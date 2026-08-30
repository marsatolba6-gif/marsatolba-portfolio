import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import AnalyticsLink from "../../AnalyticsLink";
import { getProject, projects } from "../../projects";

const SITE_URL = "https://automateiv.vercel.app";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const url = `${SITE_URL}/work/${project.slug}`;
  const description = project.value;
  const image = project.image ? `${SITE_URL}${project.image}` : undefined;

  return {
    title: project.name,
    description,
    keywords: [project.name, project.category, ...project.tools, "Mars Atolba", "AI Automation Specialist"],
    alternates: { canonical: url },
    openGraph: {
      title: `${project.name} — Automate with Mars`,
      description,
      type: "article",
      url,
      images: image ? [{ url: image, alt: `${project.name} workflow` }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — Automate with Mars`,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const previous = projects[(projectIndex - 1 + projects.length) % projects.length];
  const next = projects[(projectIndex + 1) % projects.length];
  const gallery = project.gallery?.length ? project.gallery : project.image ? [project.image] : [];
  const url = `${SITE_URL}/work/${project.slug}`;
  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#case-study`,
    name: project.name,
    url,
    description: project.system,
    creator: { "@id": `${SITE_URL}/#person` },
    about: project.category,
    keywords: project.tools.join(", "),
    image: project.image ? `${SITE_URL}${project.image}` : undefined,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: "en",
  };

  return (
    <>
      <script id={`case-study-${project.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }} />
      <header className="case-topbar">
        <AnalyticsLink href="/#work" eventName="Case Study Back Clicked" eventProperties={{ project: project.slug }}>← WORK INDEX</AnalyticsLink>
        <span>{project.num} / {String(projects.length).padStart(2, "0")}</span>
        <AnalyticsLink href="/#contact" eventName="Contact CTA Clicked" eventProperties={{ source: "case_topbar", project: project.slug }}>START A CONVERSATION ↗</AnalyticsLink>
      </header>

      <main className="case-page">
        <section className="case-hero">
          <div className="case-kicker">
            <span>{project.category}</span>
            <span>{project.scope}</span>
          </div>
          <h1>{project.name}</h1>
          <div className="case-hero-summary">
            <p>{project.value}</p>
            <dl>
              <div><dt>STAGES</dt><dd>{String(project.flow.length).padStart(2, "0")}</dd></div>
              <div><dt>TOOLS</dt><dd>{String(project.tools.length).padStart(2, "0")}</dd></div>
              <div><dt>QA</dt><dd>SCENARIO TESTED</dd></div>
            </dl>
          </div>
        </section>

        {gallery.length > 0 && (
          <section className="case-gallery" aria-label={`${project.name} workflow views`}>
            {gallery.map((src, index) => (
              <figure key={src}>
                <div className="case-image">
                  <Image src={src} alt={`${project.name} workflow view ${index + 1}`} fill sizes="(max-width: 900px) 100vw, 86vw" />
                </div>
                <figcaption>VIEW {String(index + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")} · SANITIZED PORTFOLIO VIEW</figcaption>
              </figure>
            ))}
          </section>
        )}

        <section className="case-story" aria-labelledby="case-story-title">
          <header>
            <p>MARS / SYSTEM STORY</p>
            <h2 id="case-story-title">FROM FRICTION<br />TO FLOW.</h2>
          </header>
          <div className="case-story-grid">
            {[
              ["01", "THE FRICTION", project.problem],
              ["02", "THE SYSTEM", project.system],
              ["03", "PRACTICAL VALUE", project.value],
              ["04", "RELIABILITY", project.reliability],
            ].map(([num, label, copy]) => (
              <article key={num}>
                <span>{num}</span>
                <h3>{label}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="case-evidence" aria-label="Testing and reliability evidence">
          <article>
            <p>WHAT WAS TESTED</p>
            <ul>{project.tested.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <p>RELIABILITY DECISIONS</p>
            <ul>{project.decisions.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </section>

        <section className="case-flow" aria-labelledby="case-flow-title">
          <div>
            <p>MAPPED FLOW</p>
            <h2 id="case-flow-title">HOW THE SYSTEM MOVES.</h2>
          </div>
          <ol>
            {project.flow.map((step, index) => (
              <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>
            ))}
          </ol>
        </section>

        <section className="case-tools" aria-label="Tools used">
          <p>TOOLS USED</p>
          <div>{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
        </section>

        <section className="case-cta">
          <p>HAVE A PROCESS THAT NEEDS A CLEARER SYSTEM?</p>
          <h2>LET&apos;S BUILD WHAT<br />MOVES WORK FORWARD.</h2>
          <AnalyticsLink href="/#contact" eventName="Contact CTA Clicked" eventProperties={{ source: "case_footer", project: project.slug }}>START A CONVERSATION ↗</AnalyticsLink>
        </section>

        <nav className="case-pagination" aria-label="Other case studies">
          <AnalyticsLink href={`/work/${previous.slug}`} eventName="Case Study Navigation" eventProperties={{ direction: "previous", project: previous.slug }}><span>PREVIOUS</span>{previous.shortName}</AnalyticsLink>
          <AnalyticsLink href={`/work/${next.slug}`} eventName="Case Study Navigation" eventProperties={{ direction: "next", project: next.slug }}><span>NEXT</span>{next.shortName}</AnalyticsLink>
        </nav>
      </main>
    </>
  );
}
