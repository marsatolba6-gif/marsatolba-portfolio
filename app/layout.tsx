import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_CONFIG } from "./site-config";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.name,
    template: `%s — ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  authors: [{ name: SITE_CONFIG.personName }],
  creator: SITE_CONFIG.personName,
  category: "technology",
  alternates: { canonical: `${SITE_CONFIG.url}/` },
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
    title: SITE_CONFIG.name,
    description: "Reliable n8n workflows, GoHighLevel CRM systems, AI automation, APIs, and connected business systems.",
    type: "website",
    siteName: SITE_CONFIG.name,
    locale: "en_US",
    url: `${SITE_CONFIG.url}/`,
    images: [{ url: "/og-monogram.png", width: 1200, height: 630, alt: SITE_CONFIG.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: "Reliable n8n workflows, GoHighLevel CRM systems, AI automation, APIs, and connected business systems.",
    images: ["/og-monogram.png"],
  },
};

const personSchema = {
  "@type": "Person",
  "@id": `${SITE_CONFIG.url}/#person`,
  name: SITE_CONFIG.personName,
  url: `${SITE_CONFIG.url}/`,
  jobTitle: SITE_CONFIG.jobTitle,
  description: "AI Automation Specialist focused on n8n workflows, GoHighLevel CRM systems, API integrations, and connected business automation.",
  sameAs: [SITE_CONFIG.linkedIn],
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
      "@id": `${SITE_CONFIG.url}/#website`,
      url: `${SITE_CONFIG.url}/`,
      name: SITE_CONFIG.name,
      description: "Portfolio of Mars Atolba, AI Automation Specialist.",
      publisher: { "@id": `${SITE_CONFIG.url}/#person` },
      inLanguage: "en",
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_CONFIG.url}/#profile-page`,
      url: `${SITE_CONFIG.url}/`,
      name: SITE_CONFIG.name,
      mainEntity: { "@id": `${SITE_CONFIG.url}/#person` },
      isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
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
        {process.env.VERCEL === "1" && <Analytics />}
      </body>
    </html>
  );
}
