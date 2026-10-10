"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { useFormPresentation } from "@/registry/0nlytype/lib/use-form-presentation"
import { cn } from "@/registry/0nlytype/lib/utils"
import { Fraction } from "@/registry/0nlytype/ui/fraction"

const GroupSync = React.createContext<(() => void) | null>(null)

type CheckboxProps = Omit<React.ComponentProps<"input">, "type"> & {
  /** The words are the control. */
  children: React.ReactNode
  /**
   * strike: checking strikes the words through, for things done.
   * stet: checking sets a row of dots under them, the proofreader's "let it stand", for things kept.
   * circled: checking rings them in one pen loop, as you circle a word on a page, for things chosen.
   */
  variant?: "strike" | "stet" | "circled"
  /** Classes for the label, which is the root. className goes to the input. */
  labelClassName?: string
  /** Pins a state for documentation ("hover", "focus"); set on the root. */
  "data-force"?: string
}

/** No box. The words are the control; checking marks them, by default striking them through in the accent. */
function Checkbox({ children, variant = "strike", className, labelClassName, "data-force": force, ...props }: CheckboxProps) {
  const sync = React.useContext(GroupSync)
  React.useLayoutEffect(() => { sync?.() })
  return (
    <label data-slot="checkbox" data-variant={variant} data-force={force} className={cn("db-check", labelClassName)}>
      <input type="checkbox" className={className} {...props} />
      <span>{children}</span>
      {variant === "circled" ? (
        <svg className="db-check-loop" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          {/* One hand loop: in at the upper left, round clockwise, and on past where it began. */}
          <path pathLength={1} d="M14 9C34 2 78 1 93 11C104 19 96 33 70 37C44 40 12 38 4 28C-3 19 14 8 40 5" />
        </svg>
      ) : null}
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

/** A list of checkboxes under a small legend, with an optional tally whose figures turn like a counter's wheels. */
function CheckboxGroup({ legend, tally = false, done = defaultDone, className, children, onChange, ref: forwardedRef, ...props }: CheckboxGroupProps) {
  const set = React.useRef<HTMLFieldSetElement>(null)
  const composedRef = useComposedRefs(set, forwardedRef)
  // null until the first count, so the fraction arrives with its figures and doesn't turn over on load.
  const [state, setState] = React.useState<{ count: number; total: number } | null>(null)

  const count = React.useCallback(() => {
    const boxes = [...(set.current?.querySelectorAll<HTMLInputElement>("input[type=checkbox]") ?? [])]
    const next = { count: boxes.filter((b) => b.checked).length, total: boxes.length }
    setState((was) => was?.count === next.count && was.total === next.total ? was : next)
  }, [])

  useFormPresentation(set, count)

  return (
    <GroupSync.Provider value={count}>
      <fieldset
        ref={composedRef}
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
          {state ? (
            <>
              <Fraction count={state.count} total={state.total} />
              <span>{done(state.count, state.total)}</span>
            </>
          ) : null}
        </p>
      ) : null}
    </GroupSync.Provider>
  )
}

export { Checkbox, CheckboxGroup, type CheckboxProps, type CheckboxGroupProps }
