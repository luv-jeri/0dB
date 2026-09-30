"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

const DYNAMICS = ["pp", "p", "mp", "mf", "f", "ff", "fff", "ffff"] as const
type Dynamic = (typeof DYNAMICS)[number]

type WaterfallProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The words. Plain text: pretext measures how many of them each size holds. */
  children: string
  /** The loudest dynamic to show. */
  from?: Dynamic
  /** The quietest dynamic to show. */
  to?: Dynamic
  /** Set the specimen in the expression italic. */
  italic?: boolean
}

type Row = { text: string; spacing: number; scale: number; px: number }

/**
 * A type specimen waterfall: the same words at every dynamic, loudest first. Each line takes as
 * many whole words as the measure holds at its size (pretext counts them), then its tracking opens
 * just enough to reach the edge, so the block is flush on both sides with no wrapping and no
 * ellipsis. Pointing at a line shows its size. Before the fonts and the layout arrive, each line
 * is the plain text, clipped; a reader always gets the words once.
 */
function Waterfall({ children: text, from = "ffff", to = "pp", italic = false, className, ...props }: WaterfallProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [rows, setRows] = React.useState<Row[] | null>(null)
  const [a, b] = [DYNAMICS.indexOf(from), DYNAMICS.indexOf(to)]
  const shown = DYNAMICS.slice(Math.min(a, b), Math.max(a, b) + 1).reverse()

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false
    const off: (() => void)[] = []

    ;(async () => {
      let lib: typeof import("@chenglou/pretext")
      try {
        lib = await import("@chenglou/pretext")
      } catch {
        return // the clipped plain lines stay
      }
      const cells = [...el.querySelectorAll<HTMLElement>(".db-waterfall-text")]
      const first = text.split(/\s+/)[0]

      async function lay() {
        const styles = cells.map((c) => getComputedStyle(c))
        const fonts = styles.map((s) => `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`)
        await Promise.all(fonts.map((f) => document.fonts.load(f, text)))
        let above = Infinity // the size above: a quieter line is never louder, even where a fluid size crosses another's
        const out = cells.map((cell, i): Row => {
          const size = parseFloat(styles[i].fontSize)
          const track = parseFloat(styles[i].letterSpacing) || 0
          const width = cell.clientWidth
          const prepared = lib.prepareWithSegments(text, fonts[i], { letterSpacing: track })
          const start = { segmentIndex: 0, graphemeIndex: 0 }
          // A first word wider than the line would be broken mid-word: set the line smaller instead.
          const word = lib.layoutNextLine(lib.prepareWithSegments(first, fonts[i], { letterSpacing: track }), start, 1e5)!.width
          const scale = Math.min(1, (width / word) * 0.98, (above * 0.88) / size)
          const line = lib.layoutNextLine(prepared, start, width / scale)!
          const words = line.text.trimEnd()
          const whole = !lib.layoutNextLine(prepared, line.end, width / scale) // all the text fits: leave it be
          const slack = width - line.width * scale
          // Tracking takes up the slack, by no more than a twentieth of an em: beyond that, it stays ragged.
          const extra = whole || slack <= 0 ? 0 : Math.min(slack / (words.length * scale), size * 0.05)
          above = size * scale
          return { text: words, spacing: track + extra, scale, px: Math.round(above) }
        })
        if (!cancelled) setRows(out)
      }

      await lay()
      if (cancelled) return
      let width = el.clientWidth
      const resized = new ResizeObserver(() => {
        if (el.clientWidth !== width) { width = el.clientWidth; lay() }
      })
      resized.observe(el)
      // A change of pair or scheme on <html> can change the face: lay out again.
      const restyled = new MutationObserver(() => lay())
      restyled.observe(document.documentElement, { attributes: true })
      off.push(() => { resized.disconnect(); restyled.disconnect() })
    })()

    return () => {
      cancelled = true
      off.forEach((f) => f())
    }
  }, [text, from, to, italic])

  return (
    <div ref={ref} data-slot="waterfall" data-italic={italic || undefined} className={cn("db-waterfall", className)} {...props}>
      <span className="db-sr">{text}</span>
      {shown.map((d, i) => {
        const row = rows?.[i]
        return (
          <div key={d} aria-hidden="true" className="db-waterfall-row" style={{ "--s": `var(--db-${d})`, "--lh": `var(--db-${d}-lh)`, "--tr": `var(--db-${d}-tr)` } as React.CSSProperties}>
            <span className="db-waterfall-mark">{d}</span>
            <span className="db-waterfall-text">
              {row ? <span style={{ letterSpacing: `${row.spacing}px`, fontSize: row.scale < 1 ? `${row.scale}em` : undefined }}>{row.text}</span> : text}
            </span>
            <span className="db-waterfall-px">{row ? `${row.px} px` : ""}</span>
          </div>
        )
      })}
    </div>
  )
}

export { Waterfall, type WaterfallProps, type Dynamic }
