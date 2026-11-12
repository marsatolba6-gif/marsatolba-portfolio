/** The single source of truth for the portfolio contact form's service choices. */
export const PROJECT_TYPES = [
  "AI Workflow",
  "n8n Automation",
  "GoHighLevel System",
  "Workflow Optimization",
  "Ongoing Automation Support",
  "Other",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

/** Reject anything that isn't one of the six visible dropdown values. */
export function isProjectType(value: unknown): value is ProjectType {
  return typeof value === "string" && (PROJECT_TYPES as readonly string[]).includes(value);
}
