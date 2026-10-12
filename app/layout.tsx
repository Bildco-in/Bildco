import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Noto_Sans_Devanagari,
  Noto_Sans_Telugu,
} from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--nf-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Instrument_Sans({
  variable: "--nf-body",
  subsets: ["latin"],
});

const telugu = Noto_Sans_Telugu({
  variable: "--nf-telugu",
  subsets: ["telugu"],
  weight: ["400", "600"],
  preload: false,
});

const deva = Noto_Sans_Devanagari({
  variable: "--nf-deva",
  subsets: ["devanagari"],
  weight: ["400", "600"],
  preload: false,
});

const description =
  "Bildco builds AI voice and chat agents that answer calls, book appointments, sell and follow up 24/7 in Telugu, Hindi, English and Hinglish. Done for you, live in 48 hours.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Bildco | AI voice & chat agents for Indian businesses",
  description,
  openGraph: {
    title: "Every missed call is a customer lost. Not anymore.",
    description,
    url: site.url,
    siteName: site.name,
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e1a2b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body
        className={`${display.variable} ${body.variable} ${telugu.variable} ${deva.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
