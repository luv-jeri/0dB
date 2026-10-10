import * as React from "react"

import { layoutSign, tableMetrics, type SignShape, type SignVariant } from "@/registry/0nlytype/ui/sign"

const metrics = { roman: tableMetrics(false), italic: tableMetrics(true) }
// How far the baseline sits below the middle of a line-height-1 em box: half of ascent less descent, in ems, for
// Archivo (0.88, 0.21) and Bodoni Moda (1.13, 0.40) as Chrome reports them. The other pairs fall within 0.03em.
const BASELINE = { roman: 0.335, italic: 0.365 }
const n = (v: number) => +v.toFixed(2)

/**
 * A sign at rest, drawn for a page that shows hundreds of them: the same layout the Sign primitive starts from,
 * set as one SVG with a <text> for each size its letters come in (one for dots and fill, two for words: the word
 * in ink and its drawing in pencil),
 * every letter placed by the text's own x, y and rotate lists. So a tile costs a handful of elements, not one per
 * letter; the catalogue swaps the live Sign in when a tile is pointed at or focused, for the word to be said.
 */
export function SignStill({ shape, variant, face, size }: { shape: SignShape; variant: SignVariant; face: "roman" | "italic"; size: number }) {
  const m = metrics[face]
  const laid = layoutSign(shape, variant, size, face === "italic", m)
  // The primitive sets each letter's box, an em tall, centred a little below the point (translate -50% -54%) and
  // scaled by k round it. SVG turns each letter about its origin on the baseline: half its advance back along the
  // turned line, and the baseline's depth below the box's middle less 0.04em down it. So each letter lands where
  // the span would have put it.
  const groups = new Map<string, { fs: number; quiet: boolean; x: number[]; y: number[]; r: number[]; ch: string[] }>()
  for (const g of laid.glyphs) {
    if (g.hush) continue
    const fs = n(g.k * laid.ws)
    const a = m.advances([g.ch], laid.rest, false)[0] * fs
    const t = (g.r * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t)
    const dx = -a / 2, dy = (BASELINE[face] - 0.04) * fs
    const key = `${fs}${g.quiet ? "q" : ""}`
    let group = groups.get(key)
    if (!group) groups.set(key, (group = { fs, quiet: !!g.quiet, x: [], y: [], r: [], ch: [] }))
    group.x.push(n(g.x + dx * c - dy * s))
    group.y.push(n(g.y + dx * s + dy * c))
    group.r.push(n(g.r))
    group.ch.push(g.ch)
  }
  return (
    <span className="ot-sign" data-face={face === "italic" ? "italic" : undefined} aria-hidden style={{ "--ot-sign-size": `${size}px` } as React.CSSProperties}>
      <svg className="doc-sign-still" viewBox={`0 0 ${size} ${size}`} width={size} height={size} fontWeight={laid.rest}>
        {[...groups].map(([key, g]) => (
          <text key={key} fontSize={g.fs} data-quiet={g.quiet || undefined} x={g.x.join(" ")} y={g.y.join(" ")} rotate={g.r.join(" ")}>{g.ch.join("")}</text>
        ))}
      </svg>
    </span>
  )
}
