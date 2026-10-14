import type { TtsLanguage } from "./sarvam";

const TELUGU = /[ఀ-౿]/;
const DEVANAGARI = /[ऀ-ॿ]/;

/** Picks the TTS voice language from the script the text is written in. */
export function ttsLanguageFor(text: string): TtsLanguage {
  if (TELUGU.test(text)) return "te-IN";
  if (DEVANAGARI.test(text)) return "hi-IN";
  return "en-IN";
}

const MIN_CHUNK = 40;

/**
 * Splits streamed text into speakable chunks at sentence ends, so speech can
 * start before the whole reply is written. Short sentences are merged to
 * avoid many tiny TTS calls.
 */
export class SentenceChunker {
  private buffer = "";

  push(text: string): string[] {
    this.buffer += text;
    const out: string[] = [];
    const boundary = /[.!?।]+["')\]]*\s+|\n+/g;
    let last = 0;
    let match: RegExpExecArray | null;
    while ((match = boundary.exec(this.buffer))) {
      const end = match.index + match[0].length;
      if (end - last >= MIN_CHUNK) {
        out.push(this.buffer.slice(last, end).trim());
        last = end;
      }
    }
    this.buffer = this.buffer.slice(last);
    return out.filter(Boolean);
  }

  flush(): string[] {
    const rest = this.buffer.trim();
    this.buffer = "";
    return rest ? [rest] : [];
  }
}
