// ponytail: the Worker isn't provisioned yet. Set NEXT_PUBLIC_REPORTING_API_URL=https://feedback-0db.cojeev.com
// at build time once it is (docs/reporting/OPERATIONS.md); until then the client says so and nothing is fetched.
export { reportingFetch, submitReport, fetchReceipt, uploadAttachment } from "@/lib/reporting/client"
