"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"
import { Button } from "@/registry/0nlytype/ui/button"
import { useFieldControl, useLineOrigin } from "@/registry/0nlytype/ui/field"

/** What is typed in the group, so our words can agree with it. */
const GroupValue = React.createContext("")

type InputGroupProps = React.ComponentProps<"div"> & {
  /**
   * How ours and yours share the line. line: prefix, your words, suffix, in reading order. legend: your figure large,
   * with our words stacked beside it in two small lines. arrow: a hairline arrow runs from your words to the action,
   * and gives way as you write.
   */
  variant?: "line" | "legend" | "arrow"
  /** Pins a state for documentation ("focus"); set on the root. */
  "data-force"?: string
}

/** Ours and yours on one line. Put text, the input and an action inside; the accent draws only under your part. */
function InputGroup({ className, variant = "line", onInput, onPointerDown, children, ref: forwardedRef, ...props }: InputGroupProps) {
  const root = React.useRef<HTMLDivElement>(null)
  const composedRef = useComposedRefs(root, forwardedRef)
  const [value, setValue] = React.useState("")
  React.useLayoutEffect(() => setValue(root.current?.querySelector("input")?.value ?? ""), [])
  return (
    <div
      ref={composedRef}
      data-slot="input-group"
      data-variant={variant}
      data-filled={value ? "" : undefined}
      className={cn("db-input-group", className)}
      onInput={(e) => {
        onInput?.(e)
        if (e.target instanceof HTMLInputElement) setValue(e.target.value)
      }}
      // The whole line is the field: a touch on its empty part writes in the input.
      onPointerDown={(e) => {
        onPointerDown?.(e)
        const input = e.currentTarget.querySelector("input")
        if (e.target === e.currentTarget && input && !input.disabled) {
          e.preventDefault()
          input.focus()
        }
      }}
      {...props}
    >
      <GroupValue.Provider value={value}>{children}</GroupValue.Provider>
    </div>
  )
}

type InputGroupTextProps = React.ComponentProps<"span"> & {
  /** Forms of a unit that agree with the number typed, by plural category: { one: "night", other: "nights" }. */
  agree?: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }
}

/** What we supply: a prefix or suffix, upright in pencil. With `agree`, it agrees with your number. */
function InputGroupText({ className, agree, children, ...props }: InputGroupTextProps) {
  const value = React.useContext(GroupValue)
  // Nothing typed (and the server's render) takes "other", so the page's locale can't change the first paint.
  const form = value ? new Intl.PluralRules().select(Number(value.replace(/[^\d.-]/g, "")) || 0) : "other"
  const unit = agree ? (agree[form] ?? agree.other) : null
  return (
    <span data-slot="input-group-text" className={cn("db-input-group-text", className)} {...props}>
      {unit}
      {unit && children ? " " : null}
      {children}
    </span>
  )
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

export { InputGroup, InputGroupText, InputGroupInput, InputGroupButton, type InputGroupProps, type InputGroupTextProps }
