import { ArrowRight, Mail, MapPin, Plus } from "lucide-react";
import { formatInr, formatPhone, hasWhatsapp, mailHref, site, whatsappHref } from "@/lib/site";
import { faqs } from "@/lib/faqs";
import { Logo } from "./header";
import { Container, CtaLink, SectionHeader, WhatsAppIcon, consultation, talkToAiTarget } from "./ui";

export function FoundingOffer() {
  const perks = ["Free setup", "Direct founder support", "Pricing locked for life"];
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-saffron p-8 text-ink sm:p-12 lg:p-16">
          <div aria-hidden="true" className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full border-[40px] border-ink/10" />
          <p className="text-sm font-bold uppercase tracking-[0.14em]">Founding clients</p>
          <h2 className="font-display mt-3 max-w-3xl text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
            We&rsquo;re onboarding our first {site.foundingSpotsTotal} businesses.
          </h2>
          <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {perks.map((p) => (
              <li key={p} className="rounded-full bg-ink/10 px-5 py-2.5 text-lg font-semibold">
                {p}
              </li>
            ))}
          </ul>
          {site.foundingSpotsRemaining !== null ? (
            <p className="mt-6 text-lg font-semibold">
              {site.foundingSpotsRemaining} of {site.foundingSpotsTotal} spots left.
            </p>
          ) : null}
          <CtaLink
            href={site.consultationBookingUrl || mailHref("Founding spot: I'd like to join")}
            external={consultation.external}
            variant="dark"
            className="relative mt-9"
          >
            Claim a founding spot
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </CtaLink>
        </div>
      </Container>
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="pb-20 sm:pb-24">
      <Container>
        <div className="grid items-center gap-8 rounded-[2rem] border-2 border-ink p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-saffron-deep">Pricing</p>
            <h2 className="font-display mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {site.startingPriceInr !== null ? (
                <>
                  Plans starting at <span className="text-saffron-deep">{formatInr(site.startingPriceInr)}</span>/month.
                </>
              ) : (
                <>Priced for your business, not for a big corporate.</>
              )}
            </h2>
            <p className="mt-3 text-xl text-muted">Less than a receptionist&rsquo;s salary. Working every hour of every day.</p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <CtaLink href={mailHref("Custom quote request")} variant="dark">
              Get a custom quote
            </CtaLink>
            <p className="text-sm text-muted lg:text-right">Tell us what you need. We reply with a clear monthly price.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section id="faq" className="bg-sand py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeader eyebrow="FAQ" title="Questions owners ask us." lead="Something else on your mind? Just ask us." />
        <div className="divide-y divide-line rounded-3xl bg-paper">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 sm:px-8">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="h-6 w-6 shrink-0 text-saffron-deep transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="-mt-1 pb-6 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}

export function FinalCta() {
  const talk = talkToAiTarget();
  return (
    <section className="bg-ink py-20 text-paper sm:py-28">
      <Container className="text-center">
        <h2 className="font-display mx-auto max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          Your business never misses a customer <span className="text-saffron">again.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-paper/70">
          One call with us. Live in 48 hours. We handle the tech, you handle the customers.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <CtaLink href={consultation.href} external={consultation.external}>
            Book a free consultation
          </CtaLink>
          <CtaLink href={talk.href} external={talk.external} variant="ghostLight">
            {talk.kind === "email" ? "Request a live demo" : "Talk to our AI now"}
          </CtaLink>
        </div>
      </Container>
    </section>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    { href: site.instagramUrl, label: "Instagram" },
    { href: site.linkedinUrl, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-paper/10 bg-ink pb-28 pt-14 text-paper/75 lg:pb-14">
      <Container className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm">AI voice and chat agents for Indian businesses. Built, tested and looked after by us.</p>
        </div>
        <div>
          <h2 className="font-semibold text-paper">Contact</h2>
          <ul className="mt-4 space-y-3">
            {hasWhatsapp ? (
              <li>
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 hover:text-paper">
                  <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                  {formatPhone(site.whatsappNumber)}
                </a>
              </li>
            ) : null}
            <li>
              <a href={`mailto:${site.email}`} className="flex min-h-11 items-center gap-2 hover:text-paper">
                <Mail className="h-5 w-5 text-saffron" aria-hidden="true" />
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2 py-2">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-saffron" aria-hidden="true" />
              <address className="not-italic">{site.fullAddress || `${site.city}, India`}</address>
            </li>
          </ul>
        </div>
        {socials.length > 0 || site.privacyPolicyUrl ? (
          <div>
            <h2 className="font-semibold text-paper">More</h2>
            <ul className="mt-4 space-y-1">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center hover:text-paper">
                    {s.label}
                  </a>
                </li>
              ))}
              {site.privacyPolicyUrl ? (
                <li>
                  <a href={site.privacyPolicyUrl} className="flex min-h-11 items-center hover:text-paper">
                    Privacy policy
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </Container>
      <Container>
        <p className="mt-12 border-t border-paper/10 pt-6 text-sm text-paper/50">
          © {year} {site.legalName || site.name}. Made in {site.city}.
        </p>
      </Container>
    </footer>
  );
}

export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-paper/95 p-3 backdrop-blur-md lg:hidden">
      {hasWhatsapp ? (
        <CtaLink href={whatsappHref()} external variant="whatsapp" className="w-full min-h-14 text-lg">
          <WhatsAppIcon className="h-6 w-6" />
          Chat on WhatsApp
        </CtaLink>
      ) : (
        <CtaLink href={consultation.href} external={consultation.external} variant="dark" className="w-full min-h-14 text-lg">
          Book a free consultation
        </CtaLink>
      )}
    </div>
  );
}
