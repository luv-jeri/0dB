"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0nlytype/lib/utils"

type CornersProps = React.ComponentProps<"div"> & {
  /** Put the corners on the child element instead of a new div. */
  asChild?: boolean
  /**
   * viewfinder moves the frame onto the part you point at or focus; kagi sets two corners round a phrase, as 「 」 quote it;
   * glide keeps no frame at rest and carries one between the controls of a group, at any depth, as you point or move focus.
   */
  variant?: "viewfinder" | "kagi" | "glide"
}

/** The direct child of root that holds node. */
function partOf(root: HTMLElement, node: EventTarget | null) {
  let el = node instanceof HTMLElement ? node : null
  while (el && el.parentElement !== root) el = el.parentElement
  return el
}

function aim(root: HTMLElement, part: HTMLElement) {
  const r = root.getBoundingClientRect()
  const p = part.getBoundingClientRect()
  root.style.setProperty("--db-aim-x", `${p.left - r.left - root.clientLeft}px`)
  root.style.setProperty("--db-aim-y", `${p.top - r.top - root.clientTop}px`)
  root.style.setProperty("--db-aim-w", `${p.width}px`)
  root.style.setProperty("--db-aim-h", `${p.height}px`)
  root.dataset.aim = ""
}

function rest(root: HTMLElement) {
  for (const k of ["x", "y", "w", "h"]) root.style.removeProperty(`--db-aim-${k}`)
  delete root.dataset.aim
}

const CONTROL = 'a[href], button, input, select, textarea, summary, [role="button"], [tabindex]:not([tabindex="-1"])'

/** glide: the control under node, at any depth inside root, if it can be used. */
function controlOf(root: HTMLElement, node: EventTarget | null) {
  const el = node instanceof Element ? node.closest<HTMLElement>(CONTROL) : null
  return el && root.contains(el) && el !== root && !el.matches(":disabled, [aria-disabled='true']") ? el : null
}

/** glide: frame el. Arriving from rest, the marks appear where they land instead of travelling in from the corner. */
function glideTo(root: HTMLElement, el: HTMLElement, by: "pointer" | "focus") {
  const landing = !("aim" in root.dataset)
  if (landing) root.dataset.landing = ""
  aim(root, el)
  root.dataset.aim = by
  if (landing) requestAnimationFrame(() => requestAnimationFrame(() => delete root.dataset.landing))
}

/**
 * Four corner marks: a frame that doesn't close. Tune it with the custom
 * properties --db-corner (length), --db-corner-inset and --db-corner-colour.
 */
function Corners({ className, asChild = false, variant, onPointerOver, onPointerLeave, onFocus, onBlur, ...props }: CornersProps) {
  const Comp = asChild ? Slot : "div"
  const finder =
    variant === "viewfinder"
      ? {
          onPointerOver: (e: React.PointerEvent<HTMLDivElement>) => {
            onPointerOver?.(e)
            const part = partOf(e.currentTarget, e.target)
            if (part) aim(e.currentTarget, part)
          },
          onPointerLeave: (e: React.PointerEvent<HTMLDivElement>) => {
            onPointerLeave?.(e)
            // A tap leaves at once; keep the frame where the finger put it. Focus inside keeps it too.
            if (e.pointerType !== "touch" && !e.currentTarget.contains(document.activeElement)) rest(e.currentTarget)
          },
          onFocus: (e: React.FocusEvent<HTMLDivElement>) => {
            onFocus?.(e)
            const part = partOf(e.currentTarget, e.target)
            if (part) aim(e.currentTarget, part)
          },
          onBlur: (e: React.FocusEvent<HTMLDivElement>) => {
            onBlur?.(e)
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) rest(e.currentTarget)
          },
        }
      : variant === "glide"
        ? {
            // ponytail: it moves only when the pointer or focus does; a reflow under a still frame waits for the next move.
            onPointerOver: (e: React.PointerEvent<HTMLDivElement>) => {
              onPointerOver?.(e)
              const el = controlOf(e.currentTarget, e.target)
              if (el && e.pointerType !== "touch") glideTo(e.currentTarget, el, "pointer")
            },
            onPointerLeave: (e: React.PointerEvent<HTMLDivElement>) => {
              onPointerLeave?.(e)
              // The hand has gone: the frame goes back to where you are, or away.
              const here = controlOf(e.currentTarget, document.activeElement)
              if (here) glideTo(e.currentTarget, here, "focus")
              else delete e.currentTarget.dataset.aim // it fades where it is; the last place stays for the fade
            },
            onFocus: (e: React.FocusEvent<HTMLDivElement>) => {
              onFocus?.(e)
              const el = controlOf(e.currentTarget, e.target)
              if (el) glideTo(e.currentTarget, el, "focus")
            },
            onBlur: (e: React.FocusEvent<HTMLDivElement>) => {
              onBlur?.(e)
              if (!e.currentTarget.contains(e.relatedTarget as Node | null) && e.currentTarget.dataset.aim === "focus") delete e.currentTarget.dataset.aim
            },
          }
        : { onPointerOver, onPointerLeave, onFocus, onBlur }
  return <Comp data-slot="corners" data-variant={variant} className={cn("db-corners", className)} {...finder} {...props} />
}

export { Corners, type CornersProps }
