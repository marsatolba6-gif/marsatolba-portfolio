/** Guard the existing brand copy and process/stack requirements without external calls. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const content = await readFile("app/portfolio-content.ts", "utf8");
const home = await readFile("app/Portfolio.tsx", "utf8");
const casePage = await readFile("app/work/[slug]/page.tsx", "utf8");
const config = await readFile("app/site-config.ts", "utf8");

const process = content.match(/export const PROCESS_STEPS = \[([\s\S]*?)\] as const;/);
assert.ok(process, "Shared process list must exist");
const names = [...process[1].matchAll(/\["\d{2}", "([A-Z]+)",/g)].map(x => x[1]);
assert.deepEqual(names, ["DISCOVER", "MAP", "BUILD", "TEST", "IMPROVE"]);
assert.match(process[1], /triggers, decisions, data, responsibilities, exceptions, and measurable outcomes/);

for (const markup of [
  "PROCESS_STEPS.map(([num, label], index)",
  "PROCESS_STEPS.map(([num, title, copy])",
  "PROCESS_STEPS.map(([num, title])",
]) assert.ok(home.includes(markup), "A homepage process display must use the shared list: " + markup);
assert.ok(casePage.includes("PROCESS_STEPS.map(([, title])"), "Case pages must use canonical terms");

assert.deepEqual(
  [...home.matchAll(/Elevate\. Automate\. Excel\./g)].length,
  2,
  "Tagline must appear only once in hero and once as footer label",
);
assert.match(home, /<span>Elevate\. Automate\. Excel\.<\/span>/);
assert.match(home, /aria-label="Elevate\. Automate\. Excel\."/);
for (const phrase of [
  "Tools evolve.", "Clear thinking endures.", "Rooted in the business.", "Intentional with AI.", "Built to be understood.",
]) assert.ok(!home.includes(phrase), "Remove competing headline: " + phrase);
for (const value of [
  "RELIABILITY BY DESIGN", "COMMUNICATION WITH CLARITY",
  "SYSTEMS PEOPLE CAN OWN", "CONTINUOUS REFINEMENT",
]) assert.ok(home.includes(value), "Working value missing: " + value);
assert.match(content, /"WHAT GOD ENTRUSTS TO ME,"/);
assert.match(content, /"I ELEVATE WITH PURPOSE,"/);
assert.match(content, /"AUTOMATE WITH WISDOM,"/);
assert.match(content, /"AND MULTIPLY THROUGH"/);
assert.match(content, /"EXCELLENCE\."/);

const allowed = [
  "OAuth and token-refresh handling in custom API integrations",
  "Google Apps Script",
  "Trello connected to n8n workflows",
  "Meta Ads Manager campaigns feeding GoHighLevel funnels and lead capture",
  "AppSheet apps for internal business processes",
];
for (const skill of allowed) assert.ok(content.includes(skill), "Missing approved skill: " + skill);
for (const tool of ["OAUTH", "APPS SCRIPT", "APPSHEET", "META ADS", "TRELLO"])
  assert.ok(content.includes('"' + tool + '"'), "Missing marquee label: " + tool);
assert.match(home, /STACK_DETAILS\.integrations\.map/);
assert.match(home, /STACK_DETAILS\.crm\.map/);
assert.ok(!home.includes("stack-extra-lines"), "Do not add standalone stack cards");

assert.equal([...config.matchAll(/bookingUrl:/g)].length, 1, "Keep one booking URL source");
assert.match(config, /https:\/\/calendly\.com\/marsatolba6\/30min/);
assert.equal([...home.matchAll(/SITE_CONFIG\.bookingUrl\.trim\(\)/g)].length, 2, "Exactly hero and contact booking CTA");
assert.match(home, /<ContactForm available=\{webhookReady\} \/>\{SITE_CONFIG\.bookingUrl/);
assert.match(home, /SITE_CONFIG\.typicalReplyTime\.trim\(\)/);
assert.match(home, /SITE_CONFIG\.contactNextSteps\.map/);
console.log("Portfolio branding, framework, contact and approved stack contract verified.");
