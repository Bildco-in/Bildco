// Server-only settings for the demo agents. Keys are read from env and never
// sent to the browser.

export const agentConfig = {
  // Any OpenRouter model id, e.g. "anthropic/claude-haiku-5.5" for lower cost.
  model: process.env.OPENROUTER_MODEL || "anthropic/claude-opus-5.5",
  // Low effort keeps replies fast enough for a live voice conversation.
  effort: "low" as const,
  maxTokens: { chat: 2000, voice: 1200 },

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

export function agentEnabled() {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

export function voiceEnabled() {
  return agentEnabled() && Boolean(process.env.SARVAM_API_KEY);
}
