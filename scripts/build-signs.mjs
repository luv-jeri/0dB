// Builds the signs: each curated Lucide drawing (and the five drawn by hand) becomes the strokes a word is set
// along and the rows a word fills, on the 24-unit square. Writes one registry file per sign and variant to
// registry/0db/signs (generated, committed like public/r) and the whole table to lib/site/signs.ts for the docs.
//   node scripts/build-signs.mjs         build
// Hooked into npm run registry:build; its --check fails when any of them is stale.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from "node:fs"

// V8's sin, cos, atan2 and hypot are C++ that the compiler may fuse differently on ARM and x86, so the last bit of
// a result can differ between a Mac and the Linux CI. Snapping each one to nine places keeps every later decision,
// and so every generated file, the same on both. Plain + - * / are exact IEEE and already agree.
const snap = (v) => Math.round(v * 1e9) / 1e9
const mcos = (a) => snap(Math.cos(a)), msin = (a) => snap(Math.sin(a))
const matan2 = (y, x) => snap(Math.atan2(y, x)), mhypot = (x, y) => snap(Math.hypot(x, y))

const DATA = "scripts/data/signs.json"
const OUT = "registry/0db/signs"
export const VARIANTS = ["dots", "words", "fill"]

// ── The five drawn by hand, as approved on 2026-10-10. Their fill silhouettes are closed polygons
// that add to the shape and polygons cut out of it, as first drawn.
const bar = (ax, ay, bx, by, w) => {
  const len = mhypot(bx - ax, by - ay), nx = (-(by - ay) / len) * (w / 2), ny = ((bx - ax) / len) * (w / 2)
  return [[ax + nx, ay + ny], [bx + nx, by + ny], [bx - nx, by - ny], [ax - nx, ay - ny]]
}
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const disc = (cx, cy, r) => Array.from({ length: 96 }, (_, i) => [cx + r * mcos((i / 96) * 2 * Math.PI), cy + r * msin((i / 96) * 2 * Math.PI)])

export const HAND = {
  search: {
    line: [[["O", 10, 10, 6.5, 180, 180]], [["O", 10, 10, 6.5, 180, -180]], [["M", 15.6, 15.6], ["L", 21.5, 21.5]]],
    fill: { add: [disc(10, 10, 8), bar(14, 14, 21.5, 21.5, 4.4)] },
  },
  "arrow-right": {
    line: [[["M", 2.5, 12], ["L", 17.5, 12]], [["M", 12.5, 4], ["L", 20, 11]], [["M", 12.5, 20], ["L", 20, 13]]],
    fill: { add: [rect(2, 9.6, 14, 14.4), [[11.5, 3], [22.5, 12], [11.5, 21]]] },
  },
  close: {
    line: [[["M", 5, 19], ["L", 19, 5]], [["M", 5, 5], ["L", 12, 12]], [["M", 12, 12], ["L", 19, 19]]],
    fill: { add: [bar(4, 4, 20, 20, 5.6), bar(4, 20, 20, 4, 5.6)] },
  },
  mail: {
    line: [[["M", 3, 6], ["L", 21, 6]], [["M", 21, 6], ["L", 21, 18]], [["M", 3, 18], ["L", 21, 18]], [["M", 3, 6], ["L", 3, 18]], [["M", 4, 7.5], ["L", 12, 13.2]], [["M", 12, 13.2], ["L", 20, 7.5]]],
    fill: { add: [rect(1.5, 4.5, 22.5, 19.5)], cut: [[[1.5, 4.5], [12, 12.4], [22.5, 4.5], [22.5, 7.2], [12, 15.3], [1.5, 7.2]]] },
  },
  home: {
    line: [[["M", 2, 11.5], ["L", 12, 3]], [["M", 12, 3], ["L", 22, 11.5]], [["M", 5, 10], ["L", 5, 21]], [["M", 19, 10], ["L", 19, 21]], [["M", 5, 21], ["L", 19, 21]]],
    fill: { add: [[[12, 1.5], [23.5, 11.5], [20, 11.5], [20, 22], [4, 22], [4, 11.5], [0.5, 11.5]]], cut: [rect(10, 15.5, 14, 22.5)] },
  },
}

// ── SVG to polylines ─────────────────────────────────────────────────────────────────────────────────

const COMMAND = /[MmZzLlHhVvCcSsQqTtAa]/
const NUMBER = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/

/** Path data to subpaths of points. Relative commands, implicit repeats, packed numbers (".5.5") and packed
 * arc flags ("0 01.5"), S/T reflection (only after a curve of their kind), and Z back to the subpath start. */
export function parsePath(d) {
  let i = 0
  const n = d.length
  const ws = () => { while (i < n && /[\s,]/.test(d[i])) i++ }
  const num = () => {
    ws()
    const m = NUMBER.exec(d.slice(i))
    if (!m) throw new Error(`Expected a number at ${i} in "${d}"`)
    i += m[0].length
    return parseFloat(m[0])
  }
  const flag = () => {
    ws()
    if (d[i] !== "0" && d[i] !== "1") throw new Error(`Expected an arc flag at ${i} in "${d}"`)
    return d[i++] === "1"
  }
  const subs = []
  let cur = null, x = 0, y = 0, sx = 0, sy = 0, cmd = "", ctl = null, ctlKind = ""
  const begin = (px, py) => { cur = { pts: [[px, py]], closed: false }; subs.push(cur) }
  const to = (px, py) => {
    if (!cur || cur.closed) begin(x, y)
    cur.pts.push([px, py])
    x = px
    y = py
  }
  const cubic = (x1, y1, x2, y2, ex, ey) => {
    const x0 = x, y0 = y
    const hull = mhypot(x1 - x0, y1 - y0) + mhypot(x2 - x1, y2 - y1) + mhypot(ex - x2, ey - y2)
    const steps = Math.max(2, Math.ceil(hull * 4))
    for (let s = 1; s <= steps; s++) {
      const t = s / steps, m = 1 - t
      to(m * m * m * x0 + 3 * m * m * t * x1 + 3 * m * t * t * x2 + t * t * t * ex, m * m * m * y0 + 3 * m * m * t * y1 + 3 * m * t * t * y2 + t * t * t * ey)
    }
  }
  const quad = (x1, y1, ex, ey) => cubic(x + (2 / 3) * (x1 - x), y + (2 / 3) * (y1 - y), ex + (2 / 3) * (x1 - ex), ey + (2 / 3) * (y1 - ey), ex, ey)
  const arc = (rx, ry, rot, large, sweep, ex, ey) => {
    const x0 = x, y0 = y
    rx = Math.abs(rx)
    ry = Math.abs(ry)
    if (!rx || !ry || (x0 === ex && y0 === ey)) return to(ex, ey)
    const phi = (rot * Math.PI) / 180, cos = mcos(phi), sin = msin(phi)
    const dx = (x0 - ex) / 2, dy = (y0 - ey) / 2
    const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy
    const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry)
    if (lambda > 1) { rx *= Math.sqrt(lambda); ry *= Math.sqrt(lambda) }
    const num2 = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
    const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p
    const co = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, num2 / den))
    const cxp = (co * rx * y1p) / ry, cyp = (-co * ry * x1p) / rx
    const cx = cos * cxp - sin * cyp + (x0 + ex) / 2, cy = sin * cxp + cos * cyp + (y0 + ey) / 2
    const angle = (ux, uy, vx, vy) => matan2(ux * vy - uy * vx, ux * vx + uy * vy)
    const t1 = angle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
    let dt = angle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry)
    if (!sweep && dt > 0) dt -= 2 * Math.PI
    if (sweep && dt < 0) dt += 2 * Math.PI
    const steps = Math.max(2, Math.ceil(Math.abs(dt) * Math.max(rx, ry) * 4))
    for (let s = 1; s <= steps; s++) {
      const t = t1 + (dt * s) / steps
      const px = rx * mcos(t), py = ry * msin(t)
      if (s === steps) to(ex, ey)
      else to(cos * px - sin * py + cx, sin * px + cos * py + cy)
    }
  }
  while (true) {
    ws()
    if (i >= n) break
    if (COMMAND.test(d[i])) cmd = d[i++]
    else if (!cmd) throw new Error(`Path data must start with a command: "${d}"`)
    const rel = cmd !== cmd.toUpperCase()
    const ox = rel ? x : 0, oy = rel ? y : 0
    let kind = ""
    switch (cmd.toUpperCase()) {
      case "M": {
        const px = num() + ox, py = num() + oy
        begin(px, py)
        x = sx = px
        y = sy = py
        cmd = rel ? "l" : "L"
        break
      }
      case "L": to(num() + ox, num() + oy); break
      case "H": to(num() + ox, y); break
      case "V": to(x, num() + oy); break
      case "C": {
        const x1 = num() + ox, y1 = num() + oy, x2 = num() + ox, y2 = num() + oy, ex = num() + ox, ey = num() + oy
        cubic(x1, y1, x2, y2, ex, ey)
        ctl = [x2, y2]
        kind = "C"
        break
      }
      case "S": {
        const [x1, y1] = ctlKind === "C" ? [2 * x - ctl[0], 2 * y - ctl[1]] : [x, y]
        const x2 = num() + ox, y2 = num() + oy, ex = num() + ox, ey = num() + oy
        cubic(x1, y1, x2, y2, ex, ey)
        ctl = [x2, y2]
        kind = "C"
        break
      }
      case "Q": {
        const x1 = num() + ox, y1 = num() + oy, ex = num() + ox, ey = num() + oy
        quad(x1, y1, ex, ey)
        ctl = [x1, y1]
        kind = "Q"
        break
      }
      case "T": {
        const [x1, y1] = ctlKind === "Q" ? [2 * x - ctl[0], 2 * y - ctl[1]] : [x, y]
        const ex = num() + ox, ey = num() + oy
        quad(x1, y1, ex, ey)
        ctl = [x1, y1]
        kind = "Q"
        break
      }
      case "A": {
        const rx = num(), ry = num(), rot = num(), large = flag(), sweep = flag()
        arc(rx, ry, rot, large, sweep, num() + ox, num() + oy)
        break
      }
      case "Z": {
        if (cur && !cur.closed) {
          const [ax, ay] = cur.pts[cur.pts.length - 1]
          if (mhypot(ax - sx, ay - sy) > 1e-6) cur.pts.push([sx, sy])
          cur.closed = true
        }
        x = sx
        y = sy
        break
      }
    }
    ctlKind = kind
  }
  return subs.filter((s) => s.pts.length > 1)
}

const attrs = (text) => Object.fromEntries([...text.matchAll(/([a-zA-Z][\w:-]*)="([^"]*)"/g)].map((m) => [m[1], m[2]]))
const nums = (a, ...keys) => keys.map((k) => parseFloat(a[k] ?? "0") || 0)

/** An SVG's drawing elements, as circles and polylines (closed or open). */
export function parseSvg(svg) {
  const out = []
  for (const [, tag, body] of svg.matchAll(/<(path|circle|ellipse|rect|line|polyline|polygon)\b([^>]*)\/?>/g)) {
    const a = attrs(body)
    if (tag === "circle") {
      const [cx, cy, r] = nums(a, "cx", "cy", "r")
      if (r > 0) out.push({ circle: [cx, cy, r] })
    } else if (tag === "ellipse") {
      const [cx, cy, rx, ry] = nums(a, "cx", "cy", "rx", "ry")
      const steps = Math.ceil(Math.max(rx, ry) * 2 * Math.PI * 4)
      out.push({ pts: Array.from({ length: steps + 1 }, (_, i) => [cx + rx * mcos((i / steps) * 2 * Math.PI), cy + ry * msin((i / steps) * 2 * Math.PI)]), closed: true })
    } else if (tag === "rect") {
      const [x, y, w, h] = nums(a, "x", "y", "width", "height")
      let rx = a.rx != null ? parseFloat(a.rx) : a.ry != null ? parseFloat(a.ry) : 0
      let ry = a.ry != null ? parseFloat(a.ry) : rx
      rx = Math.min(rx, w / 2)
      ry = Math.min(ry, h / 2)
      const d = rx || ry
        ? `M${x + rx} ${y}H${x + w - rx}A${rx} ${ry} 0 0 1 ${x + w} ${y + ry}V${y + h - ry}A${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}H${x + rx}A${rx} ${ry} 0 0 1 ${x} ${y + h - ry}V${y + ry}A${rx} ${ry} 0 0 1 ${x + rx} ${y}Z`
        : `M${x} ${y}H${x + w}V${y + h}H${x}Z`
      out.push(...parsePath(d))
    } else if (tag === "line") {
      const [x1, y1, x2, y2] = nums(a, "x1", "y1", "x2", "y2")
      out.push({ pts: [[x1, y1], [x2, y2]], closed: false })
    } else if (tag === "polyline" || tag === "polygon") {
      const v = (a.points ?? "").trim().split(/[\s,]+/).map(parseFloat)
      const pts = []
      for (let k = 0; k + 1 < v.length; k += 2) pts.push([v[k], v[k + 1]])
      if (tag === "polygon") pts.push(pts[0])
      out.push({ pts, closed: tag === "polygon" })
    } else {
      out.push(...parsePath(a.d ?? ""))
    }
  }
  return out
}

// ── Polylines to strokes a word can read along ───────────────────────────────────────────────────────

const len = (a, b) => mhypot(b[0] - a[0], b[1] - a[1])
const heading = (a, b) => matan2(b[1] - a[1], b[0] - a[0])
const turn = (a, b, c) => {
  let t = heading(b, c) - heading(a, b)
  while (t > Math.PI) t -= 2 * Math.PI
  while (t < -Math.PI) t += 2 * Math.PI
  return t
}

/** Douglas–Peucker: drop points within `tol` of the line through their neighbours. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts
  const keep = new Uint8Array(pts.length)
  keep[0] = keep[pts.length - 1] = 1
  const stack = [[0, pts.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop()
    let far = -1, at = -1
    const [ax, ay] = pts[a], [bx, by] = pts[b], L = mhypot(bx - ax, by - ay)
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i]
      const dist = L ? Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / L : mhypot(px - ax, py - ay)
      if (dist > far) { far = dist; at = i }
    }
    if (far > tol) { keep[at] = 1; stack.push([a, at], [at, b]) }
  }
  return pts.filter((_, i) => keep[i])
}

/** Points closer than `min` to the last kept one are dropped, so a turn is measured over real distance. */
function dedupe(pts, min = 0.02) {
  const out = [pts[0]]
  for (const p of pts.slice(1)) if (len(out[out.length - 1], p) >= min) out.push(p)
  if (out.length === 1 && pts.length > 1) out.push(pts[pts.length - 1])
  return out
}

const WINDOW = 1 // units either side of a point over which a turn counts as one corner
const CORNER = (40 * Math.PI) / 180 // a word can't bend round more than this within the window
const EASE = (30 * Math.PI) / 180 // a corner runs on while the line still turns this much: an even arc near the limit is one corner, not a hundred
const LEVEL = (3 * Math.PI) / 180 // points this close to a corner's sharpest count as its sharpest stretch

/** Cut a polyline at its corners. How sharply the line turns at each point is summed over the window either side
 * of it; each run of points turning sharply is one corner, cut at the middle of its sharpest stretch, so a rounded
 * corner is cut at its middle and a sharp one at its point. A run starts where the turn passes the limit and lasts
 * while it stays near it, so an even arc that hovers round the limit is cut once, at its middle, not shattered. A closed loop is read round, so a corner where it
 * started is a corner like any other; a smooth loop starts at its west. */
function cutCorners(pts, closed) {
  const ring = closed ? pts.slice(0, -1) : pts
  const n = ring.length
  if (n < 3) return [pts]
  const along = [0]
  for (let i = 1; i < n; i++) along.push(along[i - 1] + len(ring[i - 1], ring[i]))
  const total = closed ? along[n - 1] + len(ring[n - 1], ring[0]) : along[n - 1]
  const turns = ring.map((p, i) => (closed || (i > 0 && i < n - 1) ? turn(ring[(i - 1 + n) % n], p, ring[(i + 1) % n]) : 0))
  const apart = (i, j) => { const d = Math.abs(along[i] - along[j]); return closed ? Math.min(d, total - d) : d }
  const reachOf = Math.ceil(WINDOW / STEP) + 2
  const c = ring.map((_, i) => {
    let sum = 0
    for (let d = -reachOf; d <= reachOf; d++) {
      const j = closed ? (((i + d) % n) + n) % n : i + d
      if (j < 0 || j >= n || (closed && Math.abs(d) >= n / 2 && d !== 0)) continue
      if (apart(i, j) <= WINDOW + 1e-9) sum += turns[j]
    }
    return Math.abs(sum)
  })
  const hot = c.map((v, i) => v >= EASE && (closed || (i > 0 && i < n - 1)))
  const cuts = []
  if (!hot.every(Boolean)) {
    const first = closed ? hot.indexOf(false) : 0
    for (let k = 0; k < n; k++) {
      if (!hot[(first + k) % n]) continue
      const run = []
      while (k < n && hot[(first + k) % n]) run.push((first + k++) % n)
      const peak = Math.max(...run.map((i) => c[i]))
      if (peak < CORNER) continue
      const flat = run.filter((i) => peak - c[i] < LEVEL)
      cuts.push(flat[Math.floor((flat.length - 1) / 2)])
    }
  }
  if (!closed) {
    const out = []
    let from = 0
    for (const k of cuts.sort((x, y) => x - y)) { out.push(ring.slice(from, k + 1)); from = k }
    out.push(ring.slice(from))
    return out.filter((p) => p.length > 1)
  }
  if (!cuts.length) {
    const west = ring.reduce((best, p, i) => (p[0] < ring[best][0] ? i : best), 0)
    return [[...ring.slice(west), ...ring.slice(0, west), ring[west]]]
  }
  cuts.sort((x, y) => x - y)
  return cuts.map((k, i) => {
    const end = cuts[(i + 1) % cuts.length]
    const out = [ring[k]]
    for (let j = (k + 1) % n; ; j = (j + 1) % n) { out.push(ring[j]); if (j === end) break }
    return out
  })
}

const STEP = 0.1 // corners are found on the line resampled this finely, so a turn is measured over real distance

/** The line resampled at even steps, its corners kept. */
function resample(pts) {
  const out = [pts[0]]
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], n = Math.max(1, Math.round(len(a, b) / STEP))
    for (let k = 1; k <= n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  }
  return out
}

const EAST = mcos((80 * Math.PI) / 180)
const side = (a, b) => { const h = (b[0] - a[0]) / (len(a, b) || 1); return h > EAST ? 1 : h < -EAST ? -1 : 0 }

/** Cut where a stroke turns back on itself across the vertical, so every piece runs one way across the page. */
function cutTurnbacks(pts) {
  const out = []
  const along = [0]
  for (let i = 1; i < pts.length; i++) along.push(along[i - 1] + len(pts[i - 1], pts[i]))
  const total = along[along.length - 1]
  let from = 0, last = 0, lastAt = 0
  for (let i = 0; i + 1 < pts.length; i++) {
    // The last unit at either end is the tail of a corner cut at its middle, not a turn of the stroke's own.
    const mid = (along[i] + along[i + 1]) / 2
    if (mid < 1.2 || mid > total - 1.2) continue
    const s = side(pts[i], pts[i + 1])
    if (!s) continue
    if (last && s !== last) {
      // Cut halfway along the upright stretch between the two runs.
      const k = Math.max(from + 1, Math.round((lastAt + 1 + i) / 2))
      out.push(pts.slice(from, k + 1))
      from = k
    }
    last = s
    lastAt = i
  }
  out.push(pts.slice(from))
  return out.filter((p) => p.length > 1)
}

/** A piece read left to right; an upright one reads with the tops of its letters away from the drawing. */
function orient(pts) {
  const along = [0]
  for (let i = 1; i < pts.length; i++) along.push(along[i - 1] + len(pts[i - 1], pts[i]))
  const total = along[along.length - 1], tail = total > 3.6 ? 1.2 : 0
  // Which way it runs across the page, the corner tails at its ends left out.
  let dir = 0
  for (let i = 0; i + 1 < pts.length; i++) {
    const mid = (along[i] + along[i + 1]) / 2
    if (mid >= tail && mid <= total - tail) dir += side(pts[i], pts[i + 1]) * len(pts[i], pts[i + 1])
  }
  if (Math.abs(dir) > Math.min(0.5, total * 0.2)) return dir > 0 ? pts : [...pts].reverse()
  const mid = pts[Math.floor(pts.length / 2)]
  const down = pts[pts.length - 1][1] > pts[0][1]
  return (mid[0] >= 11.5) === down ? pts : [...pts].reverse()
}

const r1 = (v) => Math.round(v * 10) / 10 || 0

/** An element's strokes as paths of moves. Circles keep their true arcs: the upper half read clockwise and the
 * lower half anticlockwise, so both read left to right, as the legend round a seal does. */
function strokes(el) {
  if (el.circle) {
    const [cx, cy, r] = el.circle.map(r1)
    return [[["O", cx, cy, r, 180, 180]], [["O", cx, cy, r, 180, -180]]]
  }
  const raw = dedupe(el.pts)
  if (raw.length < 2) return []
  // A stroke drawn as a dot (Lucide's "h.01"), or too short to carry a letter (a cat's eye, "v.5"): kept as a dot
  // at its middle, a path that goes nowhere.
  if (raw.slice(1).reduce((sum, p, i) => sum + len(raw[i], p), 0) < 0.6) {
    const x = r1((raw[0][0] + raw[raw.length - 1][0]) / 2), y = r1((raw[0][1] + raw[raw.length - 1][1]) / 2)
    return [[["M", x, y], ["L", x, y]]]
  }
  const closed = el.closed || len(raw[0], raw[raw.length - 1]) < 1e-6
  const pts = resample(closed ? [...raw.slice(0, -1), raw[0]] : raw)
  if (closed) pts[pts.length - 1] = pts[0]
  return cutCorners(pts, closed)
    .flatMap(cutTurnbacks)
    .map((p) => simplify(p, 0.03))
    .map(orient)
    .map((p) => p.map(([x, y], i) => [i ? "L" : "M", r1(x), r1(y)]))
    .map((p) => p.filter((m, i) => i === 0 || m[1] !== p[i - 1][1] || m[2] !== p[i - 1][2]))
    .filter((p) => p.length > 1)
}

/** A path's length in units, arcs included. */
export function pathLength(path) {
  let total = 0, at = null
  for (const m of path) {
    if (m[0] === "O") total += (Math.abs(m[5]) * Math.PI * m[3]) / 180
    else { if (at && m[0] === "L") total += len(at, [m[1], m[2]]); at = [m[1], m[2]] }
  }
  return total
}

/** A path as points every quarter unit or closer. */
export function pathPoints(path) {
  const pts = []
  for (const m of path) {
    if (m[0] === "M") pts.push([m[1], m[2]])
    else if (m[0] === "L") {
      const [px, py] = pts[pts.length - 1], steps = Math.max(1, Math.ceil(len([px, py], [m[1], m[2]]) * 4))
      for (let i = 1; i <= steps; i++) pts.push([px + ((m[1] - px) * i) / steps, py + ((m[2] - py) * i) / steps])
    } else {
      const [, cx, cy, r, from, sweep] = m, steps = Math.max(8, Math.ceil(((Math.abs(sweep) * Math.PI) / 180) * r * 4))
      for (let i = 0; i <= steps; i++) {
        const a = ((from + (sweep * i) / steps) * Math.PI) / 180
        pts.push([cx + r * mcos(a), cy + r * msin(a)])
      }
    }
  }
  return pts
}

// ── Silhouette rows for the fill ─────────────────────────────────────────────────────────────────────

const RES = 10 // raster cells per unit
const PAD = 4 // units of paper round the 24-unit square, so the outside is one connected region
const GRID = (24 + 2 * PAD) * RES
const cell = (v) => Math.round((v + PAD) * RES)
const unit = (c) => c / RES - PAD
const SWELL = 2.5 // the silhouette reaches this far past a stroke's centre: as fat as the hand-drawn five, so a row always fits
const GAP = 1 // an inner stroke is cut out of the silhouette this far either side, a line of paper a letter wide at 120px
const DOT = 1.45 // an inner dot (an eye, a keyhole) is cut this far round, so it stays a hole the rows can't close over
const ROW = 2.05 // the height a row aims at; a tall silhouette is set in up to 11 rows

/** Cells within `r` of any segment of the polylines. */
function near(lines, r) {
  const mask = new Uint8Array(GRID * GRID)
  for (const pts of lines) for (let i = 0; i < pts.length; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[Math.min(i + 1, pts.length - 1)]
    const x0 = Math.max(0, cell(Math.min(ax, bx) - r) - 1), x1 = Math.min(GRID - 1, cell(Math.max(ax, bx) + r) + 1)
    const y0 = Math.max(0, cell(Math.min(ay, by) - r) - 1), y1 = Math.min(GRID - 1, cell(Math.max(ay, by) + r) + 1)
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy
    for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) {
      const px = unit(cx), py = unit(cy)
      const t = L2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L2)) : 0
      if (mhypot(px - ax - t * dx, py - ay - t * dy) <= r) mask[cy * GRID + cx] = 1
    }
  }
  return mask
}

/** Cells inside any of the polygons (even–odd within each, joined across them). */
function inside(polys) {
  const mask = new Uint8Array(GRID * GRID)
  for (const poly of polys) for (let cy = 0; cy < GRID; cy++) {
    const y = unit(cy), xs = []
    for (let i = 0; i < poly.length; i++) {
      const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length]
      if ((ay <= y && by > y) || (by <= y && ay > y)) xs.push(ax + ((y - ay) / (by - ay)) * (bx - ax))
    }
    xs.sort((a, b) => a - b)
    for (let k = 0; k + 1 < xs.length; k += 2) for (let cx = Math.max(0, Math.ceil((xs[k] + PAD) * RES)); cx <= Math.min(GRID - 1, Math.floor((xs[k + 1] + PAD) * RES)); cx++) mask[cy * GRID + cx] = 1
  }
  return mask
}

/** How far each cell is from the paper the edge reaches without crossing the mask, in units (0 on that paper). */
function outside(mask) {
  const dist = new Float32Array(GRID * GRID).fill(Infinity)
  const queue = new Int32Array(GRID * GRID)
  const around = (i) => { const x = i % GRID, y = (i - x) / GRID; return [x > 0 ? i - 1 : -1, x < GRID - 1 ? i + 1 : -1, y > 0 ? i - GRID : -1, y < GRID - 1 ? i + GRID : -1] }
  let head = 0, tail = 0
  dist[0] = 0
  queue[tail++] = 0
  while (head < tail) for (const j of around(queue[head++])) if (j >= 0 && !mask[j] && dist[j] === Infinity) { dist[j] = 0; queue[tail++] = j }
  // Then a chamfer distance inwards from that paper (steps of 1 and √2 cells, two passes), close enough to round
  // that a diagonal stroke's middle lies as deep as a level one's; a city-block measure would cut it out.
  const D = Math.SQRT2
  for (let y = 0; y < GRID; y++) for (let x = 0; x < GRID; x++) {
    const i = y * GRID + x
    if (!dist[i]) continue
    let d = dist[i]
    if (x > 0) d = Math.min(d, dist[i - 1] + 1)
    if (y > 0) d = Math.min(d, dist[i - GRID] + 1, x > 0 ? dist[i - GRID - 1] + D : Infinity, x < GRID - 1 ? dist[i - GRID + 1] + D : Infinity)
    dist[i] = d
  }
  for (let y = GRID - 1; y >= 0; y--) for (let x = GRID - 1; x >= 0; x--) {
    const i = y * GRID + x
    if (!dist[i]) continue
    let d = dist[i]
    if (x < GRID - 1) d = Math.min(d, dist[i + 1] + 1)
    if (y < GRID - 1) d = Math.min(d, dist[i + GRID] + 1, x < GRID - 1 ? dist[i + GRID + 1] + D : Infinity, x > 0 ? dist[i + GRID - 1] + D : Infinity)
    dist[i] = d
  }
  for (let i = 0; i < dist.length; i++) dist[i] /= RES
  return dist
}

/** The silhouette as rows a word can fill: the row height, and each row's centre and runs [y, a, b, a, b…]. */
function rows(mask, count) {
  let top = Infinity, foot = -Infinity
  for (let cy = 0; cy < GRID; cy++) for (let cx = 0; cx < GRID; cx++) if (mask[cy * GRID + cx]) { top = Math.min(top, unit(cy)); foot = Math.max(foot, unit(cy)) }
  const h = foot - top
  const n = count ?? Math.max(1, Math.min(11, Math.round(h / ROW)))
  const step = h / n
  const scan = (y) => {
    const cy = Math.max(0, Math.min(GRID - 1, cell(y))), runs = []
    let start = -1
    for (let cx = 0; cx <= GRID; cx++) {
      const on = cx < GRID && mask[cy * GRID + cx]
      if (on && start < 0) start = cx
      if (!on && start >= 0) { runs.push([unit(start), unit(cx - 1)]); start = -1 }
    }
    return runs
  }
  const out = []
  for (let r = 0; r < n; r++) {
    const y0 = top + r * step
    // A row is inside the silhouette only where its top, its middle and its foot all are: a hole between two of them
    // (an eye, a lens) still parts the row.
    let runs = scan(y0 + step * 0.2)
    for (const at of [0.5, 0.8]) {
      const next = []
      for (const [p, q] of runs) for (const [s, t] of scan(y0 + step * at)) if (Math.min(q, t) - Math.max(p, s) >= 0.5) next.push([Math.max(p, s), Math.min(q, t)])
      runs = next
    }
    runs = runs.flatMap(([p, q]) => [r1(p), r1(q)])
    if (runs.length) out.push([r1(y0 + step / 2), ...runs])
  }
  return { step: Math.round(step * 100) / 100, rows: out }
}

/** The fill of a stroked drawing: everything its outline encloses, with inner strokes cut out as lines of paper. */
function silhouette(line) {
  const pts = line.map(pathPoints)
  const dist = outside(near(pts, SWELL))
  const shape = new Uint8Array(GRID * GRID)
  // Inside the square only: a swollen stroke at the edge is trimmed flat rather than reaching past the sign.
  for (let i = 0; i < shape.length; i++) { const x = unit(i % GRID), y = unit(Math.floor(i / GRID)); shape[i] = dist[i] > 0 && x >= 0 && x <= 24 && y >= 0 && y <= 24 ? 1 : 0 }
  // Inner strokes: stretches lying deeper than the swell from the outside paper. Each is cut as a line of paper.
  const deep = (p) => dist[cell(p[1]) * GRID + cell(p[0])] > SWELL + 0.75
  const inner = []
  for (const p of pts) {
    let run = []
    for (const q of p) {
      if (deep(q)) run.push(q)
      else { if (run.length > 1) inner.push(run); run = [] }
    }
    if (run.length > 1) inner.push(run)
  }
  const length = (q) => q.slice(1).reduce((s, b, i) => s + mhypot(b[0] - q[i][0], b[1] - q[i][1]), 0)
  const gap = near(inner.filter((q) => length(q) >= 1), GAP), dot = near(inner.filter((q) => length(q) < 1), DOT)
  for (let i = 0; i < shape.length; i++) if (gap[i] || dot[i]) shape[i] = 0
  return rows(shape)
}

function handFill({ add, cut = [] }) {
  const shape = inside(add), hole = inside(cut)
  for (let i = 0; i < shape.length; i++) if (hole[i]) shape[i] = 0
  return rows(shape, 10)
}

// ── The table ────────────────────────────────────────────────────────────────────────────────────────

/** Longest stroke first: the long strokes take whole words, the short ones give way to them. */
const byLength = (a, b) => pathLength(b) - pathLength(a)

export function signShape({ name, word, lucide, mirror }) {
  let line, fill
  if (lucide) {
    const svg = readFileSync(`node_modules/lucide-static/icons/${lucide}.svg`, "utf8")
    line = parseSvg(svg).flatMap(strokes).filter((p) => pathLength(p) >= 0.6 || (p.length === 2 && p[0][1] === p[1][1] && p[0][2] === p[1][2])).sort(byLength)
    fill = silhouette(line)
  } else {
    const hand = HAND[name]
    if (!hand) throw new Error(`${name}: no Lucide icon and no hand drawing`)
    line = [...hand.line].sort(byLength)
    fill = handFill(hand.fill)
  }
  if (!line.length) throw new Error(`${name}: no strokes`)
  return { word, line, fill, ...(mirror ? { mirror: true } : {}) }
}

const pascal = (s) => s.replace(/(?:^|-)([a-z0-9])/g, (_, c) => c.toUpperCase())
const json = (v) => JSON.stringify(v)

function itemSource(sign, shape, variant) {
  const id = `Sign${pascal(sign.name)}${pascal(variant)}`
  const data = { word: shape.word, ...(variant === "fill" ? { fill: shape.fill } : { line: shape.line }), ...(shape.mirror ? { mirror: true } : {}) }
  const how = { dots: "ruled in leaders along its strokes", words: "set along its strokes", fill: "filling its silhouette row by row" }[variant]
  const from = sign.lucide ? `from Lucide's ${sign.lucide} (ISC)` : "from a drawing made for 0dB"
  return `import { Sign, type SignProps, type SignShape } from "@/registry/0db/ui/sign"

// Generated by scripts/build-signs.mjs ${from}.
const shape: SignShape = ${json(data)}

/** The sign for "${shape.word}": the word ${how}. */
function ${id}(props: Omit<SignProps, "shape" | "variant">) {
  return <Sign shape={shape} variant="${variant}" {...props} />
}

export { ${id} }
`
}

export function readCurated() {
  return JSON.parse(readFileSync(DATA, "utf8"))
}

export function buildSigns({ check = false } = {}) {
  const curated = readCurated()
  const shapes = {}
  const items = []
  const stale = []
  if (!check) {
    rmSync(OUT, { recursive: true, force: true })
    mkdirSync(OUT, { recursive: true })
  }
  for (const sign of curated) {
    const shape = signShape(sign)
    shapes[sign.name] = shape
    for (const variant of VARIANTS) {
      const file = `${OUT}/sign-${sign.name}-${variant}.tsx`
      const source = itemSource(sign, shape, variant)
      if (!check) writeFileSync(file, source)
      else if (!existsSync(file) || readFileSync(file, "utf8") !== source) stale.push(file)
      items.push({ name: `sign-${sign.name}-${variant}`, sign: sign.name, word: sign.word, lucide: sign.lucide, variant, file })
    }
  }
  if (check) {
    const made = new Set(items.map((i) => i.file))
    if (existsSync(OUT)) for (const f of readdirSync(OUT)) if (!made.has(`${OUT}/${f}`)) stale.push(`${OUT}/${f} (no longer a sign)`)
    if (stale.length) throw new Error(`Signs are stale. Run npm run registry:build.\n  ${stale.join("\n  ")}`)
  }
  const siteSignsTS = `// Generated by scripts/build-signs.mjs: every sign, for the docs. One line each.
import type { SignShape } from "@/registry/0db/ui/sign"

export const signs: Record<string, SignShape> = {
${curated.map((s) => `  ${json(s.name)}: ${json(shapes[s.name])},`).join("\n")}
}
`
  if (!check) {
    mkdirSync("lib/site", { recursive: true })
    writeFileSync("lib/site/signs.ts", siteSignsTS)
  }
  return { curated, shapes, items, siteSignsTS }
}

if (process.argv[1]?.endsWith("build-signs.mjs")) {
  const { curated, items } = buildSigns()
  console.log(`Built ${curated.length} signs: ${items.length} registry files in ${OUT} and lib/site/signs.ts`)
}
