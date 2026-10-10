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

type Glyph = { ch: string; x: number; y: number; r: number; k: number; say: number; hush?: boolean; quiet?: boolean }
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
  let lo = 1, hi = along.length - 1
  while (lo < hi) { const mid = (lo + hi) >> 1; if (along[mid] < s) lo = mid + 1; else hi = mid }
  const i = lo
  const [ax, ay] = pts[i - 1], [bx, by] = pts[i]
  const t = along[i] === along[i - 1] ? 0 : (s - along[i - 1]) / (along[i] - along[i - 1])
  return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t, r: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI }
}

/** The same stroke read from its other end. */
function backwards(p: Sampled): Sampled {
  const n = p.pts.length
  return { pts: p.pts.slice().reverse(), along: p.pts.map((_, i) => p.length - p.along[n - 1 - i]), length: p.length }
}

/** For each point of a sampled stroke, how long the run it lies on is between corners: where the stroke turns more
 *  than 25° within a unit. A ring is one run all round; an arrowhead is two, one each side of its point. */
function runs(p: Sampled): number[] {
  const n = p.pts.length, heading = (i: number, j: number) => Math.atan2(p.pts[j][1] - p.pts[i][1], p.pts[j][0] - p.pts[i][0])
  const corners = [0]
  for (let i = 2; i < n - 2; i++) {
    const d = Math.abs(((((heading(i, i + 2) - heading(i - 2, i)) * 180) / Math.PI + 540) % 360) - 180)
    if (d > 25 && p.along[i] - p.along[corners[corners.length - 1]] > 0.5) corners.push(i)
  }
  corners.push(n - 1)
  const out = new Array<number>(n)
  for (let c = 0; c + 1 < corners.length; c++) for (let i = corners[c]; i <= corners[c + 1]; i++) out[i] = p.along[corners[c + 1]] - p.along[corners[c]]
  return out
}

/** Where a stroke turns sharply (more than 50° within a unit), units along it: an arrowhead's point. */
function sharp(p: Sampled): number[] {
  const n = p.pts.length, heading = (i: number, j: number) => Math.atan2(p.pts[j][1] - p.pts[i][1], p.pts[j][0] - p.pts[i][0])
  const out: number[] = []
  let best = -1, most = 0
  for (let i = 2; i < n - 2; i++) {
    const d = Math.abs(((((heading(i, i + 2) - heading(i - 2, i)) * 180) / Math.PI + 540) % 360) - 180)
    if (d > 50 && d > most) { best = i; most = d }
    else if (d <= 50 && best >= 0) { out.push(p.along[best]); best = -1; most = 0 }
  }
  if (best >= 0) out.push(p.along[best])
  return out
}

/** A closed stroke twice round, so a word can start anywhere on it and run on past where the drawing began. */
function twice(p: Sampled): Sampled {
  return { pts: [...p.pts, ...p.pts.slice(1)], along: [...p.along, ...p.along.slice(1).map((a) => a + p.length)], length: p.length * 2 }
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
  const leaders = (p: Sampled, from: number, to: number, f: number, stroke: number, quiet = false) => {
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
    // A sharp corner (an arrowhead's point) always takes a leader of its own, the nearest one moved onto it, and
    // stands a little closer to another stroke than the rest may: without its point an arrow is a line.
    const points = new Set<number>()
    if (spots.length > 2) for (const c of sharp(p)) {
      const s = c * u
      if (s <= from || s >= to) continue
      let k = 0
      spots.forEach((v, i) => { if (Math.abs(v - s) < Math.abs(spots[k] - s)) k = i })
      if (k > 0 && k < spots.length - 1) { spots[k] = s; points.add(k) }
    }
    for (const [k, s] of spots.entries()) {
      const q = at(p, s / u)
      const box: Box = { x: q.x * u, y: q.y * u, r: 0, w: dot, h: dot, stroke }
      // Another stroke's leader stands off by its box, or a pitch between centres (most of one at a sharp point), the
      // spacing the strokes are ruled at, so a join reads as one ruling and an arrowhead keeps its point and barbs.
      const apart = pitch * (points.has(k) ? 0.75 : 0.95)
      const clear = (g: Box) => reach(g, box.x, box.y) >= pitch * 0.6 || Math.hypot(g.x - box.x, g.y - box.y) >= apart
      // The word's letters (stroke -1) keep the leaders a little further off, so the word stands clear of its drawing.
      if (boxes.every((g) => g.stroke === stroke || (g.stroke < 0 ? reach(g, box.x, box.y) >= Math.max(pitch * 0.6, g.h * 0.45) : clear(g)))) {
        glyphs.push({ ch: LEADER, x: box.x, y: box.y, r: 0, k: f / ws, say: -1, ...(quiet ? { quiet } : null) })
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

  /** The word cut, set as a typographer would set it by hand: the word once, in ink, on the one stroke that carries
   * it best, and the rest of the drawing ruled in pencil leaders that stop short of it. The best stroke is the one
   * that takes the word largest and most nearly level: read from whichever end keeps it upright, slid along a curve
   * to where it stands straightest, opened by at most 0.08em to reach a little further along a straight one, never
   * turning more than 80° in all or kinking at a corner, never crowding its letters' tops on the inside of a bend.
   * A drawing whose strokes are all too short to hold the word at a size a person reads (a chevron, a star's
   * points) is drawn in leaders a little smaller, and the word set straight beneath it, as a road sign carries its
   * legend; that wins too where it reads clearly larger than the word could on any stroke. */
  const setWord = () => {
    const pieces = lines.map(sample)
    const base = m.advances(letters, rest, false)
    const em = base.reduce((a, b) => a + b, 0)
    const f0 = S * Math.max(0.15, Math.min(0.3, 0.3 - 0.075 * Math.log2(S / 32)))
    const most = f0 * 1.5, least = Math.max(10, f0 * 0.7)
    const meets = (i: number, [x, y]: [number, number]) => pieces.some((q, j) => j !== i && q.pts.some(([qx, qy]) => Math.hypot(qx - x, qy - y) < 0.75))
    const top = (b: Box) => { const a = (b.r * Math.PI) / 180; return [b.x + (Math.sin(a) * b.h) / 2, b.y - (Math.cos(a) * b.h) / 2] }
    const crowd = (p: Box, q: Box) => { const [px, py] = top(p), [qx, qy] = top(q); return Math.hypot(px - qx, py - qy) < 0.75 * Math.hypot(p.x - q.x, p.y - q.y) }
    const turn = (r: number) => ((((r + 180) % 360) + 360) % 360) - 180
    // Every stroke's points in pixels, a point a unit, for telling where the word would cover the drawing.
    const others: [number, number, number][] = []
    pieces.forEach((q, j) => { let last = -1; q.pts.forEach(([x, y], i) => { if (q.along[i] - last >= 1) { last = q.along[i]; others.push([x * u, y * u, j]) } }) })
    type Take = { score: number; f: number; set: Glyph[]; put: Box[] }
    const longest = Math.max(...pieces.map((p) => Math.max(...runs(p))))
    let best: Take | null = null

    /** The word laid along p from s, at size f with track added between letters; null where it can't read there. */
    const place = (p: Sampled, s: number, f: number, track: number, stroke: number, straight: number[], bias: number): Take | null => {
      const set: Glyph[] = [], put: Box[] = []
      const from = s
      let swing = 0, widest = 0, lean = 0
      for (let i = 0; i < letters.length; i++) {
        const a = base[i] * f
        const q = at(p, (s + a / 2) / u)
        if (Math.abs(q.r) > 95) return null
        if (i) {
          const d = turn(q.r - put[i - 1].r)
          if (Math.abs(d) > 20) return null // a kink: the word would break at a corner
          swing += d
          widest = Math.max(widest, Math.abs(swing))
        }
        set.push({ ch: letters[i], x: q.x * u, y: q.y * u, r: q.r, k: f / ws, say: i })
        put.push({ x: q.x * u, y: q.y * u, r: q.r, w: a * 0.86, h: f * HEIGHT, stroke: -1 })
        lean += Math.abs(q.r)
        s += a + track
      }
      if (widest > 120) return null
      // Larger and more level is better, and a longer run a little better: an arrow says its word along its shaft.
      const mid = ((from + s) / 2) / u
      let k = 1
      while (k < p.along.length - 1 && p.along[k] < mid) k++
      const level = bias * f * (1 - (0.3 * lean) / letters.length / 90) * (Math.min(straight[k], pieces[stroke].length) / longest) ** 0.7
      if (best && level <= best.score) return null // can't beat what's found: no need to look closer
      if (put.some((b, i) => i && (touch(put[i - 1], b) || crowd(put[i - 1], b)))) return null
      // Over another stroke the word would hide part of the drawing: allowed, but it costs.
      let over = 0
      const [bx0, bx1] = [Math.min(...put.map((b) => b.x)) - f, Math.max(...put.map((b) => b.x)) + f]
      const [by0, by1] = [Math.min(...put.map((b) => b.y)) - f, Math.max(...put.map((b) => b.y)) + f]
      for (const [x, y, j] of others) if (j !== stroke && x > bx0 && x < bx1 && y > by0 && y < by1 && put.some((b) => reach(b, x, y) < f * 0.1)) over++
      return { score: level * (over ? Math.max(0.5, 1 - over * 0.02) : 1), f, set, put }
    }

    pieces.forEach((p0, stroke) => {
      const [a0, a1] = [p0.pts[0], p0.pts[p0.pts.length - 1]]
      const closed = Math.hypot(a0[0] - a1[0], a0[1] - a1[1]) < 0.01
      const ends = [meets(stroke, a0), meets(stroke, a1)]
      // Read from either end; where only one end meets the drawing, toward it a little rather: an arrow's word runs to its head.
      for (const [p, start, end] of [[p0, ends[0], ends[1]], [backwards(p0), ends[1], ends[0]]] as const) {
        const len = p.length * u
        const path = closed ? twice(p) : p
        const straight = runs(path)
        for (let f = Math.min(most, (len * 0.96) / em); f >= least; f *= 0.93) {
          const corner = f * 0.36
          const lo = closed || !start ? 0 : corner
          const hi = closed || !end ? len : len - corner
          const run = em * f
          if (!closed && run > hi - lo) continue
          // Open a little toward the ends of a straight stroke, never past 0.08em.
          const track = closed || letters.length < 2 ? 0 : Math.min(0.08 * f, (hi - lo - run) / (letters.length - 1) / 3)
          const span = run + track * (letters.length - 1)
          const room = closed ? len : hi - lo - span
          const steps = closed ? 48 : Math.min(12, Math.ceil(room / (f * 0.25)))
          let found = false
          for (let i = 0; i <= steps; i++) {
            const s = closed ? (i * len) / steps : lo + (steps ? (room * i) / steps : room / 2)
            const take = place(path, s, f, track, stroke, straight, !start && end ? 1.03 : 1)
            if (!take) continue
            found = true
            // On an open stroke the word sits best at its middle.
            if (!closed && room > 0) take.score *= 1 - 0.08 * Math.abs((s - lo) / room - 0.5)
            if (!best || take.score > best.score) best = take
          }
          if (found) break
        }
      }
    })

    const word = best as Take | null // set inside the loop's closures, which narrowing can't see
    // The legend: the drawing smaller, the word straight beneath it at a size a person reads.
    const fc = Math.min(f0 * 1.1, (S * 0.96) / em)
    if (fc >= 9 && (!word || word.f < fc * 0.85 || fc * 0.7 > word.score)) {
      const pts = pieces.flatMap((p) => p.pts)
      const [x0, x1] = [Math.min(...pts.map((q) => q[0])), Math.max(...pts.map((q) => q[0]))]
      const [y0, y1] = [Math.min(...pts.map((q) => q[1])), Math.max(...pts.map((q) => q[1]))]
      const line = (fc * HEIGHT) / u, gap = (fc * 0.45) / u, edge = 1.5
      const g = Math.min(1, (24 - 2 * edge) / Math.max(x1 - x0, 0.01), (24 - 2 * edge - line - gap) / Math.max(y1 - y0, 0.01))
      const dy = (24 - (line + gap + (y1 - y0) * g)) / 2
      const cx = (x0 + x1) / 2
      const moved = pieces.map((p) => ({ ...p, pts: p.pts.map(([x, y]) => [12 + (x - cx) * g, dy + (y - y0) * g] as [number, number]), along: p.along.map((a) => a * g), length: p.length * g }))
      let x = (S - em * fc) / 2
      const y = (dy + (y1 - y0) * g + gap + line / 2) * u
      const set: Glyph[] = [], put: Box[] = []
      letters.forEach((ch, i) => {
        const a = base[i] * fc
        set.push({ ch, x: x + a / 2, y, r: 0, k: fc / ws, say: i })
        put.push({ x: x + a / 2, y, r: 0, w: a * 0.86, h: fc * HEIGHT, stroke: -1 })
        x += a
      })
      glyphs.push(...set)
      boxes.push(...put)
      moved.forEach((p, stroke) => leaders(p, 0, p.length * u, f0 * Math.sqrt(g), stroke, true))
      return true
    }
    if (!word) return false
    glyphs.push(...word.set)
    boxes.push(...word.put)
    pieces.forEach((p, stroke) => leaders(p, 0, p.length * u, f0, stroke, true))
    return true
  }

  if (mode === "dots") ruleDots()
  else if (mode === "words") {
    // A word that can't be set at a size a person reads anywhere in the drawing: the drawing in dots.
    if (!setWord()) {
      mode = "dots"
      ruleDots()
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
          data-quiet={g.quiet || undefined}
          style={{ "--x": `${g.x}px`, "--y": `${g.y}px`, "--r": `${g.r}deg`, "--k": g.k, ...(g.say >= 0 ? { "--n": g.say, "--m": laid.word.length - 1 - g.say, "--wx": `${laid.word[g.say].x}px`, "--wy": `${laid.word[g.say].y}px` } : null) } as React.CSSProperties}
        >
          {g.ch}
        </span>
      ))}
    </span>
  )
}

export { Sign, layoutSign, mirrored, tableMetrics, type Move, type Path, type SignProps, type SignShape, type SignVariant }
