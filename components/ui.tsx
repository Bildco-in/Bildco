import type { ComponentProps, ReactNode } from "react";
import {
  consultationHref,
  consultationIsExternal,
  hasDemoCall,
  hasWhatsapp,
  mailHref,
  telHref,
  site,
  whatsappHref,
} from "@/lib/site";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  dark = false,
  center = false,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <p
        className={cn(
          "text-sm font-semibold uppercase tracking-[0.14em]",
          dark ? "text-saffron" : "text-saffron-deep",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-display mt-3 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl",
          dark ? "text-paper" : "text-ink",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p className={cn("mt-4 text-lg leading-relaxed", dark ? "text-paper/75" : "text-muted")}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}

const variants = {
  primary: "bg-saffron text-ink hover:bg-[#ffab48] shadow-[0_8px_24px_-8px_rgba(245,154,47,0.7)]",
  dark: "bg-ink text-paper hover:bg-ink-2",
  ghostLight: "border-2 border-paper/30 text-paper hover:border-paper/70 hover:bg-paper/5",
  ghostDark: "border-2 border-ink/20 text-ink hover:border-ink/60 hover:bg-ink/5",
  whatsapp: "bg-whatsapp text-[#05351a] hover:bg-[#3ee07a]",
} as const;

export function CtaLink({
  href,
  external = false,
  variant = "primary",
  className,
  children,
  ...props
}: Omit<ComponentProps<"a">, "href"> & {
  href: string;
  external?: boolean;
  variant?: keyof typeof variants;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.48.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.9.99 6.7 2.78a9.4 9.4 0 0 1 2.77 6.7c0 5.23-4.25 9.48-9.47 9.48Zm8.06-17.54A11.33 11.33 0 0 0 12.05.62C5.77.62.66 5.73.66 12.01c0 2 .52 3.97 1.52 5.7L.56 23.62l6.04-1.58a11.37 11.37 0 0 0 5.44 1.39h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.19-5.9-3.33-8.05Z" />
    </svg>
  );
}

/**
 * "Talk to our AI now" target: demo call line, then WhatsApp, then email.
 */
export function talkToAiTarget(): { href: string; external: boolean; kind: "call" | "whatsapp" | "email" } {
  if (hasDemoCall) return { href: telHref(site.demoCallNumber), external: false, kind: "call" };
  if (hasWhatsapp) return { href: whatsappHref(), external: true, kind: "whatsapp" };
  return {
    href: mailHref("Demo request: I want to talk to the AI agent"),
    external: false,
    kind: "email",
  };
}

export const consultation = { href: consultationHref, external: consultationIsExternal };
