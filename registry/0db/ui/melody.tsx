"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { cn } from "@/registry/0db/lib/utils"

/** The <html> switches that change the face; smooth scrolling toggles a class there on every scroll, which must not re-lay the text. */
const FACE = ["data-pair", "data-scheme", "data-mode", "data-key"]

/** A word: its place across the stave, its width, its step, and (for the noteheads) its baseline under the staff. */
type Note = { text: string; i: number; x: number; w: number; step: number; y?: number }
/** One stave's engraving, as SVG path data from the top line: the slurs, the fermata, and where the dynamic stands. */
type Marks = { slurs: string; hold: string; dynamic?: { x: number; y: number } }
type Layout = {
  staves: Note[][]
  marks: Marks[]
  space: number // one staff space, in px
  above: number // room over the top line, for what rises past it
  height: number // one stave
  close: number // where the last stave ends, just past its last word
  dynamic: string // the dynamic the type size is: pp, p, mp, mf, f or ff
  rtl: boolean
  width: number
  base: number // where a word's baseline falls in its own box, in px
}

type MelodyProps = Omit<React.ComponentProps<"figure">, "children"> & {
  /** The sentence, as plain text: pretext measures each word. */
  children: string
  /** The staff step of each word: 0 is the bottom line, 2 the next, 8 the top, odd numbers the spaces between. */
  contour?: number[]
  /** stave: the words are the notes. noteheads: the notes are discs on the staff and the words are sung under it. cutaway: the staff is drawn only under the words. */
  variant?: "stave" | "noteheads" | "cutaway"
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
 * `noteheads` sets the tune as discs on the staff, the words underlaid as a score's lyrics, and
 * sings along them as the calendar poster marks its days: sung in ink, here in the accent, to come
 * in rings. `cutaway` draws the staff only under the words, as a cutaway score drops an instrument's
 * lines while it rests.
 */
function Melody({ children: text, contour, variant = "stave", className, style, onKeyDown, onBlur, onPointerLeave, ref: forwardedRef, ...props }: MelodyProps) {
  const ref = React.useRef<HTMLElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
  const [layout, setLayout] = React.useState<Layout | null>(null)
  // noteheads: the word you're at, and the one you were at, so the discs fill or empty in turn from there.
  const [pos, setPos] = React.useState({ at: -1, from: -1 })
  const move = (at: number) => setPos((p) => (p.at === at ? p : { at, from: p.at }))
  const tuneKey = contour?.join()
  const heads = variant === "noteheads"

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
        let above = Math.round(size * 0.85) + clamp(Math.max(...steps) - 8, 0, 4) * (space / 2)
        let below = Math.round(size * 0.35) + Math.max(0, -Math.min(...steps)) * (space / 2)
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
            const note: Note = { text: words[i], i, x, w: w[i], step: steps[i] }
            x += w[i] + gap
            return note
          })
        })
        // Engraving, in the marks a singer reads: a slur over each phrase (the words up to a pause: a comma, a full stop), a pen
        // stroke that swells in the middle and thins to nothing at its ends; a fermata over the last word, where the tune holds;
        // and under the first word its dynamic, in the italic: the type size it's set at is a dynamic already (pp, p, mp, mf, f, ff).
        // y runs down from the top line; a word's baseline is its step.
        const lineY = (step: number) => (4 - step / 2) * space
        const r = (v: number) => Math.round(v * 10) / 10
        const cap = size * 0.74 // a word's top over its baseline, with the ascenders
        const gap = size * 0.2
        const swell = Math.max(1.5, size * 0.07) // the slur's thickness at its middle
        /** A tapered arc from (x0, y0) to (x1, y1): a cubic whose handles rise h1 and h2 over the chord, and an inner one t
         *  lower at the middle, so the stroke swells to t and thins to nothing at its ends. */
        const arc = (x0: number, y0: number, x1: number, y1: number, h1: number, h2: number, t: number) => {
          const [ax, bx, ay, by] = [x0 + (x1 - x0) / 3, x0 + (2 * (x1 - x0)) / 3, y0 + (y1 - y0) / 3, y0 + (2 * (y1 - y0)) / 3]
          const d = (4 * t) / 3 // lowering both handles by d lowers the middle by t
          return `M${r(x0)} ${r(y0)}C${r(ax)} ${r(ay - h1)} ${r(bx)} ${r(by - h2)} ${r(x1)} ${r(y1)}C${r(bx)} ${r(by - h2 + d)} ${r(ax)} ${r(ay - h1 + d)} ${r(x0)} ${r(y0)}Z`
        }
        const dot = (x: number, y: number, d: number) => `M${r(x - d)} ${r(y)}a${r(d)} ${r(d)} 0 1 0 ${r(2 * d)} 0a${r(d)} ${r(d)} 0 1 0 ${r(-2 * d)} 0Z`
        const top0 = (n: Note) => lineY(n.step) - cap - gap
        let top = 0
        let bottom = 4 * space
        const marks = staves.map((notes, row): Marks => {
          if (heads) {
            // The words are the lyric line, one baseline under the staff and under the lowest disc; no slurs, since every
            // word is one note. The fermata stands over the last disc, and the dynamic goes above the staff, over the first,
            // where a vocal score puts it to leave the words below clear.
            const low = Math.max(4 * space, ...notes.map((n) => lineY(n.step) + space / 2))
            const lyric = low + size * 1.05
            notes.forEach((n) => (n.y = lyric))
            top = Math.min(top, ...notes.map((n) => lineY(n.step) - space / 2 - 2))
            bottom = Math.max(bottom, lyric + size * 0.3)
            let hold = ""
            if (row === staves.length - 1) {
              const z = notes[notes.length - 1]
              const cx = z.x + z.w / 2
              const half = size * 0.42
              const base = Math.min(-space * 0.8, lineY(z.step) - space / 2 - gap)
              hold = arc(cx - half, base, cx + half, base, size * 0.53, size * 0.53, swell * 1.3) + dot(cx, base - size * 0.1, Math.max(1.5, size * 0.075))
              top = Math.min(top, base - size * 0.4)
            }
            let dynamic: { x: number; y: number } | undefined
            if (row === 0) {
              const a = notes[0]
              const y = Math.min(-space * 0.6, lineY(a.step) - space / 2 - gap)
              dynamic = { x: a.x, y }
              top = Math.min(top, y - size * 0.75)
            }
            return { slurs: "", hold, dynamic }
          }
          const phrases: Note[][] = [[]]
          notes.forEach((n, k) => {
            phrases[phrases.length - 1].push(n)
            if (/[,.;:!?]$/.test(n.text) && k < notes.length - 1) phrases.push([])
          })
          let slurs = ""
          let under: ((x: number) => number) | undefined // the top of the slur that ends on the stave's last word, for the fermata to clear
          for (const ph of phrases) {
            if (ph.length < 2) continue // a slur joins two notes at least
            const [a, z] = [ph[0], ph[ph.length - 1]]
            // From over the first word to over the last: their middles, or, where the tune falls away from the first (or climbs to
            // the last), their inner ends, so the slur doesn't have to hook back over the rest of a high word to leave it.
            const x0 = a.x + w[a.i] * (a.step > ph[1].step ? 0.85 : 0.5)
            const x1 = z.x + w[z.i] * (z.step > ph[ph.length - 2].step ? 0.15 : 0.5)
            let [y0, y1] = [top0(a), top0(z)]
            // The slur's underside must clear every word it passes over. Its height over the chord at u is
            // 3u(1-u)((1-u)h1 + u h2), so each word asks one straight line of (h1, h2); take the lowest pair that satisfies
            // them all, so the slur leans toward whichever end needs the lift, as an engraver's would. Past a sensible bow,
            // raise its ends instead.
            const bow = () => {
              const asks = ph.flatMap((n) =>
                [n.x, n.x + w[n.i] / 2, n.x + w[n.i]].map((x) => {
                  const u = clamp((x - x0) / (x1 - x0), 0.1, 0.9)
                  const [p, q] = [3 * u * (1 - u) * (1 - u), 3 * u * u * (1 - u)]
                  return { p, q, need: y0 + (y1 - y0) * u - top0(n) + (p + q) * ((4 * swell) / 3) }
                }),
              )
              let best = [size, size, Infinity]
              for (let h1 = 0; h1 <= size * 6; h1 += size * 0.05) {
                const h2 = Math.max(size * 0.2, ...asks.map((a) => (a.need - a.p * h1) / a.q))
                const cost = h1 * h1 + h2 * h2 // the evenest bow that clears them
                if (h1 >= size * 0.2 && cost < best[2]) best = [h1, h2, cost]
              }
              return best
            }
            let [h1, h2] = bow()
            const most = Math.max(size * 1.8, (x1 - x0) * 0.16) // a long phrase may bow higher
            for (let tries = 0; Math.max(h1, h2) > most && tries < 40; tries++) {
              ;[y0, y1] = [y0 - size * 0.1, y1 - size * 0.1]
              ;[h1, h2] = bow()
            }
            slurs += arc(x0, y0, x1, y1, h1, h2, swell)
            top = Math.min(top, Math.min(y0, y1) - 0.75 * Math.max(h1, h2))
            if (z === notes[notes.length - 1]) {
              const [c0, c1, c2, c3] = [y0, y0 + (y1 - y0) / 3 - h1, y0 + (2 * (y1 - y0)) / 3 - h2, y1]
              under = (x) => {
                const t = clamp((x - x0) / (x1 - x0), 0, 1)
                return (1 - t) ** 3 * c0 + 3 * (1 - t) ** 2 * t * c1 + 3 * (1 - t) * t * t * c2 + t ** 3 * c3
              }
            }
          }
          let hold = ""
          if (row === staves.length - 1) {
            const z = notes[notes.length - 1]
            const cx = z.x + w[z.i] / 2
            const half = size * 0.42
            const slur = under ? Math.min(...[-1, -0.5, 0, 0.5, 1].map((f) => under!(cx + f * half))) - gap : Infinity
            const base = Math.min(-space * 0.8, top0(z), slur) // above the staff, the word and the slur under it
            hold = arc(cx - half, base, cx + half, base, size * 0.53, size * 0.53, swell * 1.3) + dot(cx, base - size * 0.1, Math.max(1.5, size * 0.075))
            top = Math.min(top, base - size * 0.4)
          }
          let dynamic: { x: number; y: number } | undefined
          if (row === 0) {
            const a = notes[0]
            const y = Math.max(4 * space + size * 0.95, lineY(a.step) + size * 0.95) // under the staff, and under the word's descenders
            dynamic = { x: a.x, y }
            bottom = Math.max(bottom, y + size * 0.1)
          }
          return { slurs, hold, dynamic }
        })
        above = Math.max(above, Math.ceil(-top + 3))
        below = Math.max(below, Math.ceil(bottom - 4 * space + 3))
        // A short last line ends where the sentence does, as a score's last system is left short rather than stretched.
        const end = staves[staves.length - 1].at(-1)!
        const close = Math.min(width, Math.ceil(end.x + w[end.i] + edge))
        const root = getComputedStyle(document.documentElement)
        const rem = parseFloat(root.fontSize)
        const dynamic = ["pp", "p", "mp", "mf", "f", "ff"]
          .map((d) => [d, Math.abs(parseFloat(root.getPropertyValue(`--db-${d}`)) * rem - size)] as const)
          .reduce((a, b) => (b[1] < a[1] ? b : a))[0]
        setLayout({ staves, marks, space, above, height: above + 4 * space + below, base, close, dynamic, rtl: style.direction === "rtl", width })
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
      restyled.observe(document.documentElement, { attributeFilter: FACE })
      off.push(() => restyled.disconnect())
    })()

    return () => {
      cancelled = true
      off.forEach((f) => f())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `contour` is watched by its contents
  }, [text, tuneKey, heads])

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
      ref={composedRef}
      data-slot="melody"
      tabIndex={0}
      aria-label={text}
      className={cn("db-melody", className)}
      style={layout ? ({ ...style, "--s": `${layout.space}px`, "--b": `${layout.base}px` } as React.CSSProperties) : style}
      {...props}
      data-variant={variant}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (e.target !== e.currentTarget) return
        if (!heads) {
          if (e.key === "Enter") play(0)
          return
        }
        // Noteheads: Enter sings it through; the arrows step along the words (the way they run), Home and End go to the
        // first and the last, Escape lets it go.
        const last = text.split(/\s+/).filter(Boolean).length - 1
        const on = layout?.rtl ? -1 : 1
        const to: Record<string, number> = { Enter: last, ArrowRight: pos.at + on, ArrowLeft: pos.at - on, Home: 0, End: last, Escape: -1 }
        if (!(e.key in to)) return
        e.preventDefault()
        move(Math.max(e.key === "Escape" ? -1 : 0, Math.min(last, to[e.key])))
      }}
      onBlur={(e) => {
        onBlur?.(e)
        if (heads) move(-1)
        else if (still()) hush()
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        if (heads) move(-1)
        else if (still()) hush()
      }}
    >
      {layout ? (
        <div aria-hidden="true" className="db-melody-staves">
          {layout.staves.map((notes, r) => (
            <div key={r} className="db-melody-stave" data-last={r === layout.staves.length - 1 || undefined} style={{ blockSize: layout.height }}>
              <i className="db-melody-staff" style={{ insetBlockStart: layout.above, inlineSize: r === layout.staves.length - 1 ? layout.close : undefined }} />
              <svg className="db-melody-marks">
                {/* In right-to-left the notes run from the right: the strokes are mirrored to follow them; the dynamic is set, not mirrored, and starts from its word's start either way. */}
                <g transform={layout.rtl ? `translate(${layout.width} ${layout.above}) scale(-1 1)` : `translate(0 ${layout.above})`}>
                  <path d={layout.marks[r].slurs + layout.marks[r].hold} />
                </g>
                {layout.marks[r].dynamic ? (
                  <text
                    className="db-melody-dynamic"
                    x={layout.rtl ? layout.width - layout.marks[r].dynamic.x : layout.marks[r].dynamic.x}
                    y={layout.above + layout.marks[r].dynamic.y}
                  >
                    {layout.dynamic}
                  </text>
                ) : null}
              </svg>
              {variant === "cutaway"
                ? notes.map((n) => (
                    <i key={n.i} className="db-melody-bit" style={{ insetInlineStart: n.x, inlineSize: n.w, insetBlockStart: layout.above }} />
                  ))
                : null}
              {heads
                ? notes.map((n) => (
                    <i
                      key={n.i}
                      className="db-melody-head"
                      data-sung={pos.at > n.i || undefined}
                      data-here={pos.at === n.i || undefined}
                      style={{ insetInlineStart: n.x + n.w / 2, insetBlockStart: layout.above + (4 - n.step / 2) * layout.space, "--k": Math.abs(n.i - Math.max(0, pos.from)) } as React.CSSProperties}
                      onPointerEnter={() => move(n.i)}
                    />
                  ))
                : null}
              {notes.map((n) => (
                <span
                  key={n.i}
                  className="db-melody-note"
                  data-hold={r === layout.staves.length - 1 && n === notes[notes.length - 1] ? "" : undefined}
                  style={{ insetInlineStart: n.x, insetBlockStart: layout.above + (n.y ?? (4 - n.step / 2) * layout.space) }}
                  onPointerEnter={() => (heads ? move(n.i) : play(n.i))}
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
