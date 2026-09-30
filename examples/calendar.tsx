"use client"

import * as React from "react"

import { Calendar } from "@/registry/0db/ui/calendar"

const longDay = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" })

export default function Example() {
  const [day, setDay] = React.useState<Date>()
  return (
    <div className="grid" style={{ gap: "var(--db-space-5)" }}>
      <p id="calendar-lead">Pick a day for a first call.</p>
      <Calendar disablePast onValueChange={setDay} aria-labelledby="calendar-lead" />
      <p aria-live="polite">
        {day ? (
          <>
            Your first call: <span className="db-yours">{longDay.format(day)}</span>.
          </>
        ) : (
          "No day chosen yet."
        )}
      </p>
    </div>
  )
}
