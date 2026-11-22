"use client";

import { FormEvent, useState } from "react";
import { track } from "@vercel/analytics";
import { SITE_CONFIG } from "../site-config";
import { PROJECT_TYPES } from "../contact-project-types";
import { getFormSubmitError, isFormSubmitSuccess } from "../formsubmit-response";

const FORM_SUBMIT_ENDPOINT = `https://formsubmit.co/${SITE_CONFIG.email}`;
const FORM_SUBMIT_AJAX_ENDPOINT = `https://formsubmit.co/ajax/${SITE_CONFIG.email}`;

type FormStatus = "idle" | "sending" | "success" | "unconfirmed" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setStatus("sending");
    setErrorMessage("");
    setDeliveryMessage("");

    const projectType = String(values.get("projectType") || "");
    const payload = {
      name: String(values.get("name") || ""),
      email: String(values.get("email") || ""),
      company: String(values.get("company") || ""),
      projectType,
      message: String(values.get("message") || ""),
      _honey: String(values.get("_honey") || ""),
      _subject: "New Portfolio Enquiry — Discuss a System",
      _template: "table",
    };

    try {
      const response = await fetch(FORM_SUBMIT_AJAX_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: unknown = await response.json();

      // FormSubmit can respond with HTTP 200 when a submission is rejected.
      // Only its explicit success value confirms acceptance.
      if (!response.ok || !isFormSubmitSuccess(result)) {
        setErrorMessage(getFormSubmitError(result));
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
      track("Contact Form Submitted", { project_type: projectType || "Not specified", provider: "formsubmit" });
    } catch {
      // A dropped connection or non-JSON reply does not prove delivery failed.
      // Preserve the entered form so the visitor can contact us another way.
      setDeliveryMessage("I couldn't confirm whether FormSubmit received your message. Please avoid submitting it again immediately.");
      setStatus("unconfirmed");
      track("Contact Confirmation Delayed", { project_type: projectType || "Not specified", provider: "formsubmit" });
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

  return (
    <form className="contact-form" action={FORM_SUBMIT_ENDPOINT} method="POST" onSubmit={submit}>
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
          {status === "unconfirmed" && <>{deliveryMessage} <a href={`mailto:${SITE_CONFIG.email}`}>Email directly if needed</a>.</>}
          {status === "error" && <>{errorMessage} <a href={`mailto:${SITE_CONFIG.email}`}>Email me directly</a> or <button type="button" onClick={copyEmail}>{copied ? "EMAIL COPIED" : "COPY EMAIL"}</button>.</>}
        </p>
      </div>
      <p className="form-privacy">FormSubmit delivers your enquiry to my email. Your details are used only to respond and are not added to a mailing list.</p>
      <noscript><p className="form-privacy">JavaScript is not required to read this page. For the easiest way to reach me, email <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.</p></noscript>
    </form>
  );
}
