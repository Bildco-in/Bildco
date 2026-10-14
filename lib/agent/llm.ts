import "server-only";
import { agentConfig, llmProvider } from "./config";
import type { History } from "./guard";
import { systemPrompt, type Channel } from "./prompt";

export const REFUSAL_REPLY = "Sorry, I can't help with that one. Ask me anything about how an AI agent could work for your business.";

type StreamChunk = {
  choices?: Array<{ delta?: { content?: string | null }; finish_reason?: string | null }>;
  error?: { message?: string; code?: number | string };
};

// Both providers speak the OpenAI chat-completions format; only the URL,
// auth header and reasoning parameter differ.
function buildRequest(
  history: History,
  channel: Channel,
): { url: string; headers: Record<string, string>; body: Record<string, unknown> } {
  const provider = llmProvider();
  const system = systemPrompt(channel);
  const common = {
    stream: true,
    max_tokens: agentConfig.maxTokens[channel],
  };

  if (provider.name === "sarvam") {
    return {
      url: "https://api.sarvam.ai/v1/chat/completions",
      headers: { "api-subscription-key": provider.key },
      body: {
        ...common,
        model: provider.model,
        // Thinking off: it added ~8s before the first word and used up the token budget.
        reasoning_effort: null,
        messages: [{ role: "system", content: system }, ...history],
      },
    };
  }

  const models = provider.model.split(",").map((m) => m.trim()).filter(Boolean);
  return {
    url: "https://openrouter.ai/api/v1/chat/completions",
    headers: {
      Authorization: `Bearer ${provider.key}`,
      // Optional attribution headers shown on OpenRouter dashboards.
      "HTTP-Referer": "https://bildco.in",
      "X-Title": "Bildco demo agent",
    },
    body: {
      ...common,
      // A comma-separated list becomes OpenRouter fallbacks, tried in order.
      ...(models.length > 1 ? { models } : { model: models[0] }),
      reasoning: { effort: agentConfig.effort, exclude: true },
      messages: [
        {
          role: "system",
          // cache_control lets providers that support it (Anthropic) cache the
          // long, unchanging system prompt; others ignore it.
          content: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
        },
        ...history,
      ],
    },
  };
}

/**
 * Streams the agent's reply as text chunks.
 * Yields REFUSAL_REPLY if the model declines before writing anything.
 */
export async function* streamReply(history: History, channel: Channel): AsyncGenerator<string> {
  const { url, headers, body } = buildRequest(history, channel);
  const res = await fetch(url, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(`LLM request failed (${res.status}): ${text.slice(0, 300)}`);
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
      if (chunk.error) throw new Error(`LLM stream error: ${chunk.error.message ?? chunk.error.code}`);

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
