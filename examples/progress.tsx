"use client"

import * as React from "react"

import { Button } from "@/registry/0nlytype/ui/button"
import { Progress } from "@/registry/0nlytype/ui/progress"
import { State } from "@/components/site/state"

const FILES = 12
type Phase = "ready" | "preparing" | "uploading" | "done"

// The action keeps its name all the way through: upload, uploading, uploaded.
const words: Record<Phase, [string, string, string]> = {
  ready: ["12 photographs ready to upload", "Twelve photographs from", "Photographs to upload"],
  preparing: ["Preparing 12 photographs", "Preparing twelve photographs from", "Preparing photographs"],
  uploading: ["Uploading 12 photographs", "Uploading twelve photographs from", "Uploading photographs"],
  done: ["Uploaded 12 photographs", "Uploaded twelve photographs from", "Uploaded photographs"],
}

// One upload, told five ways. It prepares while nobody knows how long it will take, then uploads, then says it's done.
export default function Example() {
  const [phase, setPhase] = React.useState<Phase>("ready")
  const [p, setP] = React.useState(0)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const upload = () => {
    setPhase("preparing")
    setP(0)
    timer.current = setTimeout(() => {
      setPhase("uploading")
      let v = 0
      const step = () => {
        v = Math.min(1, v + 0.006 + Math.random() * 0.03)
        setP(v)
        if (v < 1) timer.current = setTimeout(step, 120)
        else setPhase("done")
      }
      step()
    }, 1800)
  }

  const value = phase === "preparing" ? null : p
  const [short, long, counted] = words[phase]
  const busy = phase === "preparing" || phase === "uploading"
  return (
    <div className="grid w-[min(36rem,100%)] justify-items-start gap-(--db-space-7)">
      <div className="grid w-full gap-4">
        <span className="db-label">hairline</span>
        <Progress value={value === null ? null : value * 100} label={short} />
      </div>
      <div className="grid w-full gap-4">
        <span className="db-label">sentence</span>
        <Progress
          variant="sentence"
          value={value === null ? null : value * 100}
          label={
            <>
              {long} <span className="db-yours">Lisbon, in April</span>
            </>
          }
        />
      </div>
      <div className="grid w-full gap-4">
        <span className="db-label">count</span>
        <Progress variant="count" value={value === null ? null : Math.floor(value * FILES)} max={FILES} label={counted} />
      </div>
      <div className="grid w-full gap-4">
        <span className="db-label">parentheses</span>
        <Progress variant="parentheses" value={value === null ? null : value * 100} label={short} />
      </div>
      <div className="grid w-full gap-4">
        <span className="db-label">tally</span>
        <Progress variant="tally" value={value === null ? null : Math.floor(value * FILES)} max={FILES} label={counted} />
      </div>
      <Button disabled={busy} onClick={upload}>
        {phase === "done" ? "Upload again" : "Upload"}
      </Button>
    </div>
  )
}

export function States() {
  const w = { width: "16rem" }
  return (
    <>
      <State label="Hairline, not started"><Progress value={0} label="Upload" style={w} /></State>
      <State label="Halfway"><Progress value={50} label="Uploading" style={w} /></State>
      <State label="Done"><Progress value={100} label="Uploaded" style={w} /></State>
      <State label="Unknown"><Progress label="Preparing" style={w} /></State>
      <State label="Sentence, not started"><Progress variant="sentence" value={0} label="Filing the invoices" style={w} /></State>
      <State label="Halfway"><Progress variant="sentence" value={50} label="Filing the invoices" style={w} /></State>
      <State label="Done"><Progress variant="sentence" value={100} label="Filed the invoices" style={w} /></State>
      <State label="Unknown"><Progress variant="sentence" label="Filing the invoices" style={w} /></State>
      <State label="Count, not started"><Progress variant="count" value={0} max={8} label="Send" style={w} /></State>
      <State label="Halfway"><Progress variant="count" value={4} max={8} label="Sending" style={w} /></State>
      <State label="Done"><Progress variant="count" value={8} max={8} label="Sent" style={w} /></State>
      <State label="Unknown"><Progress variant="count" max={8} label="Preparing" style={w} /></State>
      <State label="Parentheses, not started"><Progress variant="parentheses" value={0} label="Export" style={w} /></State>
      <State label="Halfway"><Progress variant="parentheses" value={50} label="Exporting" style={w} /></State>
      <State label="Done"><Progress variant="parentheses" value={100} label="Exported" style={w} /></State>
      <State label="Unknown"><Progress variant="parentheses" label="Preparing" style={w} /></State>
      <State label="Tally, not started"><Progress variant="tally" value={0} max={12} label="Sign" style={w} /></State>
      <State label="Seven of twelve"><Progress variant="tally" value={7} max={12} label="Signing" style={w} /></State>
      <State label="Done"><Progress variant="tally" value={12} max={12} label="Signed" style={w} /></State>
      <State label="Unknown"><Progress variant="tally" max={12} label="Preparing" style={w} /></State>
    </>
  )
}
