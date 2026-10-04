"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type MaskedValueProps = Omit<React.ComponentProps<"span">, "children"> & {
  label: string
  value: string
  revealed?: boolean
  defaultRevealed?: boolean
  onRevealedChange?: (revealed: boolean) => void
  mask?: string
  revealLabel?: string
  hideLabel?: string
  buttonProps?: Omit<React.ComponentProps<"button">, "children" | "type" | "aria-expanded" | "aria-controls">
}

/** Screen privacy: closed, the reading isn't rendered. This is not storage or access control. */
function MaskedValue({ label, value, revealed: controlled, defaultRevealed = false, onRevealedChange, mask = "Not shown", revealLabel = "Reveal", hideLabel = "Hide", buttonProps, className, id, ...props }: MaskedValueProps) {
  const generated = React.useId()
  const valueId = `${id ?? generated}-value`
  const [open, setOpen] = React.useState(defaultRevealed)
  const revealed = controlled ?? open
  const [previous, setPrevious] = React.useState(revealed)
  const [acted, setActed] = React.useState(false)
  if (previous !== revealed) { setPrevious(revealed); setActed(true) }
  return <span {...props} id={id} data-slot="masked-value" data-revealed={revealed ? "" : undefined} data-acted={acted ? "" : undefined} className={cn("db-masked", className)}>
    <span data-slot="masked-value-label" className="db-masked-label">{label}</span>
    <span data-slot="masked-value-reading" id={valueId} className="db-masked-reading">{revealed ? <bdi className="db-yours db-reading">{value}</bdi> : mask}</span>
    <button {...buttonProps} type="button" data-slot="masked-value-trigger" className={cn("db-masked-trigger", buttonProps?.className)} aria-expanded={revealed} aria-controls={valueId} aria-label={buttonProps?.["aria-label"] ?? `${revealed ? hideLabel : revealLabel} ${label}`} onClick={(e) => {
      buttonProps?.onClick?.(e)
      if (e.defaultPrevented) return
      if (controlled === undefined) setOpen(!revealed)
      onRevealedChange?.(!revealed)
    }}>{revealed ? hideLabel : revealLabel}</button>
  </span>
}

export { MaskedValue, type MaskedValueProps }
