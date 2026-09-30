"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type BadgeProps = Omit<React.ComponentProps<"span">, "onClick"> & {
  variant?: "default" | "ink" | "accent"
  /**
   * Makes the tag removable: the whole pill becomes a button with a cross, and
   * pointing at it strikes the word. It closes up, then this is called.
   * Focus moves to the neighbouring tag.
   */
  onRemove?: () => void
}

/** The one rounded shape: a hairline pill. */
function Badge({ className, variant = "default", onRemove, children, ...props }: BadgeProps) {
  const dataVariant = variant === "default" ? undefined : variant
  if (!onRemove) {
    return (
      <span data-slot="badge" data-variant={dataVariant} className={cn("db-tag", className)} {...props}>
        {children}
      </span>
    )
  }

  const { "aria-label": label, ...rest } = props
  const remove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const tag = e.currentTarget
    if (tag.hasAttribute("data-leaving")) return
    const next = tag.nextElementSibling ?? tag.previousElementSibling
    const done = () => {
      if (next instanceof HTMLButtonElement) next.focus()
      onRemove()
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return done()
    // Struck through, the tag closes up and its neighbours slide into the space.
    tag.setAttribute("data-leaving", "")
    tag.style.overflow = "clip"
    const gap = parseFloat(getComputedStyle(tag.parentElement ?? tag).columnGap) || 0
    tag
      .animate(
        [
          { width: `${tag.offsetWidth}px`, opacity: 1 },
          { width: "0px", paddingInline: "0px", marginInlineEnd: `${-gap}px`, opacity: 0 },
        ],
        { duration: 480, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" },
      )
      .finished.then(done)
  }

  return (
    <button
      type="button"
      data-slot="badge"
      data-variant={dataVariant}
      data-removable=""
      aria-label={label ?? (typeof children === "string" ? `Remove ${children}` : "Remove")}
      className={cn("db-tag", className)}
      onClick={remove}
      {...(rest as React.ComponentProps<"button">)}
    >
      <span>{children}</span>
    </button>
  )
}

export { Badge, type BadgeProps }
