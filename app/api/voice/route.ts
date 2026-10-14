import { agentConfig, voiceEnabled } from "@/lib/agent/config";
import { streamReply } from "@/lib/agent/llm";
import { clientIp, historySchema, jsonError, rateLimited, trimHistory } from "@/lib/agent/guard";
import { synthesize, transcribe } from "@/lib/agent/sarvam";
import { SentenceChunker, ttsLanguageFor } from "@/lib/agent/speech-text";
import type { VoiceEvent } from "@/lib/agent/voice-events";

export const runtime = "nodejs";

/**
 * One voice turn: audio in, NDJSON events out.
 * transcript -> text deltas -> audio chunks (in order, one per sentence) -> done.
 */
export async function POST(req: Request) {
  if (!voiceEnabled()) return jsonError(503, "Voice demo is not configured.");
  if (rateLimited(clientIp(req))) return jsonError(429, "Too many requests. Please try again in a few minutes.");

  const form = await req.formData().catch(() => null);
  const audio = form?.get("audio");
  if (!(audio instanceof Blob) || audio.size === 0) return jsonError(400, "No audio received.");
  if (audio.size > agentConfig.limits.maxAudioBytes) return jsonError(413, "Recording is too long.");

  let rawHistory: unknown = null;
  try {
    rawHistory = JSON.parse(String(form?.get("history") ?? "[]"));
  } catch {}
  const historyParsed = historySchema.safeParse(rawHistory);
  if (!historyParsed.success) return jsonError(400, "Invalid conversation history.");

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: VoiceEvent) => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));

      try {
        const filename = audio.type.includes("mp4") ? "turn.m4a" : audio.type.includes("ogg") ? "turn.ogg" : "turn.webm";
        const { transcript } = await transcribe(audio, filename);
        if (!transcript) {
          send({ type: "error", message: "Sorry, I didn't catch that. Please try again." });
          return;
        }
        send({ type: "transcript", text: transcript.slice(0, agentConfig.limits.maxMessageChars) });

        const history = trimHistory([
          ...historyParsed.data,
          { role: "user", content: transcript.slice(0, agentConfig.limits.maxMessageChars) },
        ]);

        // TTS requests run in parallel; the chain keeps audio in sentence order.
        const chunker = new SentenceChunker();
        let chain = Promise.resolve();
        const speak = (sentence: string) => {
          const pending = synthesize(sentence, ttsLanguageFor(sentence));
          chain = chain.then(async () => {
            try {
              send({ type: "audio", data: await pending, mime: "audio/mpeg" });
            } catch (err) {
              console.error("[voice] tts", err);
            }
          });
        };

        for await (const text of streamReply(history, "voice")) {
          send({ type: "text", delta: text });
          chunker.push(text).forEach(speak);
        }
        chunker.flush().forEach(speak);
        await chain;
        send({ type: "done" });
      } catch (err) {
        console.error("[voice]", err);
        send({ type: "error", message: "Sorry, something went wrong on our side. Please try again." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
