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
  "gohighlevel-workflows",
  "ai-customer-support-automation",
] as const;

export const NAVIGATION_ITEMS = [
  ["01", "ABOUT", "#about"],
  ["02", "WORK", "#work"],
  ["03", "PROCESS", "#process"],
  ["04", "EXPERIENCE", "#experience"],
  ["05", "STACK", "#stack"],
  ["06", "CONTACT", "#contact"],
] as const;

export const PROCESS_STEPS = [
  ["01", "UNDERSTAND", "Begin with the people, the purpose, and the outcome. Find the handoffs, delays, and repetitive work shaping the process."],
  ["02", "DESIGN", "Turn the process into a clear system of triggers, decisions, data, responsibilities, exceptions, and measurable outcomes."],
  ["03", "BUILD", "Choose only what the system needs, then connect automation, AI, CRM, APIs, and business applications into one dependable flow."],
  ["04", "TEST", "Challenge every branch, field, response, delay, and edge case so the workflow performs beyond the ideal scenario."],
  ["05", "REFINE", "Document the logic, review performance, and improve the system as the business, people, and priorities evolve."],
] as const;

export const STACK_TOOLS = [
  "N8N",
  "GOHIGHLEVEL",
  "RETELL AI",
  "OPENAI",
  "GROQ",
  "APIs",
  "WEBHOOKS",
  "GOOGLE SHEETS",
  "SLACK",
] as const;


/** These are descriptive skills, not logos or additional platform claims. */
export const STACK_EXTRAS = [
  ["OAuth + TOKEN REFRESH", "OAuth and token-refresh handling in custom API integrations."],
  ["GOOGLE APPS SCRIPT", "Spreadsheet and Google Workspace workflow scripting."],
  ["APPSHEET", "No-code apps that connect operational data and workflows."],
  ["META ADS MANAGER", "Lead-generation campaigns feeding GoHighLevel funnels."],
  ["TRELLO + N8N", "Connecting task coordination with n8n automation."],
] as const;
