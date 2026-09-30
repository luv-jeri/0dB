"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0db/lib/utils"
import { Button } from "@/registry/0db/ui/button"
import { Sheet, SheetContent, SheetSpine, SheetTitle, SheetTrigger } from "@/registry/0db/ui/sheet"

/** The width at which the words fit beside the work. It is also in sidebar.css: a media query can't read a variable. */
const BREAKPOINT = 860
const WIDE = `(min-width: ${BREAKPOINT}px)`

/** true once the window is wide; null until the browser has said (the server and the first paint show both surfaces and let CSS choose). */
function useWide() {
  return React.useSyncExternalStore<boolean | null>(
    (notify) => {
      const query = matchMedia(WIDE)
      query.addEventListener("change", notify)
      return () => query.removeEventListener("change", notify)
    },
    () => matchMedia(WIDE).matches,
    () => null,
  )
}

/** Set a word large and light by its first letter, so folding leaves only that. Anything that isn't plain text is left alone. */
function fold(node: React.ReactNode): React.ReactNode {
  if (typeof node !== "string" || node.length < 2) return node
  const [first, ...rest] = Array.from(node)
  return (
    <>
      <span className="db-sidebar-i">{first}</span>
      <span className="db-sidebar-rest">{rest.join("")}</span>
    </>
  )
}

type SidebarProps = Omit<React.ComponentProps<"nav">, "aria-label"> & {
  /** Names the landmark: "Studio app", "Docs". */
  label: string
  /** The trigger's word, and the sheet's name, when the window is too narrow for the column. */
  sheetLabel?: string
  /** Each word keeps only its initial, set large and light; the rest folds away in turn. */
  folded?: boolean
  /** Smaller words, closer together: for a long index. */
  compact?: boolean
}

/**
 * A column of words beside the work. Wide, it stands inline; narrow, only a quiet trigger shows
 * and the same words open in a sheet. Choosing a link in the sheet puts it away.
 */
function Sidebar({ label, sheetLabel = "Index", folded, compact, className, children, ...props }: SidebarProps) {
  const wide = useWide()
  const [open, setOpen] = React.useState(false)
  // Widening puts the sheet away, so it isn't waiting open when the window narrows again.
  const [was, setWas] = React.useState(wide)
  if (wide !== was) {
    setWas(wide)
    if (wide) setOpen(false)
  }

  return (
    <nav data-slot="sidebar" aria-label={label} className={cn("db-sidebar", className)} {...props}>
      {wide !== false && (
        <div data-slot="sidebar-list" data-folded={folded || undefined} data-compact={compact || undefined} className="db-sidebar-list">
          {children}
        </div>
      )}
      <Sheet open={open} onOpenChange={setOpen}>
        {wide !== true && (
          <SheetTrigger asChild>
            <Button variant="quiet" data-slot="sidebar-trigger">{sheetLabel}</Button>
          </SheetTrigger>
        )}
        {wide === false && (
          <SheetContent side="start" className="db-sidebar-sheet">
            <SheetSpine>{sheetLabel}</SheetSpine>
            <SheetTitle className="db-sr">{sheetLabel}</SheetTitle>
            <div
              data-slot="sidebar-list"
              data-compact={compact || undefined}
              className="db-sidebar-list"
              onClick={(e) => {
                if ((e.target as Element).closest("a[href]")) setOpen(false)
              }}
            >
              {children}
            </div>
          </SheetContent>
        )}
      </Sheet>
    </nav>
  )
}

/** The column's own name, at the top. Folded, it too keeps its initial. */
function SidebarHead({ className, children, ...props }: React.ComponentProps<"p">) {
  return (
    <p data-slot="sidebar-head" className={cn("db-sidebar-head", className)} {...props}>
      {fold(children)}
    </p>
  )
}

type SidebarGroupProps = Omit<React.ComponentProps<"div">, "aria-labelledby"> & {
  /** What the links share: a movement ("VI Controls"), a section. */
  label: string
}

function SidebarGroup({ label, className, children, ...props }: SidebarGroupProps) {
  const id = React.useId()
  return (
    <div data-slot="sidebar-group" className={cn("db-sidebar-group", className)} {...props}>
      <p id={id} data-slot="sidebar-label" className="db-sidebar-label">{label}</p>
      <ul aria-labelledby={id} className="db-sidebar-links">{children}</ul>
    </div>
  )
}

type SidebarLinkProps = React.ComponentProps<"a"> & {
  /** The page you are on: it carries the accent dot. */
  current?: boolean
  /** Render the child (a framework's Link) with the sidebar's look. */
  asChild?: boolean
}

function SidebarLink({ current, asChild = false, className, children, ...props }: SidebarLinkProps) {
  const Comp = asChild ? Slot : "a"
  // A Slot's child carries the label, so fold that instead.
  const label = asChild && React.isValidElement<{ children?: React.ReactNode }>(children) ? React.cloneElement(children, undefined, fold(children.props.children)) : fold(children)
  return (
    <li data-slot="sidebar-item" className="db-sidebar-item">
      <Comp data-slot="sidebar-link" aria-current={current ? "page" : undefined} className={cn("db-sidebar-link", className)} {...props}>
        {label}
      </Comp>
    </li>
  )
}

export { Sidebar, SidebarHead, SidebarGroup, SidebarLink, type SidebarProps }
