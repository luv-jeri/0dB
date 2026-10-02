"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { cn } from "@/registry/0db/lib/utils"

type RoomChord = (y: number) => number | [number, number][]
type RoomProps = Omit<React.ComponentProps<"div">, "children"> & {
  children: string
  shape: React.ReactNode
  /** Centred width fraction or [start, end] runs, in 0..1, at each height of the shape. */
  outline?: "box" | "ellipse" | RoomChord
  travel?: "set" | "pointer" | "scroll"
  side?: "start" | "end" | "centre"
  /** Space around the outline, in em. */
  gap?: number
}

// The exhale token, cubic-bezier(.16, 1, .3, 1), evaluated for a scroll position.
function exhale(p: number) {
  let lo = 0, hi = 1
  for (let i = 0; i < 12; i++) {
    const t = (lo + hi) / 2, q = 1 - t
    if (3 * q * q * t * 0.16 + 3 * q * t * t * 0.3 + t * t * t < p) lo = t
    else hi = t
  }
  return 1 - (1 - (lo + hi) / 2) ** 3
}

/** The thought occupies the page; a single text cursor continues through the room on both sides. */
function Room({ children: text, shape, outline = "ellipse", travel = "set", side = "centre", gap = 0.75, className, ref: forwardedRef, ...props }: RoomProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
  const shapeRef = React.useRef<HTMLDivElement>(null)
  const plainRef = React.useRef<HTMLParagraphElement>(null)
  const linesRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const el = ref.current, shapeEl = shapeRef.current, plain = plainRef.current, layer = linesRef.current
    if (!el || !shapeEl || !plain || !layer) return
    const still = matchMedia("(prefers-reduced-motion: reduce)")
    const hand = matchMedia("(hover: hover) and (pointer: fine)")
    let cancelled = false, frame = 0, revision = 0
    const off: (() => void)[] = []
    const reset = () => { el.removeAttribute("data-laid"); layer.hidden = true; el.style.removeProperty("min-height"); shapeEl.style.removeProperty("translate") }

    ;(async () => {
      const lib = await import("@chenglou/pretext")
      if (cancelled) return
      let prepared: ReturnType<typeof lib.prepareWithSegments> | undefined
      let W = 0, H = 0, sw = 0, sh = 0, lh = 0, pad = 0, rtl = false, stacked = true
      let x = 0, y = 0, tx = 0, ty = 0, startX = 0, startY = 0, started = 0, duration = 320
      const pool: HTMLSpanElement[] = []
      const clamp = (v: number, max: number) => Math.max(0, Math.min(max, v))

      function paint() {
        if (!prepared || stacked || cancelled) return
        shapeEl!.style.translate = `${x}px ${y}px`
        let cursor = { segmentIndex: 0, graphemeIndex: 0 }, count = 0, row = 0, done = false
        for (; !done && row < text.length + Math.ceil((sh + 2 * pad) / lh) + 1; row++) {
          const top = row * lh, bottom = top + lh
          const blocked: [number, number][] = []
          if (bottom > y - pad && top < y + sh + pad) {
            // Sample the whole line box, including its closest point to the ellipse's equator.
            const samples = [clamp((top - y - pad) / sh, 1), clamp((bottom - y + pad) / sh, 1)]
            if (samples[0] <= 0.5 && samples[1] >= 0.5) samples.push(0.5)
            for (const at of samples) {
              const value = typeof outline === "function" ? outline(at) : outline === "box" ? 1 : Math.sqrt(Math.max(0, 1 - (2 * at - 1) ** 2))
              const runs: [number, number][] = typeof value === "number" ? [[(1 - value) / 2, (1 + value) / 2]] : value
              for (const [a, b] of runs) if (Number.isFinite(a) && Number.isFinite(b) && b > a) blocked.push([clamp(x + (rtl ? 1 - b : a) * sw - pad, W), clamp(x + (rtl ? 1 - a : b) * sw + pad, W)])
            }
          }
          blocked.sort((a, b) => a[0] - b[0])
          const free: [number, number][] = []
          let edge = 0
          for (const [a, b] of blocked) { if (a > edge) free.push([edge, a]); edge = Math.max(edge, b) }
          if (edge < W) free.push([edge, W])
          for (const [a, b] of rtl ? free.reverse() : free) {
            if (b - a < Math.min(W, lh * 2)) continue
            const line = lib.layoutNextLine(prepared, cursor, b - a)
            if (!line) { done = true; break }
            // An indivisible word that cannot fit this interval waits for a wider one.
            if (line.width > b - a + 0.5 && b - a < W) continue
            let span = pool[count]
            if (!span) span = pool[count] = layer!.appendChild(document.createElement("span"))
            span.hidden = false
            span.textContent = line.text.trimEnd()
            span.style.translate = rtl ? `calc(${b}px - 100%) ${top}px` : `${a}px ${top}px`
            cursor = line.end
            count++
          }
        }
        for (let i = count; i < pool.length; i++) pool[i].hidden = true
        // Reserve the full obstacle height, so travel never pushes the next paragraph around.
        el!.style.minHeight = `${Math.max(H, row * lh)}px`
        el!.setAttribute("data-laid", "")
        layer!.hidden = false
      }

      function readScroll() {
        frame = 0
        if (stacked || still.matches || !prepared) return
        const box = el!.getBoundingClientRect(), top = box.top + scrollY
        const from = Math.max(0, top - innerHeight)
        const to = Math.min(document.documentElement.scrollHeight - innerHeight, top + H)
        const p = to <= from ? 0 : clamp((scrollY - from) / (to - from), 1)
        const next = exhale(p) * Math.max(0, H - sh)
        if (Math.abs(next - y) > 0.01) { y = next; paint() }
      }
      function scroll() {
        if (travel === "scroll" && !still.matches && !stacked && !frame) frame = requestAnimationFrame(readScroll)
      }
      function tick(now: number) {
        const p = clamp((now - started) / duration, 1), eased = exhale(p)
        x = startX + (tx - startX) * eased
        y = startY + (ty - startY) * eased
        if (p === 1) { x = tx; y = ty }
        paint()
        frame = p < 1 ? requestAnimationFrame(tick) : 0
      }
      function move(event: PointerEvent) {
        if (travel !== "pointer" || still.matches || !hand.matches || event.pointerType === "touch" || stacked || !prepared) return
        const box = el!.getBoundingClientRect()
        tx = clamp((event.clientX - box.left) / (box.width / W || 1) - sw / 2, W - sw)
        ty = clamp((event.clientY - box.top) / (box.height / el!.offsetHeight || 1) - sh / 2, H - sh)
        startX = x; startY = y; started = performance.now()
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(tick)
      }
      async function measure() {
        const version = ++revision
        cancelAnimationFrame(frame); frame = 0
        const style = getComputedStyle(plain!)
        const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        await document.fonts.load(font, text)
        if (cancelled || version !== revision) return
        W = el!.clientWidth
        stacked = W < 480
        reset()
        el!.toggleAttribute("data-stacked", stacked)
        if (stacked || W === 0) return
        prepared = lib.prepareWithSegments(text, font, { letterSpacing: parseFloat(style.letterSpacing) || 0 })
        lh = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.6
        pad = Math.max(0, gap) * parseFloat(style.fontSize)
        rtl = style.direction === "rtl"
        sw = shapeEl!.offsetWidth; sh = shapeEl!.offsetHeight
        H = plain!.offsetHeight + sh + 2 * pad + 2 * lh
        const end = side === "end" ? !rtl : rtl
        x = side === "centre" ? (W - sw) / 2 : end ? W - sw : 0
        y = 0
        const tempo = getComputedStyle(el!).getPropertyValue("--db-moderato").trim()
        duration = parseFloat(tempo) * (tempo.endsWith("ms") ? 1 : 1000) || 320
        paint()
        if (travel === "scroll") readScroll()
      }
      const again = () => { measure().catch(reset) }
      await measure()
      if (cancelled) return
      const resize = new ResizeObserver(() => {
        if (W !== el.clientWidth || (!stacked && (sw !== shapeEl.offsetWidth || sh !== shapeEl.offsetHeight))) again()
      })
      resize.observe(el); resize.observe(shapeEl)
      const theme = new MutationObserver(again)
      theme.observe(document.documentElement, { attributeFilter: ["data-pair", "data-scheme", "data-mode", "data-key"] })
      still.addEventListener("change", again)
      el.addEventListener("pointermove", move)
      addEventListener("scroll", scroll, { passive: true })
      addEventListener("resize", scroll)
      off.push(() => { resize.disconnect(); theme.disconnect(); still.removeEventListener("change", again); el.removeEventListener("pointermove", move); removeEventListener("scroll", scroll); removeEventListener("resize", scroll) })
    })().catch(reset)

    return () => { cancelled = true; revision++; cancelAnimationFrame(frame); off.forEach((fn) => fn()); reset(); layer.replaceChildren() }
  }, [text, outline, travel, side, gap])

  return (
    <div ref={composedRef} data-slot="room" data-travel={travel} data-side={side} className={cn("db-room", className)} {...props}>
      <div ref={shapeRef} className="db-room-shape">{shape}</div>
      <p ref={plainRef} className="db-room-plain">{text}</p>
      <span ref={linesRef} className="db-room-lines" aria-hidden="true" hidden />
    </div>
  )
}

export { Room, type RoomProps, type RoomChord }
