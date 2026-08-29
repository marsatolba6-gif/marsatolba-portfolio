import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://automateiv.vercel.app"),
  title: "Automate with Mars — AI Automation Specialist",
  description: "Mars Atolba — AI Automation Specialist building AI workflows, n8n automations, GoHighLevel systems, APIs, and connected business systems.",
  authors: [{ name: "Mars Atolba" }],
  creator: "Mars Atolba",
  category: "technology",
  keywords: ["Mars Atolba", "AI Automation Specialist", "n8n automation", "GoHighLevel", "CRM automation", "AI workflows", "business systems"],
  alternates: { canonical: "https://automateiv.vercel.app/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Mars Atolba — AI Automation Specialist",
    description: "AI workflows, automation, GoHighLevel, APIs, and business systems.",
    type: "website",
    siteName: "Automate with Mars",
    url: "https://automateiv.vercel.app/",
    images: [{ url: "/assets/portfolio-workflow-board.png", width: 1200, height: 630, alt: "Automate with Mars workflow portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mars Atolba — AI Automation Specialist",
    description: "AI workflows, automation, GoHighLevel, APIs, and business systems.",
    images: ["/assets/portfolio-workflow-board.png"],
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mars Atolba",
  url: "https://automateiv.vercel.app/",
  jobTitle: "AI Automation Specialist",
  sameAs: ["https://www.linkedin.com/in/automatonwithmars/"],
  knowsAbout: ["AI automation", "n8n", "GoHighLevel", "CRM automation", "APIs", "webhooks", "business systems"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
