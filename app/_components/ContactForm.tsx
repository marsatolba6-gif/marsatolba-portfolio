"use client";

import { FormEvent, useState } from "react";
import { track } from "@vercel/analytics";
import { SITE_CONFIG } from "../site-config";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [copied, setCopied] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    if (values.get("_honey")) return;
    setStatus("sending");

    const name = String(values.get("name") || "");
    const email = String(values.get("email") || "");
    const projectType = String(values.get("projectType") || "Not specified");
    const payload = {
      name,
      email,
      company: String(values.get("company") || "Not provided"),
      "project type": projectType,
      message: String(values.get("message") || ""),
      _subject: `Portfolio enquiry — ${name || "Website visitor"}`,
      _replyto: email,
      _template: "table",
      _captcha: "false",
    };

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${SITE_CONFIG.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Message could not be sent");
      form.reset();
      setStatus("success");
      track("Contact Form Submitted", { project_type: projectType });
    } catch {
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

  return (
    <form className="contact-form" action={`https://formsubmit.co/${SITE_CONFIG.email}`} method="POST" onSubmit={submit}>
      <input className="form-honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-row">
        <label><span>YOUR NAME *</span><input name="name" type="text" autoComplete="name" required placeholder="Name" /></label>
        <label><span>EMAIL ADDRESS *</span><input name="email" type="email" autoComplete="email" required placeholder="you@company.com" /></label>
      </div>
      <div className="form-row">
        <label><span>COMPANY / TEAM</span><input name="company" type="text" autoComplete="organization" placeholder="Optional" /></label>
        <label><span>WHAT ARE WE BUILDING?</span><select name="projectType" defaultValue=""><option value="" disabled>Select a system</option><option>AI Workflow</option><option>n8n Automation</option><option>GoHighLevel System</option><option>Workflow Optimization</option><option>Ongoing Automation Support</option><option>Other</option></select></label>
      </div>
      <label className="message-field"><span>WHAT PROCESS WOULD YOU LIKE TO IMPROVE? *</span><textarea name="message" required rows={5} placeholder="Share the process, bottleneck, or outcome you have in mind." /></label>
      <div className="form-submit">
        <button className="contact-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "SENDING…" : "DISCUSS A SYSTEM"}<span>↗</span></button>
        <p className={`form-status is-${status}`} aria-live="polite">
          {status === "success" && "Message sent. Thanks — I’ll review the details and reply by email."}
          {status === "error" && <>The form paused. <a href={`mailto:${SITE_CONFIG.email}`}>Email me directly</a> or <button type="button" onClick={copyEmail}>{copied ? "EMAIL COPIED" : "COPY EMAIL"}</button>.</>}
        </p>
      </div>
      <p className="form-privacy">Your details are used only to respond to this enquiry. They are not added to a mailing list.</p>
    </form>
  );
}

