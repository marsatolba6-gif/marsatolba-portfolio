/** Validate FormSubmit's AJAX acknowledgment without sending real enquiries. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const code = await readFile("app/formsubmit-response.ts", "utf8");
const compiled = ts.transpileModule(code, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  reportDiagnostics: true,
});
assert.equal(compiled.diagnostics?.length ?? 0, 0, "Response helper must transpile");
const { isFormSubmitSuccess, getFormSubmitError } = await import(
  "data:text/javascript;base64," + Buffer.from(compiled.outputText).toString("base64")
);

assert.equal(isFormSubmitSuccess({ success: true }), true);
assert.equal(isFormSubmitSuccess({ success: "true" }), true);
for (const failure of [
  { success: false, message: "Activation required" },
  { success: "false", message: "Activation required" },
  { success: "True" }, { success: 1 }, { success: "1" },
  {}, null, false, undefined,
]) assert.equal(isFormSubmitSuccess(failure), false);
assert.equal(getFormSubmitError({ success: "false", message: "Activation required" }), "Activation required");
assert.match(getFormSubmitError(null), /could not accept/i);
assert.equal(getFormSubmitError({ message: "  " + "a".repeat(300) }).length, 240);

const form = await readFile("app/_components/ContactForm.tsx", "utf8");
for (const expected of [
  "if (!response.ok || !isFormSubmitSuccess(result))",
  "setErrorMessage(getFormSubmitError(result))",
  'setStatus("unconfirmed")',
  'setStatus("success")',
  'status === "error"',
  'status === "unconfirmed"',
  '"Accept": "application/json"',
]) assert.ok(form.includes(expected), `Missing response handling: ${expected}`);
for (const obsolete of ["N8N_CONTACT_WEBHOOK_URL", 'fetch("/api/contact"']) {
  assert.equal(form.includes(obsolete), false);
}
console.log("FormSubmit acceptance: explicit true succeeds, false is rejected, and ambiguous delivery remains unconfirmed.");
