"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type SwitchProps = Omit<React.ComponentProps<"input">, "type" | "role" | "children" | "onChange"> & {
  /** The sentence, up to its last word: "Email me when someone replies:". */
  children: React.ReactNode
  onCheckedChange?: (checked: boolean) => void
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
function Switch({ children, onCheckedChange, on = "on", off = "off", className, labelClassName, "data-force": force, ...props }: SwitchProps) {
  return (
    <label data-slot="switch" data-force={force} className={cn("db-switch", labelClassName)}>
      <input type="checkbox" role="switch" className={className} onChange={(e) => onCheckedChange?.(e.target.checked)} {...props} />
      {children}{" "}
      <span className="db-switch-state" aria-hidden="true">
        <span>{on}</span>
        <span>{off}</span>
      </span>
      <span className="db-switch-stop" aria-hidden="true" />
    </label>
  )
}

export { Switch, type SwitchProps }
