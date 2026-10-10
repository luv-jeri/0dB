"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"

type Variant = "tail" | "catchword" | "sotto"

const Kind = React.createContext<Variant>("tail")

type CollapsibleProps = React.ComponentProps<"details"> & {
  /**
   * tail: the words "and 4 more" are the control, as the list's last line. catchword: the first name of the
   * rest waits at the foot, flush to the far edge, the way a printer set the next page's first word; opening,
   * it steps back to the start as the first row. sotto: the rest is already there, said under the breath in
   * one line of fine print; opening says it in full.
   */
  variant?: Variant
}

/**
 * A list that ends in the rest of itself: "and 4 more" is the control. Native
 * <details>. Show the first rows yourself (a CollapsibleList), then this holds the rest.
 */
function Collapsible({ className, variant = "tail", ...props }: CollapsibleProps) {
  return (
    <Kind.Provider value={variant}>
      <details data-slot="collapsible" data-variant={variant === "tail" ? undefined : variant} className={cn("ot-collapse", className)} {...props} />
    </Kind.Provider>
  )
}

type CollapsibleTriggerProps = React.ComponentProps<"summary"> & {
  /** What the control says once it is open ("Hide these 4"). Defaults to the closed words. */
  openLabel?: React.ReactNode
}

function CollapsibleTrigger({ children, openLabel, className, ...props }: CollapsibleTriggerProps) {
  const variant = React.useContext(Kind)
  return (
    <summary
      data-slot="collapsible-trigger"
      data-variant={variant === "tail" ? "quiet" : undefined}
      className={cn(variant === "tail" ? "ot-btn" : "ot-collapse-cue", className)}
      {...props}
    >
      <span>{children}</span>
      <span data-echo={openLabel === undefined ? "" : undefined}>{openLabel ?? children}</span>
    </summary>
  )
}

function CollapsibleContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="collapsible-content" className={className} {...props} />
}

/** Rows ruled off with hairlines. Its rows arrive in turn when the rest opens. */
function CollapsibleList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="collapsible-list" className={cn("ot-collapse-list", className)} {...props} />
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleList, type CollapsibleProps, type CollapsibleTriggerProps }
