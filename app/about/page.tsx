import type { Metadata } from "next";
import { SITE_CONFIG } from "../site-config";

const intro =
  "Mars Atolba is an AI Automation Specialist in the Philippines helping agencies and service businesses automate operations and lead follow-up with n8n, GoHighLevel, and AI workflows.";

const whatIDo = [
  "Lead capture, qualification, routing, and follow-up.",
  "GoHighLevel pipelines, calendars, forms, opportunities, and email/SMS workflows.",
  "n8n automations connecting CRMs, inboxes, spreadsheets, and other business tools.",
  "AI-powered email, customer support, and content workflows.",
  "API integrations, webhooks, troubleshooting, and automation cleanup.",
] as const;

const approach =
  "Before automating anything, I ask where the team is losing time, where leads or tasks are falling through, and which steps should be automated and which simply need a better process. I build systems that are clear, practical, and maintainable.";

const background = [
  "AI Automation Specialist (Freelance), March 2025 to present.",
  "AI Automation Developer (Independent Projects), September 2024 to March 2025.",
  "Operations & Customer Success, Local Businesses and Personal Ventures, August 2021 to August 2024.",
] as const;

const tools = [
  "n8n",
  "GoHighLevel",
  "OpenAI",
  "Groq",
  "Retell AI",
  "Google Workspace (Gmail, Sheets, Calendar, Apps Script)",
  "AppSheet",
  "Slack",
  "Trello",
  "Meta Ads Manager",
  "Supabase",
  "webhooks",
  "APIs",
  "OAuth",
] as const;

export const metadata: Metadata = {
  title: {
    absolute: "About Mars Atolba | AI Automation Specialist",
  },
  description: intro,
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <header className="case-topbar">
        <a href="/">← HOME</a>
        <span>ABOUT</span>
        <a href="/work/roofflow-voice-ai">
          ROOFFLOW VOICE AI ↗
        </a>
      </header>

      <main className="case-page">
        <section className="case-hero">
          <div className="case-kicker">
            <span>ABOUT</span>
            <span>MARS ATOLBA</span>
          </div>
          <h1>Mars Atolba, AI Automation Specialist</h1>
          <div className="case-hero-summary">
            <p>{intro}</p>
          </div>
        </section>

        <section
          className="case-evidence"
          aria-label="What I do and Approach"
        >
          <article aria-labelledby="what-i-do">
            <h2 id="what-i-do" className="eyebrow inverse">
              What I do
            </h2>
            <ul>
              {whatIDo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article aria-labelledby="approach">
            <h2 id="approach" className="eyebrow inverse">
              Approach
            </h2>
            <ul>
              <li>{approach}</li>
            </ul>
          </article>
        </section>

        <section
          className="case-flow"
          aria-labelledby="background"
        >
          <div>
            <p>BACKGROUND</p>
            <h2 id="background">Background</h2>
          </div>

          <ol>
            {background.map((entry, index) => (
              <li key={entry}>
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{entry}</strong>
              </li>
            ))}
          </ol>

          <div className="case-hero-summary">
            <p>
              I began in people-focused operations and
              customer success, where I learned to see
              the hidden handoffs, delays, and repetitive
              work shaping every customer and team experience.
            </p>
          </div>
        </section>

        <section className="case-tools" aria-label="Tools">
          <p>Tools</p>
          <div>
            {tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </section>

        <section
          className="case-story"
          aria-labelledby="featured-project"
        >
          <header>
            <p>FEATURED PROJECT</p>
            <h2 id="featured-project">
              <a href="/work/roofflow-voice-ai">
                RoofFlow Voice AI
              </a>
            </h2>
          </header>
          <div className="case-story-grid">
            <article>
              <span aria-hidden="true">↗</span>
              <h3>RoofFlow Voice AI</h3>
              <p>
                RoofFlow Voice AI, an inbound AI voice
                receptionist and lead qualification
                automation for roofing businesses
                (demo built with sample data).
              </p>
            </article>
          </div>
        </section>

        <section className="case-tools" aria-label="Links">
          <p>Links</p>
          <div>
            <a
              className="pill"
              href="https://github.com/marsatolba6-gif"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="pill"
              href="https://www.linkedin.com/in/automatewithmars"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="pill"
              href="mailto:marsatolba6@gmail.com"
            >
              marsatolba6@gmail.com
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
