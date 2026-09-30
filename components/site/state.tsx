import * as React from "react"

/** One cell of a states row in the docs: a small label over the item, pinned in that state. */
export function State({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="state">
      <span className="state-label">{label}</span>
      {children}
    </div>
  )
}
