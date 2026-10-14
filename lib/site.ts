// Single source of truth for business values.
// Every empty value ("" / null) is handled by the UI: the related button or
// block is hidden, or the CTA falls back to email. See placeholders.txt.

export const site = {
  name: "Bildco",
  url: "https://bildco.in",
  email: "contact@bildco.in",
  city: "Hyderabad",
  fullAddress: "",

  // Digits with country code, e.g. "919876543210".
  demoCallNumber: "",
  whatsappNumber: "",
  whatsappPrefill: "Hi Bildco, I'd like to try your AI agent.",

  consultationBookingUrl: "",

  // Monthly starting price in INR, or null to show "custom quote" only.
  startingPriceInr: null as number | null,

  foundingSpotsTotal: 20,
  foundingSpotsRemaining: null as number | null,

  instagramUrl: "",
  linkedinUrl: "",
  privacyPolicyUrl: "",
  legalName: "",
} as const;

export const hasDemoCall = site.demoCallNumber.length > 0;
export const hasWhatsapp = site.whatsappNumber.length > 0;

export function telHref(digits: string) {
  return `tel:+${digits}`;
}

export function formatPhone(digits: string) {
  if (digits.startsWith("91") && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return `+${digits}`;
}

export function whatsappHref(message: string = site.whatsappPrefill) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function mailHref(subject: string, body = "") {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  return `mailto:${site.email}?${params.toString().replace(/\+/g, "%20")}`;
}

export const consultationHref =
  site.consultationBookingUrl ||
  mailHref(
    "Free consultation request",
    "Hi Bildco team,\n\nBusiness name:\nType of business:\nCity:\nBest time to call:\n\nWhat I'd like the AI agent to handle:\n",
  );

export const consultationIsExternal = site.consultationBookingUrl.length > 0;

export function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
