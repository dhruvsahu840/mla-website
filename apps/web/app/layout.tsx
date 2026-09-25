import type { Metadata } from "next";
import "./globals.css";

// NOTE: This sandbox environment cannot reach fonts.googleapis.com, so we fall
// back to system fonts here. On your own machine / in production, swap this
// block back to `next/font/google` with Noto Sans + Noto Sans Devanagari for
// proper Hindi typography (see commented example below).
//
// import { Noto_Sans_Devanagari, Noto_Sans } from "next/font/google";
// const body = Noto_Sans({ subsets: ["latin"], variable: "--font-body", weight: ["400","500","600"] });
// const display = Noto_Sans_Devanagari({ subsets: ["devanagari","latin"], variable: "--font-display", weight: ["500","700","800"] });

export const metadata: Metadata = {
  title: {
    default: "माननीय विधायक | आधिकारिक वेबसाइट",
    template: "%s | माननीय विधायक",
  },
  description:
    "हमारे विधानसभा क्षेत्र के विकास कार्यों, योजनाओं, समाचार और जनसंपर्क सेवाओं की आधिकारिक जानकारी।",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "माननीय विधायक | आधिकारिक वेबसाइट",
    description: "जनता का विश्वास, हमारी सबसे बड़ी ताकत।",
    type: "website",
    locale: "hi_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
