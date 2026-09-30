import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

/**
 * Three periods breathing in turn. It never speaks for itself: put the words
 * that say what's happening beside it ("Saving"), so it stays aria-hidden.
 */
function Spinner({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="spinner" aria-hidden="true" className={cn("db-dots", className)} {...props}>
      <i />
      <i />
      <i />
    </span>
  )
}

export { Spinner }
