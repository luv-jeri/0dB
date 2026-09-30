import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { Scrollbar } from "@/registry/0db/ui/scrollbar"

/**
 * A box that scrolls. A rule appears at an edge only while there's more beyond it, and the
 * scrollbar is the ruler rail. Give it a height (or max-height) and a name: it takes focus
 * so the keyboard can scroll it, and a name says what it holds.
 */
function ScrollArea({ className, children, ...props }: React.ComponentProps<"div">) {
  const named = props["aria-label"] || props["aria-labelledby"]
  return (
    <div data-slot="scroll-area" tabIndex={0} role={named ? "region" : undefined} className={cn("db-scroll", className)} {...props}>
      {children}
      <Scrollbar variant="inner" />
    </div>
  )
}

export { ScrollArea }
