import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type MarkerProps = React.ComponentProps<"p"> & {
  /** A divider draws its rules outward from the word: where a day begins. */
  variant?: "status" | "divider"
  /** A small dot before a status. */
  dot?: boolean
  /** Plays the arrival when it mounts (the rules push apart). */
  arriving?: boolean
}

/** A quiet line in a conversation: a status, or where a day begins. */
function Marker({ variant = "status", dot, arriving, className, children, ...props }: MarkerProps) {
  return (
    <p
      data-slot="marker"
      data-variant={variant === "divider" ? "divider" : undefined}
      data-arriving={arriving || undefined}
      className={cn("db-marker", className)}
      {...props}
    >
      {dot ? <span className="db-marker-dot" aria-hidden="true" /> : null}
      {children}
    </p>
  )
}

export { Marker, type MarkerProps }
