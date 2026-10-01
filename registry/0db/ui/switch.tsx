"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type SwitchProps = Omit<React.ComponentProps<"input">, "type" | "role" | "children" | "onChange"> & {
  /** The sentence, up to its last word: "Email me when someone replies:". */
  children: React.ReactNode
  onCheckedChange?: (checked: boolean) => void
  /**
   * sentence: the last word rolls between on and off, and the full stop is a dot or a ring.
   * either: both words stand, "on / off", and the one that doesn't apply is struck out, as a printed form asks.
   * question: off, the sentence asks, ending in a question mark; on, the hook lifts away and leaves its dot, a full stop.
   * For question, pass the sentence without its last mark.
   */
  variant?: "sentence" | "either" | "question"
  /** The word for on, in italic. */
  on?: string
  /** The word for off. */
  off?: string
  /** Classes for the label, which is the root. className goes to the input. */
  labelClassName?: string
  /** Pins a state for documentation ("hover", "focus"); set on the root. */
  "data-force"?: string
}

/**
 * A sentence whose last word you can change. The state word rolls between on and
 * off in italic, and the full stop answers: a dot when on, a ring when off.
 * A native checkbox with the switch role, so Space toggles it.
 */
function Switch({ children, variant = "sentence", onCheckedChange, on = "on", off = "off", className, labelClassName, "data-force": force, ...props }: SwitchProps) {
  return (
    <label data-slot="switch" data-variant={variant} data-force={force} className={cn("db-switch", labelClassName)}>
      <input type="checkbox" role="switch" className={className} onChange={(e) => onCheckedChange?.(e.target.checked)} {...props} />
      {variant === "question" ? (
        <>
          {children}
          <span className="db-switch-ask" aria-hidden="true">
            <span>.</span>
            <span>?</span>
          </span>
        </>
      ) : variant === "either" ? (
        <>
          {children}{" "}
          <span className="db-switch-either" aria-hidden="true">
            <span>{on}</span>
            <span className="db-switch-or">/</span>
            <span>{off}</span>
          </span>
        </>
      ) : (
        <>
          {children}{" "}
          <span className="db-switch-state" aria-hidden="true">
            <span>{on}</span>
            <span>{off}</span>
          </span>
          <span className="db-switch-stop" aria-hidden="true" />
        </>
      )}
    </label>
  )
}

export { Switch, type SwitchProps }
