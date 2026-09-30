"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { roll } from "@/registry/0db/lib/roll"

type CheckboxProps = Omit<React.ComponentProps<"input">, "type"> & {
  /** The words are the control: checking strikes them through. */
  children: React.ReactNode
  /** Classes for the label, which is the root. className goes to the input. */
  labelClassName?: string
  /** Pins a state for documentation ("hover", "focus"); set on the root. */
  "data-force"?: string
}

/** No box. The words are the control; checking strikes them through in the accent. */
function Checkbox({ children, className, labelClassName, "data-force": force, ...props }: CheckboxProps) {
  return (
    <label data-slot="checkbox" data-force={force} className={cn("db-check", labelClassName)}>
      <input type="checkbox" className={className} {...props} />
      <span>{children}</span>
    </label>
  )
}

type CheckboxGroupProps = React.ComponentProps<"fieldset"> & {
  legend?: React.ReactNode
  /** Show how many are done, as a fraction under the list. */
  tally?: boolean
  /** What the tally says: done(count, total). */
  done?: (count: number, total: number) => React.ReactNode
}

const defaultDone = (count: number, total: number) => (count === total ? "done. Ready when you are." : "done")

/** A list of checkboxes under a small legend, with an optional tally. */
function CheckboxGroup({ legend, tally = false, done = defaultDone, className, children, onChange, ...props }: CheckboxGroupProps) {
  const set = React.useRef<HTMLFieldSetElement>(null)
  const counted = React.useRef<HTMLSpanElement>(null)
  const [state, setState] = React.useState({ count: 0, total: 0 })
  const shown = React.useRef(state)
  React.useEffect(() => {
    shown.current = state
  })

  const count = React.useCallback(() => {
    const boxes = [...(set.current?.querySelectorAll<HTMLInputElement>("input[type=checkbox]") ?? [])]
    const next = { count: boxes.filter((b) => b.checked).length, total: boxes.length }
    const was = shown.current
    // The count rolls the way it moves; the first count and totals just appear.
    if (counted.current && was.total && was.count !== next.count) {
      roll(counted.current, () => setState(next), "0.45em", next.count > was.count ? 1 : -1)
    } else setState(next)
  }, [])

  React.useEffect(count, [count])

  return (
    <>
      <fieldset
        ref={set}
        data-slot="checkbox-group"
        className={cn("db-checklist", className)}
        onChange={(e) => {
          onChange?.(e)
          if (tally) count()
        }}
        {...props}
      >
        {legend ? <legend className="db-label">{legend}</legend> : null}
        {children}
      </fieldset>
      {tally ? (
        <p data-slot="checkbox-tally" className="db-tally" aria-live="polite">
          <span className="db-fraction">
            <span ref={counted} className="db-yours">
              {state.count}
            </span>
            <i>
              <span className="db-sr"> of </span>
            </i>
            <span>{state.total}</span>
          </span>
          <span>{done(state.count, state.total)}</span>
        </p>
      ) : null}
    </>
  )
}

export { Checkbox, CheckboxGroup, type CheckboxProps, type CheckboxGroupProps }
