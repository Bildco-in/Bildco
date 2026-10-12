import { Mail, MessageSquareText, Phone } from "lucide-react";
import {
  formatPhone,
  hasDemoCall,
  hasWhatsapp,
  mailHref,
  site,
  telHref,
  whatsappHref,
} from "@/lib/site";
import { Container, CtaLink, SectionHeader, WhatsAppIcon } from "./ui";

export function DemoBlock() {
  const hasWidget = site.chatWidgetEmbedUrl.length > 0;
  const hasAnyDemo = hasDemoCall || hasWhatsapp || hasWidget;

  return (
    <section id="demo" className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Live demo"
          title="Don't take our word for it. Talk to it."
          lead="Call it, message it, try to confuse it. Ask in Telugu, Hindi, English or a mix. This is the same kind of agent we build for your business."
        />

        {hasAnyDemo ? (
          <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1fr_1.3fr]">
            {hasDemoCall ? (
              <DemoCard icon={<Phone className="h-6 w-6" aria-hidden="true" />} title="Call our demo agent">
                <a
                  href={telHref(site.demoCallNumber)}
                  className="font-display mt-2 block text-2xl font-bold tracking-tight text-ink underline decoration-saffron decoration-4 underline-offset-6 hover:decoration-ink sm:text-3xl"
                >
                  {formatPhone(site.demoCallNumber)}
                </a>
                <p className="mt-3 text-muted">Pretend you&rsquo;re a customer. Ask to book, ask for prices, ask anything.</p>
              </DemoCard>
            ) : null}

            {hasWhatsapp ? (
              <DemoCard icon={<WhatsAppIcon className="h-6 w-6" />} title="Chat on WhatsApp">
                <p className="mt-2 text-muted">Message our demo agent the way your customers would.</p>
                <CtaLink href={whatsappHref()} external variant="whatsapp" className="mt-5 w-full">
                  <WhatsAppIcon className="h-5 w-5" />
                  Open WhatsApp
                </CtaLink>
              </DemoCard>
            ) : null}

            {hasWidget ? (
              <div className="overflow-hidden rounded-3xl border border-line bg-white">
                <div className="flex items-center gap-2 border-b border-line px-5 py-3 text-sm font-semibold">
                  <MessageSquareText className="h-4 w-4 text-saffron-deep" aria-hidden="true" />
                  Website chat agent
                </div>
                <iframe
                  src={site.chatWidgetEmbedUrl}
                  title="Bildco demo chat agent"
                  loading="lazy"
                  className="h-[440px] w-full"
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-start gap-6 rounded-3xl border border-line bg-white p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div>
              <p className="font-display text-xl font-bold">Want to hear it on your own phone?</p>
              <p className="mt-2 max-w-xl text-muted">
                Tell us your business type and we&rsquo;ll set up a live demo call with an agent that speaks like your front desk.
              </p>
            </div>
            <CtaLink href={mailHref("Demo request: I want to talk to the AI agent")} variant="dark" className="shrink-0">
              <Mail className="h-5 w-5" aria-hidden="true" />
              Request a demo
            </CtaLink>
          </div>
        )}
      </Container>
    </section>
  );
}

function DemoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-3xl border border-line bg-white p-7">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron-soft text-saffron-deep">{icon}</span>
      <h3 className="font-display mt-5 text-lg font-bold">{title}</h3>
      {children}
    </div>
  );
}
