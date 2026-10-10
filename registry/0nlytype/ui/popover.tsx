"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/registry/0nlytype/lib/utils"

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverAnchor(props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverClose(props: React.ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

type Variant = "leader" | "brace" | "cut"

/* Each variant hangs the panel its own distance off: the leader's length, the brace's small gap
   (Radix adds the brace's own height), and nothing at all for the cut, which rides over its opener. */
const OFFSET: Record<Variant, number> = { leader: 27 /* --db-space-5 */, brace: 6, cut: 0 }

/**
 * A panel hung from what opened it. leader (the default): on a leader line, which joins the panel to
 * the trigger when it sits above or below and aligns to an edge (the default is the trigger's start
 * edge). brace: the panel's width gathered by a brace to one point at the trigger. cut: the panel's
 * edge cuts through the trigger's words and the panel rides over their lower half. Other menus and
 * pickers wear the same `db-pop` panel.
 */
function PopoverContent({
  className,
  variant = "leader",
  align = variant === "brace" ? "center" : "start",
  sideOffset = OFFSET[variant],
  collisionPadding = 20,
  arrowPadding = 24,
  style,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & { variant?: Variant }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        data-variant={variant === "leader" ? undefined : variant}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        arrowPadding={arrowPadding}
        style={{ "--db-pop-gap": `${sideOffset}px`, ...style } as React.CSSProperties}
        className={cn("db-pop", className)}
        {...props}
      >
        {children}
        {variant === "brace" && (
          // The brace's two ends curl at the panel's corners; its point is Radix's arrow, which Radix
          // keeps over the trigger's middle even when the panel shifts to stay on screen.
          <span className="db-pop-brace" aria-hidden="true">
            <span className="db-pop-brace-arms">
              <PopoverPrimitive.Arrow asChild>
                <span className="db-pop-brace-point" />
              </PopoverPrimitive.Arrow>
            </span>
          </span>
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose }
