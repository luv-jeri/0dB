"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { cn } from "@/registry/0db/lib/utils"

/** One move on the 24-unit square: move to, line to, or an arc of a circle (centre, radius, start and sweep in degrees). */
type Move = ["M", number, number] | ["L", number, number] | ["O", number, number, number, number, number]
type Path = Move[]
/** A sign as data: its word, the strokes the word is set along (dots, words), and the rows it fills (fill). Each row
 *  is its centre and the runs inside the silhouette, [y, a, b, a, b…], `step` units apart. `mirror` turns it round
 *  for a right-to-left page, for a sign that points the way the reader goes. */
type SignShape = { word: string; line?: Path[]; fill?: { step: number; rows: number[][] }; mirror?: boolean }
type SignVariant = "dots" | "words" | "fill"

type SignProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** The sign: its word and the drawing the word is set into. */
  shape: SignShape
  /** dots: the strokes ruled in middle-dot leaders. words: the word runs along the strokes, ruled in leaders below
   *  40px where letters can't hold a stroke. fill: the word fills the silhouette row by row. */
  variant?: SignVariant
  /** roman for what the interface offers; italic for what belongs to the person (their mail, their home). */
  face?: "roman" | "italic"
  /** The square's side: pixels, or a CSS length. Default 1.5rem. */
  size?: number | string
  /** What a reader hears. Default: the word. An empty label hides the sign from readers, for a control that already says it. */
  label?: string
}

type Glyph = { ch: string; x: number; y: number; r: number; k: number; say: number; hush?: boolean }
type Laid = { glyphs: Glyph[]; ws: number; rest: number; said: number; word: { x: number; y: number }[] }
/** Advances in ems, for letters in a weight. `wrap` adds to the last the pair it makes with the first, for a word that repeats. */
type Metrics = { advances: (letters: string[], weight: number, wrap: boolean) => number[]; leader: (weight: number) => { advance: number; ink: number } }

/** The attributes on <html> that can change the face. Not class: smooth scrolling toggles one on every scroll. */
const FACE = ["data-pair", "data-scheme", "data-mode", "data-key"]
const REF = 100 // pretext measures once at this size; widths scale straight from it
const WORDS = 40 // below this side the word can't hold a stroke: words are ruled in leaders, as dots are
const LEADER = "·" // the middle dot, type's own dotted line
const HEIGHT = 0.62 // a lowercase letter's height from descender to ascender, in ems, for telling when two touch

// Advances in thousandths of an em of a–z and the middle dot, then the dot's ink, in Archivo and Bodoni Moda italic
// at 500, 600, 700 and 800, measured in Chrome. They lay a sign out on the server and before pretext arrives, so
// every sign renders in the first paint; pretext then sets it again with the face's real kerning.
const ALPHABET = "abcdefghijklmnopqrstuvwxyz" + LEADER
const TABLE: Record<"roman" | "italic", number[][]> = {
  roman: [
    [550, 579, 532, 579, 554, 293, 573, 573, 238, 236, 528, 238, 860, 573, 583, 579, 579, 346, 524, 305, 572, 516, 740, 529, 516, 503, 333, 113],
    [556, 592, 547, 592, 561, 307, 591, 584, 252, 250, 543, 252, 861, 584, 598, 592, 592, 362, 541, 314, 583, 529, 758, 546, 529, 509, 333, 127],
    [580, 608, 573, 608, 584, 325, 607, 602, 267, 264, 570, 267, 891, 602, 613, 608, 608, 380, 556, 342, 601, 547, 798, 572, 547, 519, 333, 141],
    [616, 633, 612, 633, 619, 352, 632, 629, 288, 286, 610, 288, 937, 629, 635, 633, 633, 407, 579, 385, 629, 574, 859, 612, 574, 535, 333, 162],
  ],
  italic: [
    [547, 498, 449, 553, 467, 353, 592, 562, 293, 262, 504, 290, 819, 576, 493, 552, 504, 452, 418, 328, 569, 512, 732, 521, 524, 415, 198, 137],
    [551, 506, 461, 564, 479, 372, 600, 572, 304, 275, 519, 294, 822, 577, 506, 555, 512, 461, 431, 336, 572, 524, 754, 538, 554, 431, 198, 156],
    [557, 518, 478, 579, 494, 397, 610, 586, 318, 293, 537, 298, 826, 579, 523, 558, 522, 472, 447, 347, 577, 539, 783, 560, 592, 451, 198, 181],
    [563, 530, 496, 595, 511, 426, 622, 601, 334, 312, 558, 303, 830, 580, 542, 562, 533, 484, 466, 358, 582, 556, 815, 584, 635, 474, 198, 208],
  ],
}

function tableMetrics(italic: boolean): Metrics {
  const rows = TABLE[italic ? "italic" : "roman"]
  const look = (i: number, weight: number) => {
    const t = Math.max(0, Math.min(3, (weight - 500) / 100)), lo = Math.floor(t), hi = Math.min(3, lo + 1)
    return (rows[lo][i] + (rows[hi][i] - rows[lo][i]) * (t - lo)) / 1000
  }
  return {
    advances: (letters, weight) => letters.map((ch) => { const i = ALPHABET.indexOf(ch); return i < 0 ? 0.55 : look(i, weight) }),
    leader: (weight) => ({ advance: look(26, weight), ink: look(27, weight) }),
  }
}

type Sampled = { pts: [number, number][]; along: number[]; length: number }

/** A path sampled every quarter unit: its points, and how far along each one is. */
function sample(path: Path): Sampled {
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
function at({ pts, along }: Sampled, s: number) {
  let i = 1
  while (i < along.length - 1 && along[i] < s) i++
  const [ax, ay] = pts[i - 1], [bx, by] = pts[i]
  const t = along[i] === along[i - 1] ? 0 : (s - along[i - 1]) / (along[i] - along[i - 1])
  return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t, r: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI }
}

/** The drawing turned round for a right-to-left page: mirrored, and every stroke read the other way, so it still reads forwards. */
function mirrored(shape: SignShape): SignShape {
  const path = (p: Path): Path => {
    const out: Path = []
    for (let i = p.length - 1; i >= 0; i--) {
      const m = p[i]
      if (m[0] === "O") out.push(["O", 24 - m[1], m[2], m[3], 180 - m[4] - m[5], m[5]])
      else out.push([out.length ? "L" : "M", 24 - m[1], m[2]])
    }
    return out
  }
  return {
    ...shape,
    line: shape.line?.map(path),
    fill: shape.fill && { ...shape.fill, rows: shape.fill.rows.map(([y, ...runs]) => [y, ...runs.map((x) => 24 - x).reverse()]) },
  }
}

/** A letter's box: centre, turn and size. */
type Box = { x: number; y: number; r: number; w: number; h: number; stroke: number }

/** How far a point is from a box, 0 inside it. */
function reach(b: Box, x: number, y: number) {
  const a = (-b.r * Math.PI) / 180, dx = x - b.x, dy = y - b.y
  const lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a)
  return Math.hypot(Math.max(0, Math.abs(lx) - b.w / 2), Math.max(0, Math.abs(ly) - b.h / 2))
}

/** Whether two boxes overlap: separating axes. */
function touch(p: Box, q: Box) {
  if (Math.hypot(p.x - q.x, p.y - q.y) > (Math.hypot(p.w, p.h) + Math.hypot(q.w, q.h)) / 2) return false
  const corners = (b: Box) => {
    const a = (b.r * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a)
    return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => [b.x + (i * b.w * c) / 2 - (j * b.h * s) / 2, b.y + (i * b.w * s) / 2 + (j * b.h * c) / 2])
  }
  const cp = corners(p), cq = corners(q)
  for (const b of [p, q]) for (const deg of [b.r, b.r + 90]) {
    const ax = Math.cos((deg * Math.PI) / 180), ay = Math.sin((deg * Math.PI) / 180)
    const span = (cs: number[][]) => { const v = cs.map(([x, y]) => x * ax + y * ay); return [Math.min(...v), Math.max(...v)] }
    const [p0, p1] = span(cp), [q0, q1] = span(cq)
    if (p1 <= q0 || q1 <= p0) return false
  }
  return true
}

const r2 = (v: number) => Math.round(v * 100) / 100

/**
 * Lays a sign out at side S in pixels. Pure: the same shape, side and metrics always give the same letters, so the
 * server and the first paint agree. Optical sizes, as a punchcutter would cut them: the smaller the sign, the
 * heavier its letters.
 */
function layoutSign(shape: SignShape, variant: SignVariant, S: number, italic: boolean, m: Metrics): Laid {
  const letters = Array.from(shape.word)
  const t = Math.max(0, Math.min(3, Math.log2(S / 16)))
  const rest = Math.round(800 - 100 * t) // the letters' weight in the drawing
  const said = italic ? 500 : 560 // the weight of the word when it's said
  const sayAdv = m.advances(letters, said, false)
  const sayEm = sayAdv.reduce((a, b) => a + b, 0)
  // The said word: set at a size a person reads, never under a caption, and at most half again the sign's width, so
  // it stays the sign's own word rather than a label over its neighbours. Only a caption's floor can take it wider.
  const ws = Math.max(11, Math.min(S * 0.42, (1.5 * S) / sayEm))
  const u = S / 24
  const glyphs: Glyph[] = []
  const boxes: Box[] = []
  let mode = variant === "fill" ? "fill" : variant === "dots" || S < WORDS ? "dots" : "words"
  const lines = shape.line ?? []

  /** Rules a stretch of a stroke in leaders at type size f, giving way where it meets letters already set. */
  const leaders = (p: Sampled, from: number, to: number, f: number, stroke: number) => {
    const { advance, ink } = m.leader(rest)
    // A leader's pitch: its own advance, or half again its ink where a face sets its leaders loose (Archivo's
    // middle dot has twice its width of air either side, Bodoni's almost none), so both faces rule a stroke as dark.
    const pitch = Math.min(advance, ink * 1.45) * f
    const L = to - from
    const [a, b] = [p.pts[0], p.pts[p.pts.length - 1]]
    const closed = from === 0 && to === p.length * u && Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.01
    const n = Math.max(1, Math.round(L / pitch))
    const dot = ink * f
    // A stroke shorter than half a pitch is a dot: one leader, at its middle.
    const spots = L < pitch / 2 ? [from + L / 2] : Array.from({ length: closed ? n : n + 1 }, (_, i) => from + (i * L) / n)
    for (const s of spots) {
      const q = at(p, s / u)
      const box: Box = { x: q.x * u, y: q.y * u, r: 0, w: dot, h: dot, stroke }
      if (boxes.every((g) => g.stroke === stroke || reach(g, box.x, box.y) >= pitch * 0.6)) {
        glyphs.push({ ch: LEADER, x: box.x, y: box.y, r: 0, k: f / ws, say: -1 })
        boxes.push(box)
      }
    }
  }

  /** The text cut: each stroke ruled in leaders, ends included. The dots grow more slowly than the sign, so a
   * large one is drawn finer, as a large icon's stroke is. The word's letters wait unseen at points spread along
   * the whole drawing, and rise out of them when it's said. */
  const ruleDots = (f = S <= 24 ? S * 0.66 : 15.84 * (S / 24) ** 0.7) => {
    lines.forEach((path, stroke) => { const p = sample(path); leaders(p, 0, p.length * u, f, stroke) })
    const dots = glyphs.slice()
    letters.forEach((ch, j) => {
      const d = dots[Math.floor(((j + 0.5) * dots.length) / letters.length)]
      if (d) glyphs.push({ ch, x: d.x, y: d.y, r: 0, k: (S * 0.3) / ws, say: j, hush: true })
    })
  }

  if (mode === "dots") ruleDots()
  else if (mode === "words") {
    // Each stroke reads the word in whole words, closed up or spread to reach both its ends, longest stroke first.
    // Where two strokes meet at a corner both stop short of it by the same margin, so neither word runs into the
    // other; where a stroke meets letters already set mid-way it gives way, so a crossing is never a clot of ink.
    // A stretch too short for the word sets it smaller, down to a little over half; shorter still, or bending too
    // tight to hold the word, it is ruled in leaders, since part of a word is no longer the word.
    // A drawing of short strokes takes smaller type: the size steps down until most of the drawing reads as words.
    const pieces = lines.map(sample)
    const total = pieces.reduce((a, p) => a + p.length * u, 0)
    const base = m.advances(letters, rest, true)
    let best: { glyphs: Glyph[]; boxes: Box[]; covered: number } | null = null
    for (const scale of [1, 0.86, 0.74]) {
      glyphs.length = 0
      boxes.length = 0
      let covered = 0
      const f = scale * S * Math.max(0.15, Math.min(0.3, 0.3 - 0.075 * Math.log2(S / 32)))
      const adv = base.map((a) => a * f)
      const cycle = adv.reduce((a, b) => a + b, 0)
      const clearance = f * (HEIGHT / 2 + 0.08)
      const meets = (i: number, [x, y]: [number, number]) => pieces.some((q, j) => j !== i && q.pts.some(([qx, qy]) => Math.hypot(qx - x, qy - y) < 0.75))
      pieces.forEach((p, stroke) => {
        const len = p.length * u, nudge = f * 0.1, corner = f * 0.36
        const free = (s: number) => { const q = at(p, s / u); return boxes.every((b) => reach(b, q.x * u, q.y * u) >= clearance) }
        const lo = meets(stroke, p.pts[0]) ? corner : 0, hi = len - (meets(stroke, p.pts[p.pts.length - 1]) ? corner : 0)
        // The stretches of the stroke clear of every letter already set.
        const stretches: [number, number][] = []
        const steps = Math.ceil((hi - lo) / nudge)
        let start = -1
        for (let i = 0; i <= steps; i++) {
          const s = Math.min(lo + i * nudge, hi), ok = free(s)
          if (ok && start < 0) start = s
          if (start >= 0 && (!ok || i === steps)) { stretches.push([start, ok ? s : Math.max(start, s - nudge)]); start = -1 }
        }
        const before = glyphs.length
        for (let [s0, s1] of stretches) {
          let k = 1
          for (let tries = 0; tries < 60; tries++) {
            const L = s1 - s0
            if (L < f * 0.5) break
            // How many words: the count that asks least of the type. Closing up costs less than spreading, which
            // breaks a word into letters, and a smaller size costs least of all down to where it stops reading.
            let words = 1, least = Infinity
            for (let w = 1; w <= Math.ceil(L / cycle) + 1; w++) {
              const r = L / (cycle * w), cost = r < 0.94 ? 0.94 / r - 1 : r > 1.06 ? (r - 1.06) * 2 : 0
              if (cost < least) { least = cost; words = w }
            }
            const small = Math.min(k, 1, L / (cycle * 0.94 * words))
            if (small < 0.55) { leaders(p, s0, s1, f, stroke); break }
            const n = words * letters.length
            const run = cycle * words * small
            const spread = Math.min(L / run, 1.5)
            let s = s0 + (L - run * spread) / 2
            const set: Glyph[] = [], put: Box[] = []
            for (let i = 0; i < n; i++) {
              const a = adv[i % letters.length] * small
              const q = at(p, (s + (a * spread) / 2) / u)
              set.push({ ch: letters[i % letters.length], x: q.x * u, y: q.y * u, r: q.r, k: (f * small) / ws, say: -1 })
              put.push({ x: q.x * u, y: q.y * u, r: q.r, w: a * 0.86, h: f * small * HEIGHT, stroke })
              s += a * spread
            }
            // Never upside down: a letter turned past a right angle and a bit is a stroke the word can't read along.
            if (set.some((g) => Math.abs(g.r) > 100)) { leaders(p, s0, s1, f, stroke); break }
            // Letters of this word that touch each other, or crowd at their tops on the inside of a curve: the stroke
            // bends too tight for the size. Set it smaller.
            const top = (b: Box) => { const a = (b.r * Math.PI) / 180; return [b.x + (Math.sin(a) * b.h) / 2, b.y - (Math.cos(a) * b.h) / 2] }
            const crowd = (p: Box, q: Box) => { const [px, py] = top(p), [qx, qy] = top(q); return Math.hypot(px - qx, py - qy) < 0.75 * Math.hypot(p.x - q.x, p.y - q.y) }
            // A word that turns through more than eighty degrees can't be read as one, however small.
            const turn = (from: number) => { let t = 0, most = 0; for (let i = from + 1; i < Math.min(n, from + letters.length); i++) { t += ((((put[i].r - put[i - 1].r + 180) % 360) + 360) % 360) - 180; most = Math.max(most, Math.abs(t)) } return most }
            const bends = Array.from({ length: words }, (_, w) => turn(w * letters.length)).some((t) => t > 80)
            if (bends || put.some((b, i) => i && (touch(put[i - 1], b) || crowd(put[i - 1], b)))) { k = small * 0.9; continue }
            // Letters that touch ones already set: give way at that end.
            const hit = put.findIndex((b) => boxes.some((o) => touch(o, b)))
            if (hit >= 0) {
              if (hit < n / 2) s0 += nudge
              else s1 -= nudge
              continue
            }
            glyphs.push(...set)
            boxes.push(...put)
            covered += L
            break
          }
        }
        // A stroke with nothing set on it, small or hemmed in, is still ruled, so the drawing is never missing a stroke.
        if (glyphs.length === before && !(lo && hi < len && len < f * 1.5)) leaders(p, 0, len, f, stroke)
      })
      if (!best || covered > best.covered) best = { glyphs: glyphs.slice(), boxes: boxes.slice(), covered }
      if (covered >= total * 0.7) break
    }
    glyphs.splice(0, glyphs.length, ...best!.glyphs)
    // A drawing of strokes all too short to hold the word at this size, a star's points, is ruled in leaders, as
    // dots are, but at the words' own size, so it sits in a row of words signs as one of them: a few letters
    // scattered at its corners would be neither the word nor the drawing.
    if (!best!.covered) {
      glyphs.length = 0
      boxes.length = 0
      mode = "dots"
      ruleDots(S * Math.max(0.15, Math.min(0.3, 0.3 - 0.075 * Math.log2(S / 32))))
    }
  } else if (shape.fill) {
    // The silhouette in rows, a little tighter than the type's own leading so it reads as one shape. The word runs
    // on from one run to the next, as a paragraph does round a picture; each run is spread to its ends so the edge
    // is the outline, but never so far it falls apart into letters.
    const { step, rows } = shape.fill
    const f = step * u * 1.3
    const adv = m.advances(letters, rest, true).map((a) => a * f)
    const run = (from: number, n: number) => { let s = 0; for (let i = 0; i < n; i++) s += adv[(from + i) % adv.length]; return s }
    let from = 0
    for (const [y, ...runs] of rows) {
      for (let r = 0; r + 1 < runs.length; r += 2) {
        const a = runs[r] * u, cw = (runs[r + 1] - runs[r]) * u
        let n = 0
        while (run(from, n + 1) <= cw * 1.06) n++
        if (!n) {
          if (cw < adv[from % adv.length] * 0.55) continue // too narrow for a letter: paper
          n = 1
        }
        const spread = Math.min(cw / run(from, n), 1.35)
        const inset = (cw - run(from, n) * spread) / 2
        let s = 0
        for (let i = 0; i < n; i++) {
          const w = adv[(from + i) % adv.length]
          glyphs.push({ ch: letters[(from + i) % letters.length], x: a + inset + (s + w / 2) * spread, y: y * u, r: 0, k: f / ws, say: -1 })
          s += w
        }
        from += n
      }
    }
  }

  // The letters that say the word: the first whole word in reading order, else each letter's first appearance.
  if (mode !== "dots") {
    const first = glyphs.findIndex((_, i) => letters.every((ch, j) => glyphs[i + j]?.ch === ch))
    letters.forEach((ch, j) => {
      const g = first >= 0 ? glyphs[first + j] : glyphs.find((x) => x.ch === ch && x.say < 0)
      if (g) g.say = j
    })
  }
  // Where they stand when it's said: the word set straight across the middle of the square.
  const wadv = sayAdv.map((a) => a * ws)
  let x = (S - sayEm * ws) / 2
  const word = wadv.map((a) => { const p = { x: r2(x + a / 2), y: r2(S / 2) }; x += a; return p })
  for (const g of glyphs) {
    g.x = r2(g.x)
    g.y = r2(g.y)
    g.k = Math.round(g.k * 1000) / 1000
    // A turn the short way round, so a letter rights itself rather than spinning.
    g.r = r2(((((g.r + 180) % 360) + 360) % 360) - 180)
  }
  return { glyphs, ws: r2(ws), rest, said, word }
}

/** The side in pixels a size gives on the server: pixels, px or rem. Anything else is measured in the browser. */
function side(size: number | string | undefined) {
  if (size == null) return 24
  if (typeof size === "number") return size
  const n = parseFloat(size)
  if (size.endsWith("rem")) return n * 16
  if (size.endsWith("px")) return n
  return 24
}

/**
 * A sign: an icon made of its own word. The word is set along the strokes of the drawing (words), the strokes are
 * ruled in middle-dot leaders (dots), or the word fills the silhouette row by row (fill), so type stays the only
 * ornament and no second visual language arrives. It lays out on the server from measured advances; pretext sets
 * it again in the browser with the face's kerning. Pointing at it, at the control it sits in, or focusing that
 * control, sets the word: the letters leave the drawing in reading order, one arpeggio apart, and stand up as the
 * word they always were; the echoes go quiet. Leaving winds them back. Under reduced motion the word and the
 * drawing change places without travel.
 */
function Sign({ shape, variant = "words", face = "roman", size, label, className, style, ref: forwardedRef, ...props }: SignProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
  const italic = face === "italic"
  const [laid, setLaid] = React.useState<Laid>(() => layoutSign(shape, variant, side(size), italic, tableMetrics(italic)))

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false
    const off: (() => void)[] = []
    const table = tableMetrics(italic)

    ;(async () => {
      let lib: typeof import("@chenglou/pretext") | null = null
      try {
        lib = await import("@chenglou/pretext")
      } catch {
        // The measured table stands in: no kerning, otherwise the same.
      }
      const widths = new Map<string, number>()

      async function lay() {
        if (cancelled || !el!.isConnected) return
        const S = el!.clientWidth
        if (!S) return
        const css = getComputedStyle(el!)
        const turned = shape.mirror && css.direction === "rtl" ? mirrored(shape) : shape
        const font = (w: number) => `${italic ? "italic " : ""}${w} ${REF}px ${css.fontFamily}`
        let metrics = table
        if (lib) {
          const t = Math.max(0, Math.min(3, Math.log2(S / 16)))
          const weights = [Math.round(800 - 100 * t), italic ? 500 : 560]
          try {
            await Promise.all(weights.map((w) => document.fonts.load(font(w), shape.word + LEADER)))
          } catch {
            // A face that won't load is measured as it falls back.
          }
          if (cancelled || !el!.isConnected) return
          const pretext = lib
          const width = (s: string, w: number) => {
            const key = `${font(w)}|${s}`
            let v = widths.get(key)
            if (v == null) widths.set(key, (v = s ? pretext.measureNaturalWidth(pretext.prepareWithSegments(s, font(w))) / REF : 0))
            return v
          }
          let ink = Infinity
          const c = document.createElement("canvas").getContext("2d")
          metrics = {
            // Each letter's advance, kerning included: the width up to and with it, less the width before it.
            advances: (letters, w, wrap) => {
              let before = 0
              const out = letters.map((_, i) => { const upto = width(letters.slice(0, i + 1).join(""), w); const a = upto - before; before = upto; return a })
              const word = letters.join("")
              if (wrap && out.length) out[out.length - 1] += width(word + word, w) - 2 * width(word, w)
              return out
            },
            leader: (w) => {
              if (c && ink === Infinity) {
                c.font = font(w)
                const m = c.measureText(LEADER)
                ink = (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) / REF
              }
              return { advance: width(LEADER, w), ink: ink === Infinity ? table.leader(w).ink : ink }
            },
          }
        }
        if (!cancelled) setLaid(layoutSign(turned, variant, S, italic, metrics))
      }

      await lay()
      if (cancelled) return
      let width = el.clientWidth
      const resized = new ResizeObserver(() => {
        if (el.clientWidth !== width) { width = el.clientWidth; lay() }
      })
      resized.observe(el)
      const restyled = new MutationObserver(() => lay())
      restyled.observe(document.documentElement, { attributeFilter: [...FACE, "dir"] })
      off.push(() => { resized.disconnect(); restyled.disconnect() })
    })()

    return () => {
      cancelled = true
      off.forEach((f) => f())
    }
  }, [shape, variant, italic])

  const hidden = label === ""
  return (
    <span
      ref={composedRef}
      data-slot="sign"
      data-variant={variant}
      data-face={italic ? "italic" : undefined}
      role={hidden ? undefined : "img"}
      aria-label={hidden ? undefined : (label ?? shape.word)}
      aria-hidden={hidden || undefined}
      className={cn("db-sign", className)}
      style={{ ...(size != null ? { "--db-sign-size": typeof size === "number" ? `${size}px` : size } : null), "--ws": `${laid.ws}px`, "--rest": laid.rest, "--said": laid.said, ...style } as React.CSSProperties}
      {...props}
    >
      {laid.glyphs.map((g, i) => (
        <span
          key={i}
          className="db-sign-glyph"
          data-say={g.say >= 0 ? "" : undefined}
          data-hush={g.hush || undefined}
          style={{ "--x": `${g.x}px`, "--y": `${g.y}px`, "--r": `${g.r}deg`, "--k": g.k, ...(g.say >= 0 ? { "--n": g.say, "--m": laid.word.length - 1 - g.say, "--wx": `${laid.word[g.say].x}px`, "--wy": `${laid.word[g.say].y}px` } : null) } as React.CSSProperties}
        >
          {g.ch}
        </span>
      ))}
    </span>
  )
}

export { Sign, layoutSign, mirrored, tableMetrics, type Move, type Path, type SignProps, type SignShape, type SignVariant }
