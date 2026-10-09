"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import type { Path, SignShape } from "@/registry/0db/lib/sign-shapes"
import { cn } from "@/registry/0db/lib/utils"

/** The attributes on <html> that can change the face. Not class: smooth scrolling toggles one on every scroll. */
const FACE = ["data-pair", "data-scheme", "data-mode", "data-key"]

type SignProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** The sign: its word and the drawing the word is set into. */
  shape: SignShape
  /** dots: always shows the dotted drawing at every size. words: sets the word along the strokes. */
  variant?: "dots" | "words"
  /** roman for what the interface offers; italic for what belongs to the person (their mail, their home). */
  face?: "roman" | "italic"
  /** The square's side, a CSS length or pixel number. Default 1.5rem. */
  size?: string | number
  /** What a reader hears. Default: the word. An empty label hides the sign from readers, for a control that already says it. */
  label?: string
}

type Glyph = { ch: string; x: number; y: number; r: number; say: number; stroke?: number; k?: number; hush?: boolean }
type Laid = { glyphs: Glyph[]; ws: number; k: number; rest: number; said: number; word: { x: number; y: number }[] }

const REF = 100 // pretext measures once at this size; widths scale straight from it
const LEADER = "\u00b7" // the middle dot, type's own dotted line
const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" })

/** A path sampled every quarter unit: its points, and how far along each one is. */
function sample(path: Path) {
  const pts: [number, number][] = []
  for (const move of path) {
    if (move[0] === "M") pts.push([move[1], move[2]])
    else if (move[0] === "L") {
      const [px, py] = pts[pts.length - 1], [, x, y] = move
      const n = Math.max(1, Math.ceil(Math.hypot(x - px, y - py) * 4))
      for (let i = 1; i <= n; i++) pts.push([px + ((x - px) * i) / n, py + ((y - py) * i) / n])
    } else {
      const [, cx, cy, r, from, sweep] = move
      const n = Math.max(8, Math.ceil(((Math.abs(sweep) * Math.PI) / 180) * r * 4))
      for (let i = 0; i <= n; i++) {
        const a = ((from + (sweep * i) / n) * Math.PI) / 180
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
      }
    }
  }
  const along = [0]
  for (let i = 1; i < pts.length; i++) along.push(along[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  return { pts, along, length: along[along.length - 1] }
}

/** The point s units along a sampled path, and the way it heads there, in degrees. */
function at({ pts, along }: ReturnType<typeof sample>, s: number) {
  let i = 1
  while (i < along.length - 1 && along[i] < s) i++
  const [ax, ay] = pts[i - 1], [bx, by] = pts[i]
  const t = along[i] === along[i - 1] ? 0 : (s - along[i - 1]) / (along[i] - along[i - 1])
  return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t, r: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI }
}

/**
 * A sign: an icon made of its own word. The word is set by pretext along the strokes of the drawing (words) or
 * in middle-dot leaders (dots), so type stays the only ornament and no second visual language arrives. Pointing
 * at it, or at the control it sits in, sets the word: the letters leave the drawing in reading order, one arpeggio
 * apart, and stand up as the word they always were; the echoes go quiet. Leaving winds them back. Under reduced
 * motion the word and the drawing change places without travel.
 */
function Sign({ shape, variant = "words", face = "roman", size, label, className, style, ref: forwardedRef, ...props }: SignProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
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
        return // the sign stays its label
      }

      async function lay() {
        if (cancelled || !el!.isConnected) return
        const S = el!.clientWidth
        if (!S) return
        const css = getComputedStyle(el!)
        const italic = face === "italic" ? "italic " : ""
        // Optical sizes, as a punchcutter would cut them: the smaller the sign, the larger and heavier its letters.
        const t = Math.max(0, Math.min(3, Math.log2(S / 16)))
        const leaders = variant === "dots"
        const f = leaders ? S * 0.66 : S * Math.max(0.15, Math.min(0.3, 0.3 - 0.075 * Math.log2(S / 32)))
        const rest = Math.round(800 - 100 * t) // their weight
        const said = face === "italic" ? 500 : 560 // the weight of the word when it's said
        const ws = Math.max(13, S * 0.42) // the word's size when it's said: never under a caption
        const font = (w: number) => `${italic}${w} ${REF}px ${css.fontFamily}`
        await Promise.all([document.fonts.load(font(rest), shape.word), document.fonts.load(font(said), shape.word)])
        if (cancelled || !el!.isConnected) return

        const letters = Array.from(graphemes.segment(shape.word), (g) => g.segment)
        const width = (s: string, w: number) => (s ? lib.measureNaturalWidth(lib.prepareWithSegments(s, font(w))) : 0)
        // Each letter's advance, kerning included: the width up to and with it, less the width before it.
        // The last one also carries the pair it makes with the first, since the word repeats round the drawing.
        const advances = (w: number) => {
          let before = 0
          const out = letters.map((_, i) => {
            const upto = width(letters.slice(0, i + 1).join(""), w)
            const a = upto - before
            before = upto
            return a
          })
          out[out.length - 1] += width(shape.word + shape.word, w) - 2 * width(shape.word, w)
          return out
        }
        const u = S / 24, unit = f / REF
        const adv = advances(rest).map((a) => a * unit)
        const cycle = adv.reduce((a, b) => a + b, 0)
        const run = (from: number, n: number) => { let s = 0; for (let i = 0; i < n; i++) s += adv[(from + i) % adv.length]; return s }
        const glyphs: Glyph[] = []
        // A leader's pitch: its own advance, or half again its ink where a face sets its leaders loose (Archivo's
        // middle dot has twice its width of air either side, Bodoni's almost none), so both faces rule a stroke as dark.
        const ink = (() => {
          const c = document.createElement("canvas").getContext("2d")
          if (!c) return Infinity
          c.font = font(rest)
          const m = c.measureText(LEADER)
          return m.actualBoundingBoxLeft + m.actualBoundingBoxRight
        })()
        const pitch = Math.min(width(LEADER, rest), ink * 1.45) * unit
        // Where two strokes cross, the later one gives way, so a crossing is never a clot of ink.
        const clear = (x: number, y: number, stroke: number, gap: number) => glyphs.every((g) => g.stroke === stroke || Math.hypot(g.x - x, g.y - y) >= gap)

        if (leaders) {
          // The dotted cut: each stroke ruled in leaders, ends included, at the leader's pitch. The word's
          // letters wait unseen at points spread along the whole drawing, and rise out of them when it's said.
          const step = pitch
          shape.line.forEach((path, stroke) => {
            const p = sample(path), L = p.length * u
            const [a, b] = [p.pts[0], p.pts[p.pts.length - 1]]
            const closed = Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.01
            const n = Math.max(2, Math.round(L / step))
            for (let i = 0; i <= (closed ? n - 1 : n); i++) {
              const q = at(p, (i * L) / n / u)
              if (clear(q.x * u, q.y * u, stroke, (L / n) * 0.8)) glyphs.push({ ch: LEADER, x: q.x * u, y: q.y * u, r: 0, say: -1, stroke })
            }
          })
          const dots = glyphs.slice()
          letters.forEach((ch, j) => {
            const d = dots[Math.floor(((j + 0.5) * dots.length) / letters.length)] ?? { x: S / 2, y: S / 2 }
            glyphs.push({ ch, x: d.x, y: d.y, r: 0, say: j, k: (S * 0.3) / ws, hush: true })
          })
        } else {
          // Each stroke reads the word from its start, in whole words, spread or closed up to reach both its ends. A
          // stroke too short for the word sets it smaller, down to three fifths; shorter still, the stroke is ruled in
          // leaders, since part of a word is no longer the word. A stroke that starts or ends against an earlier one
          // begins or ends where it comes clear of it; a crossing in the middle of a stroke is two strokes in the table.
          shape.line.forEach((path, stroke) => {
            const p = sample(path), len = p.length * u, gap = f * 0.55, nudge = f * 0.1
            const free = (d: number) => { const q = at(p, d / u); return clear(q.x * u, q.y * u, stroke, gap) }
            let s0 = 0, s1 = len
            while (s0 < len && !free(s0)) s0 += nudge
            while (s1 > s0 && !free(s1)) s1 -= nudge
            if (s1 - s0 < f * 0.5) return
            const L = s1 - s0
            const m = Math.max(1, Math.round(L / cycle))
            const small = Math.min(1, L / (cycle * 0.92))
            if (small < 0.6) {
              const dot = pitch, n = Math.max(2, Math.round(L / dot))
              for (let i = 0; i <= n; i++) {
                const q = at(p, (s0 + (i * L) / n) / u)
                if (clear(q.x * u, q.y * u, stroke, dot * 0.8)) glyphs.push({ ch: LEADER, x: q.x * u, y: q.y * u, r: 0, say: -1, stroke })
              }
              return
            }
            const n = m * letters.length
            const spread = L / run(0, n)
            const k = small < 1 ? (f * small) / ws : undefined
            let s = 0
            for (let i = 0; i < n; i++) {
              const a = adv[i % adv.length]
              const q = at(p, (s0 + (s + a / 2) * spread) / u)
              if (clear(q.x * u, q.y * u, stroke, gap * small)) glyphs.push({ ch: letters[i % letters.length], x: q.x * u, y: q.y * u, r: q.r, say: -1, stroke, k })
              s += a
            }
          })
          // The letters that say the word: the first whole word in reading order, else each letter's first appearance.
          const at0 = glyphs.findIndex((_, i) => letters.every((ch, j) => glyphs[i + j]?.ch === ch))
          const dots = glyphs.filter((g) => g.ch === LEADER)
          letters.forEach((ch, j) => {
            const g = at0 >= 0 ? glyphs[at0 + j] : glyphs.find((x) => x.ch === ch && x.say < 0)
            if (g) {
              g.say = j
            } else if (dots.length) {
              const d = dots[Math.floor(((j + 0.5) * dots.length) / letters.length)] ?? { x: S / 2, y: S / 2 }
              glyphs.push({ ch, x: d.x, y: d.y, r: 0, say: j, k: (S * 0.3) / ws, hush: true })
            }
          })
        }

        // Where they stand when it's said: the word set straight across the middle of the square, at a size a person reads.
        const wadv = advances(said).map((a) => (a * ws) / REF)
        wadv[wadv.length - 1] -= ((width(shape.word + shape.word, said) - 2 * width(shape.word, said)) * ws) / REF
        const W = wadv.reduce((a, b) => a + b, 0)
        let x = (S - W) / 2
        const word = wadv.map((a) => { const p = { x: x + a / 2, y: S / 2 }; x += a; return p })
        // A turn the short way round, so a letter upside down on the lens rights itself rather than spinning.
        for (const g of glyphs) g.r = ((((g.r + 180) % 360) + 360) % 360) - 180
        if (!cancelled) setLaid({ glyphs, ws, k: f / ws, rest, said, word })
      }

      await lay()
      if (cancelled) return
      let side = el.clientWidth
      const resized = new ResizeObserver(() => {
        if (el.clientWidth !== side) { side = el.clientWidth; lay() }
      })
      resized.observe(el)
      const restyled = new MutationObserver(() => lay())
      restyled.observe(document.documentElement, { attributeFilter: FACE })
      off.push(() => { resized.disconnect(); restyled.disconnect() })
    })()

    return () => {
      cancelled = true
      off.forEach((f) => f())
    }
  }, [shape, variant, face])

  const hidden = label === ""
  return (
    <span
      ref={composedRef}
      data-slot="sign"
      data-variant={variant}
      data-face={face === "roman" ? undefined : face}
      role={hidden ? undefined : "img"}
      aria-label={hidden ? undefined : (label ?? shape.word)}
      aria-hidden={hidden || undefined}
      className={cn("db-sign", className)}
      style={{ ...(size != null ? { "--db-sign-size": typeof size === "number" ? `${size}px` : size } : null), ...(laid ? { "--ws": `${laid.ws}px`, "--k": laid.k, "--rest": laid.rest, "--said": laid.said } : null), ...style } as React.CSSProperties}
      {...props}
    >
      <span aria-hidden="true" className="db-sign-glyphs" data-laid={laid ? "" : undefined}>
        {laid?.glyphs.map((g, i) => (
          <span
            key={i}
            className="db-sign-glyph"
            data-say={g.say >= 0 ? "" : undefined}
            data-hush={g.hush || undefined}
            style={{ ...(g.k ? { "--k": g.k } : null), "--x": `${g.x}px`, "--y": `${g.y}px`, "--r": `${g.r}deg`, ...(g.say >= 0 ? { "--n": g.say, "--m": laid.word.length - 1 - g.say, "--wx": `${laid.word[g.say].x}px`, "--wy": `${laid.word[g.say].y}px` } : null) } as React.CSSProperties}
          >
            {g.ch}
          </span>
        ))}
      </span>
    </span>
  )
}

export { Sign, type SignProps }
