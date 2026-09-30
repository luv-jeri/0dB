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

/**
 * A small card. name (the default): put a HoverCardName first and the name is set large and cut by
 * the card's top edge. entry: a dictionary entry for the word you point at, its headword broken at
 * its syllables. quote: what the person said, the opening mark hung in the margin.
 */
function HoverCardContent({
  className,
  variant = "name",
  align = "start",
  sideOffset = 12,
  collisionPadding = 20,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content> & { variant?: "name" | "entry" | "quote" }) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        data-variant={variant === "name" ? undefined : variant}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn("db-peek", className)}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

/**
 * The name, set large; the card's edge crops it. Decorative, so screen readers skip it. Given a
 * string with syllable points ("gro·ˈtesque"), it breaks there, as a dictionary's headword does, and
 * the syllable after the stress mark (ˈ) is reversed out of the ink.
 */
function HoverCardName({ className, children, ...props }: React.ComponentProps<"span">) {
  const syllables = typeof children === "string" && /[·ˈ]/.test(children) ? children.split("·") : null
  return (
    <span data-slot="hover-card-name" aria-hidden="true" className={cn("db-peek-name", className)} {...props}>
      {syllables
        ? syllables.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="db-peek-point" style={{ "--i": i } as React.CSSProperties} />}
              {s.startsWith("ˈ") ? <span className="db-peek-stress">{s.slice(1)}</span> : s}
            </React.Fragment>
          ))
        : children}
    </span>
  )
}

function HoverCardMeta({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="hover-card-meta" className={cn("db-peek-meta", className)} {...props} />
}

export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardName, HoverCardMeta }
