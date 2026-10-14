import "server-only";
import { agentConfig } from "./config";
import type { History } from "./guard";
import { systemPrompt, type Channel } from "./prompt";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export const REFUSAL_REPLY = "Sorry, I can't help with that one. Ask me anything about how an AI agent could work for your business.";

type StreamChunk = {
  choices?: Array<{ delta?: { content?: string | null }; finish_reason?: string | null }>;
  error?: { message?: string; code?: number | string };
};

/**
 * Streams the agent's reply from OpenRouter as text chunks.
 * Yields REFUSAL_REPLY if the model declines before writing anything.
 */
export async function* streamReply(history: History, channel: Channel): AsyncGenerator<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is not set");

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      // Optional attribution headers shown on OpenRouter dashboards.
      "HTTP-Referer": "https://bildco.in",
      "X-Title": "Bildco demo agent",
    },
    body: JSON.stringify({
      model: agentConfig.model,
      stream: true,
      max_tokens: agentConfig.maxTokens[channel],
      reasoning: { effort: agentConfig.effort, exclude: true },
      messages: [
        {
          role: "system",
          // cache_control lets providers that support it (Anthropic) cache the
          // long, unchanging system prompt; others ignore it.
          content: [{ type: "text", text: systemPrompt(channel), cache_control: { type: "ephemeral" } }],
        },
        ...history,
      ],
    }),
  });

  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenRouter request failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let emitted = false;
  let finishReason: string | null = null;

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const raw of lines) {
      const line = raw.trim();
      // Blank lines separate events; lines starting with ":" are keep-alive comments.
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") continue;

      const chunk = JSON.parse(data) as StreamChunk;
      if (chunk.error) throw new Error(`OpenRouter stream error: ${chunk.error.message ?? chunk.error.code}`);

      const choice = chunk.choices?.[0];
      const text = choice?.delta?.content;
      if (text) {
        emitted = true;
        yield text;
      }
      if (choice?.finish_reason) finishReason = choice.finish_reason;
    }
  }

  if (!emitted && (finishReason === "content_filter" || finishReason === "refusal")) {
    yield REFUSAL_REPLY;
  }
}
