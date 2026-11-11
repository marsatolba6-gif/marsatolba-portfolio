import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getProject, projects } from "../../projects";

export const runtime = "nodejs";
export const alt = "Mars Atolba — AI Automation Specialist, case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

/** Server-generated 1200×630 PNG preview; no external font or image dependency. */
export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return new ImageResponse(
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      padding: "58px 70px", color: "#fff", background: "#050505",
      fontFamily: "Arial, Helvetica, sans-serif", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24,
        borderBottom: "1px solid #555", paddingBottom: 26, fontSize: 23, letterSpacing: 1.5 }}>
        <span>MARS ATOLBA</span><span>AI AUTOMATION SPECIALIST</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 25, flex: 1, justifyContent: "center" }}>
        <div style={{ fontSize: 20, letterSpacing: 3.5, color: "#c9c9c9" }}>{project.category}</div>
        <div style={{ fontSize: project.name.length > 35 ? 62 : 80, lineHeight: 1.05,
          fontWeight: 800, letterSpacing: -2.5, maxWidth: 1050 }}>{project.name}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 26,
        borderTop: "1px solid #555", fontSize: 22 }}>
        <span>SELECTED SYSTEMS / {project.num}</span><span>Elevate. Automate. Excel.</span>
      </div>
      <span style={{ position: "absolute", right: 65, bottom: 170, fontSize: 280, opacity: .06, fontWeight: 900 }}>M°</span>
    </div>,
    size,
  );
}
