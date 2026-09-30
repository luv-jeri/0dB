**Recommend (b): a separate 0dB reporting Worker using 000h’s code.** It preserves private reports, attachments, receipts, and component requests while isolating changes from 000h’s live service.

Read-only audit, 2026-10-01. Checkout `0fd7bb0` differs from live release `d29c2a79…`, reported by both API health endpoints. Production `/v1/config` reports email enabled; committed configuration disables it. Provisioning notes are therefore historical. Successful submissions and email delivery were not tested.

**000h’s user flow**

The [root layout](/Users/sanjaykumar/Developer/cojeev-ui-release/app/layout.tsx) mounts a floating reporting launcher everywhere except the admin page. Its side panel offers request/bug tabs. Footer, docs navigation, and `/requests/` lead to the request board, where people can start or join requests.

Both forms ask for a title, description, and required private email:

- **Issue:** what went wrong, actual versus expected behavior; optional element pins, viewport/full-page screenshots with cropping, and browser details.
- **Component:** component title, details/inspiration/links; suggestions from the existing library and request board. Joining supplies the title and makes additional context optional. Demand counts each email once.
- **Attachments:** PNG/JPEG/WebP/MP4/WebM; six maximum, 10 MiB each, 30 MiB combined.

Separate drafts persist in IndexedDB, including files. Review previews content and exposes the exact payload. Sending constitutes approval of that content and visible media; diagnostics are explicitly attached through “Include browser details.” The in-memory diagnostics buffer nevertheless starts site-wide.

After sending, users see a private receipt, report status, separate email/issue delivery states, upload progress/retries, and receipt download/import. Retrying preserves submission identity. Request titles become public only after maintainer approval. See [widget source](/Users/sanjaykumar/Developer/cojeev-ui-release/components/reporting/reporting-widget.tsx).

**API contract**

[Contracts](/Users/sanjaykumar/Developer/cojeev-ui-release/lib/reporting/contracts.ts) and [router](/Users/sanjaykumar/Developer/cojeev-ui-release/workers/reporting/src/index.ts) define:

| Endpoint | Input → output |
|---|---|
| `GET /v1/config` | `{emailEnabled,turnstileSiteKey,local}` |
| `POST /v1/reports` | `{report,token,turnstileToken}` → receipt; 201 new, 200 identical retry |
| `GET /v1/reports/:id` | Bearer receipt token → receipt |
| `PUT /v1/reports/:id/attachments/:fileId` | Bearer token, MIME, raw bytes → `{ok:true}` |
| `GET /v1/requests?q=&offset=` | `{requests,hasMore}`; 20/page |
| `/v1/admin/*` | Authenticated list/detail/media, status PATCH, drain/retry, health |
| `POST /v1/github/webhook`, `/v1/resend/webhook` | Signed provider events |

`report` contains `{id,kind,title,description,email,references,pins,attachments,diagnostics,topicId?}`. Attachment manifests contain `{id,name,type,size,sha256}`. Receipts contain `{id,token,status,topicId,componentUrl?,email,emailDelivery?,issue,issueDelivery?,attachments:[{id,state}]}`. Errors return `{error,retryAfter?}`.

Validation uses field allowlists: title 3–120 characters, details 1–6000, email ≤254, eight credential-free HTTP(S) references, eight structural pins, forty events per diagnostic group, and 192 KiB JSON. Uploads verify size, SHA-256, and media signatures. Changed retries return 409.

New submissions allow ten attempts/IP per fixed ten-minute bucket; identical retries bypass that accounting. Turnstile Siteverify checks success, hostname, and action `reporting`, with IP and report-ID idempotency.

CORS echoes exact permitted origins: production website/API plus `https://luv-jeri.github.io`; beta website/API only. Browser mutations and preflights reject unapproved origins. Headers permit `Content-Type,Authorization`; responses use `no-store`.

**Worker, storage, and deployment**

Bindings: `DB` → D1; `MEDIA` → private R2.

Tables: `reports`, `topics`, `attachments`, `outbox`, `rate_limits`, `webhook_events`, `email_attempts`, `email_events`. R2 stores `<reportId>/<fileId>`; media downloads require maintainer authentication.

A five-minute cron drains delivery jobs and performs cleanup. Reports persist before delivery. GitHub receives generic references and private-admin links. Resend sends acknowledgements/releases with stable payloads and idempotency; signed webhooks distinguish acceptance from delivery. Uncertain sends require review.

Secret names: `ADMIN_TOKEN`, `HEALTH_TOKEN`, `IP_HASH_SECRET`, `TURNSTILE_SECRET`, `GITHUB_TOKEN`, `GITHUB_WEBHOOK_SECRET`, `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`. `TURNSTILE_SITE_KEY` is public.

Production uses `cojeev-ui-reporting`, `cojeev-ui-reports`, `cojeev-ui-report-media`; beta has separate Worker/database/bucket, Turnstile, credentials, and private feedback repository.

The [release runbook](/Users/sanjaykumar/Developer/cojeev-ui-release/docs/production/OPERATIONS.md) builds both environments from one clean commit, deploys beta from main, then promotes the prepared production artifact through owner approval. Migrations require verified private D1 backups. CI uses `CLOUDFLARE_API_TOKEN`, `REPORTING_SECRETS_JSON`, and `REPORTING_ADDITIONAL_SECRETS_JSON`.

000h dependencies include origin lists, separately configured Turnstile hostname lists, release target/CSP assertions, `SITE_URL` admin/component links, and hardcoded sender/template branding.

**Privacy**

[Inventory](/Users/sanjaykumar/Developer/cojeev-ui-release/docs/privacy/2026-09-13-processing-inventory.md): Cloudflare processes reports/media/abuse checks; GitHub receives issue references; Resend receives recipients/templates; optional PostHog is separate.

Cleanup removes media, pins, and diagnostics after 30 days; private text/contact/reference fields and stored email payloads after 180. Public topics, contact hashes, delivery metadata, and email-event/attempt rows persist. Local drafts have no expiry. There is no user deletion endpoint; provider copies and backups require separate retention/deletion handling.

**Options and running cost**

| Route | Work and risk |
|---|---|
| **(a) Shared Worker** | Product schema/migration, origin-to-product enforcement, scoped topics/demand/admin/links/email/webhooks and regression tests. Highest risk to live 000h. |
| **(b) Separate instance** | Own resources/configuration/deployment, rebrand copied code, fix privacy gaps. Lowest production coupling; another service to maintain. |
| **(c) GitHub forms** | Two issue templates and prefilled links. No backend cost or 000h changes; GitHub account/public reporting, attachments completed there, no private receipts or equivalent request board. |

For (a)/(b), **$0 incremental is plausible at small volume**, within shared allowances—not guaranteed. Workers Free allows 100k requests/day, [D1](https://developers.cloudflare.com/d1/platform/pricing/) 5m reads/100k writes daily, [R2](https://developers.cloudflare.com/r2/pricing/) 10 GB-month Standard storage, and [Resend](https://resend.com/pricing) 100 emails/day, 3,000/month. Separate instances share account/provider budgets. [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).

**Exact implementation scope for (b)**

**000h repo:** no changes.

**0dB non-UI:** create:

- `workers/reporting/src/{index,reports,security,types,delivery,resend,lifecycle}.ts`
- `workers/reporting/migrations/{0001_reporting,0002_safe_delivery}.sql`
- `workers/reporting/{wrangler.jsonc,wrangler.local.jsonc,test/integration.test.mjs}`
- `lib/reporting/{contracts,client,draft,diagnostics,capture,receipt-labels}.ts`
- `tests/{reporting-contract,reporting-client}.test.mjs`, `tests/reporting.browser.mjs`
- `docs/reporting/OPERATIONS.md`, `docs/privacy/processing-inventory.md`, `.env.example`

Change `package.json`, `.github/workflows/ci.yml`, `public/_headers`. Provision `feedback-0db.cojeev.com`, separate D1/R2/Turnstile/secrets/webhooks; adapt branding, route validation, draft expiry, deletion procedure, and email quotas. Keep root `wrangler.jsonc` assets-only.

**0dB UI:** create `app/{feedback,requests,privacy,feedback-admin}/page.tsx` and `components/site/reporting/{forms,request-board,receipt,admin,turnstile}.tsx`, plus `reporting.css`. Change `components/site/top-row.tsx`, `lib/site/nav.ts`, `app/docs/[item]/page.tsx`.

Use quiet text links, roman labels/italic answers, one accent, whitespace and hairlines. Compose `field`, `form`, `input-group`, `dropzone`, `radio-group`; use `questionnaire` for guided issue questions without nesting forms. Use toast for brief acknowledgements and a persistent receipt for completion.

Test isolation, validation, retries, uploads, signatures, retention, and truthful delivery states; finish with one working-app check.

