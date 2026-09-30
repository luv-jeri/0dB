import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0db/lib/utils"

type CornersProps = React.ComponentProps<"div"> & {
  /** Put the corners on the child element instead of a new div. */
  asChild?: boolean
}

/**
 * Four corner marks: a frame that doesn't close. Tune it with the custom
 * properties --db-corner (length), --db-corner-inset and --db-corner-colour.
 */
function Corners({ className, asChild = false, ...props }: CornersProps) {
  const Comp = asChild ? Slot : "div"
  return <Comp data-slot="corners" className={cn("db-corners", className)} {...props} />
}

export { Corners, type CornersProps }
