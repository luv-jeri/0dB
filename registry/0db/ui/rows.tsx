"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0db/lib/utils"

type RowsProps = React.ComponentProps<"ul"> & {
  /**
   * reverse: the row you point at reverses out of ink. ditto: a kind or a
   * year that repeats the row above is set as a ditto mark, and pointing
   * spells it out. trail: a ring before each row that fills with ink once
   * you've been there (the browser's own :visited); where you are is the accent.
   */
  variant?: "reverse" | "ditto" | "trail"
}

/** An index: hairline-separated rows. The one you point at reverses out of ink and steps forward. */
function Rows({ className, variant = "reverse", ref, ...props }: RowsProps) {
  const own = React.useRef<HTMLUListElement>(null)
  React.useImperativeHandle(ref, () => own.current as HTMLUListElement)
  // ditto: after every render, mark each kind or year that repeats the one in the row above.
  React.useLayoutEffect(() => {
    if (variant !== "ditto" || !own.current) return
    let above = new Map<string, string>()
    for (const li of own.current.children) {
      const here = new Map<string, string>()
      for (const cell of li.querySelectorAll<HTMLElement>("[data-slot=rows-kind], [data-slot=rows-meta]")) {
        const slot = cell.dataset.slot ?? ""
        const text = cell.textContent?.trim() ?? ""
        cell.toggleAttribute("data-ditto", text !== "" && above.get(slot) === text)
        here.set(slot, text)
      }
      above = here
    }
  })
  return <ul ref={own} data-slot="rows" data-variant={variant === "reverse" ? undefined : variant} className={cn("db-rows", className)} {...props} />
}

type RowProps = Omit<React.ComponentProps<"li">, "onClick"> & {
  /** Makes the row a link. Without href (or asChild) it is a plain row that doesn't react. */
  href?: string
  /** Render your own link (Next's Link, say) inside the row with the row's look. */
  asChild?: boolean
  /** Pins a state for documentation ("hover", or "visited" for trail); set on the link. */
  "data-force"?: string
  /** Passed to the link. */
  onClick?: React.MouseEventHandler<HTMLElement>
}

/**
 * One row. Give it the parts (RowTitle, RowKind, RowMeta). A row that opens
 * something draws a → on hover; the ink comes in from the side your hand came in
 * and leaves toward the side it goes.
 */
function Row({ href, asChild = false, className, children, onClick, "data-force": force, "aria-current": current, ...props }: RowProps) {
  const Comp = asChild ? Slot : href !== undefined ? "a" : "div"
  const edge = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.dataset.edge = e.clientY < r.top + r.height / 2 ? "top" : "bottom"
  }
  return (
    <li data-slot="rows-item" {...props}>
      <Comp
        data-slot="rows-row"
        data-force={force}
        aria-current={current}
        className={cn("db-rows-link", className)}
        {...(href !== undefined ? { href } : {})}
        onClick={onClick}
        onPointerEnter={edge}
        onPointerLeave={edge}
      >
        {children}
      </Comp>
    </li>
  )
}

function RowTitle({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="rows-title" className={cn("db-rows-title", className)} {...props} />
}

function RowKind({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="rows-kind" className={cn("db-rows-kind", className)} {...props} />
}

/** The quiet fact at the end: a year, a count. */
function RowMeta({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="rows-meta" className={cn("db-rows-meta", className)} {...props} />
}

export { Rows, Row, RowTitle, RowKind, RowMeta, type RowsProps, type RowProps }
