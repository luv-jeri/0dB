import type { Metadata } from "next"

import { RequestBoard } from "@/components/site/reporting/request-board"

export const metadata: Metadata = {
  title: "Component requests",
  description: "Find a component request, join it, or suggest what 0dB should build next.",
}

export default function RequestsPage() {
  return <RequestBoard />
}
