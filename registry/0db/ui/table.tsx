import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

/** Hairline rows in tabular figures. The column you sort by is set in ink. */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return <table data-slot="table" className={cn("db-table", className)} {...props} />
}

function TableHeader(props: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" {...props} />
}

function TableBody(props: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" {...props} />
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

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption, TablePick }
