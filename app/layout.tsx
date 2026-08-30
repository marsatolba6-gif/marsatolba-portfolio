import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const SITE_URL = "https://automateiv.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Automate with Mars — AI Automation Specialist",
    template: "%s — Automate with Mars",
  },
  description: "Mars Atolba is an AI Automation Specialist building reliable n8n workflows, GoHighLevel CRM systems, API integrations, and connected business automation.",
  authors: [{ name: "Mars Atolba" }],
  creator: "Mars Atolba",
  category: "technology",
  keywords: ["Mars Atolba", "AI Automation Specialist", "n8n automation", "GoHighLevel", "CRM automation", "AI workflows", "business systems"],
  alternates: { canonical: `${SITE_URL}/` },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Mars Atolba — AI Automation Specialist",
    description: "Reliable n8n workflows, GoHighLevel CRM systems, AI automation, APIs, and connected business systems.",
    type: "website",
    siteName: "Automate with Mars",
    locale: "en_US",
    url: `${SITE_URL}/`,
    images: [{ url: "/assets/portfolio-workflow-board.png", width: 977, height: 427, alt: "Automate with Mars workflow portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mars Atolba — AI Automation Specialist",
    description: "Reliable n8n workflows, GoHighLevel CRM systems, AI automation, APIs, and connected business systems.",
    images: ["/assets/portfolio-workflow-board.png"],
  },
};

const personSchema = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Mars Atolba",
  url: `${SITE_URL}/`,
  jobTitle: "AI Automation Specialist",
  description: "AI Automation Specialist focused on n8n workflows, GoHighLevel CRM systems, API integrations, and connected business automation.",
  sameAs: ["https://www.linkedin.com/in/automatewithmars/"],
  knowsAbout: ["AI automation", "n8n", "GoHighLevel", "CRM automation", "APIs", "webhooks", "business systems"],
  address: {
    "@type": "PostalAddress",
    addressCountry: "PH",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    personSchema,
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Automate with Mars",
      description: "Portfolio of Mars Atolba, AI Automation Specialist.",
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profile-page`,
      url: `${SITE_URL}/`,
      name: "Mars Atolba — AI Automation Specialist",
      mainEntity: { "@id": `${SITE_URL}/#person` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
