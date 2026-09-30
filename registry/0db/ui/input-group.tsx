"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { Button } from "@/registry/0db/ui/button"
import { useFieldControl, useLineOrigin } from "@/registry/0db/ui/field"

type InputGroupProps = React.ComponentProps<"div"> & {
  /** Pins a state for documentation ("focus"); set on the root. */
  "data-force"?: string
}

/** Ours and yours on one line. Put text, the input and an action inside; the accent draws only under your part. */
function InputGroup({ className, ...props }: InputGroupProps) {
  return <div data-slot="input-group" className={cn("db-input-group", className)} {...props} />
}

/** What we supply: a prefix or suffix, upright in pencil. */
function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="input-group-text" className={cn("db-input-group-text", className)} {...props} />
}

/** What you type, in italic. Takes the Field's id, hint and error when there is one. */
function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  const field = useFieldControl()
  const origin = useLineOrigin<HTMLInputElement>((el) => el.closest<HTMLElement>(".db-input-group") ?? el, props)
  return (
    <input
      data-slot="input-group-input"
      className={cn("db-input-group-input", className)}
      {...props}
      id={props.id ?? field.id}
      maxLength={props.maxLength ?? field.maxLength}
      aria-invalid={props["aria-invalid"] ?? field["aria-invalid"]}
      aria-describedby={props["aria-describedby"] ?? field["aria-describedby"]}
      {...origin}
    />
  )
}

/** An action at the end of the line, set as a quiet Button. */
function InputGroupButton({ className, variant = "quiet", ...props }: React.ComponentProps<typeof Button>) {
  return <Button data-slot="input-group-button" variant={variant} className={cn("db-input-group-button", className)} {...props} />
}

export { InputGroup, InputGroupText, InputGroupInput, InputGroupButton, type InputGroupProps }
