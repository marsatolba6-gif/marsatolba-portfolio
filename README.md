# Automate with Mars

Portfolio of Mars Atolba, an AI & Automation Specialist focused on AI workflows, n8n automation, GoHighLevel systems, APIs, webhooks, and connected business systems.

## Local development

```bash
npm ci
npm run dev:vercel
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build:vercel
```

The repository includes `vercel.json`, so Vercel uses the dedicated Next.js production build while preserving the original project workflow.

## Deployment

The `main` branch is intended to be connected to Vercel. A push to `main` creates a production deployment for the portfolio.

## Contact

- Email: marsatolba6@gmail.com
- Website: https://automateiv.vercel.app

Elevate. Automate. Excel.


## Portfolio content and proof

- Edit `app/projects.ts` to populate each case study's optional `demoVideoUrl` (Loom share or YouTube URL), `sampleRun.input`, `sampleRun.extractedOutput`, `sampleRun.result`, and `workflowJsonUrl`. Empty video/sample/download fields do not render.
- Each case study's `testScenarios` is a data-driven table with `scenario`, `input`, `expectedResult`, and `outcome`. Unfilled evidence cells read **Not documented**. Add real, sanitized inputs and verified outcomes, not hypothetical pass claims.
- To share workflow JSON, sanitize credentials, hostnames, contact details, tokens and secrets first; place the exported JSON in `public/assets/` and set `workflowJsonUrl: "/assets/your-workflow.json"`.
- Every /work/[slug] has a server-generated 1200×630 PNG via the Next.js `opengraph-image` route. Home continues to use `/og.png`.

## Contact configuration

- Edit `app/site-config.ts` for `email`, `bookingUrl`, `typicalReplyTime`, and `contactNextSteps`. Empty booking URL hides the booking CTA.
- In Vercel project settings, add the **server-only** `N8N_CONTACT_WEBHOOK_URL` environment variable and redeploy. Never prefix this variable with `NEXT_PUBLIC_`, commit its value, or expose it client-side.
- The n8n endpoint must accept a JSON POST containing `name`, `email`, `company`, `projectType`, `message`, `source` and `submittedAt`, then return a 2xx status for a successful submission.
- Without a webhook configured the form responds with an error and provides a direct email alternative. Its footer statement is shown only when a webhook is configured at build time.
- The API validates fields, checks a honeypot, times out upstream requests, and limits bursts per server instance. This is **not a distributed rate limit**; for higher-volume production use add a shared store or upstream WAF protection.

## Verification

Run `npm ci`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`. A GitHub Actions workflow also runs these checks and collects mobile Lighthouse reports for home and RoofFlow (baseline live URL versus the locally served updated build). Reports are environment-dependent and should not be treated as controlled performance experiments.
