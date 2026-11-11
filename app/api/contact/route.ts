import { NextRequest, NextResponse } from "next/server";

/**
 * Lightweight per-instance rate limiting. A distributed store is required for
 * strict limits across serverless instances, but this guards basic bursts.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

export const runtime = "nodejs";
export const maxDuration = 10;

const response = (body: { message: string }, status: number) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

function clean(value: unknown, maximum: number): string {
  return typeof value === "string" ? value.trim().slice(0, maximum + 1) : "";
}

export async function POST(request: NextRequest) {
  const type = request.headers.get("content-type") ?? "";
  if (!type.includes("application/json") && !type.includes("application/x-www-form-urlencoded")) {
    return response({ message: "Unsupported form content type." }, 415);
  }

  const clientAddress =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const now = Date.now();
  if (attempts.size > 2000) {
    for (const [key, value] of attempts) {
      if (value.resetAt <= now) attempts.delete(key);
    }
  }
  const current = attempts.get(clientAddress);
  const next = !current || current.resetAt <= now
    ? { count: 1, resetAt: now + WINDOW_MS }
    : { count: current.count + 1, resetAt: current.resetAt };
  attempts.set(clientAddress, next);
  if (next.count > MAX_REQUESTS) {
    return response({ message: "Too many messages. Please try again later or email directly." }, 429);
  }

  let fields: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 12_000) return response({ message: "Message too long." }, 413);
    fields = type.includes("application/json")
      ? JSON.parse(raw)
      : Object.fromEntries(new URLSearchParams(raw));
    if (!fields || typeof fields !== "object" || Array.isArray(fields)) throw new Error("Invalid form");
  } catch {
    return response({ message: "Please check the form and try again." }, 400);
  }

  // Honeypot: pretend success to bots but never forward the data.
  if (clean(fields._honey, 100)) return response({ message: "Message received." }, 200);

  const name = clean(fields.name, 120);
  const email = clean(fields.email, 254);
  const company = clean(fields.company, 150);
  const projectType = clean(fields.projectType, 80);
  const message = clean(fields.message, 3000);
  if (!name || name.length > 120 || !email || email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !message || message.length > 3000 || company.length > 150 || projectType.length > 80) {
    return response({ message: "Please enter a valid name, email, and message." }, 400);
  }

  const webhook = process.env.N8N_CONTACT_WEBHOOK_URL;
  if (!webhook) return response({ message: "The contact workflow is not connected yet. Please use email instead." }, 503);
  let target: URL;
  try {
    target = new URL(webhook);
    if (target.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && target.hostname === "localhost"))
      return response({ message: "The contact workflow is unavailable. Please email directly." }, 503);
  } catch {
    return response({ message: "The contact workflow is unavailable. Please email directly." }, 503);
  }

  try {
    const upstream = await fetch(target.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, company, projectType, message, source: "automateiv portfolio", submittedAt: new Date().toISOString() }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!upstream.ok) throw new Error("Webhook rejected message");
    return response({ message: "Message received. Thank you." }, 200);
  } catch {
    return response({ message: "Could not send the message. Please email directly instead." }, 502);
  }
}
