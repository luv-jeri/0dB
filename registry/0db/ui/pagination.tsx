import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0db/lib/utils"

/** Numbers with a dot beneath each; the current page's dot is the accent. */
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="pagination" aria-label="Pages" className={className} {...props} />
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("db-pager", className)} {...props} />
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = React.ComponentProps<"a"> & {
  isActive?: boolean
  /** Render your own link (Next's Link, say) with the pager's look. */
  asChild?: boolean
}

/** A page number. Give it an aria-label ("Page 3"); the number alone is a poor name. */
function PaginationLink({ isActive = false, asChild = false, ...props }: PaginationLinkProps) {
  const Comp = asChild ? Slot : "a"
  return <Comp data-slot="pagination-link" aria-current={isActive ? "page" : undefined} {...props} />
}

type StepProps = Omit<PaginationLinkProps, "isActive" | "href"> & {
  /** Omit at the first or last page: the step shows, but doesn't go anywhere. */
  href?: string
}

function step(kind: "previous" | "next", dflt: string) {
  return function Step({ href, asChild = false, className, children = dflt, ...props }: StepProps) {
    const Comp = asChild ? Slot : href === undefined ? "span" : "a"
    // A word label (the neighbour's name) needs its direction spoken too.
    const label = typeof children === "string" && children !== dflt ? `${kind === "previous" ? "Previous" : "Next"}: ${children}` : undefined
    return (
      <Comp
        data-slot={`pagination-${kind}`}
        className={cn("db-pager-step", className)}
        rel={href === undefined ? undefined : kind === "previous" ? "prev" : "next"}
        aria-label={label}
        aria-disabled={href === undefined && !asChild ? true : undefined}
        {...(href === undefined ? {} : { href })}
        {...props}
      >
        {children}
      </Comp>
    )
  }
}

/** ← Previous, or ← and a word: the neighbour's name reads well here. The arrow is drawn, so pass only the words. */
const PaginationPrevious = step("previous", "Previous")
/** Next →, or a word and →. */
const PaginationNext = step("next", "Next")

/** Pages left out. */
function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="pagination-ellipsis" className={cn("db-pager-gap", className)} {...props}>
      <span aria-hidden="true">…</span>
      <span className="db-sr">More pages</span>
    </span>
  )
}

export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis, type PaginationLinkProps }
