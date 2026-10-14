import { Mail, Phone } from "lucide-react";
import { agentEnabled, voiceEnabled } from "@/lib/agent/config";
import { formatPhone, hasDemoCall, hasWhatsapp, mailHref, site, telHref, whatsappHref } from "@/lib/site";
import { ChatAgent } from "./demo/chat-agent";
import { VoiceAgent } from "./demo/voice-agent";
import { Container, CtaLink, SectionHeader, WhatsAppIcon } from "./ui";

export function DemoBlock() {
  const showChat = agentEnabled();
  const showVoice = voiceEnabled();
  const hasChannels = hasDemoCall || hasWhatsapp;

  return (
    <section id="demo" className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Live demo"
          title="Don't take our word for it. Talk to it."
          lead="Talk to it, type to it, try to confuse it. Ask in Telugu, Hindi, English or a mix. This is the same kind of agent we build for your business."
        />

        {showChat || showVoice ? (
          <div className={showVoice && showChat ? "mt-12 grid gap-5 lg:grid-cols-2" : "mt-12"}>
            {showVoice ? <VoiceAgent /> : null}
            {showChat ? <ChatAgent /> : null}
          </div>
        ) : null}

        {hasChannels ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {hasDemoCall ? (
              <div className="rounded-3xl border border-line bg-white p-7">
                <p className="flex items-center gap-2 font-semibold">
                  <Phone className="h-5 w-5 text-saffron-deep" aria-hidden="true" />
                  Prefer a real phone call?
                </p>
                <a
                  href={telHref(site.demoCallNumber)}
                  className="font-display mt-3 block text-2xl font-bold tracking-tight underline decoration-saffron decoration-4 underline-offset-6 hover:decoration-ink sm:text-3xl"
                >
                  {formatPhone(site.demoCallNumber)}
                </a>
              </div>
            ) : null}
            {hasWhatsapp ? (
              <div className="rounded-3xl border border-line bg-white p-7">
                <p className="flex items-center gap-2 font-semibold">
                  <WhatsAppIcon className="h-5 w-5 text-[#128c4b]" />
                  Message it on WhatsApp
                </p>
                <CtaLink href={whatsappHref()} external variant="whatsapp" className="mt-4">
                  <WhatsAppIcon className="h-5 w-5" />
                  Open WhatsApp
                </CtaLink>
              </div>
            ) : null}
          </div>
        ) : null}

        {!showChat && !showVoice && !hasChannels ? (
          <div className="mt-12 flex flex-col items-start gap-6 rounded-3xl border border-line bg-white p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div>
              <p className="font-display text-xl font-bold">Want to hear it on your own phone?</p>
              <p className="mt-2 max-w-xl text-muted">
                Tell us your business type and we&rsquo;ll set up a live demo with an agent that speaks like your front desk.
              </p>
            </div>
            <CtaLink href={mailHref("Demo request: I want to talk to the AI agent")} variant="dark" className="shrink-0">
              <Mail className="h-5 w-5" aria-hidden="true" />
              Request a demo
            </CtaLink>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
