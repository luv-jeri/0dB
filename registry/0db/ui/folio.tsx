"use client"

import * as React from "react"
import { cn } from "@/registry/0db/lib/utils"
import { useComposedRefs } from "@/registry/0db/lib/refs"

type FolioProps = React.ComponentProps<"article"> & { variant?: "plate" | "type" | "live" }
type FolioTitleProps = Omit<React.ComponentProps<"h3">, "children"> & { children: string }
type FolioLedgerProps = Omit<React.ComponentProps<"dl">, "children"> & { rows: { label: string; value: React.ReactNode }[] }
const FACE = ["data-pair", "data-scheme", "data-mode", "data-key"]

function Folio({ variant = "plate", className, ...props }: FolioProps) {
  return <article {...props} data-slot="folio" data-variant={variant} className={cn("db-folio", className)} />
}

/** A title opens from the aligned plate edge, one measured line at a time, once. */
function FolioTitle({ children, className, ref: forwardedRef, ...props }: FolioTitleProps) {
  const local = React.useRef<HTMLHeadingElement>(null)
  const ref = useComposedRefs(local, forwardedRef)
  const [layout, setLayout] = React.useState<{ text: string; lines: string[] } | null>(null)
  const arrived = React.useRef(false)
  const lines = layout?.text === children ? layout.lines : null

  React.useEffect(() => {
    const el = local.current
    if (!el) return
    let cancelled = false
    let width = 0
    let revision = 0
    let observer: IntersectionObserver | undefined
    let frame = 0
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    const show = () => {
      arrived.current = true
      el.dataset.arrived = "true"
      observer?.disconnect()
    }
    const motion = () => { if (reduced.matches) show() }
    async function lay() {
      const ticket = ++revision
      try {
        const { prepareWithSegments, layoutNextLine } = await import("@chenglou/pretext")
        if (cancelled || !el) return
        const style = getComputedStyle(el)
        const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        await document.fonts.load(font, children)
        if (cancelled || ticket !== revision) return
        width = el.clientWidth
        if (!width) return
        const prepared = prepareWithSegments(children, font, { letterSpacing: parseFloat(style.letterSpacing) || 0 })
        const output: string[] = []
        let cursor = { segmentIndex: 0, graphemeIndex: 0 }
        for (let guard = 0; guard < 200; guard++) {
          const line = layoutNextLine(prepared, cursor, width)
          if (!line) break
          output.push(line.text)
          cursor = line.end
        }
        if (!output.length) return
        setLayout({ text: children, lines: output })
        if (arrived.current || reduced.matches) show()
        else {
          observer?.disconnect()
          observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              // Let the measured lines mount at their closed edge before opening them.
              cancelAnimationFrame(frame)
              frame = requestAnimationFrame(() => { frame = requestAnimationFrame(show) })
            }
          }, { threshold: 0.12 })
          observer.observe(el.closest(".db-folio")?.querySelector(".db-folio-plate") ?? el)
        }
      } catch { show() }
    }
    const resized = new ResizeObserver(() => { if (el.clientWidth !== width) void lay() })
    resized.observe(el)
    const theme = new MutationObserver(() => { void lay() })
    theme.observe(document.documentElement, { attributes: true, attributeFilter: FACE })
    reduced.addEventListener("change", motion)
    void lay()
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      resized.disconnect()
      theme.disconnect()
      observer?.disconnect()
      reduced.removeEventListener("change", motion)
    }
  }, [children])

  return <h3 {...props} ref={ref} data-slot="folio-title" className={cn("db-folio-title", className)}>
    {lines ? <><span className="db-sr">{children}</span><span aria-hidden="true" className="db-folio-lines">{lines.map((line, i) => <span className="db-folio-line" key={i}><span style={{ "--db-folio-line": i } as React.CSSProperties}>{line}</span></span>)}</span></> : children}
  </h3>
}

function FolioLedger({ rows, className, ...props }: FolioLedgerProps) {
  return <dl {...props} data-slot="folio-ledger" className={cn("db-folio-ledger", className)}>{rows.map(({ label, value }, i) => <div key={i}><dt>{label}</dt><dd className="db-reading">{value}</dd></div>)}</dl>
}

function FolioPlate({ className, ...props }: React.ComponentProps<"div">) {
  return <div {...props} data-slot="folio-plate" className={cn("db-folio-plate", className)} />
}

export { Folio, FolioTitle, FolioLedger, FolioPlate, type FolioProps, type FolioTitleProps, type FolioLedgerProps }
