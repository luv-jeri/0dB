"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0db/lib/utils"
import { Spinner } from "@/registry/0db/ui/spinner"

type ButtonProps = React.ComponentProps<"button"> & {
  /**
   * The base set, one family: statement (reversed type in an ink block, one per view),
   * bracket (a secondary action held in ( )) and quiet (only a line, and the line redraws).
   * The hero set, for the big call to action: overture (the word swells and ends in a full stop),
   * fermata (an arc is drawn over the word), stave (the word set across five lines) and
   * ink (an outlined block that fills from the side you came in).
   */
  variant?: "statement" | "bracket" | "quiet" | "overture" | "fermata" | "stave" | "ink"
  size?: "m" | "l"
  /** Render the child element (a link, say) with the button's look. */
  asChild?: boolean
  /**
   * The button says what it's doing. A string replaces the label while busy
   * ("Save" becomes "Saving"); true keeps the label. Either way the periods breathe.
   */
  busy?: boolean | string
}

/** The words as plain text, or null when the label holds elements. */
function textOf(node: React.ReactNode) {
  let text = ""
  let plain = true
  React.Children.forEach(node, (c) => {
    if (typeof c === "string" || typeof c === "number") text += c
    else if (c != null && typeof c !== "boolean") plain = false
  })
  return plain ? text : null
}

/**
 * The label sits in a grid cell with an invisible copy of itself set at its widest
 * (the hover weight and width). The button is always as wide as its widest state,
 * so nothing beside it moves when the letters swell.
 */
function Label({ children }: { children?: React.ReactNode }) {
  return (
    <span className="db-btn-label" data-text={textOf(children) ?? undefined}>
      <span>{children}</span>
    </span>
  )
}

function Button({ className, variant = "bracket", size = "m", asChild = false, busy = false, children, onPointerEnter, onPointerLeave, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  // The ink fills from the side you came in and leaves toward the side you go.
  const edge = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.dataset.edge = e.clientX < r.left + r.width / 2 ? "left" : "right"
  }
  const child = asChild && React.isValidElement<{ children?: React.ReactNode }>(children) ? children : null
  const content =
    busy && !asChild ? (
      <>
        <Label>{typeof busy === "string" ? busy : children}</Label>
        <Spinner />
      </>
    ) : (
      <Label>{child ? child.props.children : children}</Label>
    )
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size === "m" ? undefined : size}
      aria-busy={busy ? true : undefined}
      className={cn("db-btn", className)}
      {...(asChild ? {} : { type: "button" as const })}
      {...(variant === "ink"
        ? {
            onPointerEnter: (e: React.PointerEvent<HTMLElement>) => (edge(e), (onPointerEnter as React.PointerEventHandler<HTMLElement> | undefined)?.(e)),
            onPointerLeave: (e: React.PointerEvent<HTMLElement>) => (edge(e), (onPointerLeave as React.PointerEventHandler<HTMLElement> | undefined)?.(e)),
          }
        : { onPointerEnter, onPointerLeave })}
      {...props}
    >
      {child ? React.cloneElement(child, undefined, content) : content}
    </Comp>
  )
}

export { Button, type ButtonProps }
