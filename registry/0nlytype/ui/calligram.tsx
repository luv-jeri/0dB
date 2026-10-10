"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"

/** The attributes on <html> that can change the face. Not class: smooth scrolling toggles one on every scroll. */
const FACE = ["data-pair", "data-scheme", "data-mode", "data-key"]

type Shape = "circle" | "fermata" | "wave"
type Variant = "fill" | "rain" | "mirror"

type CalligramProps = Omit<React.ComponentProps<"p">, "children"> & {
  /** The paragraph. Plain text: pretext measures it. */
  children: string
  /** circle is the 0 of 0nlyType, fermata an arc over a dot, wave a sound wave. For fill only. */
  shape?: Shape
  /** fill: the paragraph fills the shape. rain: it falls in streaks of letters, as in Apollinaire's "Il pleut".
   *  mirror: it runs round the four sides of a frame and spirals in, around `centre`, as in his "Cœur couronne et miroir". */
  variant?: Variant
  /** For mirror: the word in the middle, set large in the expression italic. */
  centre?: string
  /** The shape's diameter (its full width) as a CSS length. Default: the width it's given, up to 34rem. */
  size?: string
  /** Let the colour follow the shape: ink at its centre, pencil at its edge. */
  fade?: boolean
}

type Side = { text: string; spacing: number; x: number; y: number; a: number; len: number }
type Streak = { letters: string[]; x: number; y: number }
type Laid = {
  lines: { text: string; spacing: number; tracking: number; t: number }[]
  size: number
  lh: number
  top: number
  height: number
  sides?: Side[]
  centre?: number
  streaks?: Streak[]
}

const REF = 100 // pretext measures once at this size; widths scale straight from it
const WAVE = { rows: 11, low: 0.34 } // one swell every 11 rows, from a third of the width to all of it
const RAIN = { pitch: 2.2, drop: 0.8, slant: 0.16, stagger: 9 } // ems between streaks and between letters; the lean a letter; the most a streak starts late, in letters

/** The same streak always starts at the same height: a small hash of its index. */
const rand = (i: number) => {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return s - Math.floor(s)
}

/** Rain: the words in streaks of at most `most` letters, a word never split unless it is longer than a streak. */
function streaks(words: string[], most: number) {
  const out: string[][] = []
  let run: string[] = []
  for (const word of words) {
    const letters = [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(word)].map((g) => g.segment)
    if (run.length && run.length + 1 + letters.length > most) {
      out.push(run)
      run = []
    }
    if (run.length) run.push(" ")
    run.push(...letters)
    while (run.length > most) out.push(run.splice(0, most))
  }
  if (run.length) out.push(run)
  return out
}

/**
 * A paragraph that fills a shape, as Apollinaire's calligrams did. Each line's width is the shape's
 * chord at that line's height, and the line sits centred in it, spread to reach both sides, so the
 * outline is only implied by the text. The circle and the fermata's half-disc are filled exactly:
 * the size of the type is found so the last word lands in the last row. Pointing shows nothing new.
 * Until the fonts and the layout are ready it is a plain paragraph.
 */
function Calligram({ children: text, shape = "circle", variant = "fill", centre, size, fade = false, className, style, ref: forwardedRef, ...props }: CalligramProps) {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
  const middle = React.useRef<HTMLSpanElement>(null)
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

      // Rain: streaks a pitch apart, each letter a drop below the last and leaning a little, each starting a little late.
      function rain(D: number, base: number, rtl: boolean): Laid {
        const words = text.split(/\s+/).filter(Boolean)
        const pitch = RAIN.pitch * base, lean = RAIN.slant * base
        let most = 6, laid: string[][] = []
        for (; most < 400; most++) {
          laid = streaks(words, most)
          if (laid.length * pitch + most * lean <= D) break
        }
        const used = laid.length * pitch + most * lean, lh = RAIN.drop * base
        const from = (D - used) / 2 + most * lean
        const out = laid.map((letters, i) => {
          const x = from + i * pitch
          return { letters, x: rtl ? D - x - pitch : x, y: Math.floor(rand(i) * RAIN.stagger) * lh }
        })
        const height = Math.max(...out.map((s) => s.y + s.letters.length * lh))
        return { lines: [], size: base, lh, top: 0, height, streaks: out }
      }

      // Mirror: one line to each side of the frame, clockwise from the top, each ring a line inside the last, round
      // until the words run out. Each side is spread to its length but the last.
      function mirror(D: number, base: number, ratio: number): Laid {
        const p = prepared!, k = base / REF, lh = base * ratio
        const sides: Side[] = []
        let cursor = { segmentIndex: 0, graphemeIndex: 0 }, d = 0
        for (let ring = 0; ring < 40 && D - 2 * d > 4 * lh; ring++, d += lh) {
          const four = [
            { x: d, y: d, a: 0, len: D - 2 * d },
            { x: D - d, y: d + lh, a: 90, len: D - 2 * d - lh },
            { x: D - d - lh, y: D - d, a: 180, len: D - 2 * d - lh },
            { x: d, y: D - d - lh, a: 270, len: D - 2 * d - 2 * lh },
          ]
          for (const side of four) {
            const line = lib.layoutNextLine(p, cursor, side.len / k)
            if (!line) break
            const words = line.text.trimEnd()
            const gaps = words.split(" ").length - 1
            const last = !lib.layoutNextLine(p, line.end, 1e5)
            const spacing = gaps && !last ? Math.min((side.len - line.width * k) / gaps, base * 0.6) : 0
            sides.push({ text: words, spacing, ...side })
            cursor = line.end
          }
          if (!lib.layoutNextLine(p, cursor, 1e5)) { d += lh; break }
        }
        // The word in the middle: as large as the room inside the last ring allows, at most the loudest size.
        let big = 0
        const mid = middle.current
        if (mid && centre) {
          const ms = getComputedStyle(mid)
          const w = lib.measureNaturalWidth(lib.prepareWithSegments(centre, `${ms.fontStyle} ${ms.fontWeight} ${REF}px ${ms.fontFamily}`))
          const room = D - 2 * d - 2 * lh
          big = Math.max(base, Math.min((room * 0.8 * REF) / w, room * 0.6, base * 6))
        }
        return { lines: [], size: base, lh, top: 0, height: D, sides, centre: big }
      }

      async function lay() {
        if (cancelled || !el!.isConnected) return
        const style = getComputedStyle(el!)
        const base = parseFloat(style.fontSize)
        if (variant === "rain") {
          if (!cancelled) setLaid(rain(el!.clientWidth, base, style.direction === "rtl"))
          return
        }
        if (variant === "mirror" && middle.current) await document.fonts.load(`italic 400 ${REF}px ${getComputedStyle(middle.current).fontFamily}`, centre)
        if (cancelled || !el!.isConnected) return
        const next = `${style.fontStyle} ${style.fontWeight} ${REF}px ${style.fontFamily}`
        if (next !== face || !prepared) {
          face = next
          await document.fonts.load(face, text)
          if (cancelled || !el!.isConnected) return
          prepared = lib.prepareWithSegments(text, face)
          longest = Math.max(...prepared.widths)
        }
        const ratio = parseFloat(style.lineHeight) / base || 1.4
        const D = el!.clientWidth
        let result: Laid | null
        if (variant === "mirror") result = mirror(D, base, ratio)
        else if (shape === "wave") result = set(base, D, ratio, true)
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
      restyled.observe(document.documentElement, { attributeFilter: FACE })
      off.push(() => { resized.disconnect(); restyled.disconnect() })
    })()

    return () => {
      cancelled = true
      off.forEach((f) => f())
    }
  }, [text, shape, variant, centre])

  return (
    <p ref={composedRef} data-slot="calligram" data-shape={variant === "fill" ? shape : undefined} data-variant={variant === "fill" ? undefined : variant} data-fade={fade || undefined} className={cn("db-calligram", className)} style={{ ...(size ? { "--size": size } : null), ...style } as React.CSSProperties} {...props}>
      <span className="db-sr">{text}</span>
      <span
        aria-hidden="true"
        className="db-calligram-lines"
        data-laid={laid ? "" : undefined}
        style={laid ? { fontSize: laid.size, lineHeight: `${laid.lh}px`, paddingTop: laid.top, height: laid.height } : undefined}
      >
        {!laid
          ? text
          : laid.streaks
            ? laid.streaks.map((streak, i) => (
                <span key={i} className="db-calligram-streak" style={{ left: streak.x, top: streak.y }}>
                  {streak.letters.map((g, j) => (
                    <span key={j} style={{ "--j": j, "--t": 1 - j / Math.max(1, streak.letters.length - 1) } as React.CSSProperties}>{g}</span>
                  ))}
                </span>
              ))
            : laid.sides
              ? laid.sides.map((side, i) => (
                  <span key={i} className="db-calligram-side" style={{ "--x": `${side.x}px`, "--a": `${side.a}deg`, "--t": i / laid.sides!.length, top: side.y, width: side.len, wordSpacing: side.spacing } as React.CSSProperties}>{side.text}</span>
                ))
              : laid.lines.map((line, i) => (
                  <span key={i} style={{ "--t": line.t, wordSpacing: line.spacing, letterSpacing: line.tracking } as React.CSSProperties}>{line.text}</span>
                ))}
      </span>
      {variant === "mirror" && centre ? (
        <span ref={middle} className="db-calligram-centre" style={laid?.centre ? { fontSize: laid.centre } : undefined}>
          {centre}
        </span>
      ) : null}
      {variant === "fill" && shape === "fermata" ? <span aria-hidden="true" className="db-calligram-dot" /> : null}
    </p>
  )
}

export { Calligram, type CalligramProps }
