import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

/** A frame row: small words held apart by hairlines. A hairline goes between each child. */
function Meta({ className, children, ...props }: React.ComponentProps<"div">) {
  const items = React.Children.toArray(children)
  return (
    <div data-slot="meta" className={cn("db-meta", className)} {...props}>
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <hr aria-hidden="true" /> : null}
          {child}
        </React.Fragment>
      ))}
    </div>
  )
}

export { Meta }
