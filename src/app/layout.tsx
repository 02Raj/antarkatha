import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import { defaultSiteSettings } from "@/config/site";
import { publicEnv } from "@/lib/env";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const { seo, brandName } = defaultSiteSettings;

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.appUrl),
  title: { default: seo.defaultTitle, template: seo.titleTemplate },
  description: seo.defaultDescription,
  applicationName: brandName,
  openGraph: {
    type: "website",
    siteName: brandName,
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.defaultTitle,
    description: seo.defaultDescription,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#F6F0E3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${newsreader.variable} ${instrument.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-[100] rounded-md bg-forest px-4 py-2 text-surface focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
