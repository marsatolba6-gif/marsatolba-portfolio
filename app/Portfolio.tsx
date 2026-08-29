"use client";

/* Local portfolio screenshots intentionally keep their original pixel dimensions and paths. */
/* eslint-disable @next/next/no-img-element */

import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import HeroFluidCanvas from "./HeroFluidCanvas";

type Project = {
  num: string;
  name: string;
  shortName: string;
  category: string;
  scope: string;
  layout: "portrait" | "landscape" | "wide";
  image?: string;
  gallery?: string[];
  problem: string;
  system: string;
  value: string;
  reliability: string;
  flow: string[];
  tools: string[];
};

const projects: Project[] = [
  {
    num: "01",
    name: "AI-Powered Customer Support Automation",
    shortName: "AI Customer Support",
    category: "AI OPERATIONS",
    scope: "INDEPENDENT BUILD",
    layout: "portrait",
    image: "/assets/ai-customer-support-automation.png",
    gallery: ["/assets/ai-customer-support-automation.png"],
    problem: "Shared support inboxes can become difficult to manage. Urgent messages may sit beside routine inquiries, while tracking and escalation remain inconsistent.",
    system: "An n8n workflow that retrieves Gmail messages, prepares the email data, analyzes intent and urgency using an AI model, routes high-priority cases to Slack, and records results in Google Sheets.",
    value: "Reduces repetitive inbox assessment and demonstrates how important messages can be identified, routed, and recorded automatically.",
    reliability: "Tested different email scenarios, reviewed execution history, checked field mappings, validated structured AI outputs, and refined routing for different urgency levels.",
    flow: ["Gmail", "Data Preparation", "AI Analysis", "Priority Decision", "Slack Alert", "Google Sheets"],
    tools: ["n8n", "Gmail", "AI model", "Slack", "Google Sheets"],
  },
  {
    num: "02",
    name: "AI Marketing Content Engine",
    shortName: "Marketing Content Engine",
    category: "AI MARKETING AUTOMATION",
    scope: "INDEPENDENT BUILD",
    layout: "landscape",
    image: "/assets/ai-content-pipeline-final.png",
    gallery: ["/assets/ai-content-pipeline-final.png", "/assets/ai-content-pipeline-merge.png", "/assets/ai-content-pipeline-error-fix.png"],
    problem: "Turning one campaign brief into content for multiple platforms requires repeated prompting, copying, formatting, and delivery.",
    system: "An n8n workflow that receives campaign details from Google Sheets, processes the brief with Groq, validates structured output with parsers, and delivers the completed content package through Gmail.",
    value: "Turns a repetitive multi-step content preparation process into one connected automated workflow.",
    reliability: "Used fixed schemas, separate generation and parsing stages, sample campaign briefs, execution-history reviews, and corrected field-mapping issues during testing.",
    flow: ["Google Sheets", "AI Generation", "Content Parsing", "Marketing Package Parsing", "Gmail Delivery"],
    tools: ["n8n", "Groq", "Google Sheets", "Gmail", "Structured Output Parsers"],
  },
  {
    num: "03",
    name: "AI Email Assistant",
    shortName: "AI Email Assistant",
    category: "AI WORKFLOW",
    scope: "INDEPENDENT BUILD",
    layout: "portrait",
    image: "/assets/ai-email-assistant.png",
    gallery: ["/assets/ai-email-assistant.png", "/assets/gmail-read-assess-automation.png"],
    problem: "Reading, assessing, organizing, and recording emails manually can become repetitive.",
    system: "A scheduled n8n workflow that retrieves Gmail messages, uses AI-assisted assessment to interpret the content, and records structured information in Google Sheets.",
    value: "Demonstrates a foundation for automated email assessment, organization, tracking, and future routing workflows.",
    reliability: "Tested different email types, missing subject lines, incomplete body content, and field mappings while reviewing workflow executions to verify captured outputs.",
    flow: ["Schedule Trigger", "Gmail", "AI Assessment", "Google Sheets"],
    tools: ["n8n", "Gmail", "OpenAI", "Google Sheets"],
  },
  {
    num: "04",
    name: "GoHighLevel Workflows",
    shortName: "GoHighLevel Workflows",
    category: "CRM AUTOMATION",
    scope: "INDEPENDENT / CLIENT-READY DEMO",
    layout: "wide",
    image: "/assets/ghl-lead-conversion-1.png",
    gallery: ["/assets/ghl-lead-conversion-1.png", "/assets/ghl-lead-conversion-2.png", "/assets/ghl-lead-conversion-3.png", "/assets/ghl-workflow-1.png", "/assets/ghl-workflow-2.png", "/assets/ghl-workflow-overview.png", "/assets/ghl-priority-branches.png"],
    problem: "Local service businesses can lose leads when enquiries are not prioritized, assigned, and followed up consistently.",
    system: "A GoHighLevel lead-capture and qualification workflow that creates pipeline opportunities, routes leads by job urgency, updates qualification status, assigns follow-up tasks, and alerts the team about high-priority enquiries.",
    value: "Creates a clear lead journey from form submission through prioritization and follow-up while reducing repetitive CRM actions.",
    reliability: "Checked trigger behavior, custom-field conditions, pipeline movement, contact updates, task creation, and branch logic using test contacts before activation.",
    flow: ["Form Submitted", "Tag Lead", "Create Opportunity", "Assign Owner", "Check Job Urgency", "Route Priority", "Create Task", "Notify Team"],
    tools: ["GoHighLevel", "Pipelines", "Workflows", "Forms", "Custom Fields", "Email/SMS Automation"],
  },
  {
    num: "05",
    name: "GoHighLevel Landing Pages & Funnels",
    shortName: "Landing Pages & Funnels",
    category: "BUSINESS SYSTEMS",
    scope: "GOHIGHLEVEL IMPLEMENTATION",
    layout: "landscape",
    image: "/assets/ghl-landing-page-1.webp",
    gallery: ["/assets/ghl-landing-page-1.webp", "/assets/ghl-landing-page-2.png"],
    problem: "A landing page is most useful when lead capture connects directly with the business systems behind it.",
    system: "Branded GoHighLevel landing pages and funnel structures connected to forms, calendars, CRM records, and workflow automations where applicable.",
    value: "Connects customer-facing lead capture with the operational workflow that follows.",
    reliability: "Checked desktop/mobile responsiveness, form submissions, redirects, booking flows, CRM record creation, and workflow enrollment where applicable.",
    flow: ["Landing Page", "Form", "CRM Record", "Calendar Booking", "Workflow Enrollment"],
    tools: ["GoHighLevel", "Landing Pages", "Forms", "Calendars", "Funnels", "CRM Workflows"],
  },  {
    num: "06",
    name: "RoofFlow Voice AI",
    shortName: "RoofFlow Voice AI",
    category: "VOICE AI / CRM AUTOMATION",
    scope: "CLIENT-READY AUTOMATION DEMO",
    layout: "wide",
    image: "/assets/roofflow-voice-ai-workflow.svg",
    gallery: ["/assets/roofflow-voice-ai-workflow.svg"],
    problem: "Roofing inquiries often arrive by phone, where emergency leaks, estimate requests, and lower-intent questions enter the same queue. Manual notes and delayed handoffs can lose context, duplicate records, and slow the response that wins the job.",
    system: "A voice-first n8n workflow that receives roofing call data, uses Groq to extract structured lead information, applies deterministic urgency and intent scoring, upserts the contact and opportunity in GoHighLevel, books through Google Calendar, and routes the next action. Emergencies create a five-minute task, qualified inquiries a 15-minute follow-up, and nurture leads a one-day follow-up. Google Sheets records the outcome for auditability.",
    value: "Turns roofing calls into structured, prioritized CRM actions—so urgent leaks are handled quickly, qualified leads are booked, and every follow-up is traceable.",
    reliability: "Uses a fixed extraction schema, deterministic scoring rules, contact upsert logic, explicit routing branches, and a logged audit trail with CRM record IDs. Emergency, qualified, and nurture scenarios were tested to confirm that each path creates the intended next action.",
    flow: ["Call", "Understand", "Prioritize", "Record", "Book", "Follow Up"],
    tools: ["n8n", "Groq", "GoHighLevel", "Google Calendar", "Google Sheets", "JavaScript", "Webhooks"],
  },

];

function SystemArt({ num }: { num: string }) {
  return (
    <div className="system-art" aria-hidden="true">
      <div className="ring" />
      <div className="core" />
      <span className="art-label">SYSTEM / {num}</span>
    </div>
  );
}

const SCAN_MARKER_POSITIONS = [
  { left: "16%", top: "24%" },
  { left: "38%", top: "42%" },
  { left: "62%", top: "26%" },
  { left: "79%", top: "58%" },
  { left: "31%", top: "72%" },
];

function ScanStage({ project, src, index, onExpand }: { project: Project; src: string; index: number; onExpand: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const restoreTimer = useRef<number | null>(null);
  const touchPointer = useRef<number | null>(null);

  useEffect(() => () => {
    if (restoreTimer.current) window.clearTimeout(restoreTimer.current);
  }, []);

  const revealAt = (event: ReactPointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = Math.min(rect.width, Math.max(0, event.clientX - rect.left));
    const y = Math.min(rect.height, Math.max(0, event.clientY - rect.top));
    stage.style.setProperty("--scan-x", `${x}px`);
    stage.style.setProperty("--scan-y", `${y}px`);
    stage.classList.add("is-scanning");
    if (restoreTimer.current) window.clearTimeout(restoreTimer.current);
    restoreTimer.current = window.setTimeout(() => stage.classList.remove("is-scanning"), 1800);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" && touchPointer.current !== event.pointerId) return;
    revealAt(event);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" || (event.target as HTMLElement).closest("button")) return;
    touchPointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    revealAt(event);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (touchPointer.current !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    touchPointer.current = null;
  };

  const revealCenter = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--scan-x", "50%");
    stage.style.setProperty("--scan-y", "50%");
    stage.classList.add("is-scanning");
    if (restoreTimer.current) window.clearTimeout(restoreTimer.current);
    restoreTimer.current = window.setTimeout(() => stage.classList.remove("is-scanning"), 1800);
  };

  return (
    <article
      ref={stageRef}
      className="scan-stage"
      tabIndex={0}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onFocus={revealCenter}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          revealCenter();
        }
      }}
      aria-label={`${project.name} system scan ${index + 1}`}
    >
      <div className="scan-image-layer">
        <img src={src} alt={`${project.name} workflow view ${index + 1}`} loading="lazy" />
      </div>
      <div className="scan-map" aria-hidden="true">
        <div className="scan-map-head"><span>MARS / SYSTEM SCAN</span><span>VIEW {String(index + 1).padStart(2, "0")}</span></div>
        <div className="scan-map-flow">
          {project.flow.map((step, stepIndex) => (
            <div key={`${src}-${step}`}><span>{String(stepIndex + 1).padStart(2, "0")}</span><strong>{step}</strong></div>
          ))}
        </div>
        <div className="scan-map-foot"><span>TRIGGER → LOGIC → ACTION</span><span>SYSTEM VERIFIED</span></div>
      </div>
      <div className="scan-markers" aria-hidden="true">
        {project.flow.slice(0, SCAN_MARKER_POSITIONS.length).map((step, markerIndex) => (
          <span className="scan-marker" style={SCAN_MARKER_POSITIONS[markerIndex]} key={`${src}-marker-${step}`}>
            <i>{String(markerIndex + 1).padStart(2, "0")}</i><em>{step}</em>
          </span>
        ))}
      </div>
      <span className="scan-reticle" aria-hidden="true"><i>SCAN</i></span>
      <div className="scan-stage-meta">
        <span>{String(index + 1).padStart(2, "0")} / {String(project.gallery?.length ?? 1).padStart(2, "0")}</span>
        <span>MOVE TO SCAN / TAP + DRAG</span>
        <button type="button" onClick={onExpand} aria-label={`Open ${project.name} screenshot ${index + 1} full size`}>VIEW FULL IMAGE ↗</button>
      </div>
    </article>
  );
}

const EMAIL = "marsatolba6@gmail.com";
const INTRO_NAME_REVEAL_AT_MS = 520;
const INTRO_LOAD_START_MS = 1200;
const INTRO_PROGRESS_DURATION_MS = 3400;
const INTRO_COLLAPSE_PAUSE_MS = 250;
const INTRO_EXIT_DELAY_MS = 1180;
const INTRO_ROTATION_TERMS = ["AUTOMATION", "GHL", "n8n", "WORKFLOWS"];
const MANIFESTO_LINES = [
  "WHAT GOD ENTRUSTS TO ME,",
  "I ELEVATE WITH PURPOSE,",
  "AUTOMATE WITH WISDOM,",
  "AND MULTIPLY THROUGH",
  "EXCELLENCE.",
];
const MANIFESTO_QUOTE = MANIFESTO_LINES.join(" ");
const ABOUT_ROLE_LINES = ["AN AI AUTOMATION", "SPECIALIST."];

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [copied, setCopied] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    if (values.get("_honey")) return;
    setStatus("sending");

    const name = String(values.get("name") || "");
    const email = String(values.get("email") || "");
    const payload = {
      name,
      email,
      company: String(values.get("company") || "Not provided"),
      "project type": String(values.get("projectType") || "Not specified"),
      message: String(values.get("message") || ""),
      _subject: `Portfolio enquiry — ${name || "Website visitor"}`,
      _replyto: email,
      _template: "table",
      _captcha: "false",
    };

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Message could not be sent");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <form className="contact-form" action={`https://formsubmit.co/${EMAIL}`} method="POST" onSubmit={submit}>
      <input className="form-honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-row">
        <label><span>YOUR NAME *</span><input name="name" type="text" autoComplete="name" required placeholder="Name" /></label>
        <label><span>EMAIL ADDRESS *</span><input name="email" type="email" autoComplete="email" required placeholder="you@company.com" /></label>
      </div>
      <div className="form-row">
        <label><span>COMPANY / TEAM</span><input name="company" type="text" autoComplete="organization" placeholder="Optional" /></label>
        <label><span>WHAT ARE WE BUILDING?</span><select name="projectType" defaultValue=""><option value="" disabled>Select a system</option><option>AI Workflow</option><option>n8n Automation</option><option>GoHighLevel System</option><option>Workflow Optimization</option><option>Ongoing Automation Support</option><option>Other</option></select></label>
      </div>
      <label className="message-field"><span>WHAT PROCESS WOULD YOU LIKE TO IMPROVE? *</span><textarea name="message" required rows={5} placeholder="Share the process, bottleneck, or outcome you have in mind." /></label>
      <div className="form-submit">
        <button className="contact-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "SENDING…" : "DISCUSS A SYSTEM"}<span>↗</span></button>
        <p className={`form-status is-${status}`} aria-live="polite">
          {status === "success" && "Message sent. Thanks — I’ll review the details and reply by email."}
          {status === "error" && <>The form paused. <a href={`mailto:${EMAIL}`}>Email me directly</a> or <button type="button" onClick={copyEmail}>{copied ? "EMAIL COPIED" : "COPY EMAIL"}</button>.</>}
        </p>
      </div>
    </form>
  );
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [introPhase, setIntroPhase] = useState<"mark" | "name" | "loading" | "collapse">("mark");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingWordStep, setLoadingWordStep] = useState(0);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [previewProject, setPreviewProject] = useState<Project>(projects[0]);
  const [workPreviewVisible, setWorkPreviewVisible] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [headerDark, setHeaderDark] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const manifestoFlowRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const openProject = (project: Project) => {
    setPreviewProject(project);
    setWorkPreviewVisible(false);
    setActiveProject(project);
  };

  const closeProject = () => {
    setLightbox(null);
    setActiveProject(null);
  };

  const showAdjacentProject = (direction: -1 | 1) => {
    if (!activeProject) return;
    const currentIndex = projects.findIndex((project) => project.num === activeProject.num);
    const nextProject = projects[(currentIndex + direction + projects.length) % projects.length];
    setPreviewProject(nextProject);
    setActiveProject(nextProject);
    window.requestAnimationFrame(() => document.querySelector<HTMLElement>(".project-dialog")?.scrollTo({ top: 0, behavior: "auto" }));
  };

  const navigateFromMenu = (href: string) => {
    setMenuOpen(false);
    document.body.classList.remove("menu-open");
    window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(href);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }
      window.history.replaceState(null, "", href);
    }, 140);
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const reducedTimer = window.setTimeout(() => {
        setLoadingProgress(100);
        setIntroPhase("collapse");
        setIntroVisible(false);
      }, 0);
      return () => window.clearTimeout(reducedTimer);
    }
    const started = performance.now();
    let animation = 0;
    let collapseTimer = 0;
    let exitTimer = 0;
    const update = (now: number) => {
      const elapsed = Math.max(0, now - started - INTRO_LOAD_START_MS);
      const ratio = Math.min(1, elapsed / INTRO_PROGRESS_DURATION_MS);
      const progress = Math.round(ratio * 100);
      const rotationStep = Math.min(11, Math.floor(ratio * 2 + Math.pow(ratio, 3) * 9));
      setLoadingProgress(progress);
      setLoadingWordStep(rotationStep);
      if (progress < 100) {
        animation = requestAnimationFrame(update);
      } else {
        collapseTimer = window.setTimeout(() => setIntroPhase("collapse"), INTRO_COLLAPSE_PAUSE_MS);
        exitTimer = window.setTimeout(() => setIntroVisible(false), INTRO_EXIT_DELAY_MS);
      }
    };
    animation = requestAnimationFrame(update);
    const nameTimer = window.setTimeout(() => setIntroPhase("name"), INTRO_NAME_REVEAL_AT_MS);
    const loadTimer = window.setTimeout(() => setIntroPhase("loading"), INTRO_LOAD_START_MS);
    return () => {
      cancelAnimationFrame(animation);
      window.clearTimeout(nameTimer);
      window.clearTimeout(loadTimer);
      window.clearTimeout(collapseTimer);
      window.clearTimeout(exitTimer);
    };
  }, []);

  useEffect(() => {
    const flow = manifestoFlowRef.current;
    if (!flow) return;
    const stage = flow.querySelector<HTMLElement>(".manifesto-stage");
    const lines = [...flow.querySelectorAll<HTMLElement>(".manifesto-line > span")];
    const quote = flow.querySelector<HTMLElement>(".manifesto-quote");
    const signature = flow.querySelector<HTMLElement>(".manifesto-signature-mark");
    const signatureStrokes = [...flow.querySelectorAll<SVGPathElement>(".manifesto-signature-stroke")];
    const scrollCue = flow.querySelector<HTMLElement>(".manifesto-scroll");
    if (!stage || !quote || !signature || !scrollCue) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const readProgress = () => {
      const rect = flow.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      return reduced ? 1 : clamp(-rect.top / travel);
    };
    const paint = (progress: number) => {
      const handoff = clamp((progress - 0.9) / 0.1);

      lines.forEach((line, index) => {
        const reveal = clamp((progress - 0.08 - index * 0.1) / 0.24);
        const eased = 1 - Math.pow(1 - reveal, 3);
        line.style.transform = "translate3d(0, " + ((1 - eased) * 112) + "%, 0)";
        line.style.opacity = String(reveal);
      });

      const quoteReveal = clamp((progress - 0.04) / 0.68);
      const signatureReveal = clamp((progress - 0.34) / 0.22);
      quote.style.opacity = String(quoteReveal);
      signature.style.opacity = String(signatureReveal);
      signature.style.transform = "translate3d(0, " + ((1 - signatureReveal) * 24) + "px, 0)";
      signatureStrokes.forEach((stroke, index) => {
        const strokeReveal = clamp((signatureReveal - index * 0.12) / (1 - index * 0.12));
        stroke.style.strokeDashoffset = String(1 - strokeReveal);
      });
      scrollCue.style.opacity = String(1 - clamp(progress / 0.15));
      stage.style.opacity = String(1 - handoff);
    };

    let targetProgress = readProgress();
    let renderedProgress = targetProgress;
    let frame = 0;
    let previousTime = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.min(0.05, Math.max(0.001, (now - previousTime) / 1000));
      previousTime = now;
      const smoothing = 1 - Math.exp(-12 * elapsed);
      renderedProgress += (targetProgress - renderedProgress) * smoothing;

      if (Math.abs(targetProgress - renderedProgress) < 0.0004) {
        renderedProgress = targetProgress;
      }
      paint(renderedProgress);

      if (renderedProgress !== targetProgress) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };

    const requestUpdate = () => {
      targetProgress = readProgress();
      if (!frame && renderedProgress !== targetProgress) {
        previousTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    paint(renderedProgress);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  useEffect(() => {
    const section = aboutRef.current;
    if (!section) return;
    const flow = section.querySelector<HTMLElement>(".about-flight-flow");
    const stage = section.querySelector<HTMLElement>(".about-flight-stage");
    const targets = [...section.querySelectorAll<HTMLElement>(".about-target-char[data-char-id]")];
    const flyers = [...section.querySelectorAll<HTMLElement>(".about-flight-char[data-char-id]")];
    const intro = section.querySelector<HTMLElement>(".about-flight-intro");
    const scrollCue = section.querySelector<HTMLElement>(".about-flight-scroll");
    if (!flow || !stage || !intro || !scrollCue) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const pointOnCurve = (start: number, controlA: number, controlB: number, end: number, progress: number) => {
      const inverse = 1 - progress;
      return inverse ** 3 * start
        + 3 * inverse ** 2 * progress * controlA
        + 3 * inverse * progress ** 2 * controlB
        + progress ** 3 * end;
    };
    const targetsById = new Map(
      targets.map((target) => [target.dataset.charId, target]),
    );
    const staggerSpan = Math.max(0.65, 1 - flyers.length * 0.009);
    let flights: {
      flyer: HTMLElement;
      target: HTMLElement;
      index: number;
      lane: number;
      side: number;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      controlAX: number;
      controlAY: number;
      controlBX: number;
      controlBY: number;
    }[] = [];

    const measure = () => {
      const stageRect = stage.getBoundingClientRect();
      flights = flyers.flatMap((flyer, index) => {
        const target = targetsById.get(flyer.dataset.charId);
        if (!target) return [];
        const targetRect = target.getBoundingClientRect();
        const lane = index % 6;
        const side = index % 2 === 0 ? -1 : 1;
        const startX = side < 0
          ? -stageRect.width * (0.08 + lane * 0.018)
          : stageRect.width * (0.96 + lane * 0.014);
        const startY = stageRect.height * (0.09 + ((index * 37) % 78) / 100);
        const endX = targetRect.left - stageRect.left;
        const endY = targetRect.top - stageRect.top;
        return [{
          flyer,
          target,
          index,
          lane,
          side,
          startX,
          startY,
          endX,
          endY,
          controlAX: stageRect.width * (side < 0 ? 0.18 + lane * 0.035 : 0.82 - lane * 0.03),
          controlAY: stageRect.height * (index % 3 === 0 ? 0.06 : 0.88),
          controlBX: endX + side * stageRect.width * (0.08 + (index % 4) * 0.015),
          controlBY: endY + stageRect.height * (index % 2 === 0 ? -0.22 : 0.22),
        }];
      });
    };

    const readProgress = () => {
      const flowRect = flow.getBoundingClientRect();
      const travel = Math.max(1, flowRect.height - window.innerHeight);
      return reduced ? 1 : clamp(-flowRect.top / travel);
    };

    const paint = (progress: number) => {
      const flightProgress = clamp((progress - 0.06) / 0.62);

      flights.forEach((flight) => {
        const staggered = clamp((flightProgress - flight.index * 0.009) / staggerSpan);
        const eased = 1 - Math.pow(1 - staggered, 3);
        const x = pointOnCurve(flight.startX, flight.controlAX, flight.controlBX, flight.endX, eased);
        const y = pointOnCurve(flight.startY, flight.controlAY, flight.controlBY, flight.endY, eased);
        const arrival = clamp((staggered - 0.82) / 0.18);
        const rotation = flight.side * (1 - eased) * (18 + flight.lane * 3);

        flight.flyer.style.transform = "translate3d(" + x + "px, " + y + "px, 0) rotate(" + rotation + "deg)";
        flight.flyer.style.opacity = String(1 - arrival);
        flight.target.style.opacity = String(arrival);
      });

      const copyReveal = clamp((progress - 0.7) / 0.18);
      intro.style.opacity = String(copyReveal);
      intro.style.transform = "translate3d(0, " + ((1 - copyReveal) * 32) + "px, 0)";
      scrollCue.style.opacity = String(1 - clamp(progress / 0.16));
    };

    measure();
    let targetProgress = readProgress();
    let renderedProgress = targetProgress;
    let frame = 0;
    let previousTime = performance.now();
    let disposed = false;

    const tick = (now: number) => {
      const elapsed = Math.min(0.05, Math.max(0.001, (now - previousTime) / 1000));
      previousTime = now;
      const smoothing = 1 - Math.exp(-11 * elapsed);
      renderedProgress += (targetProgress - renderedProgress) * smoothing;

      if (Math.abs(targetProgress - renderedProgress) < 0.0004) {
        renderedProgress = targetProgress;
      }
      paint(renderedProgress);

      if (renderedProgress !== targetProgress) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };

    const requestUpdate = () => {
      targetProgress = readProgress();
      if (!frame && renderedProgress !== targetProgress) {
        previousTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      measure();
      requestUpdate();
      if (!frame) paint(renderedProgress);
    };

    paint(renderedProgress);
    void document.fonts.ready.then(() => {
      if (disposed) return;
      measure();
      paint(renderedProgress);
    });
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("in")),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => {
      const sections = [...document.querySelectorAll<HTMLElement>("[data-theme]")];
      const active = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 36 && rect.bottom > 36;
      });
      setHeaderDark(active?.dataset.theme === "dark");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen || Boolean(activeProject) || Boolean(lightbox));
    if (!menuOpen) return;
    const menu = menuRef.current;
    const focusable = menu?.querySelectorAll<HTMLElement>("a,button") ?? [];
    focusable[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === "Tab" && focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, activeProject, lightbox]);

  useEffect(() => {
    if (!activeProject && !lightbox) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (lightbox) setLightbox(null);
        else setActiveProject(null);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [activeProject, lightbox]);


  return (
    <>
      <a className="skip-link" href="#work">Skip to selected work</a>
      <div className={`intro ${introVisible ? "" : "is-gone"}`} aria-hidden="true">
        <div className={`intro-lockup is-${introPhase}`}>
          <div className="intro-wordmark" aria-label="Mars">
            <span className="intro-initial">M</span>
            <span className="intro-full">MARS</span>
          </div>
          <div className="intro-loader">
            <div className="intro-rotation">
              <span key={loadingWordStep} style={{ animationDuration: `${Math.max(150, 420 - loadingProgress * 2.7)}ms` }}>
                {INTRO_ROTATION_TERMS[loadingWordStep % INTRO_ROTATION_TERMS.length]}
              </span>
            </div>
            <div className="intro-meter">
              <span>{String(loadingProgress).padStart(3, "0")} / 100</span>
              <i><b style={{ width: `${loadingProgress}%` }} /></i>
            </div>
          </div>
        </div>
      </div>
      <div className="noise" aria-hidden="true" />

      <header className={`topbar ${headerDark ? "dark" : ""}`}>
        <a className="brand" href="#top" aria-label="Mars Atolba home">
          <span className="brand-mark">M°</span>
          <span className="brand-copy">Mars Atolba<br /><em>AI & Automation</em></span>
        </a>
        <button ref={menuButtonRef} className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen(true)}>
          <span>MENU</span><span className="menu-icon">+</span>
        </button>
      </header>

      <nav ref={menuRef} id="site-menu" className={`site-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="site-menu-inner">
          <p className="eyebrow inverse">NAVIGATION / 2026</p>
          {[["01", "ABOUT", "#about"], ["02", "WORK", "#work"], ["03", "PROCESS", "#process"], ["04", "EXPERIENCE", "#experience"], ["05", "STACK", "#stack"], ["06", "CONTACT", "#contact"]].map(([num, label, href]) => (
            <a key={href} href={href} onClick={(event) => { event.preventDefault(); navigateFromMenu(href); }}><span>{num}</span>{label}</a>
          ))}
          <a href="/assets/Mars-Atolba-Resume.pdf" target="_blank" rel="noreferrer"><span>07</span>RESUME</a>
          <button className="menu-close" type="button" onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus(); }}>CLOSE ×</button>
        </div>
      </nav>

      <main id="top">
        <section ref={heroRef} className="hero theme-light" data-theme="light">
          <HeroFluidCanvas />
          <div className="hero-meta">
            <p>AI with purpose.<br />Automation that works.<br />Systems built to be understood.</p>
            <a href="#work" className="pill">VIEW WORK ↘</a>
          </div>
          <h1 className="hero-title" aria-label="Automate">
            <span className="hero-line reveal-word">AUTOMATE</span>
          </h1>
          <div className="hero-footer">
            <span>AI WORKFLOWS / N8N / GOHIGHLEVEL</span>
            <span>ELEVATE. AUTOMATE. EXCEL</span>
            <span>PHILIPPINES / REMOTE</span>
          </div>
        </section>

        <section ref={manifestoFlowRef} className="manifesto-flow theme-dark" data-theme="dark" aria-label="Personal manifesto">
          <div className="manifesto-stage">
            <div className="manifesto-meta">
              <span>MARS / PERSONAL MANIFESTO</span>
              <span>PURPOSE → WISDOM → EXCELLENCE</span>
            </div>
            <blockquote className="manifesto-quote" aria-label={MANIFESTO_QUOTE}>
              {MANIFESTO_LINES.map((line) => (
                <span className="manifesto-line" key={line} aria-hidden="true"><span>{line}</span></span>
              ))}
            </blockquote>
            <div className="manifesto-signature-slot">
              <svg className="manifesto-signature-mark" viewBox="0 0 210 145" role="img" aria-label="Angular handwritten signature mark">
                <path className="manifesto-signature-stroke" pathLength="1" d="M29 72 L188 26" />
                <path className="manifesto-signature-stroke" pathLength="1" d="M51 125 L101 52 L136 19" />
                <path className="manifesto-signature-stroke" pathLength="1" d="M71 98 L105 64 L102 71 L124 54 L96 109 L188 26" />
              </svg>
            </div>
            <span className="manifesto-scroll">SCROLL TO REVEAL ↓</span>
            <span className="manifesto-index" aria-hidden="true">IV</span>
          </div>
        </section>

        <section ref={aboutRef} id="about" className="about-assembly theme-dark" data-theme="dark">
          <div className="about-flight-flow">
            <div className="about-flight-stage">
              <div className="about-flight-meta">
                <span>01 / ABOUT ME</span>
                <span>PEOPLE → PROCESS → SYSTEMS</span>
              </div>
              <p className="about-ghost" aria-hidden="true">FROM OPERATIONS TO SYSTEMS</p>
              <h2 className="about-role" aria-label="An AI Automation Specialist.">
                {ABOUT_ROLE_LINES.map((line, lineIndex) => (
                  <span className="about-role-line" key={line} aria-hidden="true">
                    {[...line].map((character, index) => (
                      <span
                        className={`about-target-char${character === " " ? " is-space" : ""}`}
                        data-char-id={character === " " ? undefined : `${lineIndex}-${index}`}
                        key={`${line}-${index}`}
                      >
                        {character === " " ? "\u00A0" : character}
                      </span>
                    ))}
                  </span>
                ))}
              </h2>
              <div className="about-fliers" aria-hidden="true">
                {ABOUT_ROLE_LINES.flatMap((line, lineIndex) => [...line].map((character, index) => (
                  character === " " ? null : (
                    <span className="about-flight-char" data-char-id={`${lineIndex}-${index}`} key={`fly-${lineIndex}-${index}`}>
                      {character}
                    </span>
                  )
                )))}
              </div>
              <div className="about-flight-intro">
                <p>My work started with people and day-to-day operations. That foundation taught me to see the handoffs, bottlenecks, and repetitive work behind every process.</p>
                <span>MARS, FROM OPERATIONS TO SYSTEMS</span>
              </div>
              <span className="about-flight-scroll">SCROLL / ASSEMBLE ↓</span>
            </div>
          </div>


          <div className="about-belief">
            <h3 className="reveal">I START WITH<br />THE PROCESS.</h3>
            <div className="about-belief-body">
              <div className="manifesto-graphic" aria-hidden="true">
                <svg viewBox="0 0 620 620"><path d="M310 120 C470 120 520 260 430 310 C520 380 440 510 310 500 C170 500 95 380 190 310 C95 245 155 120 310 120Z" /><path d="M185 310H435M310 120V500" /></svg>
                <div className="map-core"><strong>MARS</strong><span>SYSTEM MAP</span></div>
                <span className="map-node map-a">PROCESS</span><span className="map-node map-b">LOGIC</span><span className="map-node map-c">TOOLS</span><span className="map-node map-d">OUTCOME</span>
              </div>
              <p className="reveal">I choose the right mix of n8n, AI, GoHighLevel, APIs, and business tools—so the result is practical, reliable, and easy to maintain.</p>
            </div>
          </div>
        </section>

        <section id="work" className="work theme-dark" data-theme="dark">
          <div className="work-intro reveal">
            <div><p className="eyebrow inverse">02 / SELECTED WORK</p><h2>WORKS</h2><p className="muted-light">Where automation becomes operational.</p></div>
            <p className="work-index">06 SYSTEMS<br />AI / CRM / AUTOMATION</p>
          </div>
          <div className="work-browser reveal">
            <div className="work-browser-bar"><span>MARS / WORK INDEX</span><span>SELECT A SYSTEM</span><span>01—06</span></div>
            <div className="work-browser-layout" onMouseLeave={() => setWorkPreviewVisible(false)}>
              <div className="work-list" aria-label="Selected systems">
                {projects.map((project) => (
                  <button
                    key={project.num}
                    type="button"
                    className={`work-list-row${workPreviewVisible && previewProject.num === project.num ? " is-active" : ""}`}
                    aria-label={`Open project: ${project.name}`}
                    onMouseEnter={() => { setPreviewProject(project); setWorkPreviewVisible(true); }}
                    onFocus={() => { setPreviewProject(project); setWorkPreviewVisible(true); }}
                    onBlur={() => setWorkPreviewVisible(false)}
                    onClick={() => openProject(project)}
                  >
                    <span className="work-list-num">{project.num}</span>
                    <span className="work-list-title"><strong>{project.name}</strong><em>{project.category}</em></span>
                    <span className="work-list-scope">{project.scope}</span>
                    <span className="work-list-arrow">↗</span>
                  </button>
                ))}
              </div>
              <aside className={`work-hover-preview${workPreviewVisible ? " is-visible" : ""}`} aria-live="polite" aria-label={`${previewProject.name} preview`}>
                <div className="work-hover-media">
                  {previewProject.image ? <img key={previewProject.image} src={previewProject.image} alt={`${previewProject.name} workflow screenshot`} /> : <SystemArt num={previewProject.num} />}
                  <span className="work-preview-scan"><i />MARS / SYSTEM {previewProject.num}</span>
                </div>
                <div className="work-hover-meta"><span>{previewProject.shortName}</span><span>CLICK TO OPEN ↗</span></div>
              </aside>
            </div>
          </div>
        </section>

        <section id="process" className="process theme-light" data-theme="light">
          <div className="process-layout">
            <div className="process-intro reveal">
              <p className="eyebrow">03 / PROCESS</p>
              <h2>Build the right thing.<br />Then make it reliable.</h2>
              <div className="process-quote"><p>“Automate the right process — not simply the existing process.”</p><span>AI is a tool within the system, not automatically the solution to every problem.</span></div>
            </div>
            <div className="process-steps">
              {[
                ["01", "UNDERSTAND", "Understand the process, desired outcome, people involved, bottlenecks, and repetitive work before choosing the technology."],
                ["02", "DESIGN", "Map triggers, actions, integrations, data, decision points, AI steps, exceptions, and expected outcomes."],
                ["03", "BUILD", "Use the right combination of automation, AI, APIs, CRM tools, and business applications."],
                ["04", "TEST", "Validate workflow logic, field mappings, branches, AI outputs, timing, integrations, and edge cases."],
                ["05", "DOCUMENT & IMPROVE", "Use clear naming, organized workflow logic, documentation, execution review, and iteration."],
              ].map(([num, title, copy]) => <article key={num} className="process-step reveal"><span>{num}</span><h3>{title}</h3><p>{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section id="experience" className="experience theme-dark" data-theme="dark">
          <div className="experience-head reveal"><p className="eyebrow inverse">04 / EXPERIENCE</p><h2>FROM OPERATIONS<br />TO SYSTEMS.</h2></div>
          <div className="timeline">
            <article className="timeline-row reveal"><div><span>CURRENT</span><span>MARCH 2025 — PRESENT</span></div><div><h3>AI Automation Specialist</h3><p>Independent / Freelance</p></div><p>Design and build AI-powered workflows, business automations, CRM systems, integrations, and connected processes using n8n, AI models, GoHighLevel, APIs, webhooks, and business applications.</p></article>
            <article className="timeline-row reveal"><div><span>INDEPENDENT PROJECTS</span><span>SEPTEMBER 2024 — MARCH 2025</span></div><div><h3>AI Automation Developer</h3><p>Independent Projects</p></div><p>Built and tested practical automation systems with n8n, AI-assisted processes, GoHighLevel, APIs, webhooks, routing logic, structured outputs, and connected business applications.</p></article>
            <article className="timeline-row reveal"><div><span>PREVIOUS</span><span>AUGUST 2021 — AUGUST 2024</span></div><div><h3>Operations & Customer Success</h3><p>Operations & Support</p></div><p>Supported customer communication, documentation, reporting, follow-ups, administrative processes, and day-to-day problem solving — the operational foundation behind how I design automation today.</p></article>
          </div>
        </section>

        <section id="stack" className="stack theme-light" data-theme="light">
          <div className="stack-head reveal"><p className="eyebrow">05 / STACK</p><h2>TOOLS CHANGE.<br />SYSTEM THINKING STAYS.</h2></div>
          <div className="marquee" aria-label="Core tools"><div className="marquee-track">{[0, 1].map((set) => <div className="marquee-set" key={set}><span>N8N</span><i>+</i><span>GOHIGHLEVEL</span><i>+</i><span>OPENAI</span><i>+</i><span>GROQ</span><i>+</i><span>APIs</span><i>+</i><span>WEBHOOKS</span><i>+</i><span>GOOGLE SHEETS</span><i>+</i><span>SLACK</span><i>+</i></div>)}</div></div>
          <div className="stack-grid reveal">
            <article><span>AI & LLM WORK</span><p>ChatGPT, OpenAI, Groq, prompt design, structured outputs, AI-assisted workflows.</p></article>
            <article><span>AUTOMATION</span><p>n8n, workflow automation, conditional logic, data transformation, testing.</p></article>
            <article><span>INTEGRATIONS</span><p>APIs, webhooks, Gmail, Google Sheets, Slack, Google Workspace.</p></article>
            <article><span>CRM & BUSINESS SYSTEMS</span><p>GoHighLevel, pipelines, funnels, calendars, forms, email & SMS automation.</p></article>
          </div>
        </section>

        <section className="principles theme-light" data-theme="light">
          <div className="principles-visual reveal" aria-hidden="true">
            <div className="method-title"><span>MARS / METHOD</span><strong>FROM FRICTION<br />TO FLOW.</strong></div>
            <div className="method-track"><i /><span>01 / DISCOVER</span><span>02 / MAP</span><span>03 / BUILD</span><span>04 / TEST</span><span>05 / IMPROVE</span></div>
            <div className="method-signal"><span>PROCESS FIRST</span><span>HUMAN IN THE LOOP</span><span>MEASURED OUTCOME</span></div>
          </div>
          <div className="principles-copy reveal"><p className="eyebrow">HOW I WORK</p><h2>Business first.<br />AI with purpose.<br />Clear enough to maintain.</h2><div className="principle-list"><span>RELIABLE WORKFLOWS</span><span>CLEAR COMMUNICATION</span><span>MAINTAINABLE SYSTEMS</span><span>CONTINUOUS LEARNING</span></div></div>
        </section>

        <section id="contact" className="contact theme-dark" data-theme="dark">
          <div className="contact-layout reveal">
            <div className="contact-primary"><p className="eyebrow inverse">06 / CONTACT</p><h2>LET&apos;S BUILD<br />A BETTER SYSTEM.</h2><ContactForm /></div>
            <aside className="contact-details" aria-label="Contact details">
              <p className="contact-details-label">DIRECT CONTACT</p>
              <a href="mailto:marsatolba6@gmail.com"><span>EMAIL</span>marsatolba6@gmail.com ↗</a>
              <a href="https://automateiv.vercel.app" target="_blank" rel="noreferrer"><span>WEBSITE</span>automateiv.vercel.app ↗</a>
              <p><span>LOCATION</span>Remote / Philippines<br />Available for global teams</p>
              <div className="contact-actions"><a className="pill pill-inverse" href="/assets/Mars-Atolba-Resume.pdf" target="_blank" rel="noreferrer">VIEW RESUME ↗</a></div>
            </aside>
          </div>
          <div className="footer-word" aria-label="Elevate Automate Excel"><span>ELEVATE.</span><span>AUTOMATE.</span><span>EXCEL.</span></div>
          <div className="footer-bottom"><span>© 2026 MARS ATOLBA</span><span>AI AUTOMATION SPECIALIST</span><span>BUILT FOR CLARITY + MOTION</span></div>
        </section>
      </main>

      {activeProject && (
        <div className="modal-shell" role="presentation">
          <section className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-title">
            <nav className="project-interface-bar" aria-label="Project navigation">
              <button className="project-back" type="button" onClick={closeProject} autoFocus>← WORK INDEX</button>
              <span>{activeProject.num} / {String(projects.length).padStart(2, "0")}</span>
              <div><button type="button" onClick={() => showAdjacentProject(-1)}>PREV</button><button type="button" onClick={() => showAdjacentProject(1)}>NEXT</button></div>
            </nav>
            <div className="dialog-content">
              <div className="dialog-head"><div><p className="dialog-kicker">{activeProject.num} / {activeProject.category}<br />{activeProject.scope}</p></div><h2 id="project-title">{activeProject.name}</h2></div>
              <div className="dialog-system-layout">
                <aside className="project-proof-rail" aria-label="Project proof rail">
                  <div className="proof-status"><i /><span>SYSTEM VERIFIED</span></div>
                  <dl>
                    <div><dt>TYPE</dt><dd>{activeProject.category}</dd></div>
                    <div><dt>SCOPE</dt><dd>{activeProject.scope}</dd></div>
                    <div><dt>STAGES</dt><dd>{String(activeProject.flow.length).padStart(2, "0")}</dd></div>
                    <div><dt>TOOLS</dt><dd>{String(activeProject.tools.length).padStart(2, "0")}</dd></div>
                    <div><dt>QA</dt><dd>TESTED</dd></div>
                  </dl>
                  <p>MOVE OVER EACH IMAGE TO REVEAL THE SYSTEM MAP.</p>
                </aside>
                <div className="dialog-system-main">
                  {activeProject.gallery && (
                    <div className="dialog-gallery scan-gallery">
                      {activeProject.gallery.map((src, index) => <ScanStage project={activeProject} src={src} index={index} key={src} onExpand={() => setLightbox(src)} />)}
                    </div>
                  )}
                  <section className="system-story" aria-label="System story">
                    <header><p>MARS / SYSTEM STORY</p><h3>FROM FRICTION<br />TO FLOW.</h3></header>
                    {[
                      ["00", "PROBLEM", activeProject.problem],
                      ["01", "TRIGGER", `The sequence begins at ${activeProject.flow[0] ?? "a defined trigger"}.`],
                      ["02", "LOGIC", activeProject.system],
                      ["03", "ACTION", `The workflow advances through ${activeProject.flow.slice(1).join(" → ")}.`],
                      ["04", "RESULT", activeProject.value],
                    ].map(([num, label, copy]) => <article className="story-step" key={num}><span>{num}</span><h4>{label}</h4><p>{copy}</p></article>)}
                    <article className="story-qa"><span>RELIABILITY / QA</span><p>{activeProject.reliability}</p></article>
                  </section>
                  <div className="dialog-flow">{activeProject.flow.map((item, index) => <span key={item}>{index > 0 && <i>→</i>}{item}</span>)}</div>
                  <div className="dialog-tools">{activeProject.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
                  <p className="case-study-note">Case-study details are available on request. Walkthrough links are included only when a verified video is available.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {lightbox && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Project screenshot"><button type="button" onClick={() => setLightbox(null)}>CLOSE ×</button><img src={lightbox} alt="Expanded project workflow screenshot" /></div>}
    </>
  );
}
