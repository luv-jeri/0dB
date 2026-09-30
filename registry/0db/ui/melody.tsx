"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type Note = { text: string; i: number; x: number; step: number }
type Layout = {
  staves: Note[][]
  space: number // one staff space, in px
  above: number // room over the top line, for what rises past it
  height: number // one stave
  base: number // where a word's baseline falls in its own box, in px
}

type MelodyProps = Omit<React.ComponentProps<"figure">, "children"> & {
  /** The sentence, as plain text: pretext measures each word. */
  children: string
  /** The staff step of each word: 0 is the bottom line, 2 the next, 8 the top, odd numbers the spaces between. */
  contour?: number[]
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

/** A tune from the sentence itself: long words rise, the phrase rocks, and it comes home to where it began. */
function tune(words: string[]) {
  const len = words.map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").length || 1)
  const seed = len.reduce((a, b) => a + b, 0)
  const mean = seed / len.length
  const steps = len.map((l, i) => clamp(Math.round(4 + 2.4 * Math.sin(i * 0.75 + seed * 0.9) + (l - mean) * 0.5), 0, 8))
  steps[steps.length - 1] = steps[0]
  return steps
}

/**
 * A sentence set on a stave, each word a note. Pretext measures the words, so they're spaced evenly
 * across the measure and wrap onto a new stave when it's full. Pointing at a word sounds it and the
 * rest of the phrase, in turn. The whole figure takes focus and Enter plays it from the start; a
 * reader of the page gets the plain sentence.
 */
function Melody({ children: text, contour, className, style, onKeyDown, onBlur, onPointerLeave, ...props }: MelodyProps) {
  const ref = React.useRef<HTMLElement>(null)
  const [layout, setLayout] = React.useState<Layout | null>(null)
  const tuneKey = contour?.join()

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false
    let font = ""
    let width = 0
    const off: (() => void)[] = []
    const words = text.split(/\s+/).filter(Boolean)
    const own = tune(words)
    const steps = words.map((_, i) => clamp(contour?.[i] ?? own[i], -4, 12))

    ;(async () => {
      let lib: typeof import("@chenglou/pretext")
      try {
        lib = await import("@chenglou/pretext")
      } catch {
        return // the plain sentence stays
      }

      async function lay() {
        const style = getComputedStyle(el!)
        const next = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        if (next !== font) {
          font = next
          await document.fonts.load(font, text)
        }
        width = el!.clientWidth
        if (cancelled || !width) return
        const size = parseFloat(style.fontSize)
        const letterSpacing = parseFloat(style.letterSpacing) || 0 // "normal" is 0
        const w = words.map((word) => lib.measureNaturalWidth(lib.prepareWithSegments(word, font, { letterSpacing })))

        // Where the baseline sits in a line-height:1 box: the font's ascent, once the box has centred the font's height.
        const metrics = document.createElement("canvas").getContext("2d")!
        metrics.font = font
        const m = metrics.measureText("x")
        const base = m.fontBoundingBoxAscent === undefined ? size * 0.8 : (size - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent

        // A staff space is an even number of px, so the hairlines stay crisp and a step is a whole px.
        const space = 2 * Math.round(size * 0.35)
        const above = Math.round(size * 0.85) + clamp(Math.max(...steps) - 8, 0, 4) * (space / 2)
        const below = Math.round(size * 0.35) + Math.max(0, -Math.min(...steps)) * (space / 2)
        const edge = size * 0.7 // the barlines' room
        const room = width - 2 * edge
        const least = size * 0.6

        // Fill a stave, then spread its words evenly across it. The last one keeps to a moderate gap: a rest, not a stretch.
        const rows: number[][] = []
        let row: number[] = []
        let used = 0
        words.forEach((_, i) => {
          if (row.length && used + least + w[i] > room) {
            rows.push(row)
            row = []
            used = 0
          }
          used += (row.length ? least : 0) + w[i]
          row.push(i)
        })
        if (row.length) rows.push(row)
        // No word alone on the last stave: it takes one from the stave before, if that one can spare it.
        const [prev, last] = rows.slice(-2)
        if (last?.length === 1 && prev.length > 2 && w[prev.at(-1)!] + least + w[last[0]] <= room) last.unshift(prev.pop()!)
        const staves = rows.map((idx, r) => {
          const sum = idx.reduce((a, i) => a + w[i], 0)
          const even = idx.length > 1 ? (room - sum) / (idx.length - 1) : 0
          const gap = r === rows.length - 1 ? Math.min(even, least * 2.2) : even
          let x = edge
          return idx.map((i) => {
            const note = { text: words[i], i, x, step: steps[i] }
            x += w[i] + gap
            return note
          })
        })
        setLayout({ staves, space, above, height: above + 4 * space + below, base })
      }

      await lay()
      if (cancelled) return
      const resized = new ResizeObserver(() => {
        if (el.clientWidth !== width) lay()
      })
      resized.observe(el)
      off.push(() => resized.disconnect())
      // A change of pair or scheme on <html> can change the face: lay out again if it did.
      const restyled = new MutationObserver(() => lay())
      restyled.observe(document.documentElement, { attributes: true })
      off.push(() => restyled.disconnect())
    })()

    return () => {
      cancelled = true
      off.forEach((f) => f())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `contour` is watched by its contents
  }, [text, tuneKey])

  /** Sound word `from` and the ones after it: CSS lights each in turn, one arpeggio step apart. */
  const play = (from: number) => {
    const notes = ref.current?.querySelectorAll<HTMLElement>(".db-melody-note")
    if (!notes) return
    notes.forEach((n) => delete n.dataset.lit)
    void ref.current!.offsetWidth // so that the same word, sounded again, starts over
    notes.forEach((n, i) => {
      if (i < from) return
      n.style.setProperty("--k", String(i - from))
      n.dataset.lit = ""
    })
  }
  const hush = () => ref.current?.querySelectorAll<HTMLElement>(".db-melody-note").forEach((n) => delete n.dataset.lit)
  // Without motion the sounded words hold their colour, and let it go when you leave.
  const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches

  return (
    <figure
      ref={ref}
      data-slot="melody"
      tabIndex={0}
      aria-label={text}
      className={cn("db-melody", className)}
      style={layout ? ({ ...style, "--s": `${layout.space}px`, "--b": `${layout.base}px` } as React.CSSProperties) : style}
      {...props}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (e.key === "Enter" && e.target === e.currentTarget) play(0)
      }}
      onBlur={(e) => {
        onBlur?.(e)
        if (still()) hush()
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        if (still()) hush()
      }}
    >
      {layout ? (
        <div aria-hidden="true" className="db-melody-staves">
          {layout.staves.map((notes, r) => (
            <div key={r} className="db-melody-stave" data-last={r === layout.staves.length - 1 || undefined} style={{ blockSize: layout.height }}>
              <i className="db-melody-staff" style={{ insetBlockStart: layout.above }} />
              {notes.map((n) => (
                <span
                  key={n.i}
                  className="db-melody-note"
                  style={{ insetInlineStart: n.x, insetBlockStart: layout.above + (4 - n.step / 2) * layout.space }}
                  onPointerEnter={() => play(n.i)}
                >
                  {n.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <span aria-hidden="true">{text}</span>
      )}
    </figure>
  )
}

export { Melody, type MelodyProps }
