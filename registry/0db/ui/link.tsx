import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0db/lib/utils"

type LinkProps = React.ComponentProps<"a"> & {
  /** Render the child element (your router's link, say) with the link's look. */
  asChild?: boolean
  /** Leaves the site: opens in a new tab and takes the arrow, the one place an arrow belongs. */
  external?: boolean
}

/** A hairline underline; pointing at it draws a highlighter stroke through the words. */
function Link({ className, asChild = false, external = false, children, ...props }: LinkProps) {
  const Comp = asChild ? Slot : "a"
  return (
    <Comp
      data-slot="link"
      className={cn("db-link", className)}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...props}
    >
      {external && !asChild ? (
        <>
          {children}
          <span aria-hidden="true">&#8239;↗</span>
          <span className="db-sr"> (opens in a new tab)</span>
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Link, type LinkProps }
