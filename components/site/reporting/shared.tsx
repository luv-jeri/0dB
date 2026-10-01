import { siteURL } from "@/lib/site/config.mjs"
import type { ReportKind, ReportStatus, RequestTopic } from "@/lib/reporting/contracts"
import { Link } from "@/registry/0db/ui/link"

export const STATUS_LABELS: Record<ReportStatus, string> = {
  received: "Received",
  planned: "Planned",
  in_progress: "In progress",
  resolved: "Resolved",
  declined: "Not planned",
}

export const message = (cause: unknown) => cause instanceof Error ? cause.message : "We couldn’t complete that action. Your words are still here."
export const uploaded = (state: string) => state === "uploaded" || state === "ready"

export function requestHref(topic?: RequestTopic, title = "") {
  const query = new URLSearchParams({ kind: "request", ...(topic ? { topic: topic.id, title: topic.title } : title ? { title } : {}) })
  return `/feedback/?${query}`
}

/** Server-supplied links remain data, never executable URLs. */
export function publicLink(value?: string | null) {
  if (!value) return undefined
  try {
    const url = new URL(value.startsWith("/") ? siteURL(value) : value, siteURL("/"))
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? url.href : undefined
  } catch { return undefined }
}

export function githubIssueHref(kind: ReportKind, title: string, description: string) {
  const query = new URLSearchParams({
    title: title.trim() || (kind === "bug" ? "Issue with 0dB" : "Component request for 0dB"),
    body: `## ${kind === "bug" ? "Issue" : "Component request"}\n\n${description.trim() || "Describe what you would like to share."}\n\n---\nSent from the 0dB feedback form.`,
  })
  return `https://github.com/luv-jeri/0dB/issues/new?${query}`
}

export function GitHubFallback({ kind, title, description }: { kind: ReportKind; title: string; description: string }) {
  return (
    <div className="db-report-fallback">
      <p>You can also open this on GitHub. Your title and details are filled in; add any files there.</p>
      <Link href={githubIssueHref(kind, title, description)} target="_blank" rel="noopener noreferrer">Open a GitHub issue</Link>
      <p className="db-report-note">GitHub issues are public. Your email and browser details are not included. Review the text before posting.</p>
    </div>
  )
}
