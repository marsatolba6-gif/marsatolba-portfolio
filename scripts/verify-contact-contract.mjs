import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const code = await readFile("app/contact-project-types.ts", "utf8");
const transpiled = ts.transpileModule(code, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { PROJECT_TYPES, isProjectType } = await import(
  "data:text/javascript;base64," + Buffer.from(transpiled).toString("base64")
);

assert.deepEqual([...PROJECT_TYPES], [
  "AI Workflow",
  "n8n Automation",
  "GoHighLevel System",
  "Workflow Optimization",
  "Ongoing Automation Support",
  "Other",
]);
for (const option of PROJECT_TYPES) assert.equal(isProjectType(option), true);
for (const invalid of ["", "Any", "AI workflow", "Other service", null, 42, [], {}]) {
  assert.equal(isProjectType(invalid), false);
}

const form = await readFile("app/_components/ContactForm.tsx", "utf8");
assert.ok(form.includes('name="projectType" defaultValue="" required'));
assert.ok(form.includes("PROJECT_TYPES.map"));
for (const field of ["name", "email", "company", "projectType", "message", "_honey"]) {
  assert.ok(form.includes(`name="${field}"`), `Missing form field: ${field}`);
}
for (const expected of [
  "action={FORM_SUBMIT_ENDPOINT}",
  'https://formsubmit.co/ajax/${SITE_CONFIG.email}',
  "fetch(FORM_SUBMIT_AJAX_ENDPOINT",
  "JSON.stringify(payload)",
  '_subject: "New Portfolio Enquiry — Discuss a System"',
  '_template: "table"',
]) assert.ok(form.includes(expected), `Missing FormSubmit integration: ${expected}`);
for (const obsolete of ["N8N_CONTACT_WEBHOOK_URL", "/api/contact"]) {
  assert.equal(form.includes(obsolete), false, `Old contact integration remains: ${obsolete}`);
}
const homepage = await readFile("app/page.tsx", "utf8");
assert.ok(homepage.includes("<Portfolio />"));
assert.equal(homepage.includes("N8N_CONTACT_WEBHOOK_URL"), false);
const portfolio = await readFile("app/Portfolio.tsx", "utf8");
assert.ok(portfolio.includes("<ContactForm />"));
assert.ok(portfolio.includes("This form is delivered through FormSubmit."));
assert.equal(portfolio.includes("webhookReady"), false);

console.log("Contact form fields, FormSubmit endpoint, fallback and service choices verified.");
