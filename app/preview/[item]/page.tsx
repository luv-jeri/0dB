import { notFound } from "next/navigation"

import { entries } from "@/lib/site/entries"

// A bare preview of one item: its example, then its states. The docs page builds on this.
export function generateStaticParams() {
  return entries.map((e) => ({ item: e.meta.name }))
}

export default async function Preview({ params }: { params: Promise<{ item: string }> }) {
  const { item } = await params
  const entry = entries.find((e) => e.meta.name === item)
  if (!entry) notFound()
  const { default: Example } = entry.example
  const States = "States" in entry.example ? (entry.example.States as React.ComponentType) : null
  return (
    <main style={{ padding: "var(--db-space-7) var(--db-margin)", display: "grid", gap: "var(--db-space-7)" }}>
      <h1 className="db-ff">{entry.meta.title}</h1>
      <p className="db-mp" style={{ maxWidth: "var(--db-measure)" }}>{entry.meta.summary}</p>
      <div className="db-corners" style={{ padding: "var(--db-space-7)" }}>
        <Example />
      </div>
      {States ? (
        <div className="spec-states" inert>
          <States />
        </div>
      ) : null}
    </main>
  )
}
