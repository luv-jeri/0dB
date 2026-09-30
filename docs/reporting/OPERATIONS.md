# 0dB reporting operations

This runbook is for the owner to execute later. Nothing below was provisioned or deployed by this job. Production is `0db-reporting`, `feedback-0db.cojeev.com`, D1 `0db-reports` (`DB`), private R2 `0db-report-media` (`MEDIA`). Root `wrangler.jsonc` remains the assets-only site. No CI changes are required for this handoff.

## Local checks

```sh
rtk npm test
rtk npm run test:reporting
rtk npm run test:reporting:browser
```

The integration test bundles the real Worker and both migrations into disposable Miniflare D1/R2 instances. No cloud credentials or existing database are used. Tests cover validation, identity retries, media authorization/hash/signature checks, demand privacy, retention, webhook signatures/replays, delivery uncertainty, email quotas and origin isolation. Browser tests use the already-running site on localhost:3000, real IndexedDB and temporary bundled helpers. They do not create UI or send reports.

For an owner-started local Worker, with the site already on port 3000:

```sh
rtk npm run reporting:migrate:local
rtk npm run reporting:dev
```

Local mode disables Turnstile only on loopback Worker hosts; providers are disabled, no secret is needed for the public local report flow. Private local admin checks need a locally supplied `ADMIN_TOKEN` of at least 32 characters. Put local secrets in the ignored `workers/reporting/.dev.vars` file and never put them in the site build. These commands are documentation, not a request to restart the existing site server.

## Owner provisioning and activation

Use separate 0dB credentials and resources. Replace angle-bracket placeholders yourself. [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) and [D1 commands](https://developers.cloudflare.com/d1/wrangler-commands/) are the reference for these steps.

1. Authenticate the intended Cloudflare account; create only the new D1 and R2 resources. Record the returned database UUID and set `d1_databases[0].database_id` in `workers/reporting/wrangler.jsonc`. The committed all-zero value is deliberately unprovisioned. Keep R2 private: no public access, custom domain or bucket website.

   ```sh
   rtk npx wrangler login
   rtk npx wrangler d1 create 0db-reports --config workers/reporting/wrangler.jsonc
   rtk npx wrangler r2 bucket create 0db-report-media --config workers/reporting/wrangler.jsonc
   ```

2. Create a managed Turnstile widget for the **single hostname** `0db.cojeev.com` in the Cloudflare dashboard (not the old product/API hostname). Set its public key as `TURNSTILE_SITE_KEY` in Worker vars and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in the site's build environment. The UI must request action `reporting`. Set `NEXT_PUBLIC_REPORTING_API_URL=https://feedback-0db.cojeev.com` and `NEXT_PUBLIC_RELEASE_SHA=<40-character-git-sha>` at site build time. `.env.example` lists names only; it is not a dotenv file to copy unchanged.

3. Establish `hello@0db.cojeev.com` as a real reply/deletion mailbox. Verify `0db.cojeev.com` as a sending domain in Resend with the DNS records Resend supplies; create a restricted sending API key. Set `EMAIL_FROM` to the verified 0dB sender. Create a **private** GitHub feedback repository and a fine-grained token with issue read/write access to it; set `GITHUB_REPOSITORY=<owner>/<0db-feedback-repository>` in Worker vars. Project integration is optional: `GITHUB_PROJECT_ID` is a non-secret var, with additional GitHub project permissions if used.

   ```sh
   rtk gh repo create <owner>/<0db-feedback-repository> --private
   ```

4. Prepare eight separate secret values in a password manager. `ADMIN_TOKEN`, `HEALTH_TOKEN` and `IP_HASH_SECRET` must each be independently random, at least 32 characters. Do not rotate `IP_HASH_SECRET` casually: it keys demand deduplication and GitHub reconciliation markers. Set each secret interactively; at each prompt paste the indicated placeholder's real value (never literal placeholders or values in shell history).

   ```sh
   # Prompt: <random-admin-token>
   rtk npx wrangler secret put ADMIN_TOKEN --config workers/reporting/wrangler.jsonc
   # Prompt: <random-health-only-token>
   rtk npx wrangler secret put HEALTH_TOKEN --config workers/reporting/wrangler.jsonc
   # Prompt: <random-ip-and-contact-hash-key>
   rtk npx wrangler secret put IP_HASH_SECRET --config workers/reporting/wrangler.jsonc
   # Prompt: <0db-turnstile-secret>
   rtk npx wrangler secret put TURNSTILE_SECRET --config workers/reporting/wrangler.jsonc
   # Prompt: <private-0db-repository-github-token>
   rtk npx wrangler secret put GITHUB_TOKEN --config workers/reporting/wrangler.jsonc
   # Prompt: <random-github-webhook-secret>
   rtk npx wrangler secret put GITHUB_WEBHOOK_SECRET --config workers/reporting/wrangler.jsonc
   # Prompt: <0db-resend-api-key>
   rtk npx wrangler secret put RESEND_API_KEY --config workers/reporting/wrangler.jsonc
   # Prompt: <resend-whsec-signing-secret-from-step-6>
   rtk npx wrangler secret put RESEND_WEBHOOK_SECRET --config workers/reporting/wrangler.jsonc
   ```

   Secret creation may offer to create the missing Worker: accept only for `0db-reporting` after checking account selection. No `CLOUDFLARE_API_TOKEN`, `REPORTING_SECRETS_JSON` or old-product secret bundle is needed for this manual handoff. `TURNSTILE_SITE_KEY`, `EMAIL_FROM`, quotas, repository and release identifiers are vars, not secrets.

5. Apply both migrations to the new empty D1. For any later existing-database migration, first make a private backup, verify recovery and record its separate retention. Set `RELEASE` to the reviewed Git SHA. Keep `EMAIL_ENABLED=false`, `DELIVERY_ACTIVATED_AT=""`, `LOCAL_MODE=false` until controlled delivery checks. The deployment binds the custom domain and five-minute cron from this Worker config; the account must own the active `cojeev.com` zone. Do not edit the assets-only root config to add this backend.

   ```sh
   rtk npx wrangler d1 migrations apply 0db-reports --remote --config workers/reporting/wrangler.jsonc
   rtk npx wrangler deploy --config workers/reporting/wrangler.jsonc
   rtk curl --fail https://feedback-0db.cojeev.com/health
   rtk curl --fail https://feedback-0db.cojeev.com/v1/config
   ```

6. Configure GitHub's repository webhook: URL `https://feedback-0db.cojeev.com/v1/github/webhook`, content type JSON, issues events, the same `GITHUB_WEBHOOK_SECRET`. Configure Resend's webhook: `https://feedback-0db.cojeev.com/v1/resend/webhook`, events `email.sent`, `email.delivered`, `email.bounced`, `email.failed`, `email.complained`, `email.suppressed`; paste its signing secret in step 4. Confirm signed test events are accepted. Generic GitHub references link to the future 0dB `/feedback-admin/` page; no private prose goes to GitHub. Releasing a request requires close-as-completed, label `feedback:released`, and `Component: https://0db.cojeev.com/docs/<slug>/` in the issue body. Closing alone sends no release message.

7. Coordinate with the UI job before public activation. The site CSP in `public/_headers` needs `connect-src https://feedback-0db.cojeev.com` and the official Turnstile script/frame origins; this job intentionally does not edit it. Finish UI review, capture consent, private admin access and deletion contact. Set `DELIVERY_ACTIVATED_AT=<current-UTC-ISO-timestamp>` and `EMAIL_ENABLED=true`; redeploy the Worker. Jobs from before that cutoff remain held until individually reviewed. Test a controlled private issue/request, identical retry, upload, receipt and actual signed email-delivered event; inspect the separate provider states before public launch. Production receipt URLs never contain tokens.

## Delivery, quotas and health

Five-minute cron drains at most 20 enabled jobs and cleans up technical data for at most 100 aged reports. Every report is stored before delivery. Missing configuration says setup required. Uncertain sends and expired processing leases require review; never call provider acceptance email delivery. Exact Resend payload and `0db/<job-id>` idempotency key are persisted before a call. After 24 hours from first email attempt, provider reconciliation is required; retry endpoint returns 409. Reconcile in GitHub/Resend before using an admin retry. Changing branding/sender during a pending send intentionally prevents payload drift under the same key.

Committed 0dB limits are **20 email attempts/day and 500/month**, UTC, with hard ceilings of 100/day and 3,000/month. These are local service budgets, not reservations of shared Resend account capacity. Lower them if other products consume the allowance; provider 429 keeps the job pending. Every attempted/uncertain call counts conservatively. Public `/health` shows identity only; `GET /v1/admin/health` accepts `HEALTH_TOKEN` for queue/usage inspection but gives no report/media/mutation access. Never log bearer headers, report bodies, recipient addresses or raw provider errors.

Normal cron removes media/filenames/manifests/pins/diagnostics at 30 days, and private text/email/references/exact email payloads at 180 days. Approved public topic titles, hashes and delivery/email-event metadata remain. Monitor backlog and cron success; outages can delay removal. Keep provider copies and backups under separate retention policies.

## Deletion procedure

There is no public deletion endpoint. This is a maintainer-assisted complete deletion procedure, not the 30/180-day field scrub. Before launch, publish the working `hello@0db.cojeev.com` contact via the UI/privacy job. Do not request a receipt token over public channels. Verify the request through the original email or private possession of a receipt. Scope all matching report UUIDs, including other kinds/joins from that contact, and whether public content must be removed. UUID placeholders below must be validated UUIDs, not arbitrary SQL text.

1. Temporarily quiesce this Worker only. Save a private copy of `workers/reporting/wrangler.jsonc`, then temporarily set `routes: []` and `triggers: { "crons": [] }`, keeping `workers_dev: false` and `preview_urls: false`. Deploy that configuration; it removes this Worker's public custom-domain ingress and cron. Verify the domain no longer serves `/health` and verify the dashboard shows no cron or alternative route/service binding into this Worker. Merely blanking credentials does not cancel a provider request already in flight. Allow at least five minutes after ingress/cron removal, and verify no processing leases remain; reconcile any outstanding provider operation before deletion. This wait is an operational bound, not cancellation of an in-flight request: inspect Worker invocation metrics and continue waiting if activity remains. Do not pause another product's service. Record only affected UUIDs and provider IDs in a restricted deletion ledger, never report prose or receipt tokens. Inspect the target's attachment object keys, topic ID, GitHub issue ID and outbox provider IDs before deleting rows:

   ```sh
   rtk npx wrangler deploy --config workers/reporting/wrangler.jsonc
   rtk curl --fail https://feedback-0db.cojeev.com/health
   # The health request must no longer return this Worker's successful response.
   rtk npx wrangler d1 execute 0db-reports --remote --config workers/reporting/wrangler.jsonc --command "SELECT id,lease_until FROM outbox WHERE state='processing';"
   rtk npx wrangler d1 execute 0db-reports --remote --config workers/reporting/wrangler.jsonc --command "SELECT id,topic_id,issue_number FROM reports WHERE id='<REPORT_UUID>'; SELECT object_key FROM attachments WHERE report_id='<REPORT_UUID>'; SELECT id,provider_id,state FROM outbox WHERE report_id='<REPORT_UUID>';"
   ```

2. Delete every R2 key from the manifest. Also inspect for orphan objects with prefix `<REPORT_UUID>/` using the R2 dashboard/S3 client; repeat interrupted deletions. No reports' media share keys. For each file:

   ```sh
   rtk npx wrangler r2 object delete 0db-report-media/<REPORT_UUID>/<FILE_UUID> --remote --config workers/reporting/wrangler.jsonc
   ```

3. Put this SQL in a private temporary `<deletion.sql>` file, replace the report UUID and its previously recorded `<TOPIC_UUID>` for each affected report (use an empty string for a bug with no topic), then execute it against **0db-reports**. Preserve shared topics but retire the deleted report's private title/key; remove unreferenced topics. If an approved public title contains the person's information, separately clear `public_title` after reviewing the affected topic. Normal deletion of a contribution removes its demand hash/count too.

   ```sql
   DELETE FROM email_events WHERE provider_id IN (SELECT provider_id FROM outbox WHERE report_id='<REPORT_UUID>' AND provider_id IS NOT NULL);
   DELETE FROM email_attempts WHERE job_id IN (SELECT id FROM outbox WHERE report_id='<REPORT_UUID>');
   DELETE FROM attachments WHERE report_id='<REPORT_UUID>';
   DELETE FROM outbox WHERE report_id='<REPORT_UUID>';
   DELETE FROM reports WHERE id='<REPORT_UUID>';
   UPDATE topics SET title='[Deleted request]',title_key='deleted:'||id WHERE id='<REPORT_UUID>';
   DELETE FROM topics WHERE id='<TOPIC_UUID>' AND NOT EXISTS (SELECT 1 FROM reports WHERE topic_id=topics.id);
   ```

   ```sh
   rtk npx wrangler d1 execute 0db-reports --remote --config workers/reporting/wrangler.jsonc --file <deletion.sql>
   rtk npx wrangler d1 execute 0db-reports --remote --config workers/reporting/wrangler.jsonc --command "SELECT count(*) AS reports_remaining FROM reports WHERE id='<REPORT_UUID>'; SELECT count(*) AS media_remaining FROM attachments WHERE report_id='<REPORT_UUID>'; SELECT count(*) AS jobs_remaining FROM outbox WHERE report_id='<REPORT_UUID>';"
   ```

4. Remove provider copies separately. Delete the linked GitHub issue (and project entry if present), request/perform Resend deletion according to its available controls/support, and remove any mailbox copies under owner control. Record provider confirmation or the remaining provider retention period; do not claim complete provider erasure without evidence. The recipient controls their own mailbox/receipt downloads. Remove known associated GitHub replay IDs from `webhook_events` when available; generic replay IDs and unlinked provider-event rows contain metadata rather than a contact address and normally follow their documented retention. Quiescing webhooks prevents late events recreating deleted email metadata during the procedure.

   ```sh
   rtk gh issue delete <ISSUE_NUMBER> --repo <owner>/<0db-feedback-repository> --yes
   ```

5. Verify R2 objects are absent and D1 row/counts are zero before restoring ingress. Restore the saved configuration (including the original delivery activation cutoff) and deploy it; verify the domain and five-minute cron are restored. Then verify old receipt reads return 404, public request demand/title reflects removal, and unrelated/shared reports still work. Ask the requester to clear local drafts (`deleteDraft()` or browser storage for 0dB) and their receipt/download files. Remove private temporary SQL/exports per the owner's storage policy. Track owner exports/provider backups separately; apply the deletion ledger **before** reopening any restored database. Confirm completion with honest provider/backup limits.

   ```sh
   rtk npx wrangler deploy --config workers/reporting/wrangler.jsonc
   rtk curl --fail https://feedback-0db.cojeev.com/health
   ```

## Changes and rollback

Run focused tests plus independent review for storage/security/release changes. Before later schema migrations, verify a private backup and restoration process. Roll back application versions without losing receipts or blindly resending uncertain jobs. A rollback/restore must preserve delivery activation controls, replay safeguards and the deletion ledger. Deployment, remote migrations and provider sends require the owner's separate release action; they were not performed by this implementation job.
