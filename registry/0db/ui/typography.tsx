import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0db/lib/utils"

type ProseProps = React.ComponentProps<"article"> & {
  /** Set the child element (a div, say) instead of rendering an article. */
  asChild?: boolean
}

/**
 * Long text, set to be read. Wrap plain HTML (headings, paragraphs, links, quotes, lists,
 * code, tables, rules) and it is styled by element, so rendered markdown needs no classes.
 */
function Prose({ asChild = false, className, ...props }: ProseProps) {
  const Comp = asChild ? Slot : "article"
  return <Comp data-slot="typography" className={cn("db-prose", className)} {...props} />
}

/** An opening paragraph, set at the lead size in ink. */
function ProseLead({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="typography-lead" className={cn("db-prose-lead", className)} {...props} />
}

export { Prose, ProseLead }
