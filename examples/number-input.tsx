"use client"

import * as React from "react"

import { Field } from "@/registry/0nlytype/ui/field"
import { NumberInput } from "@/registry/0nlytype/ui/number-input"
import { State } from "@/components/site/state"

export default function Example() {
  const [fee, setFee] = React.useState<number | null>(1250)
  return (
    <div className="grid w-full max-w-md gap-(--db-space-8)">
      <Field label="Guests" hint="Up to twelve at the long table.">
        <NumberInput defaultValue={4} min={1} max={12} unit={{ one: "guest", other: "guests" }} name="guests" />
      </Field>
      <Field label="Fee for the second round" error={fee !== null && fee < 400 ? "Raise it to at least €400; the brief asks for two rounds of marks." : undefined}>
        <NumberInput value={fee} onValueChange={setFee} min={0} step={50} format={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }} />
      </Field>
      <Field label="Line height">
        <NumberInput variant="scale" defaultValue={1.45} min={1} max={2} step={0.01} />
      </Field>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Empty"><Field label="Copies" className="w-72"><NumberInput min={1} placeholder="How many" /></Field></State>
      <State label="Rest"><Field label="Copies" className="w-72"><NumberInput defaultValue={12} min={1} unit="copies" /></Field></State>
      <State label="Focus"><Field label="Copies" className="w-72"><NumberInput defaultValue={12} min={1} unit="copies" data-force="focus" /></Field></State>
      <State label="At the end"><Field label="Copies" className="w-72"><NumberInput defaultValue={1} min={1} unit="copy" /></Field></State>
      <State label="Error"><Field label="Copies" error="Print at least 50." className="w-72"><NumberInput defaultValue={12} min={1} /></Field></State>
      <State label="Disabled"><Field label="Copies" className="w-72"><NumberInput defaultValue={12} disabled /></Field></State>
      <State label="scale, rest"><Field label="Tracking" className="w-64"><NumberInput variant="scale" defaultValue={-12} min={-80} max={80} /></Field></State>
      <State label="scale, focus"><Field label="Tracking" className="w-64"><NumberInput variant="scale" defaultValue={-12} min={-80} max={80} data-force="focus" /></Field></State>
    </>
  )
}
