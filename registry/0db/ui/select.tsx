import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type SelectProps = React.ComponentProps<"select"> & {
  /** The words before the choice: "Sort by". Clicking them opens the list. */
  label?: React.ReactNode
  /** Classes for the sentence around the choice. className goes to the select. */
  rootClassName?: string
  /** Pins a state for documentation ("hover"); set on the root. */
  "data-force"?: string
}

/** A choice inside a sentence. The chosen word is yours, in italic over a hairline. Give it <option>s. */
function Select({ label, className, rootClassName, "data-force": force, children, ...props }: SelectProps) {
  const Root = label ? "label" : "span"
  return (
    <Root data-slot="select" data-force={force} className={cn("db-select", rootClassName)}>
      {label ? <span>{label}</span> : null}
      <span className="db-select-box">
        <select data-slot="select-input" className={className} {...props}>
          {children}
        </select>
      </span>
    </Root>
  )
}

export { Select, type SelectProps }
