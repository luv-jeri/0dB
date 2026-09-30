"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/registry/0db/lib/utils"

/** Waits 450ms for a still pointer; the keyboard gets it at once. */
function HoverCard({ openDelay = 450, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" openDelay={openDelay} {...props} />
}

function HoverCardTrigger(props: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
}

/** A small card. Put a HoverCardName first if you want the name set large and cropped by the edge. */
function HoverCardContent({ className, align = "start", sideOffset = 12, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content data-slot="hover-card-content" align={align} sideOffset={sideOffset} className={cn("db-peek", className)} {...props} />
    </HoverCardPrimitive.Portal>
  )
}

/** The name, set large; the card's edge crops it. Decorative, so screen readers skip it. */
function HoverCardName({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="hover-card-name" aria-hidden="true" className={cn("db-peek-name", className)} {...props} />
}

function HoverCardMeta({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="hover-card-meta" className={cn("db-peek-meta", className)} {...props} />
}

export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardName, HoverCardMeta }
