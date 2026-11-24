export const PROJECT_SCOPE = "INDEPENDENT BUILD · CLIENT-READY STANDARD";

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
  demoTag?: "DEMO · SAMPLE DATA";
  buildNote?: "Demo built with sample data";
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
  designDecision?: string;
  whatILearned?: string;
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
    buildNote: "Demo built with sample data",
    layout: "portrait",
    image: "/assets/ai-customer-support-automation.png",
    gallery: ["/assets/ai-customer-support-automation.png"],
    problem: "Shared support inboxes can become difficult to manage. Urgent messages may sit beside routine inquiries, while tracking and escalation remain inconsistent.",
    system: "An n8n workflow that retrieves Gmail messages, prepares the email data, analyzes intent and urgency using an AI model, routes high-priority cases to Slack, and records results in Google Sheets.",
    value: "Reduces repetitive inbox assessment and demonstrates how important messages can be identified, routed, and recorded automatically.",
    reliability: "Tested different email scenarios, reviewed execution history, checked field mappings, validated structured AI outputs, and refined routing for different urgency levels.",
    testScenarios: [
      { scenario: "Scheduled email retrieval", input: "Messages returned by the Gmail trigger.", expectedResult: "Prepare message content for AI assessment.", outcome: "Gmail retrieval and preparation steps show completed execution in the screenshot." },
      { scenario: "Priority classification", input: "An email assessed for intent and urgency.", expectedResult: "Produce a priority field that the conditional branch can evaluate.", outcome: "AI Agent and priority decision show completed execution; exact extracted values are not shown." },
      { scenario: "High-priority escalation", input: "An email classified as high priority.", expectedResult: "Send a Slack escalation for the high-priority branch.", outcome: "Slack branch is visible, but a successful Slack send is not evidenced in this capture." },
      { scenario: "Assessment logging", input: "Assessed email with priority output.", expectedResult: "Append the assessment to Google Sheets.", outcome: "Google Sheets append node shows completed execution on the captured route." },
    ],
    demoVideoUrl: "",
    sampleRun: { input: "", extractedOutput: "", result: "" },
    workflowJsonUrl: "",
    decisions: ["Structure the AI output before routing", "Alert Slack only for high-priority cases", "Record every assessed message for review"],
    designDecision: "Keep AI assessment structured enough for deterministic downstream routing instead of relying on free-form model responses.",
    whatILearned: "AI classification becomes more useful in automation when the output is structured clearly enough for downstream workflow logic to act on it.",
    flow: ["Gmail", "Data Preparation", "AI Analysis", "Priority Decision", "Slack Alert", "Google Sheets"],
    tools: ["n8n", "Gmail", "AI model", "Slack", "Google Sheets"],
  },
  {
    num: "02",
    slug: "ai-marketing-content-engine",
    name: "AI Marketing Content Engine",
    shortName: "Marketing Content Engine",
    category: "AI MARKETING AUTOMATION",
    layout: "landscape",
    image: "/assets/ai-content-pipeline-final.png",
    gallery: ["/assets/ai-content-pipeline-final.png", "/assets/ai-content-pipeline-merge.png", "/assets/ai-content-pipeline-error-fix.png"],
    problem: "Turning one campaign brief into content for multiple platforms requires repeated prompting, copying, formatting, and delivery.",
    system: "An n8n workflow that receives campaign details from Google Sheets, processes the brief with Groq, validates structured output with parsers, and delivers the completed content package through Gmail.",
    value: "Turns a repetitive multi-step content preparation process into one connected automated workflow.",
    reliability: "Used fixed schemas, separate generation and parsing stages, sample campaign briefs, execution-history reviews, and corrected field-mapping issues during testing.",
    testScenarios: [
      { scenario: "Campaign brief intake", input: "A new campaign-brief row in Google Sheets.", expectedResult: "Prepare the row for AI-driven content generation.", outcome: "Google Sheets trigger and brief preparation show execution; the capture shows three input items." },
      { scenario: "Social content generation", input: "Prepared campaign brief passed to Groq.", expectedResult: "Generate social content and parse its structured fields.", outcome: "Groq generation and the social-content parser show completed execution." },
      { scenario: "Marketing package assembly", input: "Parsed content passed to the optimization step.", expectedResult: "Create a consolidated, structured marketing package.", outcome: "Optimization and marketing-package parsing show completed execution." },
      { scenario: "Asset logging and delivery", input: "Completed marketing content package.", expectedResult: "Save marketing assets in Google Sheets and notify by Gmail.", outcome: "Sheets save and Gmail notification nodes show completed execution; inbox receipt is not separately shown." },
    ],
    demoVideoUrl: "",
    sampleRun: { input: "", extractedOutput: "", result: "" },
    workflowJsonUrl: "",
    decisions: ["Separate generation from parsing", "Use fixed output schemas", "Deliver one consolidated content package"],
    designDecision: "Separate AI generation from output parsing so generated responses can be structured and validated before downstream delivery.",
    whatILearned: "Structured output parsers make AI-generated content easier to pass through downstream automation, but field mapping still needs deliberate testing.",
    flow: ["Google Sheets", "AI Generation", "Content Parsing", "Marketing Package Parsing", "Gmail Delivery"],
    tools: ["n8n", "Groq", "Google Sheets", "Gmail", "Structured Output Parsers"],
  },
  {
    num: "03",
    slug: "ai-email-assistant",
    name: "AI Email Assistant",
    shortName: "AI Email Assistant",
    category: "AI WORKFLOW",
    layout: "portrait",
    image: "/assets/ai-email-assistant.png",
    gallery: ["/assets/ai-email-assistant.png", "/assets/gmail-read-assess-automation.png"],
    problem: "Reading, assessing, organizing, and recording emails manually can become repetitive.",
    system: "A scheduled n8n workflow that retrieves Gmail messages, uses AI-assisted assessment to interpret the content, and records structured information in Google Sheets.",
    value: "Demonstrates a foundation for automated email assessment, organization, tracking, and future routing workflows.",
    reliability: "Tested different email types, missing subject lines, incomplete body content, and field mappings while reviewing workflow executions to verify captured outputs.",
    testScenarios: [
      { scenario: "Scheduled inbox retrieval", input: "Messages from a scheduled Gmail scan.", expectedResult: "Retrieve messages for AI assessment.", outcome: "The screenshot shows the retrieval path executed with 15 message items." },
      { scenario: "AI-assisted assessment", input: "Retrieved Gmail message content.", expectedResult: "Assess the message and return structured information.", outcome: "AI Agent shows 15 processed items; individual extracted values are not visible." },
      { scenario: "Incomplete email fields", input: "An email missing its subject or containing an incomplete body.", expectedResult: "Handle missing fields without breaking the assessment.", outcome: "The project notes describe these tests; sanitized sample inputs and output are not attached." },
      { scenario: "Google Sheets tracking", input: "Structured assessment of a retrieved email.", expectedResult: "Update the corresponding Google Sheets record.", outcome: "The Sheets tool is displayed, but the supplied screenshot does not show a completed row update." },
    ],
    demoVideoUrl: "",
    sampleRun: { input: "", extractedOutput: "", result: "" },
    workflowJsonUrl: "",
    decisions: ["Run on a defined schedule", "Capture structured assessment data", "Keep records available for later routing"],
    designDecision: "Keep message retrieval, AI assessment, and tracking as separate steps so each stage can be tested and troubleshot independently.",
    whatILearned: "Separating email retrieval from assessment and logging makes the workflow easier to inspect when a message or field does not behave as expected.",
    flow: ["Schedule Trigger", "Gmail", "AI Assessment", "Google Sheets"],
    tools: ["n8n", "Gmail", "OpenAI", "Google Sheets"],
  },
  {
    num: "04",
    slug: "gohighlevel-workflows",
    name: "GoHighLevel Workflows",
    shortName: "GoHighLevel Workflows",
    category: "CRM AUTOMATION",
    buildNote: "Demo built with sample data",
    layout: "wide",
    image: "/assets/ghl-lead-conversion-1.png",
    gallery: ["/assets/ghl-lead-conversion-1.png", "/assets/ghl-lead-conversion-2.png", "/assets/ghl-lead-conversion-3.png", "/assets/ghl-workflow-1.png", "/assets/ghl-workflow-2.png", "/assets/ghl-workflow-overview.png", "/assets/ghl-priority-branches.png"],
    problem: "Local service businesses can lose leads when enquiries are not prioritized, assigned, and followed up consistently.",
    system: "A GoHighLevel lead-capture and qualification workflow that creates pipeline opportunities, routes leads by job urgency, updates qualification status, assigns follow-up tasks, and alerts the team about high-priority enquiries.",
    value: "Creates a clear lead journey from form submission through prioritization and follow-up while reducing repetitive CRM actions.",
    reliability: "Checked trigger behavior, custom-field conditions, pipeline movement, contact updates, task creation, and branch logic using test contacts before activation.",
    testScenarios: [
      { scenario: "Lead form trigger", input: "A test contact submits the configured lead form.", expectedResult: "Tag the contact, create an opportunity, assign the owner.", outcome: "These actions appear in the GoHighLevel workflow screenshot; no test-contact execution record is attached." },
      { scenario: "High-priority routing", input: "A lead with job urgency within 24 hours.", expectedResult: "Apply the priority tag, update qualification, create or update opportunity, create a task, notify the team.", outcome: "The high-priority branch and its actions are visible; execution output is not attached." },
      { scenario: "Standard-priority routing", input: "A lead with job urgency within 3 days.", expectedResult: "Apply standard classification and schedule the review/contact task.", outcome: "The standard-priority branch and follow-up task are visible; execution output is not attached." },
      { scenario: "Incomplete lead handling", input: "A lead with missing required qualification fields.", expectedResult: "Flag for manual review rather than normal qualification.", outcome: "The missing-fields/manual-review branch is visible; a completed test record is not attached." },
    ],
    demoVideoUrl: "",
    sampleRun: { input: "", extractedOutput: "", result: "" },
    workflowJsonUrl: "",
    decisions: ["Route leads by stated job urgency", "Create the opportunity early in the flow", "Use explicit tasks and team alerts for handoff"],
    designDecision: "Structure the workflow around the customer journey so timing, communication, and pipeline movement stay connected instead of being managed as separate tasks.",
    whatILearned: "Small configuration details such as timing settings can change the behavior of an entire automation, so end-to-end QA matters before launch.",
    flow: ["Form Submitted", "Tag Lead", "Create Opportunity", "Assign Owner", "Check Job Urgency", "Route Priority", "Create Task", "Notify Team"],
    tools: ["GoHighLevel", "Pipelines", "Workflows", "Forms", "Custom Fields", "Email/SMS Automation"],
  },
  {
    num: "05",
    slug: "gohighlevel-landing-pages-funnels",
    name: "GoHighLevel Landing Pages & Funnels",
    shortName: "Landing Pages & Funnels",
    category: "BUSINESS SYSTEMS",
    layout: "landscape",
    image: "/assets/ghl-landing-page-1.webp",
    gallery: ["/assets/ghl-landing-page-1.webp", "/assets/ghl-landing-page-2.png"],
    problem: "A landing page is most useful when lead capture connects directly with the business systems behind it.",
    system: "Branded GoHighLevel landing pages and funnel structures connected to forms, calendars, CRM records, and workflow automations where applicable.",
    value: "Connects customer-facing lead capture with the operational workflow that follows.",
    reliability: "Checked desktop/mobile responsiveness, form submissions, redirects, booking flows, CRM record creation, and workflow enrollment where applicable.",
    testScenarios: [
      { scenario: "Responsive landing page", input: "Desktop and mobile viewport checks.", expectedResult: "Keep content, forms, and calls to action usable at both sizes.", outcome: "The portfolio includes desktop page screenshots; a mobile test capture is not attached." },
      { scenario: "Form submission and redirect", input: "A visitor submits a lead-capture form.", expectedResult: "Capture the lead and follow the configured redirect.", outcome: "Project notes report checks; no sanitized form-submission record is attached." },
      { scenario: "Calendar booking", input: "A visitor selects a booking slot.", expectedResult: "Create the configured calendar booking.", outcome: "Booking flow is described as checked; booking confirmation evidence is not attached." },
      { scenario: "CRM and workflow handoff", input: "A submitted lead where CRM automation is configured.", expectedResult: "Create the CRM record and enroll the lead in the relevant workflow.", outcome: "Project notes describe this check where applicable; no CRM execution record is attached." },
    ],
    demoVideoUrl: "",
    sampleRun: { input: "", extractedOutput: "", result: "" },
    workflowJsonUrl: "",
    decisions: ["Connect front-end capture to CRM records", "Keep booking and follow-up in one system", "Validate responsive behavior before handoff"],
    designDecision: "Treat the page as the front end of a larger customer journey rather than as a standalone design asset.",
    whatILearned: "Funnels become more useful when the conversion action is connected cleanly to the CRM, booking, and follow-up process behind it.",
    flow: ["Landing Page", "Form", "CRM Record", "Calendar Booking", "Workflow Enrollment"],
    tools: ["GoHighLevel", "Landing Pages", "Forms", "Calendars", "Funnels", "CRM Workflows"],
  },
  {
    num: "06",
    slug: "roofflow-voice-ai",
    name: "RoofFlow Voice AI",
    shortName: "RoofFlow Voice AI",
    category: "VOICE AI / CRM AUTOMATION",
    demoTag: "DEMO · SAMPLE DATA",
    buildNote: "Demo built with sample data",
    layout: "wide",
    image: "/assets/roofflow-voice-ai-workflow.svg",
    gallery: ["/assets/roofflow-voice-ai-workflow.svg"],
    problem: "Roofing inquiries often arrive by phone, where emergency leaks, estimate requests, and lower-intent questions enter the same queue. Manual notes and delayed handoffs can lose context, duplicate records, and slow the response that wins the job.",
    system: "An inbound AI voice receptionist and lead qualification automation, built as a voice-first n8n workflow. Retell AI answers the call and gathers information. n8n receives the call data, uses Groq to extract structured lead information, and applies deterministic urgency and intent scoring. The contact and opportunity are upserted in GoHighLevel, booking checks availability in Google Calendar, and the next action is routed. Emergencies create a five-minute task, qualified inquiries a 15-minute follow-up, and nurture leads a one-day follow-up. Google Sheets records the outcome for auditability.",
    value: "Turns roofing calls into structured, prioritized CRM actions, so urgent leaks are handled quickly, qualified leads are booked, and every follow-up is traceable.",
    reliability: "Fixed extraction schema · Deterministic urgency rules · Contact upsert to reduce duplicates · Explicit routing branches · Every routed outcome logged to Google Sheets",
    testScenarios: [
      { scenario: "Emergency, Qualified, and Nurture routes", input: "Fictional routing scenarios", expectedResult: "Emergency within 5 minutes, Qualified within 15 minutes, Nurture within 1 day", outcome: "The Emergency, Qualified, and Nurture routes were scenario-tested. Run-level execution records and raw data are not published, to protect customer information." },
    ],
    demoVideoUrl: "",
    sampleRun: { input: "", extractedOutput: "", result: "" },
    workflowJsonUrl: "",
    decisions: ["Fixed extraction schema", "Deterministic urgency rules", "Contact upsert to reduce duplicates", "Explicit routing branches", "Every routed outcome logged to Google Sheets"],
    flow: ["Call", "Understand", "Prioritize", "Record", "Book", "Follow Up"],
    tools: ["Retell AI (inbound voice AI)", "n8n (webhook, orchestration, urgency scoring)", "Groq (structured extraction)", "GoHighLevel (CRM, pipeline, follow-up tasks)", "Google Calendar (availability and booking)", "Google Sheets (audit log)", "Webhooks"],
  },

];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
