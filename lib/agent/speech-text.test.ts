import { describe, expect, it } from "vitest";
import { SentenceChunker, ttsLanguageFor } from "./speech-text";

describe("ttsLanguageFor", () => {
  it("detects script", () => {
    expect(ttsLanguageFor("తప్పకుండా! రేపు ఉదయం")).toBe("te-IN");
    expect(ttsLanguageFor("जी हाँ, मिल जाएगी")).toBe("hi-IN");
    expect(ttsLanguageFor("Haan ji, options hain")).toBe("en-IN");
  });
});

describe("SentenceChunker", () => {
  it("emits complete sentences across pushes and merges short ones", () => {
    const c = new SentenceChunker();
    expect(c.push("Yes. ")).toEqual([]);
    expect(c.push("We build voice agents for clinics. Want ")).toEqual(["Yes. We build voice agents for clinics."]);
    expect(c.push("a demo?")).toEqual([]);
    expect(c.flush()).toEqual(["Want a demo?"]);
  });

  it("splits on the Hindi danda", () => {
    const c = new SentenceChunker();
    expect(c.push("हो गया। आपकी टेबल साढ़े आठ बजे के लिए बुक है। अगला")).toEqual([
      "हो गया। आपकी टेबल साढ़े आठ बजे के लिए बुक है।",
    ]);
    expect(c.flush()).toEqual(["अगला"]);
  });

  it("flush returns nothing when empty", () => {
    expect(new SentenceChunker().flush()).toEqual([]);
  });
});
