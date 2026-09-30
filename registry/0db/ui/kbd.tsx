import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type KbdProps = React.ComponentProps<"kbd"> & {
  /** Draws the key pressed: it shrinks a little and the ring turns to ink. */
  pressed?: boolean
}

/** A key, drawn as a ring. */
function Kbd({ className, pressed, ...props }: KbdProps) {
  return <kbd data-slot="kbd" data-pressed={pressed || undefined} className={cn("db-kbd", className)} {...props} />
}

export { Kbd, type KbdProps }
