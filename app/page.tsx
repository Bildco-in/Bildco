/*
 * Alternative hero headlines:
 *   1. "Your phone rings at 10 PM. Someone answers. In Telugu."
 *   2. "Never say 'sorry, we missed your call' again."
 *   3. "The front desk that never sleeps, never forgets, and speaks your customers' language."
 */
import { Calculator } from "@/components/calculator";
import {
  Faq,
  FinalCta,
  Footer,
  FoundingOffer,
  Pricing,
  StickyMobileCta,
} from "@/components/closing-sections";
import { HowItWorks, Industries, Problem, Services } from "@/components/content-sections";
import { DemoBlock } from "@/components/demo-block";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { LanguageShowcase } from "@/components/language-showcase";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-saffron px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <DemoBlock />
        <Problem />
        <Services />
        <Industries />
        <Calculator />
        <HowItWorks />
        <LanguageShowcase />
        <FoundingOffer />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyMobileCta />
    </>
  );
}
