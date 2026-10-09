// Generates signs from curated Lucide icons and hand-drawn signs.
// Run directly: node scripts/build-signs.mjs
// Hooked into:  npm run registry:build
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs"

const DATA_FILE = "scripts/data/signs.json"

const HAND_DRAWN = {
  search: {
    word: "search",
    line: [[["O", 10, 10, 6.5, 180, 360]], [["M", 15.6, 15.6], ["L", 21.5, 21.5]]],
  },
  "arrow-right": {
    word: "next",
    line: [[["M", 2.5, 12], ["L", 17.5, 12]], [["M", 12.5, 4], ["L", 20, 11]], [["M", 12.5, 20], ["L", 20, 13]]],
  },
  close: {
    word: "close",
    line: [[["M", 5, 19], ["L", 19, 5]], [["M", 5, 5], ["L", 12, 12]], [["M", 12, 12], ["L", 19, 19]]],
  },
  mail: {
    word: "mail",
    line: [
      [["M", 3, 6], ["L", 21, 6]],
      [["M", 21, 6], ["L", 21, 18]],
      [["M", 3, 18], ["L", 21, 18]],
      [["M", 3, 18], ["L", 3, 6]],
      [["M", 4, 7.5], ["L", 12, 13.2]],
      [["M", 12, 13.2], ["L", 20, 7.5]],
    ],
  },
  home: {
    word: "home",
    line: [
      [["M", 2, 11.5], ["L", 12, 3], ["L", 22, 11.5]],
      [["M", 5, 21], ["L", 5, 10]],
      [["M", 19, 10], ["L", 19, 21]],
      [["M", 5, 21], ["L", 19, 21]],
    ],
  },
}

function round(n) {
  return Math.round(n * 100) / 100
}

function angleBetween(ux, uy, vx, vy) {
  const uLen = Math.hypot(ux, uy)
  const vLen = Math.hypot(vx, vy)
  if (uLen === 0 || vLen === 0) return 0
  const dot = (ux * vx + uy * vy) / (uLen * vLen)
  return Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI)
}

function tokenizePath(d) {
  let norm = d.replace(/([aA])\s*([0-9.eE+-]+)\s+([0-9.eE+-]+)\s+([0-9.eE+-]+)\s+([01])([01])/g, "$1 $2 $3 $4 $5 $6 ")
  norm = norm.replace(/([0-9.eE+-]+)\s+([01])([01])\s+([0-9.eE+-]+)/g, "$1 $2 $3 $4")
  norm = norm.replace(/([0-9.eE+-]+)\s+([01])([01])(?=[-+])/g, "$1 $2 $3 ")
  norm = norm.replace(/([aA](?:\s*[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?){3})\s*([01])([01])/g, "$1 $2 $3 ")
  norm = norm.replace(/([01])([01])(?=[-+0-9])/g, "$1 $2 ")

  const tokens = []
  const re = /([a-df-z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?)/gi
  let m
  while ((m = re.exec(norm)) !== null) {
    const val = m[1]
    if (/^[a-df-z]$/i.test(val)) tokens.push(val)
    else tokens.push(parseFloat(val))
  }
  return tokens
}

function parsePath(d) {
  const tokens = tokenizePath(d)
  let i = 0
  let curX = 0, curY = 0
  let startX = 0, startY = 0
  let lastCtrlX = 0, lastCtrlY = 0
  let lastCmd = ""
  const subpaths = []
  let currentPoints = []

  function flush() {
    if (currentPoints.length > 1) {
      subpaths.push(currentPoints)
    }
    currentPoints = []
  }

  while (i < tokens.length) {
    const token = tokens[i]
    let cmd = typeof token === "string" ? token : lastCmd
    if (typeof token === "string") {
      i++
    } else {
      if (lastCmd === "M") cmd = "L"
      else if (lastCmd === "m") cmd = "l"
    }

    const isRel = cmd === cmd.toLowerCase() && cmd !== "z"
    const upper = cmd.toUpperCase()

    if (upper === "M") {
      flush()
      const x = isRel ? curX + tokens[i++] : tokens[i++]
      const y = isRel ? curY + tokens[i++] : tokens[i++]
      curX = x
      curY = y
      startX = x
      startY = y
      lastCtrlX = x
      lastCtrlY = y
      currentPoints = [{ x, y }]
    } else if (upper === "L") {
      const x = isRel ? curX + tokens[i++] : tokens[i++]
      const y = isRel ? curY + tokens[i++] : tokens[i++]
      curX = x
      curY = y
      lastCtrlX = x
      lastCtrlY = y
      currentPoints.push({ x, y })
    } else if (upper === "H") {
      const x = isRel ? curX + tokens[i++] : tokens[i++]
      curX = x
      lastCtrlX = x
      lastCtrlY = curY
      currentPoints.push({ x, y: curY })
    } else if (upper === "V") {
      const y = isRel ? curY + tokens[i++] : tokens[i++]
      curY = y
      lastCtrlX = curX
      lastCtrlY = y
      currentPoints.push({ x: curX, y })
    } else if (upper === "C") {
      const x1 = isRel ? curX + tokens[i++] : tokens[i++]
      const y1 = isRel ? curY + tokens[i++] : tokens[i++]
      const x2 = isRel ? curX + tokens[i++] : tokens[i++]
      const y2 = isRel ? curY + tokens[i++] : tokens[i++]
      const x = isRel ? curX + tokens[i++] : tokens[i++]
      const y = isRel ? curY + tokens[i++] : tokens[i++]
      const p0 = { x: curX, y: curY }
      const p1 = { x: x1, y: y1 }
      const p2 = { x: x2, y: y2 }
      const p3 = { x, y }
      const chord = Math.hypot(p1.x - p0.x, p1.y - p0.y) + Math.hypot(p2.x - p1.x, p2.y - p1.y) + Math.hypot(p3.x - p2.x, p3.y - p2.y)
      const steps = Math.max(4, Math.min(24, Math.ceil(chord * 2)))
      for (let s = 1; s <= steps; s++) {
        const t = s / steps
        const mt = 1 - t
        const bx = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x
        const by = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y
        currentPoints.push({ x: bx, y: by })
      }
      curX = x
      curY = y
      lastCtrlX = x2
      lastCtrlY = y2
    } else if (upper === "S") {
      let x1 = curX, y1 = curY
      if (["C", "c", "S", "s"].includes(lastCmd)) {
        x1 = 2 * curX - lastCtrlX
        y1 = 2 * curY - lastCtrlY
      }
      const x2 = isRel ? curX + tokens[i++] : tokens[i++]
      const y2 = isRel ? curY + tokens[i++] : tokens[i++]
      const x = isRel ? curX + tokens[i++] : tokens[i++]
      const y = isRel ? curY + tokens[i++] : tokens[i++]
      const p0 = { x: curX, y: curY }
      const p1 = { x: x1, y: y1 }
      const p2 = { x: x2, y: y2 }
      const p3 = { x, y }
      const chord = Math.hypot(p1.x - p0.x, p1.y - p0.y) + Math.hypot(p2.x - p1.x, p2.y - p1.y) + Math.hypot(p3.x - p2.x, p3.y - p2.y)
      const steps = Math.max(4, Math.min(24, Math.ceil(chord * 2)))
      for (let s = 1; s <= steps; s++) {
        const t = s / steps
        const mt = 1 - t
        const bx = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x
        const by = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y
        currentPoints.push({ x: bx, y: by })
      }
      curX = x
      curY = y
      lastCtrlX = x2
      lastCtrlY = y2
    } else if (upper === "Q") {
      const x1 = isRel ? curX + tokens[i++] : tokens[i++]
      const y1 = isRel ? curY + tokens[i++] : tokens[i++]
      const x = isRel ? curX + tokens[i++] : tokens[i++]
      const y = isRel ? curY + tokens[i++] : tokens[i++]
      const p0 = { x: curX, y: curY }
      const p1 = { x: x1, y: y1 }
      const p2 = { x, y }
      const chord = Math.hypot(p1.x - p0.x, p1.y - p0.y) + Math.hypot(p2.x - p1.x, p2.y - p1.y)
      const steps = Math.max(4, Math.min(20, Math.ceil(chord * 2)))
      for (let s = 1; s <= steps; s++) {
        const t = s / steps
        const mt = 1 - t
        const bx = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x
        const by = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
        currentPoints.push({ x: bx, y: by })
      }
      curX = x
      curY = y
      lastCtrlX = x1
      lastCtrlY = y1
    } else if (upper === "T") {
      let x1 = curX, y1 = curY
      if (["Q", "q", "T", "t"].includes(lastCmd)) {
        x1 = 2 * curX - lastCtrlX
        y1 = 2 * curY - lastCtrlY
      }
      const x = isRel ? curX + tokens[i++] : tokens[i++]
      const y = isRel ? curY + tokens[i++] : tokens[i++]
      const p0 = { x: curX, y: curY }
      const p1 = { x: x1, y: y1 }
      const p2 = { x, y }
      const chord = Math.hypot(p1.x - p0.x, p1.y - p0.y) + Math.hypot(p2.x - p1.x, p2.y - p1.y)
      const steps = Math.max(4, Math.min(20, Math.ceil(chord * 2)))
      for (let s = 1; s <= steps; s++) {
        const t = s / steps
        const mt = 1 - t
        const bx = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x
        const by = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
        currentPoints.push({ x: bx, y: by })
      }
      curX = x
      curY = y
      lastCtrlX = x1
      lastCtrlY = y1
    } else if (upper === "A") {
      const rx = tokens[i++]
      const ry = tokens[i++]
      const rot = (tokens[i++] * Math.PI) / 180
      const largeArc = tokens[i++]
      const sweep = tokens[i++]
      const x = isRel ? curX + tokens[i++] : tokens[i++]
      const y = isRel ? curY + tokens[i++] : tokens[i++]
      const x1p = Math.cos(rot) * (curX - x) / 2 + Math.sin(rot) * (curY - y) / 2
      const y1p = -Math.sin(rot) * (curX - x) / 2 + Math.cos(rot) * (curY - y) / 2
      let rxSq = rx * rx, rySq = ry * ry
      const x1pSq = x1p * x1p, y1pSq = y1p * y1p
      const radCheck = x1pSq / rxSq + y1pSq / rySq
      let realRx = rx, realRy = ry
      if (radCheck > 1) {
        realRx = Math.sqrt(radCheck) * rx
        realRy = Math.sqrt(radCheck) * ry
        rxSq = realRx * realRx
        rySq = realRy * realRy
      }
      const sign = largeArc === sweep ? -1 : 1
      const num = Math.max(0, rxSq * rySq - rxSq * y1pSq - rySq * x1pSq)
      const den = rxSq * y1pSq + rySq * x1pSq
      const sq = den > 0 ? Math.sqrt(num / den) : 0
      const cxp = sign * sq * (realRx * y1p / realRy)
      const cyp = sign * sq * (-realRy * x1p / realRx)
      const cx = Math.cos(rot) * cxp - Math.sin(rot) * cyp + (curX + x) / 2
      const cy = Math.sin(rot) * cxp + Math.cos(rot) * cyp + (curY + y) / 2

      function angle(u, v) {
        const sgn = u[0] * v[1] - u[1] * v[0] >= 0 ? 1 : -1
        const dot = u[0] * v[0] + u[1] * v[1]
        const uLen = Math.hypot(u[0], u[1]), vLen = Math.hypot(v[0], v[1])
        if (uLen === 0 || vLen === 0) return 0
        return sgn * Math.acos(Math.max(-1, Math.min(1, dot / (uLen * vLen))))
      }

      const v1 = [(x1p - cxp) / realRx, (y1p - cyp) / realRy]
      const v2 = [(-x1p - cxp) / realRx, (-y1p - cyp) / realRy]
      const theta1 = angle([1, 0], v1)
      let dTheta = angle(v1, v2)
      if (!sweep && dTheta > 0) dTheta -= 2 * Math.PI
      else if (sweep && dTheta < 0) dTheta += 2 * Math.PI

      const arcLen = Math.abs(dTheta) * Math.max(realRx, realRy)
      const steps = Math.max(4, Math.min(24, Math.ceil(arcLen * 2)))
      for (let s = 1; s <= steps; s++) {
        const t = theta1 + (s / steps) * dTheta
        const pxp = realRx * Math.cos(t)
        const pyp = realRy * Math.sin(t)
        const px = Math.cos(rot) * pxp - Math.sin(rot) * pyp + cx
        const py = Math.sin(rot) * pxp + Math.cos(rot) * pyp + cy
        currentPoints.push({ x: px, y: py })
      }
      curX = x
      curY = y
      lastCtrlX = x
      lastCtrlY = y
    } else if (upper === "Z") {
      if (Math.hypot(curX - startX, curY - startY) > 0.01) {
        currentPoints.push({ x: startX, y: startY })
      }
      curX = startX
      curY = startY
      lastCtrlX = startX
      lastCtrlY = startY
      flush()
    }
    lastCmd = cmd
  }
  flush()
  return subpaths
}

function splitPoints(points) {
  if (points.length < 2) return []
  const cleaned = [points[0]]
  for (let i = 1; i < points.length; i++) {
    if (Math.hypot(points[i].x - cleaned[cleaned.length - 1].x, points[i].y - cleaned[cleaned.length - 1].y) >= 0.05) {
      cleaned.push(points[i])
    }
  }
  if (cleaned.length < 2) return []
  const strokes = []
  let cur = [cleaned[0]]
  for (let i = 1; i < cleaned.length - 1; i++) {
    cur.push(cleaned[i])
    const prev = cleaned[i - 1], c = cleaned[i], next = cleaned[i + 1]
    const turn = angleBetween(c.x - prev.x, c.y - prev.y, next.x - c.x, next.y - c.y)
    if (turn > 35) {
      strokes.push(cur)
      cur = [c]
    }
  }
  cur.push(cleaned[cleaned.length - 1])
  strokes.push(cur)

  return strokes.filter((s) => s.length >= 2).map((s) => {
    const moves = [["M", round(s[0].x), round(s[0].y)]]
    for (let j = 1; j < s.length; j++) {
      moves.push(["L", round(s[j].x), round(s[j].y)])
    }
    return moves
  })
}

export function convertSvg(svgText) {
  const strokes = []
  const tagRe = /<(path|circle|rect|line|polyline|polygon|ellipse)\s+([^>]+)\/?>/gi
  let match
  while ((match = tagRe.exec(svgText)) !== null) {
    const tag = match[1].toLowerCase()
    const attrs = {}
    const attrRe = /([a-z0-9-]+)="([^"]*)"/gi
    let attrMatch
    while ((attrMatch = attrRe.exec(match[2])) !== null) {
      attrs[attrMatch[1].toLowerCase()] = attrMatch[2]
    }

    if (tag === "circle") {
      const cx = parseFloat(attrs.cx || 0)
      const cy = parseFloat(attrs.cy || 0)
      const r = parseFloat(attrs.r || 0)
      if (r > 0) strokes.push([["O", round(cx), round(cy), round(r), 0, 360]])
    } else if (tag === "line") {
      const x1 = parseFloat(attrs.x1 || 0)
      const y1 = parseFloat(attrs.y1 || 0)
      const x2 = parseFloat(attrs.x2 || 0)
      const y2 = parseFloat(attrs.y2 || 0)
      strokes.push([["M", round(x1), round(y1)], ["L", round(x2), round(y2)]])
    } else if (tag === "polyline" || tag === "polygon") {
      const pts = (attrs.points || "").trim().split(/[\s,]+/).map(parseFloat)
      const points = []
      for (let k = 0; k < pts.length; k += 2) {
        if (!isNaN(pts[k]) && !isNaN(pts[k + 1])) points.push({ x: pts[k], y: pts[k + 1] })
      }
      if (tag === "polygon" && points.length > 2) points.push(points[0])
      strokes.push(...splitPoints(points))
    } else if (tag === "rect") {
      const x = parseFloat(attrs.x || 0)
      const y = parseFloat(attrs.y || 0)
      const w = parseFloat(attrs.width || 0)
      const h = parseFloat(attrs.height || 0)
      const rx = parseFloat(attrs.rx || 0)
      const ry = parseFloat(attrs.ry || rx || 0)
      if (rx === 0 && ry === 0) {
        strokes.push([["M", round(x), round(y)], ["L", round(x + w), round(y)]])
        strokes.push([["M", round(x + w), round(y)], ["L", round(x + w), round(y + h)]])
        strokes.push([["M", round(x + w), round(y + h)], ["L", round(x), round(y + h)]])
        strokes.push([["M", round(x), round(y + h)], ["L", round(x), round(y)]])
      } else {
        const r = Math.min(rx, w / 2, h / 2)
        strokes.push([["M", round(x + r), round(y)], ["L", round(x + w - r), round(y)]])
        strokes.push([["M", round(x + w), round(y + r)], ["L", round(x + w), round(y + h - r)]])
        strokes.push([["M", round(x + w - r), round(y + h)], ["L", round(x + r), round(y + h)]])
        strokes.push([["M", round(x), round(y + h - r)], ["L", round(x), round(y + r)]])
      }
    } else if (tag === "ellipse") {
      const cx = parseFloat(attrs.cx || 0)
      const cy = parseFloat(attrs.cy || 0)
      const rx = parseFloat(attrs.rx || 0)
      const ry = parseFloat(attrs.ry || 0)
      if (Math.abs(rx - ry) < 0.05) {
        strokes.push([["O", round(cx), round(cy), round(rx), 0, 360]])
      } else {
        const steps = 24
        const pts = []
        for (let s = 0; s <= steps; s++) {
          const a = (s / steps) * 2 * Math.PI
          pts.push({ x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) })
        }
        strokes.push(...splitPoints(pts))
      }
    } else if (tag === "path") {
      const subpaths = parsePath(attrs.d || "")
      for (const sp of subpaths) {
        strokes.push(...splitPoints(sp))
      }
    }
  }
  return strokes
}

const pascal = (str) => str.replace(/(?:^|-)(.)/g, (_, c) => c.toUpperCase()).replace(/^(\d)/, "_$1")

export function buildSigns({ check = false } = {}) {
  const curated = JSON.parse(readFileSync(DATA_FILE, "utf8"))
  const allShapes = {}
  const items = []

  const outDir = "registry/0db/signs"
  mkdirSync(outDir, { recursive: true })

  for (const item of curated) {
    const { name, word, lucide } = item
    let shape
    if (lucide === null && HAND_DRAWN[name]) {
      shape = HAND_DRAWN[name]
    } else if (lucide) {
      const svgPath = `node_modules/lucide-static/icons/${lucide}.svg`
      if (!existsSync(svgPath)) throw new Error(`Missing SVG for ${name} (${lucide})`)
      const svg = readFileSync(svgPath, "utf8")
      const line = convertSvg(svg)
      if (!line.length) throw new Error(`Empty strokes for ${name} (${lucide})`)
      shape = { word, line }
    } else {
      throw new Error(`Unknown sign definition: ${name}`)
    }

    allShapes[name] = shape
    const compName = pascal(name)

    // Write sign-<name>-dots.tsx
    const dotsCode = `"use client"

import * as React from "react"
import { Sign, type SignProps } from "@/registry/0db/ui/sign"
import type { SignShape } from "@/registry/0db/lib/sign-shapes"

const shape: SignShape = ${JSON.stringify(shape, null, 2)}

function Sign${compName}Dots(props: Omit<SignProps, "shape" | "variant">) {
  return <Sign shape={shape} variant="dots" {...props} />
}

export { Sign${compName}Dots, shape }
`
    writeFileSync(`${outDir}/sign-${name}-dots.tsx`, dotsCode)

    // Write sign-<name>-words.tsx
    const wordsCode = `"use client"

import * as React from "react"
import { Sign, type SignProps } from "@/registry/0db/ui/sign"
import type { SignShape } from "@/registry/0db/lib/sign-shapes"

const shape: SignShape = ${JSON.stringify(shape, null, 2)}

function Sign${compName}Words(props: Omit<SignProps, "shape" | "variant">) {
  return <Sign shape={shape} variant="words" {...props} />
}

export { Sign${compName}Words, shape }
`
    writeFileSync(`${outDir}/sign-${name}-words.tsx`, wordsCode)

    items.push({
      name: `sign-${name}-dots`,
      signName: name,
      word,
      variant: "dots",
      file: `${outDir}/sign-${name}-dots.tsx`,
    })
    items.push({
      name: `sign-${name}-words`,
      signName: name,
      word,
      variant: "words",
      file: `${outDir}/sign-${name}-words.tsx`,
    })
  }

  // Write lib/site/signs.ts
  mkdirSync("lib/site", { recursive: true })
  const siteSignsTS = `// Generated by scripts/build-signs.mjs: full set of signs for docs and preview.
import type { SignShape } from "@/registry/0db/lib/sign-shapes"

export const signs: Record<string, SignShape> = ${JSON.stringify(allShapes, null, 2)}
`
  if (!check) {
    writeFileSync("lib/site/signs.ts", siteSignsTS)
  }

  return { curated, allShapes, items, siteSignsTS }
}

if (process.argv[1] && process.argv[1].endsWith("build-signs.mjs")) {
  const { items } = buildSigns()
  console.log(`Generated ${items.length / 2} signs (${items.length} items) in registry/0db/signs and lib/site/signs.ts`)
}
