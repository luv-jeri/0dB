"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type TableProps = React.ComponentProps<"table"> & {
  /**
   * ink: the column you sort by is set in ink. forte: it is also set loud, in large thin figures,
   * against the small print of the rest. cross: as on a road atlas's distance chart, the row and
   * column of the cell you point at cross in ink, the cell itself in the accent, the rest in pencil.
   */
  variant?: "ink" | "forte" | "cross"
}

/** Hairline rows in tabular figures. The column you sort by is set in ink. */
function Table({ className, variant = "ink", ...props }: TableProps) {
  return <table data-slot="table" data-variant={variant === "ink" ? undefined : variant} className={cn("db-table", className)} {...props} />
}

function TableHeader(props: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" {...props} />
}

/** Re-sorted, each row glides from where it was to where it is now (FLIP), andante. Still under reduced motion. */
function TableBody({ ref, ...props }: React.ComponentProps<"tbody">) {
  const own = React.useRef<HTMLTableSectionElement>(null)
  const was = React.useRef(new WeakMap<Element, number>())
  React.useLayoutEffect(() => {
    const body = own.current
    if (!body) return
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    const cs = getComputedStyle(body)
    const tempo = { duration: parseFloat(cs.getPropertyValue("--db-andante")) || 640, easing: cs.getPropertyValue("--db-breath").trim() || "ease" }
    for (const row of body.rows) {
      const from = was.current.get(row)
      was.current.set(row, row.offsetTop) // offsetTop, not the viewport: scrolling between renders isn't a move
      if (still || from === undefined || from === row.offsetTop) continue
      row.animate([{ translate: `0 ${from - row.offsetTop}px` }, { translate: "0 0" }], tempo)
    }
  })
  return (
    <tbody
      ref={(el) => {
        own.current = el
        if (typeof ref === "function") ref(el)
        else if (ref) ref.current = el
      }}
      data-slot="table-body"
      {...props}
    />
  )
}

function TableFooter(props: React.ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" {...props} />
}

type TableRowProps = React.ComponentProps<"tr"> & {
  /** A chosen row: its name turns italic. */
  picked?: boolean
}

function TableRow({ picked, ...props }: TableRowProps) {
  return <tr data-slot="table-row" data-picked={picked || undefined} {...props} />
}

type TableHeadProps = React.ComponentProps<"th"> & {
  /** Right-align a column of figures. */
  numeric?: boolean
  /** The column the rows are sorted by. Put a button inside to make it sortable. */
  sort?: "ascending" | "descending"
}

function TableHead({ numeric, sort, scope = "col", ...props }: TableHeadProps) {
  return <th data-slot="table-head" data-num={numeric || undefined} aria-sort={sort} scope={scope} {...props} />
}

type TableCellProps = React.ComponentProps<"td"> & {
  numeric?: boolean
  /** The cell sits in the sorted column, so it is set in ink. */
  sorted?: boolean
  /** The row's name: it turns italic when the row is picked. */
  primary?: boolean
}

function TableCell({ numeric, sorted, primary, className, ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      data-num={numeric || undefined}
      data-sorted={sorted || undefined}
      className={cn(primary && "db-table-name", className)}
      {...props}
    />
  )
}

/** Names the table for screen readers; visually hidden. */
function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("db-sr", className)} {...props} />
}

/** A ring that fills when the row is chosen. Give it an aria-label naming the row. */
function TablePick({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  return <input type="checkbox" data-slot="table-pick" className={cn("db-table-pick", className)} {...props} />
}

export { type TableProps, Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption, TablePick }
