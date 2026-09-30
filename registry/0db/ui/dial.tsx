import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type DialOption = string | number | { value: string | number; label?: string }

type DialProps = Omit<React.ComponentProps<"fieldset">, "defaultValue"> & {
  /** Shared by every radio, so a form submits the choice. */
  name: string
  /** The question, as a small label over the dial. */
  legend: React.ReactNode
  /** Up to nine choices, laid out on the arc in order. */
  options: DialOption[]
  defaultValue?: string | number
  /** Small words under the arc, e.g. "weeks". */
  unit?: string
}

/**
 * A radio for numbers, set on an arc. No script: the chosen number swells and turns italic,
 * the others grey with distance, and the dot travels the arc. Arrow keys turn it.
 */
function Dial({ name, legend, options, defaultValue, unit, className, style, ...props }: DialProps) {
  return (
    <fieldset
      data-slot="dial"
      className={cn("db-dial", className)}
      style={{ "--n": options.length, ...style } as React.CSSProperties}
      {...props}
    >
      <legend className="db-label">{legend}</legend>
      <div data-slot="dial-face" className="db-dial-face">
        {options.map((option, i) => {
          const value = String(typeof option === "object" ? option.value : option)
          const text = typeof option === "object" ? (option.label ?? value) : value
          return (
            <label key={value} data-slot="dial-item" data-text={text} style={{ "--i": i } as React.CSSProperties}>
              <input type="radio" name={name} value={value} defaultChecked={defaultValue !== undefined && String(defaultValue) === value} />
              <span>{text}</span>
            </label>
          )
        })}
        <span className="db-dial-arc" aria-hidden="true" />
        <span className="db-dial-dot" aria-hidden="true" />
        {unit ? (
          <span className="db-dial-unit" aria-hidden="true">
            {unit}
          </span>
        ) : null}
      </div>
    </fieldset>
  )
}

export { Dial, type DialProps, type DialOption }
