"use client"

import * as React from "react"

import { State } from "@/components/site/state"
import { AgentState, type AgentStateValue } from "@/registry/0nlytype/ui/agent-state"
import { Button } from "@/registry/0nlytype/ui/button"

const order: AgentStateValue[] = ["ready", "thinking", "working", "input", "done"]

// The agent's state comes from outside, as it would from a real agent; here the person moves it on.
export default function Example() {
  const [at, setAt] = React.useState(0)
  const state = order[at]
  return (
    <div className="grid justify-items-start gap-(--ot-space-6)">
      <AgentState state={state}>{state === "working" ? "Reading the brief" : undefined}</AgentState>
      <Button variant="quiet" onClick={() => setAt((n) => (n + 1) % order.length)}>
        {at === order.length - 1 ? "Start again" : "Next state"}
      </Button>
    </div>
  )
}

export function States() {
  return (
    <>
      {order.map((s) => (
        <State key={s} label={s[0].toUpperCase() + s.slice(1)}><AgentState state={s} /></State>
      ))}
      {order.map((s) => (
        <State key={`w-${s}`} label={`Word, ${s}`}><AgentState state={s} variant="word" /></State>
      ))}
      <State label="Thinking, right to left"><div dir="rtl" lang="ar"><AgentState state="thinking">يفكر</AgentState></div></State>
      <State label="Own words"><AgentState state="working">Reading the brief</AgentState></State>
    </>
  )
}
