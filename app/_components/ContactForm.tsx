"use client";

import { FormEvent, useState } from "react";
import { track } from "@vercel/analytics";
import { SITE_CONFIG } from "../site-config";
import { PROJECT_TYPES } from "../contact-project-types";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactForm({ available = false }: { available?: boolean }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setStatus("sending");
    setErrorMessage("");

    const projectType = String(values.get("projectType") || "");
    const payload = {
      name: String(values.get("name") || ""),
      email: String(values.get("email") || ""),
      company: String(values.get("company") || ""),
      projectType,
      message: String(values.get("message") || ""),
      _honey: String(values.get("_honey") || ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "Message could not be sent.");
      form.reset();
      setStatus("success");
      track("Contact Form Submitted", { project_type: projectType || "Not specified" });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Message could not be sent.");
      setStatus("error");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${SITE_CONFIG.email}`;
    }
  };

  if (!available) {
    return (
      <div className="contact-form contact-email-fallback">
        <p className="contact-email-note">The contact form is being connected. For now, please email me your project details directly.</p>
        <a className="contact-submit" href={`mailto:${SITE_CONFIG.email}?subject=Portfolio%20enquiry`}>EMAIL ME DIRECTLY <span>↗</span></a>
      </div>
    );
  }

  return (
    <form className="contact-form" action="/api/contact" method="POST" onSubmit={submit}>
      <div className="form-honey" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field blank</label>
        <input id="contact-website" type="text" name="_honey" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-row">
        <label><span>YOUR NAME *</span><input name="name" type="text" autoComplete="name" maxLength={120} required placeholder="Name" /></label>
        <label><span>EMAIL ADDRESS *</span><input name="email" type="email" autoComplete="email" maxLength={254} required placeholder="you@company.com" /></label>
      </div>
      <div className="form-row">
        <label><span>COMPANY / TEAM</span><input name="company" type="text" autoComplete="organization" maxLength={150} placeholder="Optional" /></label>
        <label><span>WHAT ARE WE BUILDING? *</span><select name="projectType" defaultValue="" required><option value="" disabled>Select a system</option>{PROJECT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
      </div>
      <label className="message-field"><span>WHAT PROCESS WOULD YOU LIKE TO IMPROVE? *</span><textarea name="message" required maxLength={3000} rows={5} placeholder="Share the process, bottleneck, or outcome you have in mind." /></label>
      <div className="form-submit">
        <button className="contact-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "SENDING…" : "DISCUSS A SYSTEM"}<span>↗</span></button>
        <p className={`form-status is-${status}`} role="status" aria-live="polite" aria-atomic="true">
          {status === "success" && "Message sent. Thank you — I'll review your enquiry and reply by email."}
          {status === "error" && <>{errorMessage} <a href={`mailto:${SITE_CONFIG.email}`}>Email me directly</a> or <button type="button" onClick={copyEmail}>{copied ? "EMAIL COPIED" : "COPY EMAIL"}</button>.</>}
        </p>
      </div>
      <p className="form-privacy">Your details are used only to respond to this enquiry. They are not added to a mailing list.</p>
      <noscript><p className="form-privacy">JavaScript is not required to read this page. For the easiest way to reach me, email <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.</p></noscript>
    </form>
  );
}
