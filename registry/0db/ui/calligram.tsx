"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type Shape = "circle" | "fermata" | "wave"

type CalligramProps = Omit<React.ComponentProps<"p">, "children"> & {
  /** The paragraph. Plain text: pretext measures it. */
  children: string
  /** circle is the 0 of 0dB, fermata an arc over a dot, wave a sound wave. */
  shape?: Shape
  /** The shape's diameter (its full width) as a CSS length. Default: the width it's given, up to 34rem. */
  size?: string
  /** Let the colour follow the shape: ink at its centre, pencil at its edge. */
  fade?: boolean
}

type Laid = { lines: { text: string; spacing: number; tracking: number; t: number }[]; size: number; lh: number; top: number; height: number }

const REF = 100 // pretext measures once at this size; widths scale straight from it
const WAVE = { rows: 11, low: 0.34 } // one swell every 11 rows, from a third of the width to all of it

/**
 * A paragraph that fills a shape, as Apollinaire's calligrams did. Each line's width is the shape's
 * chord at that line's height, and the line sits centred in it, spread to reach both sides, so the
 * outline is only implied by the text. The circle and the fermata's half-disc are filled exactly:
 * the size of the type is found so the last word lands in the last row. Pointing shows nothing new.
 * Until the fonts and the layout are ready it is a plain paragraph.
 */
function Calligram({ children: text, shape = "circle", size, fade = false, className, style, ...props }: CalligramProps) {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const [laid, setLaid] = React.useState<Laid | null>(null)

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
        return // the plain paragraph stays
      }
      let face = "", prepared: ReturnType<typeof lib.prepareWithSegments> | undefined, longest = 0

      // The room a row has: the shape's chord across it, from its top edge y0 to its bottom edge y1.
      function chord(D: number, i: number, y0: number, y1: number) {
        if (shape === "wave") return D * (1 - (1 - WAVE.low) * (1 + Math.cos((2 * Math.PI * i) / WAVE.rows)) / 2)
        const r = D / 2
        const far = shape === "fermata" ? r - y0 : Math.max(Math.abs(y0 - r), Math.abs(y1 - r)) // from the centre, or the base
        return far >= r ? 0 : 2 * Math.sqrt(r * r - far * far)
      }

      // Set the text at size s in a shape D wide; null if it doesn't all fit and `force` is off.
      function set(s: number, D: number, ratio: number, force: boolean): Laid | null {
        const p = prepared!, k = s / REF, lh = ratio * s
        const H = shape === "circle" ? D : D / 2
        const rows = shape === "wave" ? 1e4 : Math.floor(H / lh)
        const y0 = shape === "wave" ? 0 : (H - rows * lh) / 2
        const lines: Laid["lines"] = []
        let cursor = { segmentIndex: 0, graphemeIndex: 0 }, first = -1, done = false, i = 0
        for (; !done && (i < rows || force); i++) {
          const w = chord(D, Math.min(i, rows - 1), y0 + i * lh, y0 + (i + 1) * lh)
          if (w < longest * k * 1.02) { if (first < 0 || i >= rows) continue; break } // too narrow for the longest word: leave the row
          const want = w * 0.985
          // Greedy fit, unless one more word fits by squeezing the gaps a little: the closer, the better.
          let line = lib.layoutNextLine(p, cursor, want / k)
          if (!line) { done = true; break }
          if (first < 0) first = i
          const more = lib.layoutNextLine(p, cursor, (want * 1.06) / k)
          if (more && more.end.segmentIndex > line.end.segmentIndex) {
            const g = more.text.trimEnd().split(" ").length - 1
            if (g && (more.width * k - want) / g <= s * 0.06) line = more
          }
          const words = line.text.trimEnd()
          const gaps = words.split(" ").length - 1
          // Spread the line to its chord, mostly in the gaps and a little in the letters; the last line stays as it is.
          const last = !lib.layoutNextLine(p, line.end, 1e5)
          const slack = last ? 0 : want - line.width * k
          const spacing = gaps ? Math.max(-s * 0.06, Math.min(slack / gaps, s * 0.3)) : 0
          const rest = slack - spacing * gaps
          const tracking = rest > 0 ? Math.min(rest / words.length, s * 0.03) : 0
          lines.push({ text: words, spacing, tracking, t: 1 - w / D })
          cursor = line.end
        }
        if (!done && lib.layoutNextLine(p, cursor, 1e5)) return null
        const top = shape === "wave" ? 0 : y0 + first * lh
        return { lines, size: s, lh, top, height: shape === "wave" ? lines.length * lh : H }
      }

      async function lay() {
        const style = getComputedStyle(el!)
        const base = parseFloat(style.fontSize)
        const next = `${style.fontStyle} ${style.fontWeight} ${REF}px ${style.fontFamily}`
        if (next !== face || !prepared) {
          face = next
          await document.fonts.load(face, text)
          prepared = lib.prepareWithSegments(text, face)
          longest = Math.max(...prepared.widths)
        }
        const ratio = parseFloat(style.lineHeight) / base || 1.4
        const D = el!.clientWidth
        let result: Laid | null
        if (shape === "wave") result = set(base, D, ratio, true)
        else {
          // The largest type that still holds all the words: a search, since widths only shrink with size.
          let lo = 7, hi = base * 2
          result = null
          for (let n = 0; n < 12; n++) {
            const mid = (lo + hi) / 2
            const fit = set(mid, D, ratio, false)
            if (fit) { result = fit; lo = mid } else hi = mid
          }
          result ??= set(lo, D, ratio, true) // too much text for this size: it runs on below the shape
        }
        if (!cancelled) setLaid(result)
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
  }, [text, shape])

  return (
    <p ref={ref} data-slot="calligram" data-shape={shape} data-fade={fade || undefined} className={cn("db-calligram", className)} style={{ ...(size ? { "--size": size } : null), ...style } as React.CSSProperties} {...props}>
      <span className="db-sr">{text}</span>
      <span
        aria-hidden="true"
        className="db-calligram-lines"
        data-laid={laid ? "" : undefined}
        style={laid ? { fontSize: laid.size, lineHeight: `${laid.lh}px`, paddingTop: laid.top, height: laid.height } : undefined}
      >
        {laid ? laid.lines.map((line, i) => (
          <span key={i} style={{ "--t": line.t, wordSpacing: line.spacing, letterSpacing: line.tracking } as React.CSSProperties}>{line.text}</span>
        )) : text}
      </span>
      {shape === "fermata" ? <span aria-hidden="true" className="db-calligram-dot" /> : null}
    </p>
  )
}

export { Calligram, type CalligramProps }
