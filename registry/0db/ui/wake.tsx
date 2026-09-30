"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type WakeProps = Omit<React.ComponentProps<"p">, "children"> & {
  /** The paragraph. Plain text: pretext measures it. */
  children: string
  /** How far the text gives way around the pointer, in em. */
  radius?: number
  /** Draw a hairline ring where the text has parted. */
  mark?: boolean
}

/**
 * A paragraph that parts around your hand like water. Where the pointer is, each line that crosses
 * the circle is set as two runs, one either side, sharing a single cursor through the text, so the
 * words are pushed on rather than hidden. The circle swells as you arrive and closes as you leave;
 * the loop runs only while something is still moving. Touch, keyboard and reduced motion get the
 * plain paragraph, and the plain paragraph is always the one a reader hears.
 */
function Wake({ children: text, radius = 3.2, mark = false, className, ...props }: WakeProps) {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const lines = React.useRef<HTMLSpanElement>(null)
  const ring = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const el = ref.current, layer = lines.current, hole = ring.current
    if (!el || !layer) return
    const still = matchMedia("(prefers-reduced-motion: reduce)")
    const hand = matchMedia("(hover: hover) and (pointer: fine)")
    let cancelled = false, frame = 0
    const off: (() => void)[] = []

    ;(async () => {
      let lib: typeof import("@chenglou/pretext")
      try {
        lib = await import("@chenglou/pretext")
      } catch {
        return // the plain paragraph stays
      }
      if (cancelled) return
      let prepared: ReturnType<typeof lib.prepareWithSegments> | undefined
      let font = "", size = 16, lh = 24, W = 0, R = 0
      let cx = 0, cy = 0, tx = 0, ty = 0, r = 0, tr = 0
      let inside = false, live = false
      const pool: HTMLSpanElement[] = []

      async function measure() {
        const style = getComputedStyle(el!)
        const next = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        size = parseFloat(style.fontSize)
        lh = parseFloat(style.lineHeight) || size * 1.5
        if (next !== font || !prepared) {
          font = next
          await document.fonts.load(font, text)
          prepared = lib.prepareWithSegments(text, font, { letterSpacing: parseFloat(style.letterSpacing) || 0 })
        }
        W = el!.clientWidth
        R = radius * size
      }

      function put(i: number, s: string, x: number, y: number) {
        let span = pool[i]
        if (!span) span = pool[i] = layer!.appendChild(document.createElement("span"))
        span.hidden = false
        if (span.textContent !== s) span.textContent = s
        span.style.translate = `${Math.round(x * 2) / 2}px ${y}px`
      }

      // One frame of the wake: rows top to bottom, a row the circle crosses becomes two runs.
      function paint() {
        const on = r > 0.5 && !!prepared
        if (on !== live) {
          live = on
          el!.toggleAttribute("data-live", on)
          layer!.hidden = !on
          if (hole) hole.hidden = !on
        }
        if (!on || !prepared) return
        const least = Math.min(W * 0.4, size * 4) // a run shorter than this beside the circle stays empty
        let cursor = { segmentIndex: 0, graphemeIndex: 0 }, k = 0, y = 0, done = false
        // ponytail: the loop ends with the text; the two lines of room under the paragraph hold what the circle pushes on
        for (; !done && y < 20000; y += lh) {
          const dy = cy < y ? y - cy : cy > y + lh ? cy - y - lh : 0
          const half = dy < r ? Math.sqrt(r * r - dy * dy) : 0
          for (const [a, b] of half ? [[0, cx - half], [cx + half, W]] : [[0, W]]) {
            const x0 = Math.max(0, a), x1 = Math.min(W, b)
            if (half && x1 - x0 < least) continue
            const line = lib.layoutNextLine(prepared, cursor, x1 - x0)
            if (!line) { done = true; break }
            cursor = line.end
            put(k++, line.text.trimEnd(), x0, y)
          }
        }
        for (let i = k; i < pool.length; i++) pool[i].hidden = true
        if (hole) {
          const d = r * 1.56 // the ring sits inside the hole, so the words keep their distance
          hole.style.width = hole.style.height = `${d}px`
          hole.style.translate = `${cx - d / 2}px ${cy - d / 2}px`
        }
      }

      function tick() {
        cx += (tx - cx) * 0.2
        cy += (ty - cy) * 0.2
        r += (tr - r) * 0.14
        const settled = Math.abs(tx - cx) < 0.3 && Math.abs(ty - cy) < 0.3 && Math.abs(tr - r) < 0.5
        if (settled) { cx = tx; cy = ty; r = tr }
        paint()
        frame = settled ? 0 : requestAnimationFrame(tick)
      }
      const go = () => { if (!frame) frame = requestAnimationFrame(tick) }

      const move = (e: PointerEvent) => {
        if (e.pointerType === "touch" || !hand.matches || still.matches || !prepared) return
        const box = el.getBoundingClientRect()
        tx = e.clientX - box.left
        ty = e.clientY - box.top
        if (!inside) { inside = true; cx = tx; cy = ty } // it opens where the hand arrived
        tr = R
        go()
      }
      const leave = () => { inside = false; tr = 0; go() }
      el.addEventListener("pointermove", move)
      el.addEventListener("pointerleave", leave)
      off.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave) })

      await measure()
      if (cancelled) return
      const again = async () => { await measure(); if (!cancelled && live) paint() }
      const resized = new ResizeObserver(() => { if (el.clientWidth !== W) again() })
      resized.observe(el)
      // A change of pair or scheme on <html> can change the face: measure again.
      const restyled = new MutationObserver(again)
      restyled.observe(document.documentElement, { attributes: true })
      off.push(() => { resized.disconnect(); restyled.disconnect() })
    })()

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      off.forEach((f) => f())
    }
  }, [text, radius])

  return (
    <p ref={ref} data-slot="wake" className={cn("db-wake", className)} {...props}>
      <span className="db-wake-plain">{text}</span>
      <span ref={lines} aria-hidden="true" hidden className="db-wake-lines" />
      {mark ? <span ref={ring} aria-hidden="true" hidden className="db-wake-ring" /> : null}
    </p>
  )
}

export { Wake, type WakeProps }
