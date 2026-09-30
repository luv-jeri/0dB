import type { Metadata } from "next"

import { FeedbackForms } from "@/components/site/reporting/forms"
import { entries } from "@/lib/site/entries"

export const metadata: Metadata = {
  title: "Feedback",
  description: "Report an issue or request a component for 0dB.",
}

export default function FeedbackPage() {
  const components = entries.map(({ meta }) => ({ name: meta.name, title: meta.title, description: meta.summary, contract: meta.contract }))
  return <FeedbackForms entries={components} />
}
