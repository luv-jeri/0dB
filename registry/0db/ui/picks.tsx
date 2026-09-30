"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type PicksContextValue = { name: string; value: string | undefined; select: (value: string) => void }

const PicksContext = React.createContext<PicksContextValue | null>(null)

type PicksProps = Omit<React.ComponentProps<"fieldset">, "defaultValue" | "onChange"> & {
  /** Shared by every radio, so a form submits the choice. Defaults to a generated name. */
  name?: string
  /** The small label over the list. Without one, give the group an aria-label. */
  legend?: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

/** A list of choices that carry their own content. A dot hangs beside the one you took. */
function Picks({ name, legend, value: controlled, defaultValue, onValueChange, className, children, ...props }: PicksProps) {
  const generated = React.useId()
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = controlled ?? uncontrolled
  const select = React.useCallback(
    (next: string) => {
      if (controlled === undefined) setUncontrolled(next)
      onValueChange?.(next)
    },
    [controlled, onValueChange],
  )
  const ctx = React.useMemo(() => ({ name: name ?? generated, value, select }), [name, generated, value, select])
  return (
    <PicksContext.Provider value={ctx}>
      <fieldset data-slot="picks" className={cn("db-picks", className)} {...props}>
        {legend ? <legend className="db-label">{legend}</legend> : null}
        {children}
      </fieldset>
    </PicksContext.Provider>
  )
}

type PickProps = Omit<React.ComponentProps<"input">, "type" | "name" | "checked" | "defaultChecked" | "value" | "children"> & {
  value: string
  /** Anything: a name and a line under it, a swatch, a specimen. */
  children: React.ReactNode
  /** Classes for the label, which is the root. className goes to the input. */
  labelClassName?: string
  /** Pins a state for documentation ("hover", "focus"); set on the root. */
  "data-force"?: string
}

function Pick({ value, children, className, labelClassName, "data-force": force, onChange, ...props }: PickProps) {
  const group = React.useContext(PicksContext)
  if (!group) throw new Error("Pick must sit inside <Picks>.")
  return (
    <label data-slot="pick" data-force={force} className={labelClassName}>
      <input
        type="radio"
        name={group.name}
        value={value}
        checked={group.value === value}
        className={className}
        onChange={(e) => {
          onChange?.(e)
          group.select(value)
        }}
        {...props}
      />
      {children}
    </label>
  )
}

export { Picks, Pick, type PicksProps, type PickProps }
