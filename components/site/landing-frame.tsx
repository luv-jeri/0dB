"use client"

import * as React from "react"

// A border made of words: a running line set round the edge of its parent, as a seal or a banknote sets its
// legend. Pretext cuts the line into four measured lengths, one per edge, justified corner to corner; the
// edges turn with the frame, so the words read clockwise and their tops face out. fill draws the frame only
// that far round (a meter that closes into a border); run steps the words round it, a word at a time.
// Aria-hidden: whatever it says is also said in the page. Reduced motion: drawn once, still.

type FrameProps = {
  /** The line, repeated round the frame. */
  words: string
  /** How far round the frame is set, 0 to 1, clockwise from the top left. */
  fill?: number
  /** Words a second it steps round; 0 is still. */
  run?: number
  className?: string
}

export function TextFrame({ words, fill = 1, run = 0, className }: FrameProps) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const live = React.useRef({ fill, run })
  const kick = React.useRef<() => void>(() => {})
  React.useEffect(() => { live.current = { fill, run }; kick.current() }, [fill, run])

  React.useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const still = matchMedia("(prefers-reduced-motion: reduce)")
    let cancelled = false, frame = 0
    const off: (() => void)[] = []

    ;(async () => {
      let lib: typeof import("@chenglou/pretext")
      try { lib = await import("@chenglou/pretext") } catch { return }
      if (cancelled) return
      const { prepareWithSegments, layoutNextLine } = lib
      let prepared: ReturnType<typeof prepareWithSegments> | null = null
      let font = "", W = 0, H = 0, dpr = 1, size = 11, band = 18, per = 1, flow = 0, last = 0

      async function prepare() {
        const b = canvas!.getBoundingClientRect()
        W = b.width; H = b.height
        size = W >= 2000 ? 13 : 11
        band = Math.round(size * 1.7)
        const voice = getComputedStyle(document.documentElement).getPropertyValue("--db-voice").trim() || "sans-serif"
        const next = `500 ${size}px ${voice}`
        if (next !== font || !prepared) {
          font = next
          await document.fonts.load(font, words)
          const copies = Math.max(4, Math.ceil(2400 / Math.max(1, words.length)))
          prepared = prepareWithSegments(words.repeat(copies), font)
          per = Math.max(1, Math.round(prepared.segments.length / copies))
        }
        dpr = Math.min(2, devicePixelRatio || 1)
        canvas!.width = Math.round(W * dpr)
        canvas!.height = Math.round(H * dpr)
      }

      function draw(now: number) {
        if (!prepared) return
        const { fill, run } = live.current
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx!.clearRect(0, 0, W, H)
        ctx!.font = font
        ctx!.fillStyle = getComputedStyle(canvas!).color
        ctx!.textBaseline = "alphabetic"
        // Every run is placed by its left edge, whichever way the page reads.
        ctx!.direction = "ltr"
        ctx!.textAlign = "left"
        const dt = last ? Math.min(64, now - last) : 0
        last = now
        if (!still.matches) flow += (dt / 1000) * run
        let s = Math.floor(flow) % per
        while (s < prepared.segments.length - 1 && !prepared.segments[s].trim()) s++
        let cursor = { segmentIndex: s, graphemeIndex: 0 }
        // Each edge: where it starts, which way it turns, how long it is. The corners stay open, a band square.
        const base = band * 0.72
        const edges: [number, number, number, number][] = [
          [band, base, 0, W - 2 * band],
          [W - base, band, Math.PI / 2, H - 2 * band],
          [W - band, H - base, Math.PI, W - 2 * band],
          [base, H - band, -Math.PI / 2, H - 2 * band],
        ]
        let left = Math.max(0, Math.min(1, fill)) * edges.reduce((t, e) => t + e[3], 0)
        for (const [x, y, turn, len] of edges) {
          const w = Math.min(len, left)
          left -= len
          if (w < size * 3) break
          const line = layoutNextLine(prepared, cursor, w)
          if (!line) break
          cursor = line.end
          const text = line.text.trimEnd()
          const gaps = (text.match(/ /g) ?? []).length
          // A whole edge is justified corner to corner; the edge being drawn is set as it comes.
          ctx!.wordSpacing = w === len && gaps ? `${Math.max(0, w - line.width) / gaps}px` : "0px"
          ctx!.setTransform(dpr, 0, 0, dpr, x * dpr, y * dpr)
          ctx!.rotate(turn)
          ctx!.fillText(text, 0, 0)
        }
        ctx!.wordSpacing = "0px"
      }

      function tick(now: number) {
        frame = 0
        draw(now)
        if (live.current.run > 0 && !still.matches) frame = requestAnimationFrame(tick)
        else last = 0
      }
      kick.current = () => { if (!frame) frame = requestAnimationFrame(tick) }

      await prepare()
      if (cancelled) return
      kick.current()
      const relayout = async () => { await prepare(); if (!cancelled) kick.current() }
      const ro = new ResizeObserver(() => relayout())
      ro.observe(canvas!)
      const mo = new MutationObserver(() => relayout())
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-pair", "data-scheme", "data-mode", "data-key"] })
      off.push(() => { ro.disconnect(); mo.disconnect() })
    })()

    return () => {
      cancelled = true
      kick.current = () => {}
      cancelAnimationFrame(frame)
      off.forEach((f) => f())
    }
  }, [words])

  return <canvas ref={ref} className={className ? `text-frame ${className}` : "text-frame"} aria-hidden="true" />
}
