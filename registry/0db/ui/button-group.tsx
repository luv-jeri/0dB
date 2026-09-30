import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type ButtonGroupProps = React.ComponentProps<"div"> & {
  /** Names the set for a screen reader: "Share Halden". */
  "aria-label": string
}

/** One pair of parentheses holds a set of Buttons; hairlines stand between them. Its Buttons drop their own brackets. */
function ButtonGroup({ className, ...props }: ButtonGroupProps) {
  return <div role="group" data-slot="button-group" className={cn("db-btn-group", className)} {...props} />
}

export { ButtonGroup, type ButtonGroupProps }
