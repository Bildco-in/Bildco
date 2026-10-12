import {
  AudioLines,
  BadgeCheck,
  Building2,
  Check,
  GraduationCap,
  Home,
  MessageCircle,
  MoonStar,
  PhoneMissed,
  Puzzle,
  Repeat,
  Rocket,
  Scissors,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  UtensilsCrossed,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Container, SectionHeader } from "./ui";

const pains: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: PhoneMissed,
    title: "The phone rings during rush hour",
    body: "Your team is busy with the customer in front of them. The caller hangs up and books with the place down the road.",
  },
  {
    icon: MoonStar,
    title: "Enquiries come in after you close",
    body: "People ask at 10 PM and on Sundays. By the time someone replies next morning, they've already decided.",
  },
  {
    icon: Repeat,
    title: "Staff repeat the same answers all day",
    body: "Timings, fees, location, availability. Hours of skilled time spent on questions that never change.",
  },
];

export function Problem() {
  return (
    <section className="bg-sand py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="The problem"
          title="You're losing customers you never even hear about."
          lead="Not because your service is bad. Because nobody picked up."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {pains.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-3xl bg-paper p-7">
              <Icon className="h-8 w-8 text-saffron-deep" aria-hidden="true" />
              <h3 className="font-display mt-5 text-xl font-bold leading-snug">{title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

const services: Array<{ tag: string; title: string; body: string; points: string[]; icon: LucideIcon }> = [
  {
    tag: "Voice",
    icon: AudioLines,
    title: "Voice Agents",
    body: "A phone agent that sounds natural, speaks your customers' language and never puts anyone on hold.",
    points: [
      "Answers every incoming call, day or night",
      "Calls back leads and follows up on enquiries",
      "Sends appointment and payment reminders",
      "Asks the right questions to qualify serious buyers",
    ],
  },
  {
    tag: "Chat",
    icon: MessageCircle,
    title: "Chat Agents",
    body: "Instant, helpful replies on the channels your customers already use, with your prices, menu or schedule built in.",
    points: [
      "WhatsApp replies, bookings and order updates",
      "Website chat that answers and captures leads",
      "Instagram DMs handled while you sleep",
      "Shares brochures, locations and payment links",
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="What we build"
          title="Two agents. One goal: no customer left waiting."
          lead="We don't hand you a bot builder and wish you luck. Our team designs, configures, tests and maintains your agent for you."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {services.map((s, i) => (
            <article
              key={s.title}
              className={
                i === 0
                  ? "rounded-[2rem] bg-ink p-8 text-paper sm:p-10"
                  : "rounded-[2rem] border-2 border-ink p-8 sm:p-10"
              }
            >
              <span
                className={
                  i === 0
                    ? "inline-block rounded-full bg-saffron px-3 py-1 text-sm font-semibold text-ink"
                    : "inline-block rounded-full bg-ink px-3 py-1 text-sm font-semibold text-paper"
                }
              >
                {s.tag}
              </span>
              <h3 className="font-display mt-5 text-3xl font-bold tracking-tight">{s.title}</h3>
              <p className={i === 0 ? "mt-3 text-lg text-paper/75" : "mt-3 text-lg text-muted"}>{s.body}</p>
              <ul className="mt-7 space-y-4">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-3 text-[17px]">
                    <Check
                      className={i === 0 ? "mt-0.5 h-6 w-6 shrink-0 text-saffron" : "mt-0.5 h-6 w-6 shrink-0 text-saffron-deep"}
                      aria-hidden="true"
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 rounded-2xl bg-sand px-6 py-5 text-[15px] font-medium">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5 text-saffron-deep" aria-hidden="true" /> Hands over to a human when needed
          </span>
          <span className="flex items-center gap-2">
            <Puzzle className="h-5 w-5 text-saffron-deep" aria-hidden="true" /> Connects to calendars, WhatsApp, CRMs and POS
          </span>
        </div>
      </Container>
    </section>
  );
}

const industries: Array<{ icon: LucideIcon; name: string; task: string }> = [
  { icon: Stethoscope, name: "Clinics", task: "Books appointments and reminds patients." },
  { icon: UtensilsCrossed, name: "Restaurants", task: "Takes table bookings and answers menu questions." },
  { icon: GraduationCap, name: "Schools & Coaching", task: "Handles admission enquiries and fee reminders." },
  { icon: Home, name: "Real Estate", task: "Qualifies buyers and schedules site visits." },
  { icon: ShoppingBag, name: "Retail", task: "Checks stock, shares offers and tracks orders." },
  { icon: Scissors, name: "Salons", task: "Fills the appointment book and cuts no-shows." },
  { icon: Wrench, name: "Service Businesses", task: "Logs service requests and confirms visit slots." },
  { icon: Sparkles, name: "Custom", task: "Your workflow, built around how you already work." },
];

export function Industries() {
  return (
    <section className="bg-sand py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Works for any business"
          title="If your customers call or message, it fits."
          lead="Every agent is trained on your business: your services, prices, timings and the way you talk to customers."
        />
        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map(({ icon: Icon, name, task }) => (
            <li key={name} className="group rounded-3xl bg-paper p-6 transition-colors hover:bg-ink hover:text-paper">
              <Icon className="h-7 w-7 text-saffron-deep group-hover:text-saffron" aria-hidden="true" />
              <h3 className="font-display mt-4 text-lg font-bold">{name}</h3>
              <p className="mt-1.5 text-muted group-hover:text-paper/75">{task}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

const steps: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: Building2,
    title: "Discovery call",
    body: "We learn how your business runs, what customers usually ask, and where you're losing them.",
  },
  {
    icon: Sparkles,
    title: "We build & train your agent",
    body: "We write its script, load your prices and timings, pick its voice and connect your tools.",
  },
  {
    icon: BadgeCheck,
    title: "Test with your team",
    body: "You and your staff call it, message it and try to break it. We fix everything you flag.",
  },
  {
    icon: Rocket,
    title: "Go live in 48 hrs",
    body: "Your phone line and chats are switched on. Your agent starts answering customers right away.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-ink py-20 text-paper sm:py-24">
      <Container>
        <SectionHeader dark eyebrow="How it works" title="From first call to live agent in 48 hours." />
        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="relative rounded-3xl border border-paper/10 bg-ink-2 p-7">
              <span className="font-display text-5xl font-extrabold text-saffron/90" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Icon className="absolute right-7 top-8 h-6 w-6 text-paper/40" aria-hidden="true" />
              <h3 className="font-display mt-4 text-xl font-bold">
                <span className="sr-only">Step {i + 1}: </span>
                {title}
              </h3>
              <p className="mt-2 leading-relaxed text-paper/70">{body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 flex items-start gap-3 rounded-2xl bg-saffron px-6 py-5 text-lg font-semibold text-ink sm:items-center">
          <Repeat className="mt-1 h-6 w-6 shrink-0 sm:mt-0" aria-hidden="true" />
          After launch, we keep improving it every month based on real conversations.
        </p>
      </Container>
    </section>
  );
}
