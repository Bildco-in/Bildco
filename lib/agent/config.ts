// Server-only settings for the demo agents. Keys are read from env and never
// sent to the browser.

export const agentConfig = {
  // Low effort keeps replies fast enough for a live voice conversation.
  effort: "low" as const,
  maxTokens: { chat: 1500, voice: 1000 },

  stt: { model: "saaras:v4" },
  tts: {
    model: "bulbul:v3",
    speaker: process.env.SARVAM_TTS_SPEAKER || "priya",
    codec: "mp3" as const,
    sampleRate: 24000,
  },

  limits: {
    maxTurns: 16, // messages kept per conversation (user + assistant)
    maxMessageChars: 1000,
    maxAudioBytes: 2_000_000, // ~30s of opus audio, well over that in practice
    requestsPerWindow: 30,
    windowMs: 10 * 60 * 1000,
  },
};

type Provider = { name: "sarvam" | "openrouter"; key: string; model: string };

/**
 * Which LLM writes the replies. LLM_PROVIDER picks it; otherwise Sarvam is
 * used when its key is set, else OpenRouter.
 */
export function llmProvider(): Provider {
  const sarvamKey = process.env.SARVAM_API_KEY ?? "";
  const openrouterKey = process.env.OPENROUTER_API_KEY ?? "";
  const choice = process.env.LLM_PROVIDER || (sarvamKey ? "sarvam" : "openrouter");

  if (choice === "sarvam") {
    return { name: "sarvam", key: sarvamKey, model: process.env.SARVAM_LLM_MODEL || "sarvam-105b" };
  }
  // Any OpenRouter model id, or a comma-separated list to fall back through.
  return { name: "openrouter", key: openrouterKey, model: process.env.OPENROUTER_MODEL || "anthropic/claude-haiku-5.5" };
}

export function agentEnabled() {
  return Boolean(llmProvider().key);
}

export function voiceEnabled() {
  return agentEnabled() && Boolean(process.env.SARVAM_API_KEY);
}
