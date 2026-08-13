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
  alternates: { canonical: "https://automateiv.vercel.app/" },
  openGraph: {
    title: "Mars Atolba — AI Automation Specialist",
    description: "AI workflows, automation, GoHighLevel, APIs, and business systems.",
    type: "website",
    url: "https://automateiv.vercel.app/",
    images: [{ url: "/assets/portfolio-workflow-board.png", width: 1200, height: 630, alt: "Automate with Mars workflow portfolio" }],
  },
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
