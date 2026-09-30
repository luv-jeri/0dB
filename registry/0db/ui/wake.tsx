"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { cn } from "@/registry/0db/lib/utils"

type WakeProps = Omit<React.ComponentProps<"p">, "children"> & {
  /** The paragraph. Plain text: pretext measures it. */
  children: string
  /** How far the text gives way around the pointer, in em. */
  radius?: number
  /** Draw a hairline where the text has parted: a ring, the river's middle, or rules either side of the held line. */
  mark?: boolean
  /**
   * circle: a hole round the hand. river: a gutter down the whole paragraph at the hand. caesura: the paragraph
   * opens at the line the hand is on. weight: nothing parts; the letters under the hand press heavier and narrower,
   * each keeping its place, so no line moves.
   */
  variant?: "circle" | "river" | "caesura" | "weight"
}

/**
 * A paragraph that parts around your hand like water. Where the pointer is, each line that crosses
 * the circle is set as two runs, one either side, sharing a single cursor through the text, so the
 * words are pushed on rather than hidden. The circle swells as you arrive and closes as you leave;
 * the loop runs only while something is still moving. Touch, keyboard and reduced motion get the
 * plain paragraph, and the plain paragraph is always the one a reader hears.
 */
function Wake({ children: text, radius = 3.2, mark = false, variant = "circle", className, ref: forwardedRef, ...props }: WakeProps) {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
  const lines = React.useRef<HTMLSpanElement>(null)
  const ring = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const el = ref.current, layer = lines.current, hole = ring.current
    if (!el || !layer || variant === "weight") return
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
      let inside = false, live = false, rtl = false
      const pool: HTMLSpanElement[] = []

      async function measure() {
        if (cancelled || !el!.isConnected) return
        const style = getComputedStyle(el!)
        const next = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        size = parseFloat(style.fontSize)
        rtl = style.direction === "rtl"
        lh = parseFloat(style.lineHeight) || size * 1.5
        if (next !== font || !prepared) {
          font = next
          await document.fonts.load(font, text)
          if (cancelled || !el!.isConnected) return
          prepared = lib.prepareWithSegments(text, font, { letterSpacing: parseFloat(style.letterSpacing) || 0 })
        }
        W = el!.clientWidth
        // The river's gutter is the circle's radius wide; the caesura's breath is at most the room under the paragraph.
        R = variant === "circle" ? radius * size : variant === "river" ? (radius * size) / 2 : Math.min(radius * size, 2 * lh)
      }

      function put(i: number, s: string, x: number, y: number) {
        let span = pool[i]
        if (!span) span = pool[i] = layer!.appendChild(document.createElement("span"))
        span.hidden = false
        if (span.textContent !== s) span.textContent = s
        const at = Math.round(x * 2) / 2
        span.style.translate = rtl ? `calc(${at}px - 100%) ${y}px` : `${at}px ${y}px` // right to left, a run hangs from its end
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
        let cursor = { segmentIndex: 0, graphemeIndex: 0 }, k = 0, y = 0, j = 0, done = false, end = 0
        // ponytail: the loop ends with the text; the two lines of room under the paragraph hold what the circle pushes on
        for (; !done && y < 20000; y += lh, j++) {
          const dy = cy < y ? y - cy : cy > y + lh ? cy - y - lh : 0
          const half = variant === "caesura" ? 0 : variant === "river" ? r : dy < r ? Math.sqrt(r * r - dy * dy) : 0
          // caesura: rows above the hand stay, rows below drop by the breath; the row under it sits between, held apart.
          const drop = variant === "caesura" ? r * Math.min(1, Math.max(0, (y + lh - cy) / lh)) : 0
          const runs = half ? [[0, cx - half], [cx + half, W]] : [[0, W]]
          for (const [a, b] of rtl ? runs.reverse() : runs) {
            const x0 = Math.max(0, a), x1 = Math.min(W, b)
            if (half && x1 - x0 < least) continue
            const line = lib.layoutNextLine(prepared, cursor, x1 - x0)
            if (!line) { done = true; break }
            cursor = line.end
            const words = line.text.trimEnd()
            put(k++, words, rtl ? x1 : x0, y + drop)
            end = y + lh
          }
          if (hole && variant === "caesura" && j === Math.floor(cy / lh)) {
            // The held line between two rules, each in the middle of its half of the breath.
            const s = Math.min(1, Math.max(0, (y + lh - cy) / lh))
            hole.style.width = `${W}px`
            hole.style.height = `${lh + r / 2}px`
            hole.style.translate = `0 ${y + (s * r) / 2}px`
            hole.style.opacity = String(Math.min(1, r / R))
          }
        }
        for (let i = k; i < pool.length; i++) pool[i].hidden = true
        if (hole && variant === "river") {
          hole.style.height = `${end}px`
          hole.style.translate = `${cx}px 0`
          hole.style.opacity = String(Math.min(1, r / R))
        } else if (hole && variant === "circle") {
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
        tx = (e.clientX - box.left) / (box.width / el.offsetWidth || 1)
        ty = (e.clientY - box.top) / (box.height / el.offsetHeight || 1)
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
      restyled.observe(document.documentElement, { attributeFilter: ["data-pair", "data-scheme", "data-mode", "data-key"] })
      off.push(() => { resized.disconnect(); restyled.disconnect() })
    })()

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      off.forEach((f) => f())
    }
  }, [text, radius, variant])

  useWeight(ref, lines, ring, text, radius, variant === "weight")

  return (
    <p ref={composedRef} data-slot="wake" data-variant={variant === "circle" ? undefined : variant} className={cn("db-wake", className)} {...props}>
      <span className="db-wake-plain">{text}</span>
      <span ref={lines} aria-hidden="true" hidden className="db-wake-lines" />
      {mark ? <span ref={ring} aria-hidden="true" hidden className="db-wake-ring" /> : null}
    </p>
  )
}

/**
 * weight: the letterpress's impression, and "It has to be design."'s heavy condensed roman. Each letter near the
 * hand is pressed heavier (the face's weight axis) and, where the face has a width axis, narrower by as much as the
 * weight widened it, so it keeps its set width. The letters are a layer placed exactly over the plain text (each
 * one measured from it, kerning and all), centred on its own place, so no line ever reflows.
 */
function useWeight(
  ref: React.RefObject<HTMLParagraphElement | null>,
  lines: React.RefObject<HTMLSpanElement | null>,
  ring: React.RefObject<HTMLSpanElement | null>,
  text: string,
  radius: number,
  on: boolean,
) {
  React.useEffect(() => {
    const el = ref.current, layer = lines.current, hole = ring.current
    const plain = el?.firstElementChild?.firstChild
    if (!on || !el || !layer || !(plain instanceof Text)) return
    const still = matchMedia("(prefers-reduced-motion: reduce)")
    const hand = matchMedia("(hover: hover) and (pointer: fine)")
    let letters: { span: HTMLSpanElement; x: number; y: number; t: number }[] = []
    let dirty = true, live = false, inside = false, frame = 0
    let R = 0, cx = 0, cy = 0, tx = 0, ty = 0, r = 0, tr = 0

    function measure() {
      dirty = false
      layer!.hidden = false // measured shown, in the same frame: nothing paints between
      const style = getComputedStyle(el!)
      R = radius * parseFloat(style.fontSize)
      const w0 = parseFloat(style.fontWeight) || 400, s0 = parseFloat(style.fontStretch) || 100
      el!.style.setProperty("--db-wake-w0", String(w0))
      el!.style.setProperty("--db-wake-s0", String(s0))
      // How far the width axis must close for the heaviest letters to keep their set width (none without one).
      const probe = layer!.appendChild(document.createElement("span"))
      probe.style.cssText = "visibility:hidden;white-space:pre;translate:none"
      probe.textContent = [...new Set(text.replace(/\s/g, ""))].join("")
      const wide = (w: number, st: number) => ((probe.style.fontWeight = String(w)), (probe.style.fontStretch = `${st}%`), probe.getBoundingClientRect().width)
      const rest = wide(w0, s0)
      let lo = 50, hi = s0
      if (wide(800, s0) > rest + 0.5) for (let i = 0; i < 7; i++) { const mid = (lo + hi) / 2; if (wide(800, mid) > rest) hi = mid; else lo = mid }
      el!.style.setProperty("--db-wake-s1", String(Math.round(hi)))
      probe.remove()

      const box = el!.getBoundingClientRect()
      // Ranges are in viewport pixels; the letter layer is in local CSS pixels. A fitted specimen
      // may be transformed, so undo that scale before placing its letters over the original text.
      const sx = box.width / el!.offsetWidth || 1, sy = box.height / el!.offsetHeight || 1
      const range = document.createRange()
      const next: typeof letters = []
      layer!.replaceChildren()
      for (const { segment, index } of new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)) {
        if (!segment.trim()) continue
        range.setStart(plain as Text, index)
        range.setEnd(plain as Text, index + segment.length)
        const b = range.getClientRects()[0]
        if (!b) continue
        const span = layer!.appendChild(document.createElement("span"))
        span.textContent = segment
        const x = (b.left - box.left + b.width / 2) / sx, y = (b.top - box.top) / sy
        // Its line box is its content area, so the letter sits on the baseline it had in the text.
        span.style.cssText = `translate:calc(${x}px - 50%) ${y}px;line-height:${b.height / sy}px`
        next.push({ span, x, y: y + b.height / sy / 2, t: 0 })
      }
      letters = next
      layer!.hidden = !live
    }

    function paint() {
      const show = r > 0.5
      if (show !== live) {
        live = show
        el!.toggleAttribute("data-live", show)
        layer!.hidden = !show
        if (hole) hole.hidden = !show
      }
      for (const l of letters) {
        const d = Math.hypot(l.x - cx, l.y - cy)
        const t = d < r ? Math.round(((1 + Math.cos((Math.PI * d) / r)) / 2) * 50) / 50 : 0
        if (t !== l.t) l.span.style.setProperty("--t", String((l.t = t)))
      }
      if (hole) {
        hole.style.width = hole.style.height = `${2 * r}px`
        hole.style.translate = `${cx - r}px ${cy - r}px`
      }
    }

    function tick() {
      cx += (tx - cx) * 0.2
      cy += (ty - cy) * 0.2
      r += (tr - r) * 0.14
      const settled = Math.abs(tx - cx) < 0.3 && Math.abs(ty - cy) < 0.3 && Math.abs(tr - r) < 0.5
      if (settled) { cx = tx; cy = ty; r = tr }
      paint()
      frame = settled ? 0 : requestAnimationFrame(tick) // a still hand, a still page
    }
    const go = () => { if (!frame) frame = requestAnimationFrame(tick) }

    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !hand.matches || still.matches) return
      if (dirty && !live) measure()
      const box = el.getBoundingClientRect()
      tx = (e.clientX - box.left) / (box.width / el.offsetWidth || 1)
      ty = (e.clientY - box.top) / (box.height / el.offsetHeight || 1)
      if (!inside) { inside = true; cx = tx; cy = ty }
      tr = R
      go()
    }
    const leave = () => { inside = false; tr = 0; go() }
    // A new width or face moves the letters: measure again, now if they are showing, else when the hand returns.
    const stale = () => { dirty = true; if (live) { measure(); paint() } }
    let alive = true
    document.fonts.ready.then(() => { if (alive) dirty = true })
    const resized = new ResizeObserver(stale)
    resized.observe(el)
    const restyled = new MutationObserver(stale)
    restyled.observe(document.documentElement, { attributeFilter: ["data-pair", "data-scheme", "data-mode", "data-key"] })
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", leave)
    return () => {
      alive = false
      cancelAnimationFrame(frame)
      resized.disconnect()
      restyled.disconnect()
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
      layer.replaceChildren()
      el.removeAttribute("data-live")
    }
  }, [ref, lines, ring, text, radius, on])
}

export { Wake, type WakeProps }
