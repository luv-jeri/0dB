import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { chromium } from "playwright"

import { parsePath, parseSvg, pathPoints, readCurated, signShape, VARIANTS } from "../scripts/build-signs.mjs"
import { layoutSign, tableMetrics } from "../registry/0nlytype/ui/sign.tsx"
import { signs } from "../lib/site/signs.ts"
import { SignSearchWords } from "../registry/0nlytype/signs/sign-search-words.tsx"

const curated = readCurated()
const near = (pts, [x, y], within = 0.1) => pts.some(([px, py]) => Math.hypot(px - x, py - y) <= within)

test("path data parses the way a browser draws it", () => {
  // Relative moves, implicit repeats and Z back to the start of the subpath.
  const [box] = parsePath("m1 1l2 0 0 2-2 0z")
  assert.deepEqual(box.pts.map((p) => p.map((v) => +v.toFixed(6))), [[1, 1], [3, 1], [3, 3], [1, 3], [1, 1]])
  assert.equal(box.closed, true)
  // A moveto followed by pairs draws lines to them.
  assert.deepEqual(parsePath("M0 0 1 1 2 0")[0].pts, [[0, 0], [1, 1], [2, 0]])
  // Packed numbers and H/V, absolute and relative.
  assert.deepEqual(parsePath("M.5.5H2v1.5h-1V.5")[0].pts, [[0.5, 0.5], [2, 0.5], [2, 2], [1, 2], [1, 0.5]])
  // Packed arc flags: "011" is large-arc 0, sweep 1, then x. A sweep of 1 from west to east goes over the top.
  const arc = parsePath("M0 0a2 2 0 014 0")[0].pts
  assert.ok(near(arc, [4, 0], 1e-6) && near(arc, [2, -2]), "the arc ends at (4, 0) by way of its top")
  assert.ok(Math.max(...arc.map((p) => p[1])) < 1e-6, "and never dips below")
  // S reflects the last cubic's second control; T reflects the last quadratic's control.
  const s = parsePath("M0 0C0 2 2 2 2 0S4-2 4 0")[0].pts
  assert.ok(near(s, [1, 1.5]) && near(s, [3, -1.5]), "S mirrors the curve before it")
  const t = parsePath("M0 0Q1 2 2 0T4 0")[0].pts
  assert.ok(near(t, [1, 1]) && near(t, [3, -1]), "T mirrors the curve before it")
  // A second subpath starts where the first closed.
  const two = parsePath("M1 1h2v2zl1 0")
  assert.equal(two.length, 2)
  assert.deepEqual(two[1].pts[0], [1, 1])
})

test("each sign is its own drawing: no repeated name, word, source or drawing", () => {
  const seen = (key) => {
    const all = curated.map(key).filter(Boolean)
    const twice = all.filter((v, i) => all.indexOf(v) !== i)
    return twice
  }
  assert.deepEqual(seen((s) => s.name), [], "names")
  assert.deepEqual(seen((s) => s.word), [], "words")
  assert.deepEqual(seen((s) => s.lucide), [], "Lucide sources")
  assert.deepEqual(seen((s) => JSON.stringify(signs[s.name].line)), [], "drawings")
  assert.ok(curated.length >= 200, `${curated.length} signs`)
})

// The move list each sign is laid along, drawn as a 2-unit stroke, against the Lucide icon it comes from, both
// rasterised at 96px. Every sign scores 0.95 or more (most 0.99; what's left is the joins, cut where a word turns a
// corner); a lost arc or a missing stroke drops a sign well under: losing a cat's two eyes alone costs 0.04.
const IOU = 0.94

test("every Lucide sign keeps its source's shape", { timeout: 120_000 }, async () => {
  const wrap = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
  const draw = (line) => wrap(line.map((p) => `<polyline points="${pathPoints(p).map(([x, y]) => `${x},${y}`).join(" ")}"/>`).join(""))
  const pairs = curated.filter((s) => s.lucide).map((s) => {
    const source = readFileSync(`node_modules/lucide-static/icons/${s.lucide}.svg`, "utf8")
    return [s.name, source, draw(signShape(s).line)]
  })
  // The control: a cat with no eyes must fail, or the gate passes broken drawings.
  const cat = curated.find((s) => s.name === "cat")
  pairs.push(["control: cat with no eyes", readFileSync(`node_modules/lucide-static/icons/${cat.lucide}.svg`, "utf8"), draw(signShape(cat).line.filter((p) => p.length > 2 || p[0][1] !== p[1][1] || p[0][2] !== p[1][2]))])

  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    const scores = await page.evaluate(async (pairs) => {
      const PX = 96
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = PX
      const g = canvas.getContext("2d", { willReadFrequently: true })
      const mask = async (svg) => {
        const img = new Image()
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg)
        await img.decode()
        g.clearRect(0, 0, PX, PX)
        g.drawImage(img, 0, 0, PX, PX)
        const d = g.getImageData(0, 0, PX, PX).data
        return Array.from({ length: PX * PX }, (_, i) => d[i * 4 + 3] > 127)
      }
      const out = []
      for (const [name, a, b] of pairs) {
        const [ma, mb] = [await mask(a), await mask(b)]
        let both = 0, either = 0
        for (let k = 0; k < ma.length; k++) { both += ma[k] && mb[k]; either += ma[k] || mb[k] }
        out.push([name, both / either])
      }
      return out
    }, pairs)
    const control = scores.pop()
    assert.ok(control[1] < IOU, `the control scored ${control[1].toFixed(3)}; the gate can't tell a missing stroke`)
    const low = scores.filter(([, v]) => v < IOU).map(([n, v]) => `${n} ${v.toFixed(3)}`)
    assert.deepEqual(low, [], `signs that lost part of their drawing (IoU under ${IOU})`)
  } finally {
    await browser.close()
  }
})

test("every sign reads in every variant, size and face", () => {
  const problems = []
  for (const italic of [false, true]) {
    const m = tableMetrics(italic)
    for (const variant of VARIANTS) for (const S of [16, 24, 48, 120]) for (const [name, shape] of Object.entries(signs)) {
      const where = `${name} ${variant} ${S} ${italic ? "italic" : "roman"}`
      const laid = layoutSign(shape, variant, S, italic, m)
      const shown = laid.glyphs.filter((g) => !g.hush)
      if (shown.length < 4) problems.push(`${where}: ${shown.length} glyphs`)
      // Every letter of the word is there to say it.
      if (laid.glyphs.filter((g) => g.say >= 0).length !== Array.from(shape.word).length) problems.push(`${where}: can't say its word`)
      // The said word stays the sign's own: half again its width at most, unless a caption's floor sets it wider.
      const wide = m.advances(Array.from(shape.word), laid.said, false).reduce((a, b) => a + b, 0) * laid.ws
      if (laid.ws > 11 && wide > 1.5 * S + 0.5) problems.push(`${where}: said word too wide`)
      if (variant === "fill" && laid.glyphs.length < Array.from(shape.word).length) problems.push(`${where}: fill shorter than its word`)
      if (variant !== "words") continue
      const letters = shown.filter((g) => g.ch !== "·")
      // Never upside down: a letter turned past a right angle and a bit can't be read along its stroke.
      if (letters.some((g) => Math.abs(g.r) > 100)) problems.push(`${where}: a letter is upside down`)
      // No clot: two letters that aren't neighbours in a word never sit on one another.
      for (let i = 0; i < letters.length; i++) for (let j = i + 2; j < letters.length; j++) {
        const a = letters[i], b = letters[j]
        if (Math.hypot(a.x - b.x, a.y - b.y) < 0.4 * Math.min(a.k, b.k) * laid.ws) { problems.push(`${where}: ${a.ch} on ${b.ch}`); i = j = Infinity }
      }
      // From 40px up the words variant spells its word once, whole, on its best stroke or beneath the drawing, and
      // rules the rest in quiet leaders; where the word can't be set at a size a person reads, it's dots throughout.
      // Never a word repeated as filler, never a few letters stranded among dots.
      if (S >= 48) {
        const text = letters.map((g) => g.ch).join("")
        if (letters.length && text !== shape.word) problems.push(`${where}: letters "${text}", not its word once`)
        if (letters.length && shown.some((g) => g.ch === "·" && !g.quiet)) problems.push(`${where}: a leader as loud as the word`)
      } else if (letters.length) problems.push(`${where}: letters under the words variant's smallest size`)
    }
  }
  assert.deepEqual(problems, [])
})

test("a sign renders on the server, one letter to an element", () => {
  const html = renderToStaticMarkup(React.createElement(SignSearchWords, { size: 48 }))
  const laid = layoutSign(signs.search, "words", 48, false, tableMetrics(false))
  assert.match(html, /role="img" aria-label="search"/)
  assert.equal(html.match(/class="ot-sign-glyph"/g)?.length, laid.glyphs.length)
  assert.ok(laid.glyphs.length > 10)
})

test("the fill and words variants carry only what they draw", () => {
  for (const variant of VARIANTS) {
    const source = readFileSync(`registry/0nlytype/signs/sign-search-${variant}.tsx`, "utf8")
    assert.equal(source.includes('"fill":'), variant === "fill", `${variant} ships the fill rows only if it fills`)
    assert.equal(source.includes('"line":'), variant !== "fill", `${variant} ships the strokes only if it draws them`)
  }
  assert.deepEqual(parseSvg('<svg><rect x="2" y="2" width="4" height="4"/></svg>')[0].pts.length, 5)
})
