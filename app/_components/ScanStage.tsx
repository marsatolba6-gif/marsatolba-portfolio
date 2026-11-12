"use client";

import { PointerEvent as ReactPointerEvent, useEffect, useRef } from "react";
import Image from "next/image";
import type { Project } from "../projects";
import { getSharpImageSrc } from "../image-quality";

const SCAN_MARKER_POSITIONS = [
  { left: "16%", top: "24%" },
  { left: "38%", top: "42%" },
  { left: "62%", top: "26%" },
  { left: "79%", top: "58%" },
  { left: "31%", top: "72%" },
];

type ScanStageProps = {
  project: Project;
  src: string;
  index: number;
  onExpand: (trigger: HTMLButtonElement) => void;
};

export default function ScanStage({ project, src, index, onExpand }: ScanStageProps) {
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
        <Image src={getSharpImageSrc(src)} alt={`${project.name} workflow view ${index + 1}`} fill unoptimized sizes="(max-width: 600px) 100vw, (max-width: 1100px) 90vw, 1050px" loading="lazy" />
      </div>
      <div className="scan-map" aria-hidden="true">
        <div className="scan-map-head"><span>MARS / SYSTEM SCAN</span><span>VIEW {String(index + 1).padStart(2, "0")}</span></div>
        <div className="scan-map-flow">
          {project.flow.map((step, stepIndex) => (
            <div key={`${src}-${step}`}><span>{String(stepIndex + 1).padStart(2, "0")}</span><strong>{step}</strong></div>
          ))}
        </div>
        <div className="scan-map-foot"><span>TRIGGER → LOGIC → ACTION</span><span>SYSTEM MAPPED</span></div>
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
        <button type="button" onClick={(event) => onExpand(event.currentTarget)} aria-label={`Open ${project.name} screenshot ${index + 1} full size`}>VIEW FULL IMAGE ↗</button>
      </div>
    </article>
  );
}
