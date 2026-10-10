import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0nlytype/lib/utils"

type LinkProps = React.ComponentProps<"a"> & {
  /** Render the child element (your router's link, say) with the link's look. */
  asChild?: boolean
  /** Leaves the site: opens in a new tab and takes the ↗, the one place an arrow belongs. */
  external?: boolean
  /**
   * quiet sets the underline in rule, for a run of links that already reads as links. reference drops the line for a raised
   * reference mark (* † ‡ …). address writes where the link goes after it when pointed at (not with asChild).
   */
  variant?: "quiet" | "reference" | "address"
}

/** Hangs past the end of the line (see base.css), so the link keeps room for it and it never starts a line alone. */
const out = (
  <>
    <span className="ot-link-out" aria-hidden="true">
      ↗
    </span>
    <span className="ot-sr"> (opens in a new tab)</span>
  </>
)

/** Where a link goes, as print spells it out: no scheme, no www, no trailing slash. */
const addressOf = (href: string) => href.replace(/^[a-z][a-z0-9+.-]*:(\/\/)?/i, "").replace(/^www\./, "").replace(/\/$/, "") || href

/** A hairline underline; pointing at it draws a highlighter stroke through the words. */
function Link({ className, asChild = false, external = false, variant, children, ...props }: LinkProps) {
  const Comp = asChild ? Slot : "a"
  const address =
    variant === "address" && !asChild && props.href ? (
      <span className="ot-link-address" aria-hidden="true">
        ({addressOf(props.href)})
      </span>
    ) : null
  const link = (
    <Comp
      data-slot="link"
      data-variant={variant}
      className={cn("ot-link", className)}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {children}
          {external ? out : null}
        </>
      )}
    </Comp>
  )
  // Keep room for the address even at rest; it steps under the words when their measure is full.
  return address ? <span className="ot-link-addressed">{link}{address}</span> : link
}

export { Link, type LinkProps }
