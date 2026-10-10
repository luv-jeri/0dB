"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"

/** The attributes on <html> that can change the face. Not class: smooth scrolling toggles one on every scroll. */
const FACE = ["data-pair", "data-scheme", "data-mode", "data-key"]

/** The arc: how much of a circle it spans, how far the guide sits inside the letters, and what the scroll moves. */
const ARC = { span: (100 * Math.PI) / 180, scroll: 0.6 }
const WAVE = { amp: 0.6 }
/** How far under the letters the guide runs, in ems: the dots between the phrases ride on it. */
const GUIDE = 0.55

type TextRibbonProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The phrase. Plain text: pretext measures every letter. It is read once; the ribbon repeats it for the eye. */
  children: string
  /** arc: after WOVE, the phrase round an arch, largest and in ink at the crest, shrinking and fading toward the ends.
   *  wave: the phrase rides a slow wave across the measure, fading in and out at the edges. */
  variant?: "arc" | "wave"
  /** The name of the handle you move it by. */
  label?: string
  autoplay?: boolean
  defaultPaused?: boolean
  pauseLabel?: string
  playLabel?: string
  "data-force"?: string
}

type Glyph = { el: HTMLSpanElement; x: number; dot?: boolean }

/**
 * A phrase laid along a curve by pretext, repeated round like a ribbon with a dot between each time.
 * It drifts until you take over: drag it along, press the arrow keys, scroll the page, or pause it.
 */
function TextRibbon({ children: text, variant = "arc", label = "Move the phrase", autoplay = true, defaultPaused = false, pauseLabel = "pause", playLabel = "play", "data-force": force, className, ...props }: TextRibbonProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const stage = React.useRef<HTMLDivElement>(null)
  const [paused, setPaused] = React.useState(defaultPaused)
  const drift = React.useRef<(delta: number) => void>(() => {})

  React.useEffect(() => {
    const root = ref.current, box = stage.current
    if (!root || !box) return
    let cancelled = false
    const off: (() => void)[] = []

    ;(async () => {
      let lib: typeof import("@chenglou/pretext")
      try {
        lib = await import("@chenglou/pretext")
      } catch {
        return // the plain phrase stays
      }
      if (cancelled) return
      const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" })
      const layer = document.createElement("span")
      layer.className = "db-ribbon-letters"
      layer.setAttribute("aria-hidden", "true")
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("class", "db-ribbon-guide")
      svg.setAttribute("aria-hidden", "true")
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
      svg.append(path)
      box.append(svg, layer)
      off.push(() => {
        svg.remove()
        layer.remove()
        delete root.dataset.laid
      })

      let glyphs: Glyph[] = []
      let W = 0, size = 16, period = 1, length = 1
      let hand = 0, scrolled = 0, carried = 0
      const reduced = matchMedia("(prefers-reduced-motion: reduce)")
      const still = () => reduced.matches || !!force?.split(" ").includes("reduced")
      let place: (s: number) => { x: number; y: number; a: number } = () => ({ x: 0, y: 0, a: 0 })

      async function lay() {
        if (cancelled || !box!.isConnected) return
        const style = getComputedStyle(box!)
        const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        await document.fonts.load(font, text)
        if (cancelled || !box!.clientWidth) return
        W = box!.clientWidth
        size = parseFloat(style.fontSize)
        const letterSpacing = parseFloat(style.letterSpacing) || 0
        const measure = (s: string) => lib.measureNaturalWidth(lib.prepareWithSegments(s, font, { letterSpacing }))
        const phrase = text.trim()
        const gap = 2 * size
        period = measure(phrase) + gap

        let d: string
        if (variant === "wave") {
          const amp = WAVE.amp * size, k = (2 * Math.PI) / Math.max(12 * size, W / 2), mid = 1.1 * size + amp
          length = W
          place = (s) => ({ x: s, y: mid + amp * Math.sin(k * s), a: Math.atan(amp * k * Math.cos(k * s)) })
          const g = GUIDE * size
          d = Array.from({ length: 65 }, (_, i) => {
            const s = (i / 64) * W
            return `${i ? "L" : "M"}${s.toFixed(1)} ${(mid + g + amp * Math.sin(k * s)).toFixed(1)}`
          }).join("")
        } else {
          const chord = W - 1.5 * size, R = chord / (2 * Math.sin(ARC.span / 2)), cx = W / 2, cy = 1.2 * size + R
          length = R * ARC.span
          place = (s) => {
            const a = -ARC.span / 2 + s / R
            return { x: cx + R * Math.sin(a), y: cy - R * Math.cos(a), a }
          }
          const r = R - GUIDE * size, h = ARC.span / 2
          d = `M${cx - r * Math.sin(h)} ${cy - r * Math.cos(h)}A${r} ${r} 0 0 1 ${cx + r * Math.sin(h)} ${cy - r * Math.cos(h)}`
        }
        svg.setAttribute("viewBox", `0 0 ${W} ${box!.clientHeight}`)
        path.setAttribute("d", d)

        // One period: the letters of the phrase at their centres, kerning included, then a dot in the gap. Enough
        // periods to cover the curve with one to spare either side, so a letter is always coming in as one goes out.
        const one: { g: string; x: number; dot?: boolean }[] = []
        let before = ""
        for (const { segment: g } of graphemes.segment(phrase)) {
          if (g.trim()) {
            const gw = measure(g)
            one.push({ g, x: measure(before + g) - gw / 2 })
          }
          before += g
        }
        one.push({ g: "", x: period - gap / 2, dot: true })
        const copies = Math.ceil(length / period) + 2
        glyphs = []
        for (let c = 0; c < copies; c++)
          for (const p of one) {
            const el = document.createElement("span")
            if (p.dot) el.className = "db-ribbon-dot"
            else el.textContent = p.g
            glyphs.push({ el, x: (c - 1) * period + p.x, dot: p.dot })
          }
        layer.replaceChildren(...glyphs.map((g) => g.el))
        root!.dataset.laid = ""
        paint()
      }

      const turn = (v: number) => ((v % period) + period) % period
      function paint() {
        const shift = turn(hand + (still() ? 0 : scrolled + carried))
        for (const g of glyphs) {
          const s = g.x + shift - period
          const d = Math.min(1, Math.abs(s - length / 2) / (length / 2))
          if (s < -size || s > length + size) {
            g.el.style.visibility = "hidden"
            continue
          }
          const { x, y, a } = place(s)
          // WOVE: the figures shrink and fade by their distance from the crest. On the wave, only the edges fade.
          const k = variant === "arc" ? 1 - 0.42 * d * d : 1
          g.el.style.visibility = ""
          g.el.style.setProperty("--d", d.toFixed(3))
          g.el.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${a.toFixed(4)}rad) ${g.dot ? `translate(0,${GUIDE}em) scale(${k.toFixed(3)}) translate(-50%,-50%)` : `scale(${k.toFixed(3)}) translate(-50%,-0.8em)`}`
        }
        box!.setAttribute("aria-valuenow", String(Math.round((turn(hand) / period) * 100)))
      }
      let frame = 0
      const ask = () => {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(paint)
      }

      await lay()
      if (cancelled) return
      drift.current = (delta) => {
        carried = turn(carried + delta * size * 0.0006)
        paint()
      }

      const resized = new ResizeObserver(() => box.clientWidth !== W && lay())
      resized.observe(box)
      // A change of pair or scheme on <html> can change the face: measure again.
      const restyled = new MutationObserver(() => lay())
      restyled.observe(document.documentElement, { attributeFilter: FACE })
      off.push(() => {
        cancelAnimationFrame(frame)
        resized.disconnect()
        restyled.disconnect()
        drift.current = () => {}
      })

      // The hand: a drag along it moves it as far as the pointer goes, and it stays where it's let go.
      let from: number | null = null
      const down = (e: PointerEvent) => {
        if (!e.isPrimary || e.button !== 0) return
        from = e.clientX
        box.setPointerCapture(e.pointerId)
        root.dataset.held = ""
      }
      const move = (e: PointerEvent) => {
        if (from === null) return
        hand += e.clientX - from
        from = e.clientX
        ask()
      }
      const up = () => {
        from = null
        delete root.dataset.held
      }
      const key = (e: KeyboardEvent) => {
        const step = e.key === "ArrowRight" ? size : e.key === "ArrowLeft" ? -size : e.key === "PageDown" ? 4 * size : e.key === "PageUp" ? -4 * size : 0
        if (step) hand += step
        else if (e.key === "Home") hand = 0
        else return
        e.preventDefault()
        ask()
      }
      box.addEventListener("pointerdown", down)
      box.addEventListener("pointermove", move)
      box.addEventListener("pointerup", up)
      box.addEventListener("pointercancel", up)
      box.addEventListener("keydown", key)
      off.push(() => {
        box.removeEventListener("pointerdown", down)
        box.removeEventListener("pointermove", move)
        box.removeEventListener("pointerup", up)
        box.removeEventListener("pointercancel", up)
        box.removeEventListener("keydown", key)
      })

      // The page: scrolling moves it along as the ribbon rises through the view, read from the real layout in a frame
      // asked for by the scroll event, which runs after a smooth scroller has moved the page. Not under reduced motion.
      const onScroll = () => {
        if (still()) return
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          scrolled = -box.getBoundingClientRect().top * ARC.scroll
          paint()
        })
      }
      const onMotion = () => {
        cancelAnimationFrame(frame)
        // Restore the still curve now; resuming reads any scrolling that happened while it was still.
        scrolled = still() ? 0 : -box.getBoundingClientRect().top * ARC.scroll
        paint()
      }
      onScroll()
      reduced.addEventListener("change", onMotion)
      addEventListener("scroll", onScroll, { passive: true })
      off.push(() => {
        reduced.removeEventListener("change", onMotion)
        removeEventListener("scroll", onScroll)
      })
    })()

    return () => {
      cancelled = true
      off.splice(0).forEach((f) => f())
    }
  }, [text, variant, force])

  // A single clock for idle motion. Every pause cancels it; resuming starts with a fresh delta.
  React.useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    let running = false, held = false, visible = false, hovered = root.matches(":hover"), frame = 0, last = 0, timer = 0, restUntil = 0
    const forced = force?.split(" ") ?? []
    const tick = (time: number) => {
      if (!running) return
      const delta = last ? Math.min(time - last, 64) : 0
      last = time
      drift.current(delta)
      if (running) frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      running = false
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      last = 0
      const resting = performance.now() < restUntil
      const stopped = !autoplay || paused || reduced.matches || forced.includes("reduced") || forced.includes("hover") || forced.includes("focus") || !visible || hovered || held || root.contains(document.activeElement) || document.hidden
      root.dataset.autoplay = stopped || resting ? "paused" : "playing"
      if (stopped) return
      if (resting) timer = window.setTimeout(sync, restUntil - performance.now())
      else { running = true; frame = requestAnimationFrame(tick) }
    }
    const rest = () => {
      restUntil = performance.now() + 1600
      sync()
    }
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      hovered = true
      rest()
    }
    const leave = () => { hovered = false; rest() }
    const down = () => { held = true; rest() }
    const up = () => { if (held) { held = false; rest() } }
    const seen = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    seen.observe(root)
    root.addEventListener("pointerenter", enter)
    root.addEventListener("pointerleave", leave)
    root.addEventListener("pointerdown", down)
    addEventListener("pointerup", up)
    addEventListener("pointercancel", up)
    root.addEventListener("keydown", rest)
    root.addEventListener("focusin", rest)
    root.addEventListener("focusout", rest)
    addEventListener("scroll", rest, { passive: true })
    document.addEventListener("visibilitychange", sync)
    reduced.addEventListener("change", sync)
    sync()
    return () => {
      running = false
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      seen.disconnect()
      root.removeEventListener("pointerenter", enter)
      root.removeEventListener("pointerleave", leave)
      root.removeEventListener("pointerdown", down)
      removeEventListener("pointerup", up)
      removeEventListener("pointercancel", up)
      root.removeEventListener("keydown", rest)
      root.removeEventListener("focusin", rest)
      root.removeEventListener("focusout", rest)
      removeEventListener("scroll", rest)
      document.removeEventListener("visibilitychange", sync)
      reduced.removeEventListener("change", sync)
    }
  }, [autoplay, paused, force])

  return (
    <div ref={ref} data-slot="text-ribbon" data-force={force} data-variant={variant === "arc" ? undefined : variant} className={cn("db-ribbon", className)} {...props}>
      <span className="db-sr">{text}</span>
      <div
        ref={stage}
        className="db-ribbon-stage"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        aria-keyshortcuts="ArrowLeft ArrowRight PageUp PageDown Home"
      >
        <span className="db-ribbon-plain" aria-hidden="true">{text}</span>
      </div>
      {autoplay && <button type="button" className="db-ribbon-pause" onClick={() => setPaused((value) => !value)}>{paused ? playLabel : pauseLabel}</button>}
    </div>
  )
}

export { TextRibbon, type TextRibbonProps }
