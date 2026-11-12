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
assert.match(form, /name="projectType" defaultValue="" required/);
assert.match(form, /PROJECT_TYPES\.map/);
assert.match(form, /projectType,\s*message:/);
assert.match(form, /fetch\("\/api\/contact"/);

const route = await readFile("app/api/contact/route.ts", "utf8");
assert.match(route, /if \(!isProjectType\(projectType\)\)/);
assert.match(route, /return response\(\{ message: "Please select a valid service from the list\." \}, 400\)/);
assert.match(route, /body: JSON\.stringify\(\{ name, email, company, projectType, message, source: "automateiv portfolio", submittedAt: new Date\(\)\.toISOString\(\) \}\)/);
assert.match(route, /const webhook = process\.env\.N8N_CONTACT_WEBHOOK_URL/);
assert.match(route, /if \(clean\(fields\._honey, 100\)\)/);

console.log("Contact form options, strict validation and n8n payload contract verified.");
