import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

/**
 * A list that ends in the rest of itself: "and 4 more" is the control. Native
 * <details>. Show the first rows yourself (a CollapsibleList), then this holds the rest.
 */
function Collapsible({ className, ...props }: React.ComponentProps<"details">) {
  return <details data-slot="collapsible" className={cn("db-collapse", className)} {...props} />
}

type CollapsibleTriggerProps = React.ComponentProps<"summary"> & {
  /** What the control says once it is open ("Hide these 4"). Defaults to the closed words. */
  openLabel?: React.ReactNode
}

function CollapsibleTrigger({ children, openLabel, className, ...props }: CollapsibleTriggerProps) {
  return (
    <summary data-slot="collapsible-trigger" data-variant="quiet" className={cn("db-btn", className)} {...props}>
      <span>{children}</span>
      <span>{openLabel ?? children}</span>
    </summary>
  )
}

function CollapsibleContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="collapsible-content" className={className} {...props} />
}

/** Rows ruled off with hairlines. Its rows arrive in turn when the rest opens. */
function CollapsibleList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="collapsible-list" className={cn("db-collapse-list", className)} {...props} />
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleList, type CollapsibleTriggerProps }
