import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0nlytype/lib/utils"

type ProseProps = React.ComponentProps<"article"> & {
  /** Set the child element (a div, say) instead of rendering an article. */
  asChild?: boolean
  /**
   * swiss (the default): space between paragraphs, punctuation hung in the margin. book: indents instead
   * of space, justified, the opening line in capitals, a dinkus for a break. run-on: a passage's paragraphs
   * run on as one block, a pilcrow where each begins.
   */
  variant?: "swiss" | "book" | "run-on"
}

/**
 * Long text, set to be read. Wrap plain HTML (headings, paragraphs, links, quotes, lists,
 * code, tables, rules) and it is styled by element, so rendered markdown needs no classes.
 */
function Prose({ asChild = false, variant = "swiss", className, ...props }: ProseProps) {
  const Comp = asChild ? Slot : "article"
  return <Comp data-slot="typography" data-variant={variant} className={cn("db-prose", className)} {...props} />
}

/** An opening paragraph, set at the lead size in ink. */
function ProseLead({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="typography-lead" className={cn("db-prose-lead", className)} {...props} />
}

export { Prose, ProseLead, type ProseProps }
