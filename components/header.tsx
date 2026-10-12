import { Container, CtaLink, consultation } from "./ui";

const nav = [
  { href: "#demo", label: "Live demo" },
  { href: "#services", label: "What we build" },
  { href: "#calculator", label: "Calculator" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="font-display flex items-center gap-2 text-2xl font-extrabold tracking-tight" aria-label="Bildco home">
      <span className="flex h-8 items-center gap-[3px]" aria-hidden="true">
        {[40, 75, 100, 60].map((h, i) => (
          <span key={i} className="w-[4px] rounded-full bg-saffron" style={{ height: `${h}%` }} />
        ))}
      </span>
      <span className={light ? "text-paper" : "text-ink"}>bildco</span>
    </a>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-paper/10 bg-ink/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo light />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[15px] font-medium text-paper/75">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-paper">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <CtaLink
          href={consultation.href}
          external={consultation.external}
          variant="primary"
          className="min-h-11 px-5 py-2 text-sm sm:text-base"
        >
          Free consultation
        </CtaLink>
      </Container>
    </header>
  );
}
