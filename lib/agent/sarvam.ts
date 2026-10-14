import "server-only";
import { agentConfig } from "./config";

const BASE = "https://api.sarvam.ai";

function key() {
  const k = process.env.SARVAM_API_KEY;
  if (!k) throw new Error("SARVAM_API_KEY is not set");
  return k;
}

async function sarvamError(res: Response, what: string) {
  const body = await res.text().catch(() => "");
  return new Error(`Sarvam ${what} failed (${res.status}): ${body.slice(0, 300)}`);
}

export async function transcribe(audio: Blob, filename: string) {
  const form = new FormData();
  form.append("file", audio, filename);
  form.append("model", agentConfig.stt.model);
  form.append("language_code", "unknown");
  form.append("keyterms", JSON.stringify(["Bildco", "WhatsApp", "Hinglish", "appointment"]));

  const res = await fetch(`${BASE}/speech-to-text`, {
    method: "POST",
    headers: { "api-subscription-key": key() },
    body: form,
  });
  if (!res.ok) throw await sarvamError(res, "speech-to-text");
  const data = (await res.json()) as { transcript: string; language_code: string | null };
  return { transcript: data.transcript.trim(), languageCode: data.language_code };
}

export type TtsLanguage = "te-IN" | "hi-IN" | "en-IN";

export async function synthesize(text: string, languageCode: TtsLanguage) {
  const res = await fetch(`${BASE}/text-to-speech`, {
    method: "POST",
    headers: { "api-subscription-key": key(), "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      language_code: languageCode,
      model: agentConfig.tts.model,
      speaker: agentConfig.tts.speaker,
      output_audio_codec: agentConfig.tts.codec,
      speech_sample_rate: agentConfig.tts.sampleRate,
    }),
  });
  if (!res.ok) throw await sarvamError(res, "text-to-speech");
  const data = (await res.json()) as { audios: string[] };
  return data.audios.join("");
}
