"use client"

import * as React from "react"

import { Button } from "@/registry/0nlytype/ui/button"
import { Step, StepTitle, Steps, type StepsProps } from "@/registry/0nlytype/ui/steps"
import { State } from "@/components/site/state"

const STEPS = [
  ["Share the brief", "A paragraph on what you're making and who it's for."],
  ["Agree the scope", "We send back what we'll make, and what we won't."],
  ["Book a first call", "Forty minutes, cameras optional."],
]

function Sequence({ variant, at, go }: { variant: StepsProps["variant"]; at: number; go: (n: number) => void }) {
  return (
    <Steps variant={variant} value={at} onValueChange={go}>
      {STEPS.map(([title, text]) => (
        <Step key={title}>
          <StepTitle>{title}</StepTitle>
          <p>{text}</p>
        </Step>
      ))}
    </Steps>
  )
}

export default function Example() {
  const [at, setAt] = React.useState(2)
  return (
    <div className="grid gap-y-10">
      <div className="flex gap-x-6">
        <Button variant="quiet" disabled={at === 1} onClick={() => setAt(at - 1)}>Back a step</Button>
        <Button variant="quiet" disabled={at === STEPS.length} onClick={() => setAt(at + 1)}>Next step</Button>
      </div>
      {(["margin", "rise", "cascade", "folio"] as const).map((v) => (
        <div key={v} className="grid gap-y-4">
          <span className="db-label">{v}</span>
          <Sequence variant={v} at={at} go={setAt} />
        </div>
      ))}
    </div>
  )
}

export function States() {
  const short = (variant: StepsProps["variant"], at: number) => (
    <Steps variant={variant} value={at} style={{ width: variant === "rise" ? "20rem" : "16rem", maxWidth: "100%" }}>
      {["Brief", "Scope", "Call"].map((t) => (
        <Step key={t}><StepTitle>{t}</StepTitle></Step>
      ))}
    </Steps>
  )
  return (
    <>
      <State label="margin, second">{short("margin", 2)}</State>
      <State label="rise, first">{short("rise", 1)}</State>
      <State label="rise, last">{short("rise", 3)}</State>
      <State label="cascade, first">{short("cascade", 1)}</State>
      <State label="cascade, last">{short("cascade", 3)}</State>
      <State label="folio, second">{short("folio", 2)}</State>
      <State label="folio, all done">{short("folio", 4)}</State>
    </>
  )
}
