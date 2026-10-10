"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"

type BadgeProps = Omit<React.ComponentProps<"span">, "onClick"> & {
  /**
   * default, ink and accent are pills. series drops the pill: sibling tags are
   * written as one list ("Identity, Web and Motion"), in the italic, and the
   * commas and the "and" re-set as tags come and go. seal sets `legend` round
   * a ring, like a coin, with the children in the middle.
   */
  variant?: "default" | "ink" | "accent" | "series" | "seal"
  /**
   * Makes the tag removable: the whole pill becomes a button with a cross, and
   * pointing at it strikes the word. It closes up, then this is called.
   * Focus moves to the neighbouring tag. Not for seal.
   */
  onRemove?: () => void
  /** seal: the words set round the rim, about 12 to 24 characters. */
  legend?: string
}

/** The one rounded shape: a hairline pill. */
function Badge({ className, variant = "default", onRemove, legend, children, ...props }: BadgeProps) {
  const id = React.useId()
  const dataVariant = variant === "default" ? undefined : variant

  if (variant === "seal") {
    const name = props["aria-label"] ?? [typeof children === "string" ? children : "", legend].filter(Boolean).join(", ")
    return (
      <span data-slot="badge" data-variant="seal" role="img" className={cn("db-tag", className)} {...props} aria-label={name}>
        <svg viewBox="0 0 90 90" aria-hidden="true">
          <circle className="db-tag-rim" cx="45" cy="45" r="44.5" />
          <circle className="db-tag-rim" cx="45" cy="45" r="28.5" />
          {/* From the foot, round by the left: the legend reads clockwise over the top, as on a coin. */}
          <path id={id} d="M45 77a32 32 0 1 1 0-64a32 32 0 1 1 0 64" fill="none" />
          <text className="db-tag-legend">
            <textPath href={`#${id}`} textLength={2 * Math.PI * 32} lengthAdjust="spacing">{`${legend ?? ""} · `}</textPath>
          </text>
        </svg>
        <span className="db-tag-face" aria-hidden="true">{children}</span>
      </span>
    )
  }

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
