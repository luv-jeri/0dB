"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { cn } from "@/registry/0db/lib/utils"

/** The attributes on <html> that can change the face. Not class: smooth scrolling toggles one on every scroll. */
const FACE = ["data-pair", "data-scheme", "data-mode", "data-key"]

type Shape = "diminuendo" | "crescendo" | "hairpin"
type Variant = "edge" | "tale" | "cola"

/** How much of the measure a line may take, `t` of the way through the text. */
const share: Record<Shape, (t: number, least: number) => number> = {
  diminuendo: (t, least) => 1 - (1 - least) * t,
  crescendo: (t, least) => least + (1 - least) * t,
  hairpin: (t, least) => least + (1 - least) * (1 - Math.abs(2 * t - 1)),
}

/** A line as laid: its words, how far through the text it starts, and what it is set with. */
type Line = { text: string; t: number; spacing?: number; tracking?: number; size?: number; c?: number; a?: number; k?: number; colon?: number; turn?: boolean }

type ContourProps = Omit<React.ComponentProps<"p">, "children"> & {
  /** The paragraph. Plain text: pretext measures it. */
  children: string
  /** diminuendo narrows to the end, crescendo opens towards it, hairpin swells and closes. For tale it is the size, not the width. */
  shape?: Shape
  /** The narrowest a line may be (for tale, the smallest size), as a share of the measure. */
  least?: number
  /** edge: each line spread to its width, so the edge is the hairpin's straight line. tale: the Mouse's Tale, the type
   *  shrinking as the paragraph winds down the page. cola: a line to each phrase, as texts were set to be read aloud. */
  variant?: Variant
  /** Let the colour follow the shape: ink where it's loud, pencil where it's quiet. */
  fade?: boolean
}

const TALE = { measure: 0.5, turn: 7, floor: 10 } // half the measure a line, a swing every seven lines, never under 10px

/**
 * A paragraph set to a contour, the way a score draws a swell. Pretext lays each line to its own
 * width and each is spread to reach it, so the words taper like a diminuendo or open like a
 * crescendo along a straight edge; with `fade` the colour falls away with them. `tale` sets the
 * contour in the size of the type instead, winding like Carroll's mouse's tail, and `cola` breaks
 * at the phrases. Until the fonts have come and the layout is done, it's a plain paragraph, and a
 * reader of the page always gets the plain text.
 */
function Contour({ children: text, shape = "diminuendo", least = 0.3, variant = "edge", fade = false, className, ref: forwardedRef, ...props }: ContourProps) {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
  const [lines, setLines] = React.useState<Line[] | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false
    let font = ""
    let width = 0
    const off: (() => void)[] = []

    ;(async () => {
      let lib: typeof import("@chenglou/pretext")
      try {
        lib = await import("@chenglou/pretext")
      } catch {
        return // the plain paragraph stays
      }
      let prepared: ReturnType<typeof lib.prepareWithSegments> | undefined
      let phrases: ReturnType<typeof lib.prepareWithSegments>[] = []
      const start = { segmentIndex: 0, graphemeIndex: 0 }

      async function lay() {
        if (cancelled || !el!.isConnected) return
        const style = getComputedStyle(el!)
        const next = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        if (next !== font || !prepared) {
          font = next
          await document.fonts.load(font, text)
          if (cancelled || !el!.isConnected) return
          prepared = lib.prepareWithSegments(text, font)
          // A phrase ends at a comma, a colon, a full stop, a question or a dash, with its mark.
          phrases = (text.match(/[^,;:.!?—–]+(?:[,;:.!?—–]+|$)/g) ?? [text]).map((p) => p.trim()).filter(Boolean).map((p) => lib.prepareWithSegments(p, font))
        }
        width = el!.clientWidth
        const size = parseFloat(style.fontSize)
        const total = Math.max(1, prepared.segments.length)
        const out: Line[] = []

        if (variant === "cola") {
          // A line to each phrase; one too long for the measure turns over, hung an indent in, like verse.
          const hang = 1.5 * size
          phrases.forEach((p, colon) => {
            let cursor = start
            for (let guard = 0; guard < 100; guard++) {
              const turn = cursor !== start
              const line = lib.layoutNextLine(p, cursor, Math.max(width - (turn ? hang : 0), 48))
              if (!line) break
              out.push({ text: line.text.trim(), t: colon / phrases.length, colon, turn })
              cursor = line.end
            }
          })
        } else if (variant === "tale") {
          // Every line holds the same measure in its own size, so the tail narrows as the type does.
          const ratio = parseFloat(style.lineHeight) / size || 1.45
          const measure = Math.max(width * TALE.measure, 96)
          let cursor = start, y = 0
          for (let guard = 0; guard < 500; guard++) {
            const t = cursor.segmentIndex / total
            const line = lib.layoutNextLine(prepared, cursor, measure)
            if (!line) break
            const s = Math.max(TALE.floor, size * share[shape](t, least))
            const room = (width - (line.width * s) / size) / 2
            out.push({ text: line.text.trimEnd(), t, size: s, c: room, a: room * 0.85, k: (2 * Math.PI * y) / (TALE.turn * size * ratio) })
            y += s * ratio
            cursor = line.end
          }
        } else {
          let cursor = start
          for (let guard = 0; guard < 500; guard++) {
            const t = cursor.segmentIndex / total
            const want = Math.max(width * share[shape](t, least), 48)
            let line = lib.layoutNextLine(prepared, cursor, want)
            if (!line) break
            // One more word, if the gaps can close a little to take it: the edge comes out truer.
            const more = lib.layoutNextLine(prepared, cursor, want * 1.06)
            if (more && more.end.segmentIndex > line.end.segmentIndex) {
              const g = more.text.trimEnd().split(" ").length - 1
              if (g && (more.width - want) / g <= size * 0.06) line = more
            }
            const words = line.text.trimEnd()
            const gaps = words.split(" ").length - 1
            // Spread it to its width, mostly in the gaps and a little in the letters; the last line stays as it is.
            const slack = lib.layoutNextLine(prepared, line.end, 1e5) ? want - line.width : 0
            const spacing = gaps ? Math.max(-size * 0.06, Math.min(slack / gaps, size * 0.3)) : 0
            const rest = slack - spacing * gaps
            out.push({ text: words, t, spacing, tracking: rest > 0 ? Math.min(rest / words.length, size * 0.03) : 0 })
            cursor = line.end
          }
        }
        if (!cancelled) setLines(out)
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

      // The tale swings with the hand across it, and comes to rest when the hand leaves.
      if (variant === "tale" && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const swing = (e: PointerEvent) => {
          if (e.pointerType === "touch") return
          const box = el.getBoundingClientRect()
          el.style.setProperty("--phase", `${((e.clientX - box.left) / box.width) * 2 * Math.PI}rad`)
        }
        const rest = () => el.style.removeProperty("--phase")
        el.addEventListener("pointermove", swing)
        el.addEventListener("pointerleave", rest)
        off.push(() => {
          el.removeEventListener("pointermove", swing)
          el.removeEventListener("pointerleave", rest)
          rest()
        })
      }
    })()

    return () => {
      cancelled = true
      off.forEach((f) => f())
    }
  }, [text, shape, least, variant])

  const line = (l: Line, i: number) => (
    <span
      key={i}
      data-turn={l.turn || undefined}
      style={{ "--t": l.t, "--i": i, wordSpacing: l.spacing || undefined, letterSpacing: l.tracking || undefined, fontSize: l.size, ...(l.k === undefined ? null : { "--c": `${l.c}px`, "--a": `${l.a}px`, "--k": `${l.k}rad` }) } as React.CSSProperties}
    >
      {l.text}
    </span>
  )

  return (
    <p ref={composedRef} data-slot="contour" data-shape={shape} data-variant={variant === "edge" ? undefined : variant} data-fade={fade || undefined} className={cn("db-contour", className)} {...props}>
      {lines ? (
        <>
          <span className="db-sr">{text}</span>
          <span aria-hidden="true" className="db-contour-lines">
            {variant === "cola"
              ? Array.from(new Set(lines.map((l) => l.colon))).map((colon) => (
                  <span key={colon} className="db-contour-colon">
                    {lines.map((l, i) => (l.colon === colon ? line(l, i) : null))}
                  </span>
                ))
              : lines.map(line)}
          </span>
        </>
      ) : (
        text
      )}
    </p>
  )
}

export { Contour, type ContourProps }
