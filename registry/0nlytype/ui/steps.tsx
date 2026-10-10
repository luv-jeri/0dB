"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"
import { Fraction } from "@/registry/0nlytype/ui/fraction"

type StepsProps = Omit<React.ComponentProps<"ol">, "defaultValue"> & {
  /**
   * margin: large thin numerals in the margin.
   * rise: the numerals stand on one line across the page; those to come are sunk into it and rise out as you reach them.
   * cascade: no numerals; the titles step across the page like a broken headline, an arrow pointing on from where you are.
   * folio: the compact one. The sequence folds into one fraction, "02/05", beside the step you're on.
   */
  variant?: "margin" | "rise" | "cascade" | "folio"
  /**
   * The step you're on, counted from 1 as the numerals are; the steps before it are done. One past the last means
   * all done. Left out, each Step's own `current` and `done` say where you are.
   */
  value?: number
  defaultValue?: number
  /** Makes the steps behind you a way back: their titles become buttons that call this with the step's number. */
  onValueChange?: (value: number) => void
}

const Sequence = React.createContext<{ at?: number; go?: (n: number) => void; shown?: number }>({})
const Place = React.createContext(0) // this step's number, from 1
const Reached = React.createContext({ n: 0, done: false })

/** A real sequence, numbered. Only use it when the order matters. */
function Steps({ className, variant = "margin", value, defaultValue, onValueChange, children, ...props }: StepsProps) {
  const [own, setOwn] = React.useState(defaultValue)
  const kids = React.Children.toArray(children).filter(React.isValidElement<StepProps>)
  const at = value ?? own
  // The folio says where you are as one figure: the step you're on, or the last one reached.
  const here = Math.min(Math.max(at ?? (kids.findIndex((k) => k.props.current) + 1 || kids.filter((k) => k.props.done).length + 1), 1), kids.length)
  const shown = variant === "folio" ? here : undefined
  const go = onValueChange
    ? (n: number) => {
        if (value === undefined) setOwn(n)
        onValueChange(n)
      }
    : undefined
  const list = (
    <ol data-slot="steps" data-variant={variant} className={cn("db-steps", className)} {...props}>
      <Sequence.Provider value={{ at, go, shown }}>
        {kids.map((kid, i) => (
          <Place.Provider key={kid.key ?? i} value={i + 1}>
            {kid}
          </Place.Provider>
        ))}
      </Sequence.Provider>
    </ol>
  )
  if (variant !== "folio") return list
  // The list stays whole for a screen reader; only the step shown beside the figure is seen.
  return (
    <div className="db-steps-folio">
      <Fraction count={String(here).padStart(2, "0")} total={String(kids.length).padStart(2, "0")} aria-hidden="true" />
      {list}
    </div>
  )
}

type StepProps = React.ComponentProps<"li"> & {
  /** The step the person is on: its numeral is the view's one accent. Left out, Steps' `value` decides. */
  current?: boolean
  done?: boolean
}

function Step({ className, current, done, ...props }: StepProps) {
  const { at, shown } = React.useContext(Sequence)
  const n = React.useContext(Place)
  const here = current ?? (at !== undefined && n === at)
  const behind = done ?? (at !== undefined && n < at)
  return (
    <Reached.Provider value={{ n, done: behind }}>
      <li
        data-slot="step"
        data-current={here || undefined}
        data-done={behind || undefined}
        data-shown={n === shown || undefined}
        aria-current={here ? "step" : undefined}
        className={cn("db-step", className)}
        {...props}
      />
    </Reached.Provider>
  )
}

/** The step's name. Behind you, with `onValueChange` on Steps, it's a button back to that step. */
function StepTitle({ className, children, ...props }: React.ComponentProps<"h3">) {
  const { go, shown } = React.useContext(Sequence)
  const { n, done } = React.useContext(Reached)
  return (
    <h3 data-slot="step-title" className={cn("db-step-title", className)} {...props}>
      {go && done && shown === undefined ? ( // ponytail: the folio hides the steps behind you, so it offers no way back; pair it with your own Back button
        <button type="button" className="db-step-back" onClick={() => go(n)}>
          {children}
          <span className="db-sr">, done. Go back to this step.</span>
        </button>
      ) : (
        children
      )}
    </h3>
  )
}

export { Steps, Step, StepTitle, type StepsProps, type StepProps }
