# Research brief: report an issue and request a component (for GPT Sol 6.1)

Owner, 2026-10-01: "we also want to have the report and issue and request an component feature same as the 000h. please also do that as well but in our design philosophy and design system and components."

You are read-only. Map how 000h does it, then recommend how 0dB should do it. Write Markdown to stdout.

## 000h
- The repo is `/Users/sanjaykumar/Developer/cojeev-ui-release` (luv-jeri/cojeev-ui). The live site is https://000h.cojeev.com, and the feedback API is https://feedback.cojeev.com.
- The reporting Worker is in `workers/reporting/`. The UI and its client are in `app/`, `components/` and `lib/`; grep for report, feedback, request, turnstile.
- The docs are in `docs/production/OPERATIONS.md`, `docs/production/provisioning-status.md` and the privacy docs.
- `git log --oneline | grep -i -E "report|feedback|request|privacy|turnstile"` finds more.

Report:
1. **The user flow.** Where the entry points are, what each form asks (report an issue versus request a component), the fields, the attachments, the consent, and what the user sees afterwards.
2. **The API contract.** Endpoints, the request and response shapes, validation, rate limits, CORS and allowed origins, and how Turnstile is verified.
3. **The Worker and its storage.** D1 tables, R2 media, the cron job, Resend email, and the secret NAMES and binding names. Never print values.
4. **How it's deployed,** for beta and production. What depends on `000h.cojeev.com` specifically: origins, the Turnstile hostname list, and email templates.
5. **Privacy:** retention, deletion, and the processing inventory.

## Recommend for 0dB
0dB is a static Next 16 export on Cloudflare (`wrangler.jsonc`: Worker `0db`, custom domain `0db.cojeev.com`, assets only). Compare these routes, with the work each needs, the risk to 000h's live production, and the running cost:
- **(a)** Reuse 000h's reporting Worker. Add a `product: "0db"` field, and 0db.cojeev.com as an allowed origin and Turnstile hostname.
- **(b)** Deploy a second instance of the same Worker code for 0dB (its own D1 and R2, for example feedback-0db.cojeev.com).
- **(c)** Use GitHub issue forms only (`.github/ISSUE_TEMPLATE/*.yml`), and have the site open prefilled issue URLs. This needs no backend.

Pick one and justify it. Then list the exact files to create or change in each repo, and the non-UI work (the Worker, the API client, validation, and tests), separately from the UI work (the forms, built from 0dB's own components: field, form, input-group, dropzone, radio-group, questionnaire, toast). Under 1200 words.
