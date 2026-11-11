import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import AnalyticsLink from "../../AnalyticsLink";
import { getBuildNote, getProject, projects } from "../../projects";
import { SITE_CONFIG } from "../../site-config";

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

  const url = `${SITE_CONFIG.url}/work/${project.slug}`;
  const description = project.value;
  const image = `${url}/opengraph-image`;

  return {
    title: project.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.name} — ${SITE_CONFIG.name}`,
      description,
      type: "article",
      url,
      images: [{ url: image, width: 1200, height: 630, type: "image/png", alt: `${project.name} — ${SITE_CONFIG.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — ${SITE_CONFIG.name}`,
      description,
      images: [image],
    },
  };
}

function toEmbeddableVideoUrl(raw?: string): string | null {
  if (!raw?.trim()) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be" || host === "youtube.com" || host === "m.youtube.com") {
      const id = host === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") ?? url.pathname.match(/^\/embed\/([\w-]+)/)?.[1];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "loom.com") {
      const id = url.pathname.match(/^\/(?:share|embed)\/([a-zA-Z0-9]+)\/?$/)?.[1];
      return id ? `https://www.loom.com/embed/${id}` : null;
    }
    return null;
  } catch { return null; }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const previous = projects[(projectIndex - 1 + projects.length) % projects.length];
  const next = projects[(projectIndex + 1) % projects.length];
  const gallery = project.gallery?.length ? project.gallery : project.image ? [project.image] : [];
  const demoVideo = toEmbeddableVideoUrl(project.demoVideoUrl);
  const sampleRun = project.sampleRun;
  const hasSampleRun = Boolean(sampleRun && Object.values(sampleRun).some((value) => value?.trim()));
  const workflowJsonUrl = project.workflowJsonUrl?.startsWith("/assets/") && project.workflowJsonUrl.endsWith(".json")
    ? project.workflowJsonUrl
    : null;
  const url = `${SITE_CONFIG.url}/work/${project.slug}`;
  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#case-study`,
    name: project.name,
    url,
    description: project.system,
    creator: { "@id": `${SITE_CONFIG.url}/#person` },
    about: project.category,
    keywords: project.tools.join(", "),
    image: project.image ? `${SITE_CONFIG.url}${project.image}` : undefined,
    isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
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
          <p className="case-build-note">{getBuildNote(project)}</p>
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
                  <Image src={src} alt={`${project.name} workflow view ${index + 1}`} fill sizes="(max-width: 600px) 100vw, (max-width: 1100px) 90vw, 1100px" loading="lazy" />
                </div>
                <figcaption>VIEW {String(index + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")} · SANITIZED PORTFOLIO VIEW</figcaption>
              </figure>
            ))}
          </section>
        )}

        <section className="case-story" aria-labelledby="case-story-title">
          <header>
            <p>MARS / SYSTEM STORY</p>
            <h2 id="case-story-title">From friction<br />to flow.</h2>
          </header>
          <div className="case-story-grid">
            {[
              ["01", "THE FRICTION", project.problem],
              ["02", "THE SYSTEM", project.system],
              ...(project.practicalValueDetail?.trim() && project.practicalValueDetail.trim() !== project.value.trim()
                ? [["03", "PRACTICAL VALUE", project.practicalValueDetail]]
                : []),
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

        {(demoVideo || hasSampleRun || workflowJsonUrl) && (
          <section className="case-demo" aria-labelledby="case-demo-title">
            <header><p>MARS / SYSTEM PROOF</p><h2 id="case-demo-title">See it run.</h2></header>
            {demoVideo && (
              <div className="case-demo-video">
                <iframe src={demoVideo} title={`${project.name} demonstration`} loading="lazy" allow="fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
              </div>
            )}
            {hasSampleRun && sampleRun && (
              <div className="case-sample-run">
                <h3>Sample run · Sanitized data</h3>
                <div className="case-sample-grid">
                  {([["01 / INPUT", sampleRun.input], ["02 / EXTRACTED OUTPUT", sampleRun.extractedOutput], ["03 / RESULT", sampleRun.result]] as const)
                    .filter(([, content]) => Boolean(content?.trim()))
                    .map(([label, content]) => <article key={label}><span>{label}</span><pre>{content}</pre></article>)}
                </div>
              </div>
            )}
            {workflowJsonUrl && <a className="case-json-download" href={workflowJsonUrl} download>Download sanitized workflow JSON ↗</a>}
          </section>
        )}

        <section className="case-evidence" aria-label="Testing and reliability evidence">
          <article>
            <p>WHAT WAS TESTED</p>
            <div className="case-test-scroll"><table className="case-test-table">
              <caption className="sr-only">Documented test scenarios. Empty evidence fields are not claimed as verified results.</caption>
              <thead><tr><th scope="col">Scenario</th><th scope="col">Input</th><th scope="col">Expected result</th><th scope="col">Outcome</th></tr></thead>
              <tbody>{project.testScenarios.map((test, index) => (
                <tr key={`${index}-${test.scenario}`}>
                  <th scope="row">{test.scenario}</th>
                  <td>{test.input?.trim() || "Not documented"}</td>
                  <td>{test.expectedResult?.trim() || "Not documented"}</td>
                  <td>{test.outcome?.trim() || "Not documented"}</td>
                </tr>
              ))}</tbody>
            </table></div>
          </article>
          <article>
            <p>RELIABILITY DECISIONS</p>
            <ul>{project.decisions.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </section>

        <section className="case-flow" aria-labelledby="case-flow-title">
          <div>
            <p>MAPPED FLOW</p>
            <h2 id="case-flow-title">How the system moves.</h2>
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
          <h2>Let's build what<br />moves work forward.</h2>
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
