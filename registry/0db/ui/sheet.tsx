"use client"

import * as React from "react"

import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0db/lib/utils"
import { Dialog, DialogActions, DialogClose, DialogSurface, DialogTrigger, useDialog } from "@/registry/0db/ui/dialog"

/** What opened the sheet, so a fold can grow out of it. */
const Opener = React.createContext<React.RefObject<HTMLElement | null> | null>(null)

/** A page slid in from the edge. Same props and behaviour as Dialog: the native <dialog> keeps focus, Escape and the top layer. */
function Sheet(props: React.ComponentProps<typeof Dialog>) {
  const openerRef = React.useRef<HTMLElement | null>(null)
  return (
    <Opener.Provider value={openerRef}>
      <Dialog {...props} />
    </Opener.Provider>
  )
}

/** Opens the sheet. It remembers itself, so a fold sheet grows from it (a Row, through `<Row asChild><SheetTrigger>`). */
function SheetTrigger({ onClick, ...props }: React.ComponentProps<typeof DialogTrigger>) {
  const openerRef = React.useContext(Opener)
  return (
    <DialogTrigger
      {...props}
      onClick={(e) => {
        if (openerRef) openerRef.current = e.currentTarget
        onClick?.(e)
      }}
    />
  )
}

const SheetClose = DialogClose

type SheetContentProps = React.ComponentProps<"dialog"> & {
  /** Which edge it slides from. Logical, so start is the right edge in right-to-left. */
  side?: "start" | "end" | "top" | "bottom"
  /**
   * spine: the title runs up the spine, in its own column. shelf: a sheet opened from inside it stands in
   * front, one spine narrower, so this one's spine stays in view like a book on a shelf, and is the way back.
   * rag: the text is set flush to the window's edge, and the paper is cut to the rag of its lines.
   * fold: the row that opened it unfolds into the page: its two hairlines part to the window's edges and its
   * name grows into the page's title. Put it away and the page folds back into the row.
   */
  variant?: "spine" | "shelf" | "rag" | "fold"
}

type Rag = { w: number; h: number; fill: string; line: string }

/**
 * Cuts the paper to the words: every line box in the sheet, merged into rows, stepped out by the padding on
 * the side that faces the page. Measured from the live layout (the fonts, the pair and the width decide the
 * rag), so it re-cuts on resize and when <html> changes its face.
 */
function useRag(probe: React.RefObject<HTMLElement | null>, on: boolean) {
  const { open } = useDialog()
  const [rag, setRag] = React.useState<Rag | null>(null)

  React.useEffect(() => {
    const d = probe.current?.closest("dialog")
    if (!on || !open || !d) return
    let frame = 0
    const cut = () => {
      const box = d.getBoundingClientRect()
      const style = getComputedStyle(d)
      const pad = parseFloat(style.paddingInlineEnd) || 40
      // Which physical edge it stands on: end is the right in left-to-right, start is the right in right-to-left.
      const right = (d.dataset.side !== "start") !== (style.direction === "rtl")
      const rows: { top: number; bottom: number; x: number }[] = []
      const walk = document.createTreeWalker(d, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => (n.parentElement?.closest("svg, .db-scrollbar, .db-sr") || !n.textContent?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
      })
      const range = document.createRange()
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        range.selectNodeContents(n)
        for (const r of range.getClientRects()) {
          if (r.width < 1) continue
          rows.push({ top: r.top - box.top + d.scrollTop, bottom: r.bottom - box.top + d.scrollTop, x: (right ? r.left : r.right) - box.left })
        }
      }
      if (!rows.length) return
      rows.sort((a, b) => a.top - b.top)
      const merged = [rows[0]]
      for (const r of rows.slice(1)) {
        const last = merged[merged.length - 1]
        // Same line when its middle falls inside the last: tight leading makes the next line's box overlap this one.
        if ((r.top + r.bottom) / 2 < last.bottom) Object.assign(last, { bottom: Math.max(last.bottom, r.bottom), x: right ? Math.min(last.x, r.x) : Math.max(last.x, r.x) })
        else merged.push({ ...r })
      }
      const w = d.clientWidth
      const h = d.scrollHeight
      const at = (x: number) => Math.round(Math.min(w, Math.max(0, right ? x - pad : x + pad)))
      const edge = right ? w : 0
      let line = `M${at(merged[0].x)} 0`
      merged.forEach((r, i) => {
        const next = merged[i + 1]
        const y = next ? Math.round((r.bottom + next.top) / 2) : h - 1
        line += ` V${y}`
        if (next) line += ` H${at(next.x)}`
      })
      line += ` H${edge}`
      setRag({ w, h, line, fill: `M${edge} 0 H${at(merged[0].x)}${line.slice(line.indexOf(" "))} Z` })
      d.setAttribute("data-laid", "")
    }
    const soon = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(cut)
    }
    document.fonts.ready.then(soon)
    const resized = new ResizeObserver(soon)
    resized.observe(d)
    const restyled = new MutationObserver(soon)
    restyled.observe(document.documentElement, { attributes: true })
    return () => {
      cancelAnimationFrame(frame)
      resized.disconnect()
      restyled.disconnect()
    }
  }, [probe, on, open])

  return rag
}

const ms = (v: string) => (v.trim().endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000) || 0

/**
 * Fold: the page grows out of what opened it. Before the dialog opens (and again before it closes) the opener's
 * box is written to --fold-t/r/b/l, so the clip and the two hairlines open out from the row and fold back to it
 * in CSS. The title flies between the row's name and its own place by a transform, measured both ways.
 */
function useFold(probe: React.RefObject<HTMLElement | null>, on: boolean) {
  const { open } = useDialog()
  const openerRef = React.useContext(Opener)
  const flip = React.useCallback((d: HTMLElement, from: HTMLElement | null, title: HTMLElement | null) => {
    if (!from || !title) return null
    const a = from.getBoundingClientRect()
    const b = title.getBoundingClientRect()
    const fa = getComputedStyle(from)
    const fb = getComputedStyle(title)
    const s = parseFloat(fa.fontSize) / parseFloat(fb.fontSize)
    const lh = (st: CSSStyleDeclaration) => parseFloat(st.lineHeight) || parseFloat(st.fontSize) * 1.2
    const rtl = fb.direction === "rtl"
    title.style.transformOrigin = rtl ? "100% 0" : "0 0"
    // The first lines' middles meet, whatever each one's leading.
    const dx = rtl ? a.right - b.right : a.left - b.left
    const dy = a.top + lh(fa) / 2 - (b.top + (lh(fb) * s) / 2)
    const style = getComputedStyle(d)
    return {
      transform: `translate(${dx}px, ${dy}px) scale(${s})`,
      duration: ms(style.getPropertyValue("--db-andante")),
      easing: style.getPropertyValue("--db-exhale").trim() || "ease-out",
    }
  }, [])

  // Before showModal and before close: where the row is now, and whether it stands reversed out of ink.
  React.useLayoutEffect(() => {
    const d = probe.current?.closest("dialog")
    if (!on || !d) return
    const from = openerRef?.current ?? null
    const r = from?.isConnected ? from.getBoundingClientRect() : null
    const px = (v: number) => `${Math.round(Math.max(0, v))}px`
    for (const [k, v] of Object.entries(r ? { t: r.top, r: innerWidth - r.right, b: innerHeight - r.bottom, l: r.left } : {})) d.style.setProperty(`--fold-${k}`, px(v))
    d.toggleAttribute("data-from-ink", !!from?.matches('.db-rows:not([data-variant]) .db-rows-link:is(:hover, :focus-visible)'))
    // Closing (the page still laid out, before close() or while Escape's close plays): the title flies back.
    const title = d.querySelector<HTMLElement>(".db-sheet-title")
    if (open || !title?.getClientRects().length) return
    const f = flip(d, from?.querySelector<HTMLElement>("[data-slot=rows-title]") ?? from, title)
    if (f && title && !matchMedia("(prefers-reduced-motion: reduce)").matches) title.animate([{ transform: "none" }, { transform: f.transform }], { duration: f.duration, easing: f.easing, fill: "forwards" })
  }, [probe, on, open, openerRef, flip])

  // Opened: the row's name grows into the title.
  React.useEffect(() => {
    const d = probe.current?.closest("dialog")
    const title = d?.querySelector<HTMLElement>(".db-sheet-title") ?? null
    if (!on || !open || !d || !title) return
    title.getAnimations().forEach((a) => a.cancel())
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const from = openerRef?.current ?? null
    const f = flip(d, from?.isConnected ? (from.querySelector<HTMLElement>("[data-slot=rows-title]") ?? from) : null, title)
    if (f) title.animate([{ transform: f.transform }, { transform: "none" }], { duration: f.duration, easing: f.easing })
  }, [probe, on, open, openerRef, flip])
}

function SheetContent({ className, side = "end", variant = "spine", children, onClick, ...props }: SheetContentProps) {
  const { setOpen } = useDialog()
  const probe = React.useRef<HTMLSpanElement>(null) // DialogSurface keeps the dialog's own ref; the rag and the fold find it from here
  const ragged = variant === "rag" && (side === "start" || side === "end")
  const rag = useRag(probe, ragged)
  useFold(probe, variant === "fold")
  return (
    <DialogSurface
      data-slot="sheet-content"
      data-side={side}
      data-variant={variant === "spine" ? undefined : variant}
      className={cn("db-sheet", className)}
      onClick={(e) => {
        onClick?.(e)
        // A rag sheet's box is wider than its paper: a click on the bare part is a click outside.
        if (ragged && e.target === e.currentTarget) setOpen(false)
      }}
      {...props}
    >
      {children}
      {ragged && rag && (
        <svg className="db-sheet-rag" aria-hidden="true" width={rag.w} height={rag.h} viewBox={`0 0 ${rag.w} ${rag.h}`}>
          <path className="db-sheet-rag-paper" d={rag.fill} />
          <path className="db-sheet-rag-edge" d={rag.line} pathLength={1} />
        </svg>
      )}
      {(ragged || variant === "fold") && <span ref={probe} hidden />}
    </DialogSurface>
  )
}

type PanelsContextValue = { path: string[]; root: string; go: (to: string, from: HTMLElement | null) => void }
const PanelsContext = React.createContext<PanelsContextValue | null>(null)

function usePanels() {
  const ctx = React.useContext(PanelsContext)
  if (!ctx) throw new Error("SheetPanel and SheetPanelLink must sit inside <SheetPanels>.")
  return ctx
}

type SheetPanelsProps = Omit<React.ComponentProps<"div">, "defaultValue"> & {
  /** The panel it opens on, the root of the trail. Each opening of the sheet starts here again. */
  defaultValue: string
  /** Called with the panel you arrive at. */
  onValueChange?: (value: string) => void
}

/**
 * Pages inside one sheet, the chapters of the book on its spine. Stepping into a panel writes its name up the
 * spine, large, and the name you left shrinks into the pencil below it; the names below are the way back. The
 * panels must be direct children: their titles are read from them to set the trail.
 */
function SheetPanels({ defaultValue, onValueChange, className, children, ...props }: SheetPanelsProps) {
  const { open } = useDialog()
  const [path, setPath] = React.useState([defaultValue])
  const [step, setStep] = React.useState<"in" | "out">("in")
  const openers = React.useRef<(HTMLElement | null)[]>([])
  const host = React.useRef<HTMLDivElement>(null)
  const titles = new Map<string, React.ReactNode>()
  React.Children.forEach(children, (c) => {
    if (React.isValidElement<SheetPanelProps>(c) && c.props.value) titles.set(c.props.value, c.props.title)
  })

  // Put away, it opens on the root next time.
  if (!open && path.length > 1) setPath([defaultValue])

  const arrive = (next: string[], dir: "in" | "out", focus: () => HTMLElement | null | undefined) => {
    setStep(dir)
    setPath(next)
    onValueChange?.(next[next.length - 1])
    requestAnimationFrame(() => {
      host.current?.closest("dialog")?.scrollTo({ top: 0 })
      focus()?.focus({ preventScroll: true })
    })
  }
  const heading = () => host.current?.querySelector<HTMLElement>(".db-sheet-panel:not([hidden]) > .db-sheet-panel-title")
  const go = (to: string, from: HTMLElement | null) => {
    if (to === path[path.length - 1] || !titles.has(to)) return
    openers.current[path.length - 1] = from
    arrive([...path, to], "in", heading)
  }
  const back = (depth: number) => arrive(path.slice(0, depth + 1), "out", () => openers.current[depth] ?? heading())

  return (
    <PanelsContext.Provider value={{ path, root: defaultValue, go }}>
      <div ref={host} data-slot="sheet-panels" data-step={step} className={cn("db-sheet-panels", className)} {...props}>
        {/* The spine is the trail: the root at the foot, the panel you are in written large at the head. */}
        <nav className="db-sheet-spine db-sheet-trail" aria-label="Path">
          {path.map((v, i) => {
            const here = i === path.length - 1
            return (
              <button
                key={v}
                type="button"
                className="db-sheet-trail-step"
                aria-current={here ? "page" : undefined}
                aria-disabled={here || undefined}
                onClick={() => !here && back(i)}
              >
                {titles.get(v)}
              </button>
            )
          })}
        </nav>
        {children}
      </div>
    </PanelsContext.Provider>
  )
}

type SheetPanelProps = Omit<React.ComponentProps<"section">, "title"> & {
  value: string
  /** Its name: the panel's heading, and its step on the spine. */
  title: React.ReactNode
}

/** One page of the sheet. Only the one you are in is shown; the others wait, hidden and inert. */
function SheetPanel({ value, title, className, children, ...props }: SheetPanelProps) {
  const { path, root } = usePanels()
  const { titleId } = useDialog()
  const here = path[path.length - 1] === value
  return (
    <section data-slot="sheet-panel" hidden={!here} inert={!here} aria-label={typeof title === "string" ? title : undefined} className={cn("db-sheet-panel", className)} {...props}>
      <h2 id={value === root ? titleId : undefined} tabIndex={-1} className="db-sheet-title db-sheet-panel-title">
        {title}
      </h2>
      {children}
    </section>
  )
}

type SheetPanelLinkProps = React.ComponentProps<"button"> & { to: string; asChild?: boolean }

/** Steps into another panel. Bare, it is a line of type with the arrow that says it opens; asChild lends the move to your own control. */
function SheetPanelLink({ to, asChild = false, className, children, onClick, ...props }: SheetPanelLinkProps) {
  const { go } = usePanels()
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="sheet-panel-link"
      className={asChild ? className : cn("db-sheet-panel-link", className)}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)
        if (!e.defaultPrevented) go(to, e.currentTarget)
      }}
      {...(asChild ? {} : { type: "button" as const })}
      {...props}
    >
      {asChild ? children : (
        <>
          <span>{children}</span>
          <span aria-hidden="true" className="db-sheet-panel-arrow">→</span>
        </>
      )}
    </Comp>
  )
}

/** The sheet's name, running up its spine like a book's. Decorative: the visible title is SheetTitle. */
function SheetSpine({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="sheet-spine" aria-hidden="true" className={cn("db-sheet-spine", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.ComponentProps<"h2">) {
  const { titleId } = useDialog()
  return <h2 data-slot="sheet-title" id={titleId} className={cn("db-sheet-title", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { descriptionId } = useDialog()
  return <p data-slot="sheet-description" id={descriptionId} className={cn("db-sheet-body", className)} {...props} />
}

function SheetActions(props: React.ComponentProps<"div">) {
  return <DialogActions data-slot="sheet-actions" {...props} />
}

export {
  Sheet, SheetTrigger, SheetContent, SheetSpine, SheetTitle, SheetDescription, SheetActions, SheetActions as SheetFooter, SheetClose,
  SheetPanels, SheetPanel, SheetPanelLink,
  type SheetContentProps, type SheetPanelsProps, type SheetPanelProps, type SheetPanelLinkProps,
}
