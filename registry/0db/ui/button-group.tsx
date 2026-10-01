import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type ButtonGroupProps = React.ComponentProps<"div"> & {
  /** Names the set for a screen reader: "Share Halden". */
  "aria-label": string
  /**
   * parentheses: one pair holds the set, hairlines between. column: the actions stacked as a narrow
   * ragged column, a dash hung in the margin beside the one you point at. sentence: the actions
   * written as a list in running text, with commas and a conjunction between them.
   */
  variant?: "parentheses" | "column" | "sentence"
  /** The word before the last action in a sentence: "or", "and", or the page's own language. */
  conjunction?: string
}

/** One pair of parentheses holds a set of Buttons; hairlines stand between them. Its Buttons drop their own brackets. */
function ButtonGroup({ className, variant = "parentheses", conjunction = "or", children, ...props }: ButtonGroupProps) {
  if (variant === "sentence") {
    // ponytail: the separators are English list punctuation; `conjunction` covers the word, not the commas.
    const items = React.Children.toArray(children)
    const last = items.length - 1
    return (
      <span role="group" data-slot="button-group" data-variant={variant} className={cn("db-btn-group", className)} {...(props as React.ComponentProps<"span">)}>
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 ? (
              <span className="db-btn-group-sep" aria-hidden="true">
                {i < last ? ", " : `${last > 1 ? "," : ""} ${conjunction} `}
              </span>
            ) : null}
            {item}
          </React.Fragment>
        ))}
      </span>
    )
  }
  return (
    <div role="group" data-slot="button-group" data-variant={variant} className={cn("db-btn-group", className)} {...props}>
      {children}
    </div>
  )
}

export { ButtonGroup, type ButtonGroupProps }
