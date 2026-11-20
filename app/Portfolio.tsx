"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import ContactForm from "./_components/ContactForm";
import ScanStage from "./_components/ScanStage";
import SystemArt from "./_components/SystemArt";
import {
  ABOUT_ROLE_LINES,
  FEATURED_PROJECT_SLUGS,
  INTRO_ROTATION_TERMS,
  INTRO_TIMING,
  MANIFESTO_LINES,
  MANIFESTO_QUOTE,
  NAVIGATION_ITEMS,
  PROCESS_STEPS,
  STACK_TOOLS,
  STACK_DETAILS,
} from "./portfolio-content";
import { getProject, projects, type Project } from "./projects";
import { SITE_CONFIG } from "./site-config";
import { getSharpImageSrc } from "./image-quality";

const HeroFluidCanvas = dynamic(() => import("./HeroFluidCanvas"), { ssr: false });
const CURRENT_YEAR = new Date().getFullYear();
const featuredProjects = FEATURED_PROJECT_SLUGS.map(getProject).filter((project): project is Project => Boolean(project));

export default function Portfolio({ webhookReady = false }: { webhookReady?: boolean }) {
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
  const projectDialogRef = useRef<HTMLElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const projectTriggerRef = useRef<HTMLButtonElement | null>(null);
  const lightboxTriggerRef = useRef<HTMLButtonElement | null>(null);

  const openProject = (project: Project, trigger: HTMLButtonElement) => {
    track("Project Quick View Opened", { project: project.slug });
    projectTriggerRef.current = trigger;
    setPreviewProject(project);
    setWorkPreviewVisible(false);
    setActiveProject(project);
  };

  const closeProject = useCallback(() => {
    setLightbox(null);
    setActiveProject(null);
    window.requestAnimationFrame(() => projectTriggerRef.current?.focus());
  }, []);

  const openLightbox = (src: string, trigger: HTMLButtonElement) => {
    lightboxTriggerRef.current = trigger;
    setLightbox(src);
  };

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    window.requestAnimationFrame(() => lightboxTriggerRef.current?.focus());
  }, []);

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
    menuButtonRef.current?.focus({ preventScroll: true });
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
    const capTimer = window.setTimeout(() => setIntroVisible(false), 660);
    const started = performance.now();
    let animation = 0;
    let collapseTimer = 0;
    let exitTimer = 0;
    const update = (now: number) => {
      const elapsed = Math.max(0, now - started - INTRO_TIMING.loadStart);
      const ratio = Math.min(1, elapsed / INTRO_TIMING.progressDuration);
      const progress = Math.round(ratio * 100);
      const rotationStep = Math.min(11, Math.floor(ratio * 2 + Math.pow(ratio, 3) * 9));
      setLoadingProgress(progress);
      setLoadingWordStep(rotationStep);
      if (progress < 100) {
        animation = requestAnimationFrame(update);
      } else {
        collapseTimer = window.setTimeout(() => setIntroPhase("collapse"), INTRO_TIMING.collapsePause);
        exitTimer = window.setTimeout(() => setIntroVisible(false), INTRO_TIMING.exitDelay);
      }
    };
    animation = requestAnimationFrame(update);
    const nameTimer = window.setTimeout(() => setIntroPhase("name"), INTRO_TIMING.nameRevealAt);
    const loadTimer = window.setTimeout(() => setIntroPhase("loading"), INTRO_TIMING.loadStart);
    return () => {
      cancelAnimationFrame(animation);
      window.clearTimeout(nameTimer);
      window.clearTimeout(loadTimer);
      window.clearTimeout(collapseTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(capTimer);
    };
  }, []);

  useEffect(() => {
    const flow = manifestoFlowRef.current;
    if (!flow || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage = flow.querySelector<HTMLElement>(".manifesto-stage");
    const lines = [...flow.querySelectorAll<HTMLElement>(".manifesto-line > span")];
    const quote = flow.querySelector<HTMLElement>(".manifesto-quote");
    const signature = flow.querySelector<HTMLElement>(".manifesto-signature-mark");
    const signatureStrokes = [...flow.querySelectorAll<SVGPathElement>(".manifesto-signature-stroke")];
    const scrollCue = flow.querySelector<HTMLElement>(".manifesto-scroll");
    if (!stage || !quote || !signature || !scrollCue) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const smootherstep = (value: number) =>
      value * value * value * (value * (value * 6 - 15) + 10);
    const readProgress = () => {
      const rect = flow.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      return reduced ? 1 : clamp(-rect.top / travel);
    };
    const paint = (progress: number) => {
      const handoff = smootherstep(clamp((progress - 0.9) / 0.1));

      lines.forEach((line, index) => {
        const reveal = smootherstep(clamp((progress - 0.08 - index * 0.1) / 0.24));
        const eased = 1 - Math.pow(1 - reveal, 3);
        line.style.transform = "translate3d(0, " + ((1 - eased) * 112) + "%, 0)";
        line.style.opacity = String(reveal);
      });

      const quoteReveal = smootherstep(clamp((progress - 0.04) / 0.68));
      const signatureReveal = smootherstep(clamp((progress - 0.34) / 0.22));
      quote.style.opacity = String(quoteReveal);
      signature.style.opacity = String(signatureReveal);
      signature.style.transform = "translate3d(0, " + ((1 - signatureReveal) * 24) + "px, 0)";
      signatureStrokes.forEach((stroke, index) => {
        const strokeReveal = clamp((signatureReveal - index * 0.12) / (1 - index * 0.12));
        stroke.style.strokeDashoffset = String(1 - strokeReveal);
      });
      scrollCue.style.opacity = String(1 - smootherstep(clamp(progress / 0.15)));
      stage.style.opacity = String(1 - handoff);
    };

    let targetProgress = readProgress();
    let renderedProgress = targetProgress;
    let frame = 0;
    let previousTime = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.min(0.05, Math.max(0.001, (now - previousTime) / 1000));
      previousTime = now;
      const smoothing = 1 - Math.exp(-7.5 * elapsed);
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
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const flow = section.querySelector<HTMLElement>(".about-flight-flow");
    const stage = section.querySelector<HTMLElement>(".about-flight-stage");
    const targets = [...section.querySelectorAll<HTMLElement>(".about-target-char[data-char-id]")];
    const flyers = [...section.querySelectorAll<HTMLElement>(".about-flight-char[data-char-id]")];
    const intro = section.querySelector<HTMLElement>(".about-flight-intro");
    const scrollCue = section.querySelector<HTMLElement>(".about-flight-scroll");
    if (!flow || !stage || !intro || !scrollCue) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const smootherstep = (value: number) =>
      value * value * value * (value * (value * 6 - 15) + 10);
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
      const flightProgress = smootherstep(clamp((progress - 0.06) / 0.62));

      flights.forEach((flight) => {
        const staggered = smootherstep(clamp((flightProgress - flight.index * 0.009) / staggerSpan));
        const eased = smootherstep(staggered);
        const x = pointOnCurve(flight.startX, flight.controlAX, flight.controlBX, flight.endX, eased);
        const y = pointOnCurve(flight.startY, flight.controlAY, flight.controlBY, flight.endY, eased);
        const arrival = smootherstep(clamp((staggered - 0.82) / 0.18));
        const rotation = flight.side * (1 - eased) * (18 + flight.lane * 3);

        flight.flyer.style.transform = "translate3d(" + x + "px, " + y + "px, 0) rotate(" + rotation + "deg)";
        flight.flyer.style.opacity = String(1 - arrival);
        flight.target.style.opacity = String(arrival);
      });

      const copyReveal = smootherstep(clamp((progress - 0.7) / 0.18));
      intro.style.opacity = String(copyReveal);
      intro.style.transform = "translate3d(0, " + ((1 - copyReveal) * 32) + "px, 0)";
      scrollCue.style.opacity = String(1 - smootherstep(clamp(progress / 0.16)));
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
      const smoothing = 1 - Math.exp(-6.5 * elapsed);
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
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("in")),
      { threshold: 0.1 },
    );
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add("in");
      observer.observe(el);
    });
    document.documentElement.classList.add("js-motion");
    return () => { observer.disconnect(); document.documentElement.classList.remove("js-motion"); };
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
    const overlayOpen = menuOpen || Boolean(activeProject) || Boolean(lightbox);
    document.body.classList.toggle("menu-open", overlayOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen, activeProject, lightbox]);

  useEffect(() => {
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
  }, [menuOpen]);

  useEffect(() => {
    if (!activeProject || lightbox) return;
    const dialog = projectDialogRef.current;
    if (!dialog) return;
    const background = [document.querySelector<HTMLElement>(".topbar"), document.querySelector<HTMLElement>("#top"), menuRef.current].filter(Boolean) as HTMLElement[];
    background.forEach((element) => { element.inert = true; });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProject();
        return;
      }
      if (event.key === "Tab") {
        const focusable = [...dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
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
    return () => {
      background.forEach((element) => { element.inert = false; });
      window.removeEventListener("keydown", onKey);
    };
  }, [activeProject, lightbox, closeProject]);

  useEffect(() => {
    if (!lightbox) return;
    const dialog = lightboxRef.current;
    const projectShell = document.querySelector<HTMLElement>(".modal-shell");
    if (projectShell) projectShell.inert = true;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
        return;
      }
      if (event.key === "Tab") {
        const controls = [...(dialog?.querySelectorAll<HTMLElement>('button, a[href]') ?? [])];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first || !last) return;
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
    return () => {
      if (projectShell) projectShell.inert = false;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, closeLightbox]);


  return (
    <>
      <a className="skip-link" href="#work">Skip to selected work</a>
      <noscript><style>{".intro { display: none !important; }"}</style></noscript>
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
          <span className="brand-copy">Mars Atolba<br /><em>AI Automation Specialist</em></span>
        </a>
        <button ref={menuButtonRef} className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen(true)}>
          <span>MENU</span><span className="menu-icon">+</span>
        </button>
      </header>

      <nav ref={menuRef} id="site-menu" className={`site-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="site-menu-inner">
          <p className="eyebrow inverse">NAVIGATION / {CURRENT_YEAR}</p>
          {NAVIGATION_ITEMS.map(([num, label, href]) => (
            <a key={href} href={href} onClick={(event) => { event.preventDefault(); navigateFromMenu(href); }}><span>{num}</span>{label}</a>
          ))}
          <a href="/assets/Mars-Atolba-Resume.pdf" target="_blank" rel="noreferrer" onClick={() => track("Resume Opened", { source: "menu" })}><span>07</span>RESUME</a>
          <button className="menu-close" type="button" onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus(); }}>CLOSE ×</button>
        </div>
      </nav>

      <main id="top">
        <section ref={heroRef} className="hero theme-light" data-theme="light">
          <HeroFluidCanvas />
          <div className="hero-meta">
            <p>AI Automation Specialist helping agencies and service businesses automate operations and lead follow-up with n8n, GoHighLevel, and AI workflows.</p>
            <a href="#work" className="pill" onClick={() => track("Hero CTA Clicked", { destination: "work" })}>VIEW WORK ↘</a>
          </div>
          <h1 className="hero-title">
            <span className="sr-only">Mars Atolba — AI Automation Specialist</span>
            <span className="hero-line reveal-word" aria-hidden="true">AUTOMATE</span>
          </h1>
          <div className="hero-footer">
            <span>AI WORKFLOWS / N8N / GOHIGHLEVEL</span>
            <span>Elevate. Automate. Excel.</span>
            <span>PHILIPPINES / REMOTE</span>
          </div>
        </section>
        <nav className="hero-link-row" aria-label="Start a conversation, book a call, or view resume">
          <a href="#contact" onClick={() => track("Hero CTA Clicked", { destination: "contact" })}>Start a conversation <span aria-hidden="true">↗</span></a>
          {SITE_CONFIG.bookingUrl.trim() && <a href={SITE_CONFIG.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("Booking Opened", { source: "hero" })}>Book a call <span aria-hidden="true">↗</span></a>}
          <a href="/assets/Mars-Atolba-Resume.pdf" target="_blank" rel="noreferrer" onClick={() => track("Resume Opened", { source: "hero" })}>View resume <span aria-hidden="true">↗</span></a>
        </nav>

        <section className="proof-preview theme-dark" data-theme="dark" aria-labelledby="proof-preview-title">
          <header className="proof-preview-head">
            <div>
              <p className="eyebrow inverse">SELECTED SYSTEMS</p>
              <h2 id="proof-preview-title">BUILT.<br />TESTED.<br />MAPPED.</h2>
            </div>
            <p>Independent systems documented through workflow logic, scenario testing, reliability decisions, and clear operational handoffs.</p>
          </header>
          <div className="proof-preview-grid">
            {featuredProjects.map((project) => (
              <Link className="proof-preview-card" href={`/work/${project.slug}`} key={project.slug} onClick={() => track("Case Study Opened", { project: project.slug, source: "proof_preview" })}>
                <span>{project.num} / {project.category}</span>
                <h3>{project.shortName}</h3>
                <p>{project.testScenarios[0]?.scenario} · {project.testScenarios[1]?.scenario}</p>
                <strong>READ CASE STUDY ↗</strong>
              </Link>
            ))}
          </div>
          <footer className="proof-preview-actions">
            <a href="#work" onClick={() => track("Proof CTA Clicked", { destination: "work" })}>VIEW ALL SIX SYSTEMS ↓</a>
            <a href="#contact" onClick={() => track("Contact CTA Clicked", { source: "proof_preview" })}>START A CONVERSATION ↗</a>
          </footer>
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
                <Image
                  src="/assets/mars-atolba-photo.jpg"
                  alt="Mars Atolba, AI Automation Specialist"
                  width={150}
                  height={150}
                   quality={95}
                   sizes="(max-width: 520px) 110px, 150px"
                   loading="lazy"
                   className="about-flight-photo"
                />
                <p>I began in people-focused operations and customer success, where I learned to see the hidden handoffs, delays, and repetitive work shaping every customer and team experience.</p>
              <span>MARS, FROM OPERATIONS TO SYSTEMS</span>
              </div>
              <span className="about-flight-scroll">SCROLL / ASSEMBLE ↓</span>
            </div>
          </div>


          <div className="about-belief">
            <div className="about-journey" aria-hidden="true">
              <svg viewBox="0 0 1440 650" preserveAspectRatio="none">
                <path className="journey-line-base" pathLength="1" d="M-70 420 C70 420 90 420 180 420 C285 420 275 180 390 180 C515 180 500 490 640 490 C780 490 790 230 920 230 C1050 230 1080 420 1210 420 C1330 420 1350 300 1510 300" />
                <path className="journey-line-signal" pathLength="1" d="M-70 420 C70 420 90 420 180 420 C285 420 275 180 390 180 C515 180 500 490 640 490 C780 490 790 230 920 230 C1050 230 1080 420 1210 420 C1330 420 1350 300 1510 300" />
              </svg>
              {PROCESS_STEPS.map(([num, label], index) => {
                const [left, top] = [["12.5%", "64.6%"], ["30%", "27.7%"], ["49%", "75.4%"], ["69%", "35.4%"], ["91%", "64.6%"]][index];
                return <span className="journey-node" style={{ left, top }} key={num}><i>{num}</i><strong>{label}</strong></span>;
              })}
            </div>
            <div className="about-belief-copy reveal">
              <span>PROCESS BEFORE PLATFORM</span>
              <h3>I START WITH<br />THE PROCESS.</h3>
              <p>Before automating anything, I ask where the team is losing time, where leads or tasks are falling through, and which steps should be automated and which simply need a better process. I build systems that are clear, practical, and maintainable.</p>
              <div className="about-belief-rule" aria-hidden="true"><i /><b>MARS / WORKING METHOD</b><i /></div>
            </div>
          </div>
        </section>

        <section id="work" className="work theme-dark" data-theme="dark">
          <div className="work-intro reveal">
            <div><p className="eyebrow inverse">02 / SELECTED WORK</p><h2>SYSTEMS</h2><p className="muted-light">Practical systems, built around real work.</p></div>
            <p className="work-index">06 SYSTEMS<br />AI / CRM / AUTOMATION</p>
          </div>
          <div className="work-browser reveal">
            <div className="work-browser-bar"><span>MARS / WORK INDEX</span><span>SELECT A SYSTEM</span><span>01—06</span></div>
            <div className="work-browser-layout" onMouseLeave={() => setWorkPreviewVisible(false)}>
              <div className="work-list" aria-label="Selected systems">
                {projects.map((project) => (
                  <div
                    key={project.num}
                    className={`work-list-row${workPreviewVisible && previewProject.num === project.num ? " is-active" : ""}`}
                    onMouseEnter={() => { setPreviewProject(project); setWorkPreviewVisible(true); }}
                  >
                    <button
                      type="button"
                      className="work-list-main"
                      aria-label={`Open quick view: ${project.name}`}
                      onFocus={() => { setPreviewProject(project); setWorkPreviewVisible(true); }}
                      onBlur={() => setWorkPreviewVisible(false)}
                      onClick={(event) => openProject(project, event.currentTarget)}
                    >
                      <span className="work-list-num">{project.num}</span>
                      <span className="work-list-title"><strong>{project.name}</strong><em>{project.category}</em></span>
                      <span className="work-list-scope">{project.scope}</span>
                      <span className="work-list-arrow">QUICK VIEW</span>
                    </button>
                    <Link className="work-list-case" href={`/work/${project.slug}`} aria-label={`Read full case study: ${project.name}`} onClick={() => track("Case Study Opened", { project: project.slug, source: "work_index" })}>CASE ↗</Link>
                  </div>
                ))}
              </div>
              <aside className={`work-hover-preview${workPreviewVisible ? " is-visible" : ""}`} aria-live="polite" aria-label={`${previewProject.name} preview`}>
                <div className="work-hover-media">
                  {previewProject.image ? <Image key={previewProject.image} src={getSharpImageSrc(previewProject.image)} alt={`${previewProject.name} workflow screenshot`} fill unoptimized sizes="(max-width: 900px) 70vw, 520px" loading="lazy" /> : <SystemArt num={previewProject.num} />}
                  <span className="work-preview-scan"><i />MARS / SYSTEM {previewProject.num}</span>
                </div>
                <div className="work-hover-meta"><span>{previewProject.shortName}</span><span>CLICK TO OPEN ↗</span></div>
              </aside>
            </div>
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

        <aside className="work-contact-bridge theme-dark" data-theme="dark" aria-label="Start a conversation">
          <p>HAVE A PROCESS, HANDOFF, OR FOLLOW-UP SYSTEM THAT NEEDS A CLEARER FLOW?</p>
          <a href="#contact" onClick={() => track("Contact CTA Clicked", { source: "work_bridge" })}>START A CONVERSATION ↗</a>
        </aside>

        <section id="process" className="process theme-light" data-theme="light">
          <div className="process-layout">
            <div className="process-intro reveal">
              <p className="eyebrow">03 / PROCESS</p>
              <h2>From Friction<br />to Flow.</h2>
              <div className="process-quote"><p>“The goal is not to automate more. It is to create a better way of working.”</p><span>Technology earns its place when it removes friction, supports people, and makes the outcome more reliable.</span></div>
            </div>
            <div className="process-steps">
              {PROCESS_STEPS.map(([num, title, copy]) => <article key={num} className="process-step reveal"><span>{num}</span><h3>{title}</h3><p>{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section id="experience" className="experience theme-dark" data-theme="dark">
          <div className="experience-head reveal"><p className="eyebrow inverse">04 / EXPERIENCE</p><h2>FROM OPERATIONS<br />TO SYSTEMS.</h2></div>
          <div className="timeline">
            <article className="timeline-row reveal"><div><span>CURRENT</span><span>MARCH 2025 — PRESENT</span></div><div><h3>AI Automation Specialist</h3><p>Independent / Freelance</p></div><p>AI Automation Specialist helping agencies and service businesses automate operations and lead follow-up with n8n, GoHighLevel, and AI workflows.</p></article>
            <article className="timeline-row reveal"><div><span>INDEPENDENT PROJECTS</span><span>SEPTEMBER 2024 — MARCH 2025</span></div><div><h3>AI Automation Developer</h3><p>Independent Projects</p></div><p>Independent projects using n8n, GoHighLevel, AI workflows, APIs, and webhooks.</p></article>
            <article className="timeline-row reveal"><div><span>PREVIOUS</span><span>AUGUST 2021 — AUGUST 2024</span></div><div><h3>Operations &amp; Customer Success</h3><p>Local Businesses</p></div><p>I began in people-focused operations and customer success, where I learned to see the hidden handoffs, delays, and repetitive work shaping every customer and team experience.</p></article>
          </div>
        </section>

        <section id="stack" className="stack theme-light" data-theme="light">
          <div className="stack-head reveal"><p className="eyebrow">05 / STACK</p><h2>Technical<br />stack.</h2></div>
          <div className="marquee" aria-label="Core tools"><div className="marquee-track">{[0, 1].map((set) => <div className="marquee-set" key={set}>{STACK_TOOLS.map((tool, index) => <Fragment key={tool}>{index > 0 && <i>+</i>}<span>{tool}</span></Fragment>)}</div>)}</div></div>
          <div className="stack-grid reveal">
            <article><span>AI & LLM WORK</span><p>LLM workflow design, prompt systems, structured outputs, validation, and human-reviewed AI assistance.</p></article>
            <article><span>AUTOMATION</span><p>n8n orchestration, decision logic, data transformation, error handling, testing, and monitoring.</p></article>
            <article><span>INTEGRATIONS</span><p>Connected data and actions across APIs, webhooks, Google Sheets, and Google Calendar.</p><ul className="stack-card-details">{STACK_DETAILS.integrations.map((skill) => <li key={skill}>{skill}</li>)}</ul></article>
            <article><span>CRM & BUSINESS SYSTEMS</span><p>GoHighLevel pipelines, funnels, calendars, forms, and intentional email and SMS journeys.</p><ul className="stack-card-details">{STACK_DETAILS.crm.map((skill) => <li key={skill}>{skill}</li>)}</ul></article>
          </div>
        </section>

        <section className="principles theme-light" data-theme="light">
          <div className="principles-visual reveal" aria-hidden="true">
            <div className="method-title"><span>MARS / METHOD</span><strong>From Friction<br />to Flow.</strong></div>
            <div className="method-track"><i />{PROCESS_STEPS.map(([num, title]) => <span key={num}>{num} / {title}</span>)}</div>
            <div className="method-signal"><span>PROCESS FIRST</span><span>HUMAN IN THE LOOP</span><span>MEASURED OUTCOME</span></div>
          </div>
          <div className="principles-copy reveal"><p className="eyebrow">HOW I WORK</p><h2>Working<br />principles.</h2><div className="principle-list"><span>RELIABILITY BY DESIGN</span><span>COMMUNICATION WITH CLARITY</span><span>SYSTEMS PEOPLE CAN OWN</span><span>CONTINUOUS REFINEMENT</span></div></div>
        </section>

        <section id="contact" className="contact theme-dark" data-theme="dark">
          <div className="contact-layout reveal">
            <div className="contact-primary"><p className="eyebrow inverse">06 / CONTACT</p><h2>Let&apos;s build what<br />moves work forward.</h2><ContactForm available={webhookReady} />{SITE_CONFIG.bookingUrl.trim() && <a className="contact-booking-link" href={SITE_CONFIG.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("Booking Opened", { source: "contact" })}>BOOK A 30-MINUTE CALL <span aria-hidden="true">↗</span></a>}</div>
            <aside className="contact-details" aria-label="Contact details">
              <p className="contact-details-label">DIRECT CONTACT</p>
              {SITE_CONFIG.typicalReplyTime.trim() && <p><span>TYPICAL REPLY TIME</span>{SITE_CONFIG.typicalReplyTime}</p>}
              <div className="contact-next-steps"><strong>WHAT HAPPENS NEXT</strong><ol>{SITE_CONFIG.contactNextSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol></div>
              <a href={`mailto:${SITE_CONFIG.email}`}><span>EMAIL</span>{SITE_CONFIG.email} ↗</a>
              <a href={SITE_CONFIG.linkedIn} target="_blank" rel="noreferrer" onClick={() => track("LinkedIn Opened", { source: "contact" })}><span>LINKEDIN</span>linkedin.com/in/automatewithmars ↗</a>
              <a href="https://github.com/marsatolba6-gif" target="_blank" rel="noreferrer" onClick={() => track("GitHub Opened", { source: "contact" })}><span>GITHUB</span>github.com/marsatolba6-gif ↗</a>
              <p><span>LOCATION</span>Remote / Philippines<br />Available for global teams</p>
              <div className="contact-actions"><a className="pill pill-inverse" href="/assets/Mars-Atolba-Resume.pdf" target="_blank" rel="noreferrer" onClick={() => track("Resume Opened", { source: "contact" })}>VIEW RESUME ↗</a></div>
            </aside>
          </div>
          <div className="footer-word" aria-label="Elevate. Automate. Excel."><span>Elevate.</span><span>Automate.</span><span>Excel.</span></div>
          <div className="footer-bottom"><span>© {CURRENT_YEAR} {SITE_CONFIG.name}</span><span>Remote / Philippines</span><span>{webhookReady ? "This form runs through an n8n workflow." : "Direct enquiries: " + SITE_CONFIG.email}</span></div>
        </section>
      </main>

      {activeProject && (
        <div className="modal-shell" role="presentation">
          <section ref={projectDialogRef} className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-title">
            <nav className="project-interface-bar" aria-label="Project navigation">
              <button className="project-back" type="button" onClick={closeProject} autoFocus>← WORK INDEX</button>
              <span>{activeProject.num} / {String(projects.length).padStart(2, "0")}</span>
              <div><button type="button" onClick={() => showAdjacentProject(-1)}>PREV</button><button type="button" onClick={() => showAdjacentProject(1)}>NEXT</button></div>
            </nav>
            <div className="dialog-content">
              <div className="dialog-head"><div><p className="dialog-kicker">{activeProject.num} / {activeProject.category}<br />{activeProject.scope}</p><Link className="dialog-case-link" href={`/work/${activeProject.slug}`} onClick={() => track("Case Study Opened", { project: activeProject.slug, source: "quick_view" })}>OPEN SHAREABLE CASE STUDY ↗</Link></div><h2 id="project-title">{activeProject.name}</h2></div>
              <div className="dialog-system-layout">
                <aside className="project-proof-rail" aria-label="Project proof rail">
                  <div className="proof-status"><i /><span>TESTED BUILD</span></div>
                  <dl>
                    <div><dt>TYPE</dt><dd>{activeProject.category}</dd></div>
                    <div><dt>SCOPE</dt><dd>{activeProject.scope}</dd></div>
                    <div><dt>STAGES</dt><dd>{String(activeProject.flow.length).padStart(2, "0")}</dd></div>
                    <div><dt>TOOLS</dt><dd>{String(activeProject.tools.length).padStart(2, "0")}</dd></div>
                    <div><dt>QA</dt><dd>SCENARIO TESTED</dd></div>
                  </dl>
                  <p>MOVE OVER EACH IMAGE TO REVEAL THE SYSTEM MAP.</p>
                </aside>
                <div className="dialog-system-main">
                  {activeProject.gallery && (
                    <div className="dialog-gallery scan-gallery">
                      {activeProject.gallery.map((src, index) => <ScanStage project={activeProject} src={src} index={index} key={src} onExpand={(trigger) => openLightbox(src, trigger)} />)}
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
                  {activeProject.slug === "roofflow-voice-ai" && <p className="case-study-note">The Emergency, Qualified, and Nurture routes were scenario-tested. Run-level execution records and raw data are not published, to protect customer information.</p>}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {lightbox && (
        <div ref={lightboxRef} className="lightbox" role="dialog" aria-modal="true" aria-label="Expanded project screenshot">
          <div className="lightbox-controls">
            <a href={lightbox} target="_blank" rel="noopener noreferrer">VIEW ORIGINAL FILE ↗</a>
            <button type="button" onClick={closeLightbox} autoFocus>CLOSE ×</button>
          </div>
          <div className="lightbox-media">
            <Image src={getSharpImageSrc(lightbox)} alt="Expanded project workflow screenshot" fill unoptimized sizes="(max-width: 700px) 100vw, 1440px" loading="eager" />
          </div>
        </div>
      )}
    </>
  );
}
