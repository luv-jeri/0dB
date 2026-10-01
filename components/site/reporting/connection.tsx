// The client defaults to https://feedback.thedirectors.agency. Override the build-time URL
// for local checks as documented in docs/reporting/OPERATIONS.md.
export { reportingFetch, submitReport, fetchReceipt, uploadAttachment } from "@/lib/reporting/client"
