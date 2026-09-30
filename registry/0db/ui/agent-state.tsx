"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { Marker } from "@/registry/0db/ui/marker"
import { Spinner } from "@/registry/0db/ui/spinner"

type AgentStateValue = "ready" | "thinking" | "working" | "input" | "done"

/** What each state says when no other words are given. */
const agentStateWords: Record<AgentStateValue, string> = {
  ready: "Ready",
  thinking: "Thinking",
  working: "Working",
  input: "Needs your input",
  done: "Done",
}

type AgentStateProps = Omit<React.ComponentProps<"p">, "children"> & {
  /**
   * Where the agent is. ready: a hairline ring, nothing started. thinking: the ring breathes. working: three
   * voices go round it. input: the one accent disc, your turn. done: the disc filled in ink, the word in pencil.
   * Only thinking and working move, and only while the caller says so.
   */
  state: AgentStateValue
  /** dot (the default): the mark before the word, after the calendar's discs. word: no mark; the word carries it. */
  variant?: "dot" | "word"
  /** Other words for the state ("Reading the brief"). Leave it out for the state's own word. */
  children?: string
}

/** Where an agent is, in one quiet line: a mark and a word. It moves only while the agent thinks or works. */
function AgentState({ state, variant = "dot", children, className, ...props }: AgentStateProps) {
  const word = children || agentStateWords[state]
  const busy = state === "thinking" || state === "working"
  // The mark lands only when the state changes, never on first paint.
  const [seen, setSeen] = React.useState(state)
  const [turned, setTurned] = React.useState(false)
  if (seen !== state) {
    setSeen(state)
    setTurned(true)
  }
  return (
    <Marker
      data-variant={variant === "dot" ? undefined : variant}
      data-state={state}
      data-turned={turned || undefined}
      role="status"
      aria-live="polite"
      aria-busy={busy || undefined}
      className={cn("db-agent", className)}
      {...props}
    >
      {variant === "dot" ? (
        <span key={state} className="db-agent-mark" aria-hidden="true">
          {state === "thinking" ? <Spinner variant="breath" /> : state === "working" ? <Spinner variant="round" /> : null}
        </span>
      ) : null}
      {variant === "word" && busy ? (
        <>
          <span className="db-sr">{word}</span>
          {/* The word spinner is always a status; here the line is, so its own role and voice are taken off. */}
          <Spinner variant="word" label={word} role={undefined} aria-live={undefined} aria-hidden="true" />
        </>
      ) : (
        <span className="db-agent-word">{word}</span>
      )}
    </Marker>
  )
}

export { AgentState, agentStateWords, type AgentStateProps, type AgentStateValue }
