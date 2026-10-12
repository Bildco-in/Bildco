import { existsSync } from "node:fs";
import path from "node:path";
import { languageSamples } from "@/lib/languages";
import { LanguageTabs } from "./language-tabs";
import { Container, SectionHeader } from "./ui";

export function LanguageShowcase() {
  const samples = languageSamples.map((s) => ({
    ...s,
    audioSrc: existsSync(path.join(process.cwd(), "public", "audio", s.audioFile)) ? `/audio/${s.audioFile}` : null,
  }));

  return (
    <section id="languages" className="bg-sand py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Speaks like your customers"
          title="Telugu, Hindi, English, or all three in one sentence."
          lead="Real customers mix languages. Your agent switches along with them, naturally, without asking them to press 1 for Hindi."
        />
        <LanguageTabs samples={samples} />
      </Container>
    </section>
  );
}
