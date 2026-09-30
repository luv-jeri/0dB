import type { Receipt } from "./contracts"

// The provider's own vocabulary. `accepted` means Resend took the request and returned an id
// only a signed `delivered` event promotes the receipt's `email` field to "sent".
const DELIVERY_LABELS: Record<string, string> = {
  held: "Held pending delivery activation or review",
  queued: "Waiting to be sent",
  sending: "Being sent now",
  accepted: "Accepted by the email provider, delivery not confirmed yet",
  quota: "Waiting for the sending limit to reset",
  uncertain: "The provider response was unclear and will be checked before retrying",
}

// The outbox's own vocabulary for the GitHub job. `pending` here means configured and waiting
// `held` means activation or historical review is outstanding, which the `issue` enum reports as pending too.
const ISSUE_LABELS: Record<string, string> = {
  held: "Held pending delivery activation or review",
  pending: "Waiting to be created",
  processing: "Being created now",
}

/** Honest wording for the issue state. Held, unconfigured and unknown jobs are never called queued. */
export function issueReceiptLabel(receipt: Pick<Receipt, "issue" | "issueDelivery">): string {
  if (receipt.issue === "created") return "Created"
  if (receipt.issue === "setup_required") return "Issue tracker is not connected yet"
  if (receipt.issue === "needs_review") return "Needs maintainer review"
  return ISSUE_LABELS[receipt.issueDelivery ?? ""] ?? "Not created yet"
}

/** Honest wording for the email state. An unknown or missing provider state says only what is certain. */
export function emailReceiptLabel(receipt: Pick<Receipt, "email" | "emailDelivery">): string {
  if (receipt.email === "sent") return "Delivered"
  if (receipt.email === "setup_required") return "Email is not connected yet"
  if (receipt.email === "needs_review") return "Delivery needs maintainer review"
  return DELIVERY_LABELS[receipt.emailDelivery ?? ""] ?? "Not delivered yet"
}
