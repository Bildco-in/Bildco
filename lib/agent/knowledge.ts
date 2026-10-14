import { consultationIsExternal, formatInr, formatPhone, hasWhatsapp, site } from "@/lib/site";
import { faqs } from "@/lib/faqs";

// Everything the demo agent knows about Bildco. Built from the same values the
// website shows, so the agent can never quote something the site doesn't.
//
// The whole knowledge base is small (about two pages), so it goes into the
// system prompt in full instead of being retrieved chunk by chunk. That avoids
// retrieval misses when a visitor asks in Telugu or Hindi about English text.
// When per-client data gets large (menus, catalogues, policies), replace
// buildKnowledge() with a retrieval step over embedded chunks.

function contactLines() {
  const lines = [`Email: ${site.email}`];
  if (hasWhatsapp) lines.push(`WhatsApp: ${formatPhone(site.whatsappNumber)}`);
  if (consultationIsExternal) lines.push(`Book a free consultation online: ${site.consultationBookingUrl}`);
  else lines.push(`To book a free consultation, email ${site.email}.`);
  lines.push(`Location: ${site.fullAddress || `${site.city}, India`}`);
  return lines.join("\n");
}

function pricingLine() {
  return site.startingPriceInr !== null
    ? `Plans start at ${formatInr(site.startingPriceInr)} per month. Exact price depends on the business; the team sends a custom quote.`
    : "Pricing is a custom monthly quote based on what the business needs. There is no public price list. Do not state or estimate any rupee amount; offer a custom quote instead.";
}

export function buildKnowledge() {
  return `# Bildco

## What Bildco does
Bildco is a startup based in ${site.city}, India. It builds custom AI voice calling agents and chat agents (WhatsApp, website chat, Instagram DMs) for businesses of any kind: clinics, restaurants, schools and coaching institutes, real estate, retail shops, salons, service businesses, and custom workflows.
Core promise: your business never misses a customer again.

Bildco is NOT a self-serve bot builder. It is a done-for-you team: Bildco designs, configures, tests and maintains the agent for each business. The owner does not need to touch any technology.

## Voice agents can
- Answer every incoming call, day or night (24/7)
- Call back leads and follow up on enquiries
- Send appointment and payment reminders
- Ask questions to qualify serious buyers

## Chat agents can
- Reply on WhatsApp, take bookings, give order updates
- Answer on website chat and capture leads
- Handle Instagram DMs
- Share brochures, locations and payment links

## Examples by industry
- Clinics: book appointments and remind patients
- Restaurants: take table bookings, answer menu questions
- Schools & coaching: handle admission enquiries, fee reminders
- Real estate: qualify buyers, schedule site visits
- Retail: check stock, share offers, track orders
- Salons: fill the appointment book, reduce no-shows with reminders
- Service businesses: log service requests, confirm visit slots
- Custom: built around how the business already works

## Languages
Telugu, Hindi, English and Hinglish, including natural code-switching (mixing languages in one sentence, the way real customers talk).

## Other facts
- Goes live in 48 hours after the discovery call, once Bildco has the business's basic details (services, prices, timings).
- Hands over to a human when needed.
- Integrates with calendars, WhatsApp, CRMs and POS systems.

## How it works
1. Discovery call: learn how the business runs and what customers ask.
2. Bildco builds and trains the agent: script, prices, timings, voice, tool connections.
3. Test with the owner's team: they call it, message it, try to break it; Bildco fixes what they flag.
4. Go live in 48 hours.
After launch, Bildco keeps improving the agent every month based on real conversations.

## Founding clients offer
Bildco is onboarding its first ${site.foundingSpotsTotal} businesses. Founding clients get free setup, direct founder support, and pricing locked for life.${
    site.foundingSpotsRemaining !== null ? ` Spots left: ${site.foundingSpotsRemaining}.` : ""
  }

## Pricing
${pricingLine()}
Positioning: costs less than a receptionist's salary, and works every hour of every day.

## FAQ
${faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}

## Contact
${contactLines()}
`;
}
