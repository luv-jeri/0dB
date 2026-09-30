# 0dB reporting API

The reporting service is a separate Worker at `https://feedback-0db.cojeev.com`. The static site remains assets-only. These modules have no React imports or automatic browser hooks. Import from `@/lib/reporting/<module>`; nothing mounts or sends a report on import.

## Configuration

Set `NEXT_PUBLIC_REPORTING_API_URL` at site build time to the service URL, or `http://localhost:8787` for local work. Missing configuration fails explicitly and preserves the local draft. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is an optional build-time public key; `GET /v1/config` supplies the configured key and whether email is connected. `NEXT_PUBLIC_RELEASE_SHA` accepts a 40-character lowercase Git SHA for diagnostics. No Worker secret belongs in a `NEXT_PUBLIC_*` variable.

Production permits the exact origin `https://0db.cojeev.com`. Local config additionally permits `http://localhost:3000`; local mode refuses remote Worker hosts. No other origin, including the API's own origin, is permitted for browser mutations. Requests omit cookies. Private read credentials use `Authorization: Bearer <token>`, never URLs.

## Shared modules

| Module | Public API | Caller responsibility |
|---|---|---|
| `contracts` | `ReportKind`, `ReportPayload`, `Pin`, `Diagnostics`, `AttachmentManifest`, `Receipt`, `RequestTopic`, `ComponentMatch`; `LIMITS`, `MEDIA_TYPES`; `validateReport`, `safeReference`, `isUUID`, `redact`, `safeRoute`, `matchesMedia`, `findComponents` | Validate the reviewed payload. Diagnostics redaction is best effort; intentional prose and references remain private verbatim. |
| `client` | `REPORTING_API`, `REPORTING_SITE_KEY`, `ReportingConfig`, `ReportFile`, `FrozenSubmission`, `ReportingError`; `reportingFetch<T>`, `receiptSecret`, `manifestFiles`, `submitReport`, `fetchReceipt`, `uploadAttachment`, `canEditRejectedSubmission` | Freeze the UUID, token and exact report before the first attempt. Retry those unchanged. Read `ReportingError.status`; 0 denotes an uncertain connection. |
| `draft` | `ReportingDraft`, `ReportingDraftWorkspace`, `DRAFT_TTL_MS`; `emptyDraft`, `loadDraft`, `saveDraft`, `deleteDraft`, `loadDraftWorkspace`, `saveDraftWorkspace` | Await storage operations and show storage errors. Use the workspace for separate bug/request forms. Clear it explicitly when discarded or finished. |
| `diagnostics` | `releaseIdentifier`, `structuralPath`, `startDiagnostics`, `snapshotDiagnostics`, `clearDiagnostics` | Call `startDiagnostics` only after an explicit choice to capture browser details; keep its cleanup function and invoke it when capture ends. Attach a snapshot only after review. Do not mount a site-wide listener. |
| `capture` | `Crop`, `captureDimensions`, `capturePage`, `cropImage` | Capture/crop only on user action. Preview the actual resulting File before sending; personal information in rendered text/images cannot be reliably detected. |
| `receipt-labels` | `emailReceiptLabel`, `issueReceiptLabel` | Use these for truthful provider labels. Accepted email is not delivered; held work is not queued. |

`ReportFile` is `{ id: string, file: File }`. `FrozenSubmission` is `{ report: ReportPayload, token: string }`. Generate file/report IDs with `crypto.randomUUID()`, receipt tokens with `receiptSecret()`. `manifestFiles` hashes the original bytes and verifies media signatures. Never replace files while retrying a frozen report.

`ReportingDraft` includes kind, title, description, email, optional topicId, pins, files, diagnostics, frozen submission, attempted flag and receipt. `ReportingDraftWorkspace` is `{ activeKind, drafts: { bug?, request? } }`. IndexedDB `0db-reporting-v1` / `drafts` stores structured clones including files. A workspace expires seven days after its last save; reads do not refresh it. Expiry is checked and private entries are deleted transactionally on the next load. A closed browser cannot run cleanup: expired bytes may remain until the origin is opened or browser storage is cleared. Saving replaces the single-draft key atomically. `deleteDraft()` clears both keys and both report kinds. Unversioned entries lacking an expiry are discarded.

Diagnostics keep at most 40 redacted events in each group. They omit form values, cookies, storage, bodies and headers; structural paths omit IDs and text. Private admin routes are excluded. The 0dB modes are `day` and `nocturne`. Capture excludes `[data-private]`, editable controls and `[data-reporting-chrome]`; mark the reporting surface accordingly.

## Submission sequence

```ts
import { validateReport } from "@/lib/reporting/contracts"
import { manifestFiles, receiptSecret, submitReport, uploadAttachment } from "@/lib/reporting/client"

// Run only after the person has reviewed the content and chosen Send.
const frozen = {
  report: validateReport({ ...reviewedReport, attachments: await manifestFiles(files) }),
  token: receiptSecret(),
}
// Persist frozen in the draft before the first network attempt.
const receipt = await submitReport(frozen, turnstileToken)
for (const file of files) await uploadAttachment(receipt, file)
// Refresh fetchReceipt(receipt.id, receipt.token) for upload/provider status.
```

Store/download a receipt privately as JSON if the UI offers that feature; it is a bearer credential. Validate imported JSON and never auto-submit it. There is no receipt export/import helper in the port: the `Receipt` contract, `fetchReceipt` and label helpers are the shared primitives. A resolved component request includes `componentUrl`; all release URLs must be a single slug at `https://0db.cojeev.com/docs/<slug>/` (matching local-site URLs work only in local mode).

## HTTP contract

| Method and path | Input | Result |
|---|---|---|
| `GET /health` | None | Public status, environment and release identity only |
| `GET /v1/config` | None | `{ emailEnabled, turnstileSiteKey, local }` |
| `POST /v1/reports` | JSON `{ report, token, turnstileToken }` | `Receipt`; 201 new, 200 identical retry, 409 changed payload or token |
| `GET /v1/reports/:id` | Receipt bearer token | `Receipt`; unauthorized/not found both 404 |
| `PUT /v1/reports/:id/attachments/:fileId` | Receipt bearer token, exact MIME and raw bytes | `{ ok: true }`; repeat upload is safe; expired upload window 410 |
| `GET /v1/requests?q=&offset=` | Optional query and offset | `{ requests: RequestTopic[], hasMore }`, 20 per page |
| `GET /v1/admin/reports?offset=` | Admin bearer token | Private paginated summaries |
| `GET /v1/admin/reports/:id` | Admin bearer token | `{ report, attachments, deliveries }`; excludes token/payload/contact hashes |
| `GET /v1/admin/reports/:id/attachments/:fileId` | Admin bearer token | Private download |
| `PATCH /v1/admin/reports/:id` | Admin token, JSON `{ status?, componentUrl?, publicTitle? }` | `{ ok: true }`; safe public title approval; request resolution verifies a live HTML page |
| `POST /v1/admin/drain` | Admin token | `{ processed }` |
| `POST /v1/admin/deliveries/:id/retry` | Admin token; URL-encoded job ID | `{ ok: true }`; explicit reconciliation required after an uncertain email's 24-hour window |
| `GET /v1/admin/health` | Admin or health bearer token | Queue, usage, limits, activation and provider diagnostics |
| `POST /v1/github/webhook` | Signed GitHub issues event | 202 `{ ok: true, duplicate?, ignored? }` |
| `POST /v1/resend/webhook` | Signed Svix event | 202 `{ ok: true }` |

Reports require title 3–120, details 1–6000, email up to 254 characters, up to eight HTTP(S) references without URL credentials and eight structural pins. Allowed media: PNG/JPEG/WebP/MP4/WebM; six files maximum, 10 MiB each, 30 MiB combined. JSON request bodies are bounded to 192 KiB. Unknown report/diagnostic fields are rejected. New submissions allow ten attempts per IP per fixed ten-minute bucket; accepted identical retries bypass that accounting. Production Turnstile must pass hostname and action `reporting` checks.

Report statuses: `received`, `planned`, `in_progress`, `resolved`, `declined`. Receipt `email` is `pending | sent | setup_required | needs_review`; `issue` is `pending | created | setup_required | needs_review`. Optional `emailDelivery` and `issueDelivery` expose the underlying queue/provider state. The email becomes `sent` only after a signed delivered event. Public request titles require explicit maintainer approval; demand counts each normalized email once via a keyed hash.

Errors are JSON `{ error, retryAfter? }` with HTTP status and, for rate limits, a `Retry-After` header. Responses are `no-store`. There is no user deletion endpoint; follow [the maintainer deletion procedure](./OPERATIONS.md#deletion-procedure).
