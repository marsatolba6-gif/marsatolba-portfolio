/** Test actual /api/contact server behavior without sending any external requests. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

const routeTs = await readFile("app/api/contact/route.ts", "utf8");
const compiled = ts.transpileModule(routeTs, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  reportDiagnostics: true,
});
assert.equal(compiled.diagnostics?.length ?? 0, 0, "Route transpilation must succeed");

let behavior = "timeout";
const calls = [];
const env = { NODE_ENV: "production", N8N_CONTACT_WEBHOOK_URL: "https://example.invalid/n8n-test" };
const mockModule = { exports: {} };
const customRequire = (name) => {
  if (name === "next/server") return { NextResponse: { json: (body, config) => ({ status: config.status, body }) } };
  if (name === "../../contact-project-types") return { isProjectType: value => [
    "AI Workflow", "n8n Automation", "GoHighLevel System",
    "Workflow Optimization", "Ongoing Automation Support", "Other",
  ].includes(value) };
  throw new Error("Unexpected require: " + name);
};
const sandbox = {
  module: mockModule, exports: mockModule.exports, require: customRequire,
  Map, Date, URL, JSON, Object, Error, AbortSignal, process: { env },
  fetch: async (_target, request) => {
    calls.push(request);
    if (behavior === "timeout") throw Object.assign(new Error("Webhook response timeout"), { name: "TimeoutError" });
    if (behavior === "rejected") return { ok: false };
    return { ok: true };
  },
};
vm.runInNewContext(compiled.outputText, sandbox, { filename: "contact-route.test.cjs" });

const makeRequest = (projectType, id) => ({
  headers: { get: key => key === "content-type" ? "application/json" : key === "x-real-ip" ? id : null },
  text: async () => JSON.stringify({
    name: "Integration Test", email: "example@example.invalid", company: "Test Company",
    projectType, message: "Testing status and field handling", _honey: "",
  }),
});
const submit = (type, id) => mockModule.exports.POST(makeRequest(type, id));

// A slow n8n confirmation must not incorrectly declare a confirmed failure.
// Users sometimes receive the Gmail message even when the 8-second HTTP timer fires.
let result = await submit("AI Workflow", "test-1");
assert.equal(result.status, 202);
assert.equal(result.body.delivery, "unconfirmed");
assert.match(result.body.message, /confirmation is taking longer/i);
assert.equal(calls.length, 1);
const forwarded = JSON.parse(calls[0].body);
assert.deepEqual(Object.keys(forwarded), ["name","email","company","projectType","message","source","submittedAt"]);
assert.equal(forwarded.company, "Test Company");
assert.equal(forwarded.projectType, "AI Workflow");
assert.equal(forwarded.source, "automateiv portfolio");

// A truly failed upstream response must still be surfaced as an error.
behavior = "rejected";
result = await submit("n8n Automation", "test-2");
assert.equal(result.status, 502);

// A successful acknowledgment remains the normal confirmed success state.
behavior = "success";
result = await submit("GoHighLevel System", "test-3");
assert.equal(result.status, 200);

// Unrecognized service types must be rejected without calling the webhook.
const prevCalls = calls.length;
result = await submit("Unknown Service", "test-4");
assert.equal(result.status, 400);
assert.equal(calls.length, prevCalls);

const form = await readFile("app/_components/ContactForm.tsx", "utf8");
assert.match(form, /response\.status === 202/);
assert.match(form, /setStatus\("unconfirmed"\)/);
assert.match(form, /status === "unconfirmed"/);
assert.match(form, /status === "error"/);
console.log("Delivery feedback: timeout = pending, rejection = error, success = success, allowlist = valid.");
