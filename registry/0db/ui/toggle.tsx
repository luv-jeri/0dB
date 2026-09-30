"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"

import { cn } from "@/registry/0db/lib/utils"

type ToggleProps = React.ComponentProps<typeof TogglePrimitive.Root> & {
  /** Pins a state for documentation ("hover"); set on the root. */
  "data-force"?: string
}

/** A word you can hold down. Held, it wears the fermata: an arc over the word and a dot inside it. */
function Toggle({ className, ...props }: ToggleProps) {
  return <TogglePrimitive.Root data-slot="toggle" className={cn("db-toggle", className)} {...props} />
}

export { Toggle, type ToggleProps }
