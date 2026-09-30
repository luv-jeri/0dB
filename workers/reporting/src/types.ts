import type { D1Database, R2Bucket } from "@cloudflare/workers-types"
import type { ReportKind, ReportStatus } from "../../../lib/reporting/contracts"
export interface Env {
  DB: D1Database; MEDIA: R2Bucket
  ALLOWED_ORIGINS: string; SITE_URL: string; LOCAL_MODE?: string
  TURNSTILE_SITE_KEY?: string; TURNSTILE_SECRET?: string; IP_HASH_SECRET?: string
  ADMIN_TOKEN?: string; HEALTH_TOKEN?: string; GITHUB_TOKEN?: string; GITHUB_REPOSITORY?: string
  GITHUB_PROJECT_ID?: string; GITHUB_WEBHOOK_SECRET?: string
  EMAIL_FROM?: string; EMAIL_ENABLED?: string
  RESEND_API_KEY?: string; RESEND_WEBHOOK_SECRET?: string
  ENVIRONMENT?: string; RELEASE?: string; DELIVERY_ACTIVATED_AT?: string
  EMAIL_DAILY_LIMIT?: string; EMAIL_MONTHLY_LIMIT?: string; BETA_TESTER_EMAILS?: string
}
export interface ReportRow {
  id: string; token_hash: string; payload_hash: string; kind: ReportKind
  title: string; description: string; email: string; contact_hash: string; references_json: string
  diagnostics_json: string | null; pins_json: string; topic_id: string | null
  status: ReportStatus; component_url: string | null
  issue_number: number | null; issue_node_id: string | null; issue_url: string | null
  created_at: number; updated_at: number; technical_purged: number; private_purged: number
}
export interface AttachmentRow { id: string; report_id: string; name: string; type: string; size: number; sha256: string; state: string; object_key: string }
export interface Delivery { id: string; report_id: string; kind: string; state: string; attempts: number; due_at: number; lease_until: number; lease_token: string | null; last_error: string | null; payload_json: string | null; first_attempt_at: number | null; reviewed_at: number | null; delivery_status: string; provider_id: string | null }
export const now = () => Date.now()
export const local = (env: Env) => env.LOCAL_MODE === "true"
export const emailEnabled = (env: Env) => env.EMAIL_ENABLED === "true" && !!env.RESEND_API_KEY && !!env.EMAIL_FROM && /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(env.EMAIL_FROM) && !env.EMAIL_FROM.endsWith(".invalid")
export const githubEnabled = (env: Env) => !!env.GITHUB_TOKEN && /^[\w.-]+\/[\w.-]+$/.test(env.GITHUB_REPOSITORY ?? "")
export const activationCutoff = (env:Env) => {const value=Date.parse(env.DELIVERY_ACTIVATED_AT??"");return Number.isFinite(value)&&value>0&&value<=now()?value:null;}
