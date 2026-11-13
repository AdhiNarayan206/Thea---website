import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import "./globals.css";

const serif = localFont({
  src: [
    {
      path: "../assets/fonts/InstrumentSerif-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/InstrumentSerif-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-instrument",
  fallback: ["Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
});

const sans = localFont({
  src: "../assets/fonts/Geist.ttf",
  display: "swap",
  variable: "--font-geist",
  fallback: ["Segoe UI", "Helvetica", "Arial", "sans-serif"],
});

const mono = localFont({
  src: "../assets/fonts/GeistMono.ttf",
  display: "swap",
  variable: "--font-geist-mono",
  fallback: ["Consolas", "Courier New", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.fullName,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  generator: "Next.js",
  keywords: [
    "Thea",
    "desktop pet",
    "pixel art",
    "Windows companion",
    "desktop companion",
    "virtual pet",
    "pixel pet",
    "offline app",
  ],
  authors: [{ name: site.fullName }],
  creator: site.fullName,
  publisher: site.fullName,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: site.fullName,
    title: site.fullName,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.fullName,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
