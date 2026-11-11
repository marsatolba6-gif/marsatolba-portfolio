export type TestScenario = {
  scenario: string;
  input?: string;
  expectedResult?: string;
  outcome?: string;
};

export type Project = {
  num: string;
  slug: string;
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
  testScenarios: TestScenario[];
  /** Optional proof fields. Leave empty to hide the section/link. */
  demoVideoUrl?: string;
  sampleRun?: { input?: string; extractedOutput?: string; result?: string };
  workflowJsonUrl?: string;
  /** Only show when it adds information beyond the hero summary. */
  practicalValueDetail?: string;
  decisions: string[];
  flow: string[];
  tools: string[];
};

export const projects: Project[] = [
  {
    num: "01",
    slug: "ai-customer-support-automation",
    name: "AI-Powered Customer Support Automation",
    shortName: "AI Customer Support",
    category: "AI OPERATIONS",
    scope: "BUILT TO CLIENT-READY STANDARD",
    layout: "portrait",
    image: "/assets/ai-customer-support-automation.png",
    gallery: ["/assets/ai-customer-support-automation.png"],
    problem: "Shared support inboxes can become difficult to manage. Urgent messages may sit beside routine inquiries, while tracking and escalation remain inconsistent.",
    system: "An n8n workflow that retrieves Gmail messages, prepares the email data, analyzes intent and urgency using an AI model, routes high-priority cases to Slack, and records results in Google Sheets.",
    value: "Reduces repetitive inbox assessment and demonstrates how important messages can be identified, routed, and recorded automatically.",
    reliability: "Tested different email scenarios, reviewed execution history, checked field mappings, validated structured AI outputs, and refined routing for different urgency levels.",
    testScenarios: [{ scenario: "Different email scenarios", input: "", expectedResult: "", outcome: "" }, { scenario: "Urgency-level routing", input: "", expectedResult: "", outcome: "" }, { scenario: "Structured AI output mapping", input: "", expectedResult: "", outcome: "" }, { scenario: "Execution history and Sheets records", input: "", expectedResult: "", outcome: "" }],
    demoVideoUrl: "",
    sampleRun: { input: "", extractedOutput: "", result: "" },
    workflowJsonUrl: "",
    decisions: ["Structure the AI output before routing", "Alert Slack only for high-priority cases", "Record every assessed message for review"],
    flow: ["Gmail", "Data Preparation", "AI Analysis", "Priority Decision", "Slack Alert", "Google Sheets"],
    tools: ["n8n", "Gmail", "AI model", "Slack", "Google Sheets"],
  },
  {
    num: "02",
    slug: "ai-marketing-content-engine",
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
    testScenarios: [{ scenario: "Sample campaign briefs", input: "", expectedResult: "", outcome: "" }, { scenario: "Generation-to-parser handoff", input: "", expectedResult: "", outcome: "" }, { scenario: "Field mapping across outputs", input: "", expectedResult: "", outcome: "" }, { scenario: "Gmail package delivery", input: "", expectedResult: "", outcome: "" }],
    demoVideoUrl: "",
    sampleRun: { input: "", extractedOutput: "", result: "" },
    workflowJsonUrl: "",
    decisions: ["Separate generation from parsing", "Use fixed output schemas", "Deliver one consolidated content package"],
    flow: ["Google Sheets", "AI Generation", "Content Parsing", "Marketing Package Parsing", "Gmail Delivery"],
    tools: ["n8n", "Groq", "Google Sheets", "Gmail", "Structured Output Parsers"],
  },
  {
    num: "03",
    slug: "ai-email-assistant",
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
    testScenarios: [{ scenario: "Different email types", input: "", expectedResult: "", outcome: "" }, { scenario: "Missing subject lines", input: "", expectedResult: "", outcome: "" }, { scenario: "Incomplete message bodies", input: "", expectedResult: "", outcome: "" }, { scenario: "Google Sheets field mapping", input: "", expectedResult: "", outcome: "" }],
    demoVideoUrl: "",
    sampleRun: { input: "", extractedOutput: "", result: "" },
    workflowJsonUrl: "",
    decisions: ["Run on a defined schedule", "Capture structured assessment data", "Keep records available for later routing"],
    flow: ["Schedule Trigger", "Gmail", "AI Assessment", "Google Sheets"],
    tools: ["n8n", "Gmail", "OpenAI", "Google Sheets"],
  },
  {
    num: "04",
    slug: "gohighlevel-workflows",
    name: "GoHighLevel Workflows",
    shortName: "GoHighLevel Workflows",
    category: "CRM AUTOMATION",
    scope: "BUILT TO CLIENT-READY STANDARD",
    layout: "wide",
    image: "/assets/ghl-lead-conversion-1.png",
    gallery: ["/assets/ghl-lead-conversion-1.png", "/assets/ghl-lead-conversion-2.png", "/assets/ghl-lead-conversion-3.png", "/assets/ghl-workflow-1.png", "/assets/ghl-workflow-2.png", "/assets/ghl-workflow-overview.png", "/assets/ghl-priority-branches.png"],
    problem: "Local service businesses can lose leads when enquiries are not prioritized, assigned, and followed up consistently.",
    system: "A GoHighLevel lead-capture and qualification workflow that creates pipeline opportunities, routes leads by job urgency, updates qualification status, assigns follow-up tasks, and alerts the team about high-priority enquiries.",
    value: "Creates a clear lead journey from form submission through prioritization and follow-up while reducing repetitive CRM actions.",
    reliability: "Checked trigger behavior, custom-field conditions, pipeline movement, contact updates, task creation, and branch logic using test contacts before activation.",
    testScenarios: [{ scenario: "Trigger behavior", input: "", expectedResult: "", outcome: "" }, { scenario: "Custom-field conditions", input: "", expectedResult: "", outcome: "" }, { scenario: "Pipeline movement", input: "", expectedResult: "", outcome: "" }, { scenario: "Task creation and team alerts", input: "", expectedResult: "", outcome: "" }],
    demoVideoUrl: "",
    sampleRun: { input: "", extractedOutput: "", result: "" },
    workflowJsonUrl: "",
    decisions: ["Route leads by stated job urgency", "Create the opportunity early in the flow", "Use explicit tasks and team alerts for handoff"],
    flow: ["Form Submitted", "Tag Lead", "Create Opportunity", "Assign Owner", "Check Job Urgency", "Route Priority", "Create Task", "Notify Team"],
    tools: ["GoHighLevel", "Pipelines", "Workflows", "Forms", "Custom Fields", "Email/SMS Automation"],
  },
  {
    num: "05",
    slug: "gohighlevel-landing-pages-funnels",
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
    testScenarios: [{ scenario: "Desktop and mobile layouts", input: "", expectedResult: "", outcome: "" }, { scenario: "Form submissions and redirects", input: "", expectedResult: "", outcome: "" }, { scenario: "Booking flow", input: "", expectedResult: "", outcome: "" }, { scenario: "CRM creation and workflow enrollment", input: "", expectedResult: "", outcome: "" }],
    demoVideoUrl: "",
    sampleRun: { input: "", extractedOutput: "", result: "" },
    workflowJsonUrl: "",
    decisions: ["Connect front-end capture to CRM records", "Keep booking and follow-up in one system", "Validate responsive behavior before handoff"],
    flow: ["Landing Page", "Form", "CRM Record", "Calendar Booking", "Workflow Enrollment"],
    tools: ["GoHighLevel", "Landing Pages", "Forms", "Calendars", "Funnels", "CRM Workflows"],
  },
  {
    num: "06",
    slug: "roofflow-voice-ai",
    name: "RoofFlow Voice AI",
    shortName: "RoofFlow Voice AI",
    category: "VOICE AI / CRM AUTOMATION",
    scope: "BUILT TO CLIENT-READY STANDARD",
    layout: "wide",
    image: "/assets/roofflow-voice-ai-workflow.svg",
    gallery: ["/assets/roofflow-voice-ai-workflow.svg"],
    problem: "Roofing inquiries often arrive by phone, where emergency leaks, estimate requests, and lower-intent questions enter the same queue. Manual notes and delayed handoffs can lose context, duplicate records, and slow the response that wins the job.",
    system: "A voice-first n8n workflow that receives roofing call data from Retell AI, uses Groq to extract structured lead information, applies deterministic urgency and intent scoring, upserts the contact and opportunity in GoHighLevel, books through Google Calendar, and routes the next action. Emergencies create a five-minute task, qualified inquiries a 15-minute follow-up, and nurture leads a one-day follow-up. Google Sheets records the outcome for auditability.",
    value: "Turns roofing calls into structured, prioritized CRM actions—so urgent leaks are handled quickly, qualified leads are booked, and every follow-up is traceable.",
    reliability: "Uses a fixed extraction schema, deterministic scoring rules, contact upsert logic, explicit routing branches, and a logged audit trail with CRM record IDs. Emergency, qualified, and nurture scenarios were tested to confirm that each path creates the intended next action.",
    testScenarios: [{ scenario: "Emergency scenario", input: "", expectedResult: "", outcome: "" }, { scenario: "Qualified inquiry scenario", input: "", expectedResult: "", outcome: "" }, { scenario: "Nurture scenario", input: "", expectedResult: "", outcome: "" }, { scenario: "CRM IDs and audit records", input: "", expectedResult: "", outcome: "" }],
    demoVideoUrl: "",
    sampleRun: { input: "", extractedOutput: "", result: "" },
    workflowJsonUrl: "",
    decisions: ["Use deterministic urgency rules", "Upsert contacts to reduce duplicates", "Log every routed outcome to Google Sheets"],
    flow: ["Call", "Understand", "Prioritize", "Record", "Book", "Follow Up"],
    tools: ["n8n", "Retell AI", "Groq", "GoHighLevel", "Google Calendar", "Google Sheets", "Webhooks"],
  },

];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

/** Scope labels distinguish scenario-tested demos from independent implementations. */
export function getBuildNote(project: Project): "Demo built with sample data" | "Independent build" {
  return project.scope === "BUILT TO CLIENT-READY STANDARD" ? "Demo built with sample data" : "Independent build";
}
