"use client"

import * as React from "react"

import { DatePicker } from "@/registry/0nlytype/ui/date-picker"
import { Field } from "@/registry/0nlytype/ui/field"
import { State } from "@/components/site/state"

export default function Example() {
  const [due, setDue] = React.useState<Date>()
  return (
    <div className="grid w-full max-w-md gap-10">
      <p className="ot-mp">
        The call is on <DatePicker aria-label="Day of the call" disablePast />.
      </p>
      <Field label="Deliver the brief by" hint={due ? "We'll send the reminder the day before." : "Pick the day Halden's brief is due."}>
        <DatePicker placeholder="choose a day" disablePast value={due} onValueChange={setDue} />
      </Field>
      <DatePicker label="Present the identity on" placeholder="choose a day" variant="ruler" />
      <DatePicker label="Hold the review on" placeholder="choose a day" variant="ghost" />
      <DatePicker label="Take the week off from" placeholder="choose a day" variant="parenthesis" disablePast />
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><DatePicker aria-label="Day" /></State>
      <State label="Hover"><DatePicker aria-label="Day" data-force="hover" /></State>
      <State label="Focus"><DatePicker aria-label="Day" data-force="focus" /></State>
      <State label="Chosen"><DatePicker aria-label="Day" defaultValue={new Date(2026, 9, 1)} /></State>
      <State label="Disabled"><DatePicker aria-label="Day" defaultValue={new Date(2026, 9, 1)} disabled /></State>
    </>
  )
}
