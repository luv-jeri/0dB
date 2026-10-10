"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0nlytype/lib/utils"
import { Button } from "@/registry/0nlytype/ui/button"
import { Scrollbar, type ScrollbarSection } from "@/registry/0nlytype/ui/scrollbar"
import { Sheet, SheetContent, SheetSpine, SheetTitle, SheetTrigger } from "@/registry/0nlytype/ui/sheet"

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

/** Splits a group's name into the part that stays when the column is folded and the part that folds away: "VI Controls" keeps "VI", "Start" keeps "S". */
function split(label: string): { mark: string; rest: string; numeral: boolean } {
  const [first, ...more] = label.split(" ")
  if (more.length && /^[IVXLCDM]+$/.test(first)) return { mark: first, rest: more.join(" "), numeral: true }
  const [initial, ...rest] = Array.from(label)
  return { mark: initial ?? "", rest: rest.join(""), numeral: false }
}

/** Keep a word's initial when folded. Anything that isn't plain text is left alone. */
function fold(node: React.ReactNode): React.ReactNode {
  if (typeof node !== "string" || node.length < 2) return node
  const { mark, rest } = split(node)
  return (
    // bdi: the two halves are inline-blocks, which bidi treats as neutral, so in a right-to-left page "Start" read
    // "tartS". Isolated, they take their order from the word's own letters.
    <bdi>
      <span className="ot-sidebar-i">{mark}</span>
      <span className="ot-sidebar-rest">{rest}</span>
    </bdi>
  )
}

/** The groups in the list, as marks for the column's rail: a string, so React can tell when it changed. */
const readGroups = (list: HTMLElement | null) =>
  JSON.stringify(
    [...(list?.querySelectorAll<HTMLElement>("[data-slot=sidebar-label]") ?? [])].map((l) => {
      const { mark, rest, numeral } = split(l.dataset.name ?? "")
      return { id: l.id, num: numeral ? mark : "", name: numeral ? rest : (l.dataset.name ?? "") }
    }),
  )
const never = () => () => {}

/** What is being pointed at while folded: it gets its name in the margin, on a leader line. */
type Peek = { key: string; name: string; group: string; y: number; edge: number; rtl: boolean }
type Peeking = { peek: Peek | null; slot: HTMLElement | null; folded: boolean }
const PeekContext = React.createContext<Peeking>({ peek: null, slot: null, folded: false })

type SidebarProps = Omit<React.ComponentProps<"nav">, "aria-label"> & {
  /** Names the landmark: "Studio app", "Docs". */
  label: string
  /** The trigger's word, and the sheet's name, when the window is too narrow for the column. */
  sheetLabel?: string
  /** The column folds to a ruler: each group keeps its numeral or initial, each link a tick, and pointing at or focusing one draws its name (and a link's preview) in the margin. */
  folded?: boolean
  /** Smaller words, closer together: for a long index. */
  compact?: boolean
  /**
   * words: every group open. chapter: only the group you are in stands open; the others keep their names, and open
   * for a still pointer or for focus. numerals: each group's place (01, 02) set large in the
   * margin, its label and links small beside it. Unfolded only: folded, every variant is the ruler.
   */
  variant?: "words" | "chapter" | "numerals"
}

/**
 * A column of words beside the work. Wide, it stands inline; narrow, only a quiet trigger shows
 * and the same words open in a sheet. Choosing a link in the sheet puts it away.
 */
function Sidebar({ label, sheetLabel = "Index", folded, compact, variant = "words", className, children, onScroll, ...props }: SidebarProps) {
  const wide = useWide()
  const [open, setOpen] = React.useState(false)
  // Widening puts the sheet away, so it isn't waiting open when the window narrows again.
  const [was, setWas] = React.useState(wide)
  if (wide !== was) {
    setWas(wide)
    if (wide) setOpen(false)
  }

  // Pointing at a tick (or focusing it) names it in the margin. One callout is shared, and follows.
  const [peek, setPeek] = React.useState<Peek | null>(null)
  const [slot, setSlot] = React.useState<HTMLElement | null>(null)
  const [hushed, setHushed] = React.useState(false)
  const target = React.useRef<HTMLElement | null>(null)
  const callout = React.useRef<HTMLDivElement>(null)
  const list = React.useRef<HTMLDivElement>(null)
  const ruler = folded && wide !== false
  // Unfolding, or the window narrowing: nothing is pointed at any more.
  const [wasRuler, setWasRuler] = React.useState(ruler)
  if (ruler !== wasRuler) {
    setWasRuler(ruler)
    setPeek(null)
  }

  // Each group is a mark on the column's rail, as a page's sections are on the page's. Folded, the ruler already numbers them.
  const groups = React.useSyncExternalStore(never, () => (ruler ? "[]" : readGroups(list.current)), () => "[]") // read again after each commit

  const look = (from: EventTarget | null) => {
    const el = from instanceof Element ? from.closest<HTMLElement>("[data-slot=sidebar-link], [data-slot=sidebar-label]") : null
    target.current = el
    const box = list.current
    if (!el || !box || !ruler) return setPeek(null)
    const r = el.getBoundingClientRect(), edge = box.getBoundingClientRect()
    const rtl = getComputedStyle(box).direction === "rtl"
    const link = el.dataset.slot === "sidebar-link"
    setPeek({
      key: link ? el.dataset.peekId! : "",
      name: el.dataset.name ?? el.textContent ?? "",
      group: link ? el.closest<HTMLElement>("[data-slot=sidebar-group]")?.dataset.name ?? "" : "",
      y: r.top + r.height / 2,
      edge: rtl ? edge.left : edge.right,
      rtl,
    })
  }

  // The callout sits beside its tick, kept inside the window; the leader line reaches back to the tick.
  React.useLayoutEffect(() => {
    const el = callout.current
    if (!el || !peek) return
    const place = () => {
      const name = el.querySelector<HTMLElement>("[data-slot=sidebar-callout-name]")
      const lead = name ? name.offsetTop + name.offsetHeight / 2 : 0
      const top = Math.max(8, Math.min(peek.y - lead, innerHeight - el.offsetHeight - 8))
      el.style.top = `${top}px`
      el.style.setProperty("--leader", `${peek.y - top}px`)
    }
    place()
    const watch = new ResizeObserver(place)
    watch.observe(el)
    return () => watch.disconnect()
  }, [peek])

  return (
    <nav
      data-slot="sidebar"
      aria-label={label}
      className={cn("ot-sidebar ot-scroll", className)}
      onScroll={(e) => {
        onScroll?.(e)
        if (target.current) look(target.current) // the tick moved under the pointer
      }}
      {...props}
    >
      {wide !== false && (
        <PeekContext.Provider value={{ peek, slot, folded: !!ruler }}>
          <div
            ref={list}
            data-slot="sidebar-list"
            data-folded={folded || undefined}
            data-compact={compact || undefined}
            data-variant={variant}
            className="ot-sidebar-list"
            onPointerOver={(e) => {
              if (e.pointerType === "touch") return
              setHushed(false)
              look(e.target)
            }}
            onPointerLeave={() => !list.current?.contains(document.activeElement) && look(null)}
            onFocus={(e) => {
              setHushed(false)
              look(e.target.matches(":focus-visible") ? e.target : null)
            }}
            onBlur={(e) => !list.current?.contains(e.relatedTarget as Node | null) && look(null)}
            onKeyDown={(e) => e.key === "Escape" && peek && setHushed(true)}
          >
            {children}
          </div>
          {ruler && peek && !hushed && (
            <div
              ref={callout}
              key={peek.key || peek.name}
              data-slot="sidebar-callout"
              data-rtl={peek.rtl || undefined}
              aria-hidden="true"
              className="ot-sidebar-callout"
              style={peek.rtl ? { right: innerWidth - peek.edge } : { left: peek.edge }}
            >
              <p data-slot="sidebar-callout-name" className="ot-sidebar-callout-name">{peek.name}</p>
              {peek.group ? <p className="ot-sidebar-callout-group">{peek.group}</p> : null}
              <div ref={setSlot} className="ot-sidebar-callout-preview" />
            </div>
          )}
        </PeekContext.Provider>
      )}
      <Sheet open={open} onOpenChange={setOpen}>
        {wide !== true && (
          <SheetTrigger asChild>
            <Button variant="quiet" data-slot="sidebar-trigger">{sheetLabel}</Button>
          </SheetTrigger>
        )}
        {wide === false && (
          <SheetContent side="start" className="ot-sidebar-sheet">
            <SheetSpine>{sheetLabel}</SheetSpine>
            <SheetTitle className="ot-sr">{sheetLabel}</SheetTitle>
            <div
              data-slot="sidebar-list"
              data-compact={compact || undefined}
              data-variant={variant}
              className="ot-sidebar-list"
              onClick={(e) => {
                if ((e.target as Element).closest("a[href]")) setOpen(false)
              }}
            >
              {children}
            </div>
          </SheetContent>
        )}
      </Sheet>
      <Scrollbar sections={JSON.parse(groups) as ScrollbarSection[]} />
    </nav>
  )
}

/** The column's own name, at the top. Folded, it too keeps its initial. */
function SidebarHead({ className, children, ...props }: React.ComponentProps<"p">) {
  return (
    <p data-slot="sidebar-head" className={cn("ot-sidebar-head", className)} {...props}>
      {fold(children)}
    </p>
  )
}

type SidebarGroupProps = Omit<React.ComponentProps<"div">, "aria-labelledby"> & {
  /** What the links share: a movement ("VI Controls"), a section. Folded, a leading roman numeral stays ("VI"), or else the initial. */
  label: string
}

function SidebarGroup({ label, className, children, ...props }: SidebarGroupProps) {
  const id = React.useId()
  const { mark, rest, numeral } = split(label)
  return (
    <div data-slot="sidebar-group" data-name={label} className={cn("ot-sidebar-group", className)} {...props}>
      <p id={id} data-slot="sidebar-label" data-name={label} className="ot-sidebar-label">
        <bdi>
          <span className="ot-sidebar-i">{mark}</span>
          {numeral ? " " : null}
          <span className="ot-sidebar-rest" data-numeral={numeral || undefined}>{rest}</span>
        </bdi>
      </p>
      <ul aria-labelledby={id} className="ot-sidebar-links">{children}</ul>
    </div>
  )
}

type SidebarLinkProps = React.ComponentProps<"a"> & {
  /** The page you are on: it carries the accent dot. */
  current?: boolean
  /** Render the child (a framework's Link) with the sidebar's look. */
  asChild?: boolean
  /** Shown beside the tick, under its name, while the column is folded and the link is pointed at or focused: a sentence about where it goes. */
  preview?: React.ReactNode
}

function SidebarLink({ current, asChild = false, preview, className, children, ...props }: SidebarLinkProps) {
  const Comp = asChild ? Slot : "a"
  const id = React.useId()
  const { peek, slot } = React.useContext(PeekContext)
  // The word sits in its own box so folding can take it away and leave the name for assistive technology.
  const word = (node: React.ReactNode) => <span className="ot-sidebar-text">{node}</span>
  const label = asChild && React.isValidElement<{ children?: React.ReactNode }>(children) ? React.cloneElement(children, undefined, word(children.props.children)) : word(children)
  return (
    <li data-slot="sidebar-item" className="ot-sidebar-item">
      <Comp data-slot="sidebar-link" data-peek-id={id} data-peeked={peek?.key === id || undefined} aria-current={current ? "page" : undefined} className={cn("ot-sidebar-link", className)} {...props}>
        {label}
      </Comp>
      {preview && slot && peek?.key === id ? createPortal(preview, slot) : null}
    </li>
  )
}

export { Sidebar, SidebarHead, SidebarGroup, SidebarLink, type SidebarProps }
