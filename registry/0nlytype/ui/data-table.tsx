"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"
import { Button } from "@/registry/0nlytype/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/registry/0nlytype/ui/pagination"
import { Select } from "@/registry/0nlytype/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, type TableProps } from "@/registry/0nlytype/ui/table"

type DataTableColumn<T> = {
  id: string
  header: string
  /** What the column sorts by, and what it shows unless `cell` says otherwise. */
  value: (row: T) => string | number
  cell?: (row: T) => React.ReactNode
  /** Right-aligned figures. Its first sort is largest first. */
  numeric?: boolean
  /** The row's name. */
  primary?: boolean
  /** Set false for a column you can't sort by. */
  sortable?: boolean
}

type DataTableFilter<T> = { id: string; label: string; test: (row: T) => boolean }

type Sort = { id: string; dir: 1 | -1 }

type DataTableProps<T> = Omit<React.ComponentProps<"div">, "children"> & {
  data: T[]
  columns: DataTableColumn<T>[]
  /** What the rows are, in the plural: "projects". It finishes the filter's sentence and the count. */
  noun?: string
  /** Names the table for screen readers. */
  caption: string
  /** A stable name for a row, so it keeps its place (and glides) through sorting and filtering. Defaults to its index in data. */
  getRowId?: (row: T, index: number) => string
  /** The ways to narrow the rows. The sentence "Show [all] projects" offers them; "all" is always first. */
  filters?: DataTableFilter<T>[]
  filter?: string
  defaultFilter?: string
  onFilterChange?: (filter: string) => void
  defaultSort?: Sort
  page?: number
  defaultPage?: number
  onPageChange?: (page: number) => void
  pageSize?: number
  /** Where a page's link goes when opened in a new tab. A plain press turns the page in place. */
  pageHref?: (page: number) => string
  /** folio: a page at a time, the book's folio at the foot. tail: the table ends in the rest of itself ("and 6 more"). */
  variant?: "folio" | "tail"
  /** The table's own setting: ink, or forte (the sorted column set loud). */
  tableVariant?: Exclude<TableProps["variant"], "cross">
}

const byIndex = (_row: unknown, i: number) => String(i)
const pad = (n: number) => String(n).padStart(2, "0")
const compare = (a: string | number, b: string | number) => (typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b)))

/**
 * Records you can narrow, sort and page. The filter is a sentence ("Show identity projects"); pressing a heading sorts by
 * it, the column turns ink and the rows glide to their places; the pages turn at a folio, or the table ends in the rest
 * of itself. Rows that come into view (a new page, the rest shown) arrive in turn.
 */
function DataTable<T>({
  data,
  columns,
  noun = "rows",
  caption,
  getRowId = byIndex,
  filters = [],
  filter,
  defaultFilter = "all",
  onFilterChange,
  defaultSort,
  page,
  defaultPage = 1,
  onPageChange,
  pageSize = 8,
  pageHref = (n) => `?page=${n}`,
  variant = "folio",
  tableVariant,
  className,
  ...props
}: DataTableProps<T>) {
  const [ownFilter, setOwnFilter] = React.useState(defaultFilter)
  const [ownPage, setOwnPage] = React.useState(defaultPage)
  const [sort, setSort] = React.useState<Sort | null>(defaultSort ?? null)
  const [arriving, setArriving] = React.useState<number | null>(null) // rows from this index arrive in turn

  const chosen = filters.find((f) => f.id === (filter ?? ownFilter))
  const rows = React.useMemo(() => {
    const all = data.map((row, i) => ({ row, id: getRowId(row, i) }))
    const kept = chosen ? all.filter(({ row }) => chosen.test(row)) : all
    const col = columns.find((c) => c.id === sort?.id)
    return col && sort ? [...kept].sort((a, b) => compare(col.value(a.row), col.value(b.row)) * sort.dir) : kept
  }, [data, getRowId, chosen, columns, sort])

  const size = Math.max(1, Math.floor(pageSize))
  const pages = Math.max(1, Math.ceil(rows.length / size))
  const current = Math.min(pages, Math.max(1, page ?? ownPage))
  const from = variant === "folio" ? (current - 1) * size : 0
  const to = Math.min(rows.length, current * size)
  const shown = rows.slice(from, to)

  function turn(next: number, arriveFrom: number | null) {
    setArriving(arriveFrom)
    if (page === undefined) setOwnPage(next)
    onPageChange?.(next)
  }
  function narrow(next: string) {
    setArriving(null)
    if (filter === undefined) setOwnFilter(next)
    onFilterChange?.(next)
    if (page === undefined) setOwnPage(1)
    onPageChange?.(1)
  }
  const go = (n: number) => ({
    href: pageHref(n),
    onClick(e: React.MouseEvent<HTMLAnchorElement>) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return // a new tab: let the link be a link
      e.preventDefault()
      if (n !== current) turn(n, 0)
      // A step that runs out of pages stops being a link, which drops focus. Keep it in the pager, on the page.
      const nav = e.currentTarget.closest("nav")
      requestAnimationFrame(() => {
        if (nav && !nav.contains(document.activeElement)) (nav.querySelector<HTMLElement>('[aria-current="page"]') ?? nav.querySelector<HTMLElement>("a[href]"))?.focus()
      })
    },
  })

  const kind = chosen ? `${chosen.label} ` : ""
  const left = rows.length - to

  return (
    <div data-slot="data-table" data-variant={variant} className={cn("ot-data-table", className)} {...props}>
      {filters.length ? (
        <p className="ot-data-table-filter">
          <Select label="Show" value={chosen ? chosen.id : "all"} onChange={(e) => narrow(e.target.value)}>
            <option value="all">all</option>
            {filters.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </Select>{" "}
          <span>{noun}</span>
        </p>
      ) : null}
      <Table variant={tableVariant}>
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.id} numeric={c.numeric} sort={sort?.id === c.id ? (sort.dir === 1 ? "ascending" : "descending") : undefined}>
                {c.sortable === false ? (
                  c.header
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setArriving(null)
                      setSort({ id: c.id, dir: sort?.id === c.id ? (-sort.dir as 1 | -1) : c.numeric ? -1 : 1 })
                    }}
                  >
                    {c.header}
                  </button>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map(({ row, id }, i) => (
            <TableRow
              key={id}
              data-arriving={arriving !== null && from + i >= arriving ? "" : undefined}
              style={arriving !== null ? ({ "--k": from + i - arriving } as React.CSSProperties) : undefined}
            >
              {columns.map((c) => (
                <TableCell key={c.id} numeric={c.numeric} primary={c.primary} sorted={sort?.id === c.id}>
                  {c.cell ? c.cell(row) : c.value(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {shown.length ? null : (
            <TableRow>
              <TableCell colSpan={columns.length} className="ot-data-table-empty">
                {data.length ? `No ${kind}${noun}.` : `No ${noun} yet.`}{" "}
                {chosen ? (
                  <Button variant="quiet" onClick={() => narrow("all")}>
                    Show all {noun}
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="ot-data-table-foot">
        <p className="ot-data-table-count" role="status">
          {from === 0 && to === rows.length ? `${rows.length} ${noun}` : variant === "tail" ? `${to} of ${rows.length} ${noun}` : `${from + 1} to ${to} of ${rows.length} ${noun}`}
        </p>
        {variant === "folio" && pages > 1 ? (
          <Pagination aria-label={`Pages of ${noun}`}>
            <PaginationContent variant="folio">
              <PaginationItem><PaginationPrevious {...(current > 1 ? go(current - 1) : {})} /></PaginationItem>
              <PaginationItem><PaginationLink {...go(current)} aria-label={`Page ${current} of ${pages}`} isActive>{pad(current)}</PaginationLink></PaginationItem>
              <PaginationItem aria-hidden="true">{pad(pages)}</PaginationItem>
              <PaginationItem><PaginationNext {...(current < pages ? go(current + 1) : {})} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
        {variant === "tail" && rows.length > size ? (
          <Button
            variant="quiet"
            className="ot-data-table-more"
            aria-label={left > size ? `and ${left} more, show the next ${size}` : undefined}
            onClick={() => (left > 0 ? turn(current + 1, to) : turn(1, null))}
          >
            {left > 0 ? `and ${left} more` : "Show fewer"}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export { DataTable, type DataTableProps, type DataTableColumn, type DataTableFilter }
