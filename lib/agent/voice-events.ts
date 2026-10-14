// Events streamed (as NDJSON) from /api/voice to the browser.
export type VoiceEvent =
  | { type: "transcript"; text: string }
  | { type: "text"; delta: string }
  | { type: "audio"; data: string; mime: string }
  | { type: "done" }
  | { type: "error"; message: string };
