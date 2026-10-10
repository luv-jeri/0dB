"use client"

import * as React from "react"

import { Calendar } from "@/registry/0nlytype/ui/calendar"
import { State } from "@/components/site/state"

const longDay = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" })

// The four share the chosen day, so you can compare how each draws it.
export default function Example() {
  const [day, setDay] = React.useState<Date>()
  return (
    <div className="grid w-full gap-8">
      <p id="calendar-lead">Pick a day for a first call.</p>
      <div className="grid gap-4">
        <span className="db-label">dots</span>
        <Calendar disablePast value={day} onValueChange={setDay} aria-labelledby="calendar-lead" />
      </div>
      <div className="mt-8 grid gap-4">
        <span className="db-label">ruler</span>
        <Calendar variant="ruler" disablePast value={day} onValueChange={setDay} aria-labelledby="calendar-lead" />
      </div>
      <div className="mt-8 grid gap-4">
        <span className="db-label">ghost</span>
        <Calendar variant="ghost" disablePast value={day} onValueChange={setDay} aria-labelledby="calendar-lead" />
      </div>
      <div className="mt-8 grid gap-4">
        <span className="db-label">parenthesis</span>
        <Calendar variant="parenthesis" disablePast value={day} onValueChange={setDay} aria-labelledby="calendar-lead" />
      </div>
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

// A fixed today (16 September) and a chosen day (24 September), so every state shows at once:
// the days gone, today, the wait, yours and the days to come.
const today = new Date(2026, 8, 16)
const chosen = new Date(2026, 8, 24)
const october = new Date(2026, 9, 1)
const dots = "w-[22rem] max-w-full"
const ruler = "w-[36rem] max-w-full"

export function States() {
  return (
    <>
      <State label="dots: gone, today, the wait, yours, to come">
        <Calendar today={today} defaultValue={chosen} disablePast className={dots} />
      </State>
      <State label="dots: chosen today">
        <Calendar today={today} defaultValue={today} className={dots} />
      </State>
      <State label="dots, pointed at the 1st">
        <Calendar today={today} defaultMonth={october} data-force="hover" className={dots} />
      </State>
      <State label="dots, focus on the 1st">
        <Calendar today={today} defaultMonth={october} data-force="focus" className={dots} />
      </State>
      <State label="ruler: gone, today, the wait, yours, to come">
        <Calendar variant="ruler" today={today} defaultValue={chosen} disablePast className={ruler} />
      </State>
      <State label="ruler: the wait, run on from September">
        <Calendar variant="ruler" today={today} defaultValue={new Date(2026, 9, 9)} defaultMonth={october} className={ruler} />
      </State>
      <State label="ruler, pointed at the 1st">
        <Calendar variant="ruler" today={today} defaultMonth={october} data-force="hover" className={ruler} />
      </State>
      <State label="ghost: gone, today, yours, to come">
        <Calendar variant="ghost" today={today} defaultValue={chosen} disablePast className={dots} />
      </State>
      <State label="ghost: nothing chosen, today behind">
        <Calendar variant="ghost" today={today} className={dots} />
      </State>
      <State label="ghost, pointed at the 1st">
        <Calendar variant="ghost" today={today} defaultMonth={october} data-force="hover" className={dots} />
      </State>
      <State label="parenthesis: gone, (today, the wait, yours), to come">
        <Calendar variant="parenthesis" today={today} defaultValue={chosen} disablePast className={dots} />
      </State>
      <State label="parenthesis: run on from September, closing on the 9th">
        <Calendar variant="parenthesis" today={today} defaultValue={new Date(2026, 9, 9)} defaultMonth={october} className={dots} />
      </State>
      <State label="parenthesis, pointed at the 1st">
        <Calendar variant="parenthesis" today={today} defaultMonth={october} data-force="hover" className={dots} />
      </State>
    </>
  )
}
