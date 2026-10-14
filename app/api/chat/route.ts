import { agentConfig, agentEnabled } from "@/lib/agent/config";
import { streamReply } from "@/lib/agent/llm";
import { chatBodySchema, clientIp, jsonError, rateLimited, trimHistory } from "@/lib/agent/guard";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!agentEnabled()) return jsonError(503, "Demo agent is not configured.");
  if (rateLimited(clientIp(req))) return jsonError(429, "Too many messages. Please try again in a few minutes.");

  const parsed = chatBodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError(400, "Invalid request.");
  const history = trimHistory(parsed.data.messages);
  if (history[history.length - 1].content.length > agentConfig.limits.maxMessageChars) {
    return jsonError(400, "Message is too long.");
  }

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      try {
        for await (const text of streamReply(history, "chat")) {
          sent = true;
          controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        console.error("[chat]", err);
        const prefix = sent ? "\n\n" : "";
        controller.enqueue(encoder.encode(`${prefix}Sorry, something went wrong on our side. Please try again.`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
