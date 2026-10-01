"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/registry/0db/lib/utils"

/** Holds a still pointer for 400ms before whispering; focus shows it at once. */
function TooltipProvider({ delayDuration = 400, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />
}

function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

type TooltipContentProps = React.ComponentProps<typeof TooltipPrimitive.Content> & { variant?: "whisper" | "initials" | "beside" }

/**
 * A whisper. Keep it to a few words; it names, it doesn't explain. whisper (the default): in
 * parentheses above the thing it names. initials: the same, with the letters the control shows
 * marked in the words they come from (wrap each in <b>). beside: on the control's own line, after it,
 * on a hairline.
 */
function TooltipContent(props: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <Placed {...props} />
    </TooltipPrimitive.Portal>
  )
}

// Beside reads on from the control, so it sits at the line's end: the right, or the left on a
// right-to-left page. The portal mounts this only once open, in the browser, so the direction is read
// fresh each time and can't disagree with the server's (closed, empty) render.
// ponytail: reads the page's direction, not the trigger's; pass side for a mixed-direction page.
function Placed({ className, variant = "whisper", side, sideOffset = variant === "beside" ? 10 : 8, ...props }: TooltipContentProps) {
  const rtl = variant === "beside" && !side && getComputedStyle(document.body).direction === "rtl"
  return (
    <TooltipPrimitive.Content
      data-slot="tooltip-content"
      data-variant={variant === "whisper" ? undefined : variant}
      side={side ?? (variant === "beside" ? (rtl ? "left" : "right") : "top")}
      sideOffset={sideOffset}
      className={cn("db-tip-text", className)}
      {...props}
    />
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
