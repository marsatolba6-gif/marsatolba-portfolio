"use client";

/* Local portfolio screenshots intentionally keep their original pixel dimensions and paths. */
/* eslint-disable @next/next/no-img-element */

import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";

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

  return (
    <article
      ref={stageRef}
      className="scan-stage"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
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
const BRUSH_TRAIL_HOLD_MS = 1550;
const BRUSH_TRAIL_FADE_MS = 1150;
const BRUSH_TRAIL_LIFETIME_MS = BRUSH_TRAIL_HOLD_MS + BRUSH_TRAIL_FADE_MS;

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
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [headerDark, setHeaderDark] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
    const media = [...document.querySelectorAll<HTMLElement>(".project-media")];
    let frame = 0;
    const update = () => {
      const viewport = window.innerHeight;
      media.forEach((item) => {
        const card = item.closest<HTMLElement>(".project-card");
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (viewport * 0.78 - rect.top) / (rect.height + viewport * 0.22)));
        item.style.setProperty("--media-scale", String(1 - progress * 0.12));
      });
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    const cursor = cursorRef.current;
    if (!canvas || !hero || !cursor) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      canvas.style.display = "none";
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) return;
    const baseCanvas = document.createElement("canvas");
    const baseContext = baseCanvas.getContext("2d");
    if (!baseContext) return;
    type BrushPoint = { x: number; y: number; radius: number; createdAt: number };
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let last: { x: number; y: number; time: number } | null = null;
    let trail: BrushPoint[] = [];
    let touchActive = false;
    let activePointerId: number | null = null;
    let inputFrame = 0;
    let trailFrame = 0;
    let lastTrailRender = 0;

    const paintBase = (width: number, height: number) => {
      baseContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      baseContext.globalCompositeOperation = "source-over";
      baseContext.fillStyle = "#fff";
      baseContext.fillRect(0, 0, width, height);
      baseContext.strokeStyle = "rgba(10,10,10,.055)";
      baseContext.lineWidth = 1;
      for (let x = 0; x < width; x += 46) {
        baseContext.beginPath();
        baseContext.moveTo(x, 0);
        baseContext.lineTo(x, height);
        baseContext.stroke();
      }
      for (let y = 0; y < height; y += 46) {
        baseContext.beginPath();
        baseContext.moveTo(0, y);
        baseContext.lineTo(width, y);
        baseContext.stroke();
      }
    };

    const restoreBase = () => {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(baseCanvas, 0, 0);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resetCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = hero.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      baseCanvas.width = canvas.width;
      baseCanvas.height = canvas.height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      paintBase(rect.width, rect.height);
      trail = [];
      restoreBase();
      last = null;
    };

    const erase = (x: number, y: number, radius: number, strength = 1) => {
      context.save();
      context.globalCompositeOperation = "destination-out";
      const gradient = context.createRadialGradient(x, y, radius * 0.18, x, y, radius);
      gradient.addColorStop(0, `rgba(0,0,0,${strength})`);
      gradient.addColorStop(0.72, `rgba(0,0,0,${strength * 0.88})`);
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    const renderTrail = (now: number) => {
      if (now - lastTrailRender < 32) {
        trailFrame = requestAnimationFrame(renderTrail);
        return;
      }
      lastTrailRender = now;
      trail = trail.filter((point) => now - point.createdAt < BRUSH_TRAIL_LIFETIME_MS);
      restoreBase();
      trail.forEach((point) => {
        const age = now - point.createdAt;
        const strength = age <= BRUSH_TRAIL_HOLD_MS
          ? 1
          : Math.max(0, 1 - (age - BRUSH_TRAIL_HOLD_MS) / BRUSH_TRAIL_FADE_MS);
        const radius = point.radius * (0.78 + strength * 0.22);
        erase(point.x, point.y, radius, strength);
      });
      trailFrame = trail.length ? requestAnimationFrame(renderTrail) : 0;
    };

    const queueTrailRender = () => {
      if (!trailFrame) trailFrame = requestAnimationFrame(renderTrail);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && activePointerId !== event.pointerId) return;
      if (event.pointerType !== "mouse" && touchActive) event.preventDefault();
      const rect = hero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
      const action = target?.closest("a,button,input,textarea,select,[role='button']");
      const scan = !action && target?.closest(".scan-stage");
      const text = !action && !scan && target?.closest("h1,h2,h3,p,.project-short-name,.footer-word,.eyebrow");
      const label = cursor.querySelector("span");
      cursor.classList.toggle("is-action", Boolean(action));
      cursor.classList.toggle("is-text", Boolean(text));
      cursor.classList.toggle("is-scan", Boolean(scan));
      if (label) label.textContent = action ? (target?.matches("input,textarea,select") ? "WRITE" : "OPEN") : scan ? "SCAN" : text ? "READ" : "BRUSH";
      cursor.style.opacity = event.pointerType === "mouse" ? "1" : touchActive ? ".86" : "0";
      cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0) translate(-50%,-50%)`;
      if (action) {
        cursor.style.width = "58px";
        cursor.style.height = "58px";
      } else if (scan) {
        cursor.style.width = "88px";
        cursor.style.height = "88px";
      } else if (text) {
        cursor.style.width = "46px";
        cursor.style.height = "22px";
      } else if (!inside) {
        cursor.style.width = "76px";
        cursor.style.height = "76px";
      }
      if (!inside || (event.pointerType !== "mouse" && !touchActive)) {
        last = null;
        return;
      }
      if (inputFrame) cancelAnimationFrame(inputFrame);
      inputFrame = requestAnimationFrame(() => {
        const now = performance.now();
        const distance = last ? Math.hypot(x - last.x, y - last.y) : 0;
        const elapsed = last ? Math.max(1, now - last.time) : 16;
        const speed = distance / elapsed;
        const radius = Math.min(132, Math.max(54, 62 + speed * 22));
        const steps = last ? Math.max(1, Math.ceil(distance / (radius * 0.3))) : 1;
        for (let i = 1; i <= steps; i += 1) {
          const t = i / steps;
          trail.push({
            x: last ? last.x + (x - last.x) * t : x,
            y: last ? last.y + (y - last.y) * t : y,
            radius,
            createdAt: now,
          });
        }
        if (trail.length > 160) trail.splice(0, trail.length - 160);
        queueTrailRender();
        if (!action && !text) {
          cursor.style.width = `${radius * 1.55}px`;
          cursor.style.height = `${radius * 1.55}px`;
        }
        last = { x, y, time: now };
      });
    };

    const pointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || !event.isPrimary) return;
      event.preventDefault();
      touchActive = true;
      activePointerId = event.pointerId;
      cursor.classList.add("is-touching");
      canvas.setPointerCapture(event.pointerId);
      move(event);
    };
    const pointerUp = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) return;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      touchActive = false;
      activePointerId = null;
      cursor.classList.remove("is-touching");
      cursor.style.opacity = "0";
      last = null;
    };
    resetCanvas();
    window.addEventListener("resize", resetCanvas);
    window.addEventListener("pointermove", move, { passive: false });
    canvas.addEventListener("pointerdown", pointerDown, { passive: false });
    window.addEventListener("pointerup", pointerUp, { passive: true });
    window.addEventListener("pointercancel", pointerUp, { passive: true });
    return () => {
      if (inputFrame) cancelAnimationFrame(inputFrame);
      if (trailFrame) cancelAnimationFrame(trailFrame);
      window.removeEventListener("resize", resetCanvas);
      window.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", pointerDown);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", pointerUp);
    };
  }, []);

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
      <div ref={cursorRef} className="cursor-brush" aria-hidden="true"><span>BRUSH</span></div>
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
          <div className="brush-underlay" aria-hidden="true">
            <div className="underlay-grid" />
            <div className="underlay-orb orb-alpha">AI</div>
            <div className="underlay-orb orb-beta">N8N</div>
            <div className="underlay-orb orb-gamma">GHL</div>
            <span className="underlay-note">CONNECTED SYSTEMS / HUMAN CLARITY</span>
          </div>
          <canvas ref={canvasRef} className="brush-canvas" aria-hidden="true" />
          <div className="brush-instruction" aria-hidden="true"><span>DRAG TO REVEAL</span><i /></div>
          <div className="hero-meta">
            <p>AI with purpose.<br />Automation that works.<br />Systems built to be understood.</p>
            <a href="#work" className="pill">VIEW WORK ↘</a>
          </div>
          <h1 className="hero-title" aria-label="Automate with Mars">
            <span className="hero-line reveal-word">AUTOMATE</span>
            <span className="hero-line hero-line-indent reveal-word">WITH MARS.</span>
          </h1>
          <div className="hero-footer">
            <span>AI WORKFLOWS / N8N / GOHIGHLEVEL</span>
            <span>ELEVATE. AUTOMATE. EXCEL</span>
            <span>PHILIPPINES / REMOTE</span>
          </div>
        </section>

        <section id="about" className="manifesto theme-light" data-theme="light">
          <div className="manifesto-graphic" aria-hidden="true">
            <svg viewBox="0 0 620 620"><path d="M310 120 C470 120 520 260 430 310 C520 380 440 510 310 500 C170 500 95 380 190 310 C95 245 155 120 310 120Z" /><path d="M185 310H435M310 120V500" /></svg>
            <div className="map-core"><strong>MARS</strong><span>SYSTEM MAP</span></div>
            <span className="map-node map-a">PROCESS</span><span className="map-node map-b">LOGIC</span><span className="map-node map-c">TOOLS</span><span className="map-node map-d">OUTCOME</span>
          </div>
          <div className="manifesto-copy reveal">
            <p className="eyebrow">01 / INTRODUCTION</p>
            <h2>I build systems<br /><span>that make work move.</span></h2>
          </div>
          <div className="manifesto-grid reveal">
            <p className="manifesto-note">OPERATIONS → AUTOMATION</p>
            <div className="manifesto-body">
              <p>I&apos;m Mars Atolba, an AI & Automation Specialist with a background in operations and customer support. I turn repetitive work, scattered information, and manual handoffs into clear, connected workflows.</p>
              <p>I start with the process, then choose the right mix of n8n, AI, GoHighLevel, APIs, and business tools—so the result is practical, reliable, and easy to maintain.</p>
            </div>
          </div>
        </section>

        <section id="work" className="work theme-dark" data-theme="dark">
          <div className="work-intro reveal">
            <div><p className="eyebrow inverse">02 / SELECTED WORK</p><h2>WORKS</h2><p className="muted-light">Where automation becomes operational.</p></div>
            <p className="work-index">05 SYSTEMS<br />AI / CRM / AUTOMATION</p>
          </div>
          <div className="projects">
            {projects.map((project) => (
              <article key={project.num} className={`project-card reveal is-${project.layout}`} role="button" tabIndex={0} aria-label={`Open project: ${project.name}`} onClick={() => setActiveProject(project)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveProject(project); } }}>
                <div className="project-media">
                  {project.image ? <img src={project.image} alt={`${project.name} workflow screenshot`} loading="lazy" /> : <SystemArt num={project.num} />}
                </div>
                <div className="project-copy">
                  <div className="project-kicker"><span>{project.num} / {project.category}</span><span>{project.scope}</span></div>
                  <p className="project-short-name">{project.shortName}</p>
                  <h3>{project.name}</h3><p>{project.value}</p><span className="project-open">SCAN SYSTEM ↗</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="process theme-light" data-theme="light">
          <div className="process-head reveal"><p className="eyebrow">03 / PROCESS</p><h2>Build the right thing.<br />Then make it reliable.</h2></div>
          <div className="process-steps">
            {[
              ["01", "UNDERSTAND", "Understand the process, desired outcome, people involved, bottlenecks, and repetitive work before choosing the technology."],
              ["02", "DESIGN", "Map triggers, actions, integrations, data, decision points, AI steps, exceptions, and expected outcomes."],
              ["03", "BUILD", "Use the right combination of automation, AI, APIs, CRM tools, and business applications."],
              ["04", "TEST", "Validate workflow logic, field mappings, branches, AI outputs, timing, integrations, and edge cases."],
              ["05", "DOCUMENT & IMPROVE", "Use clear naming, organized workflow logic, documentation, execution review, and iteration."],
            ].map(([num, title, copy]) => <article key={num} className="process-step reveal"><span>{num}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
          <div className="process-quote reveal"><p>“Automate the right process — not simply the existing process.”</p><span>AI is a tool within the system, not automatically the solution to every problem.</span></div>
        </section>

        <section id="experience" className="experience theme-dark" data-theme="dark">
          <div className="experience-head reveal"><p className="eyebrow inverse">04 / EXPERIENCE</p><h2>FROM OPERATIONS<br />TO SYSTEMS.</h2></div>
          <div className="timeline">
            <article className="timeline-row reveal"><div><span>CURRENT</span><span>MARCH 2025 — PRESENT</span></div><div><h3>AI & Automation Specialist</h3><p>Independent / Freelance</p></div><p>Design and build AI-powered workflows, business automations, CRM systems, integrations, and connected processes using n8n, AI models, GoHighLevel, APIs, webhooks, and business applications.</p></article>
            <article className="timeline-row reveal"><div><span>INDEPENDENT PROJECTS</span><span>SEPTEMBER 2024 — MARCH 2025</span></div><div><h3>AI & Automation Developer</h3><p>Independent Projects</p></div><p>Built and tested practical automation systems with n8n, AI-assisted processes, GoHighLevel, APIs, webhooks, routing logic, structured outputs, and connected business applications.</p></article>
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
          <div className="footer-bottom"><span>© 2026 MARS ATOLBA</span><span>AI & AUTOMATION SPECIALIST</span><span>BUILT FOR CLARITY + MOTION</span></div>
        </section>
      </main>

      {activeProject && (
        <div className="modal-shell" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveProject(null); }}>
          <section className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-title">
            <button className="dialog-close" type="button" onClick={() => setActiveProject(null)} autoFocus>CLOSE ×</button>
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
