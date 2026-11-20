export const INTRO_TIMING = {
  nameRevealAt: 60,
  loadStart: 100,
  progressDuration: 450,
  collapsePause: 10,
  exitDelay: 60,
} as const;

export const INTRO_ROTATION_TERMS = ["AUTOMATION", "GHL", "n8n", "WORKFLOWS"] as const;

export const MANIFESTO_LINES = [
  "WHAT GOD ENTRUSTS TO ME,",
  "I ELEVATE WITH PURPOSE,",
  "AUTOMATE WITH WISDOM,",
  "AND MULTIPLY THROUGH",
  "EXCELLENCE.",
] as const;

export const MANIFESTO_QUOTE = MANIFESTO_LINES.join(" ");
export const ABOUT_ROLE_LINES = ["AN AI AUTOMATION", "SPECIALIST."] as const;
export const FEATURED_PROJECT_SLUGS = [
  "roofflow-voice-ai",
] as const;

export const NAVIGATION_ITEMS = [
  ["01", "ABOUT", "#about"],
  ["02", "WORK", "#work"],
  ["03", "PROCESS", "#process"],
  ["04", "EXPERIENCE", "#experience"],
  ["05", "STACK", "#stack"],
  ["06", "CONTACT", "#contact"],
] as const;

/** The only process framework used across About, Process, Method and case studies. */
export const PROCESS_STEPS = [
  ["01", "DISCOVER", "Begin with the people, the purpose, and the outcome. Find the handoffs, delays, and repetitive work shaping the process."],
  ["02", "MAP", "Turn the process into a clear system of triggers, decisions, data, responsibilities, exceptions, and measurable outcomes."],
  ["03", "BUILD", "Choose only what the system needs, then connect automation, AI, CRM, APIs, and business applications into one dependable flow."],
  ["04", "TEST", "Challenge every branch, field, response, delay, and edge case so the workflow performs beyond the ideal scenario."],
  ["05", "IMPROVE", "Document the logic, review performance, and improve the system as the business, people, and priorities evolve."],
] as const;

export const STACK_TOOLS = [
  "n8n", "GoHighLevel", "AI workflows", "Retell AI", "Groq", "OpenAI",
  "Webhooks", "APIs", "OAuth", "Google Sheets", "Google Calendar",
  "Google Apps Script", "AppSheet", "Trello", "Meta Ads Manager",
] as const;


/** Requested descriptive skills, shown inside their existing Stack cards. */
export const STACK_DETAILS = {
  integrations: [
    "OAuth and token-refresh handling in custom API integrations",
    "Google Apps Script",
    "Trello connected to n8n workflows",
  ],
  crm: [
    "Meta Ads Manager campaigns feeding GoHighLevel funnels and lead capture",
    "AppSheet apps for internal business processes",
  ],
} as const;
