import { Clock, Languages, PhoneIncoming, Zap } from "lucide-react";
import { SoundWave } from "./sound-wave";
import { Container, CtaLink, WhatsAppIcon, consultation, talkToAiTarget } from "./ui";

const facts = [
  { icon: Languages, label: "Telugu · Hindi · English · Hinglish" },
  { icon: Clock, label: "Answers 24/7" },
  { icon: Zap, label: "Live in 48 hours" },
];

export function Hero() {
  const talk = talkToAiTarget();

  return (
    <section id="top" className="relative overflow-hidden bg-ink text-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-saffron/15 blur-3xl"
      />
      <Container className="relative grid items-center gap-12 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:pb-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-4 py-1.5 text-sm font-medium text-paper/85">
            <span className="h-2 w-2 rounded-full bg-whatsapp" aria-hidden="true" />
            AI voice & chat agents, built for you
          </p>
          <h1 className="font-display mt-6 text-[2.6rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.25rem]">
            Every missed call is a customer lost.{" "}
            <span className="text-saffron">Not anymore.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75 sm:text-xl">
            We build AI voice and chat agents that answer, book, sell and follow up for your business,
            24/7, in your customers&rsquo; language. You don&rsquo;t touch any tech. We set it up, test it and
            keep it running.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <CtaLink href={talk.href} external={talk.external} variant={talk.kind === "whatsapp" ? "whatsapp" : "primary"}>
              {talk.kind === "whatsapp" ? <WhatsAppIcon className="h-5 w-5" /> : <PhoneIncoming className="h-5 w-5" aria-hidden="true" />}
              {talk.kind === "email" ? "Request a live demo" : "Talk to our AI now"}
            </CtaLink>
            <CtaLink href={consultation.href} external={consultation.external} variant="ghostLight">
              Book a free consultation
            </CtaLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[15px] text-paper/70">
            {facts.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-saffron" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <CallCard />
      </Container>
    </section>
  );
}

// Illustration of how an answered call looks. Not a real customer conversation.
function CallCard() {
  return (
    <figure className="relative mx-auto w-full max-w-md" aria-label="Illustration: the AI agent answering a call at night">
      <div className="rounded-[2rem] border border-paper/10 bg-ink-2 p-6 shadow-2xl shadow-black/40 sm:p-7">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 font-medium text-paper/80">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-whatsapp" />
            </span>
            Call answered
          </span>
          <span className="text-paper/50">10:42 PM</span>
        </div>
        <div className="mt-6 h-24">
          <SoundWave />
        </div>
        <div className="mt-6 space-y-3 text-[15px] leading-snug">
          <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-paper/8 px-4 py-3 text-paper/85">
            Hi, is the doctor available tomorrow morning?
          </p>
          <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-saffron px-4 py-3 font-medium text-ink">
            Yes! 10:30 AM is free. Shall I book it and send the details on WhatsApp?
          </p>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-paper/45">Illustrative example</figcaption>
    </figure>
  );
}
