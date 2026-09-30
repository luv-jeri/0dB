"use client"

import * as React from "react"

// Noise: words set small and dense on a canvas around big type, as SPECTRA sets its metadata against huge
// type. Pretext lays every row around the letters of each [data-noise-glyphs] element (their real boxes, cut
// to cap, x-height and descender), around each [data-hush] box, and around a pause that follows a fine pointer.
// It moves as a hairpin: it swells in, streaming (each row starts a word further on, so the field runs like
// a ticker), then the silence spreads out from [data-noise-center] and turns it down until it rests, still.
// A [data-noise-meter] beside it reads the loudness in dB as it goes. Aria-hidden: the type is the page.
// Given a level (0 to 1), it follows that instead, and the level shows in the type itself: the rows close up
// (density), and weight and ink ramp out from the words, each run measured by pretext in its own weight, so
// the gradient is made of type; each [data-noise-echo] gets echoes of its own lines, set a step apart behind
// it, a shadow made of its words, deeper as it gets louder.
// Reduced motion: the quiet state (or the level, as it stands), drawn still, with no pause and the meter at 0.

export const REFUSED =
  "icon 84dB  drop shadow 91dB  gradient 96dB  card 88dB  glassmorphism 102dB  glow 97dB  badge 79dB  confetti 110dB  blur 86dB  neon 104dB  emoji 83dB  bento 89dB  particles 108dB  parallax 99dB  3D tilt 101dB  hover lift 87dB  rounded-2xl 82dB  shadow-lg 93dB  ring offset 78dB  second accent 95dB  autoplay 106dB  notification dot 90dB  shimmer 92dB  pulse 85dB  bounce 94dB  ambient background 98dB  click spark 103dB  meta balls 100dB  swarm cursor 107dB  typography vortex 111dB  particle text 105dB  ghost cursor 96dB  image trail 97dB  magic rings 102dB  elastic mesh 99dB  dither dissolve 94dB  glass sculpture 101dB  orbit images 98dB  warp text 100dB  zoom words 103dB  falling text 95dB  dock 88dB  animated icon 92dB  "

type Box = { x0: number; x1: number; y0: number; y1: number }
type Cursor = { segmentIndex: number; graphemeIndex: number }
type Phase = { kind: "swell" | "hush"; at: number; from: number; meterFrom: number }
type Echo = { text: string; x: number; y: number; font: string; spacing: number }

const ASCENDS = /[A-Zbdfhijklt0-9!?'"()]/
const DESCENDS = /[gjpqy,;]/
const X_ONLY = /[.]/
const LOUD = 0.6, REST = 0.15 // the ink's alpha, at full noise and at rest
const SWELL = 520, HUSH = 1500, SPREAD = 0.5, STREAM = 16 // ms, ms, ms per pixel from the centre, words a second
const RAMP = [300, 500, 760] // the weights a levelled field ramps through
const ECHOES = 6 // at full level

/** The ink of each letter, near enough: its advance box cut to cap height, x-height and descender. */
function glyphBoxes(el: HTMLElement, origin: DOMRect, ctx: CanvasRenderingContext2D, out: Box[]) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? ""
    const cs = getComputedStyle(node.parentElement ?? el)
    const s = parseFloat(cs.scale) || 1
    const size = parseFloat(cs.fontSize) * s
    // A zero-size probe standing on the baseline, when the word carries one; else the font's own ascent
    // below the top of each letter's box.
    const probe = node.parentElement?.closest("[data-noise-word]")?.querySelector("[data-noise-base]")
    const base = probe ? probe.getBoundingClientRect().bottom : NaN
    let ascent = NaN
    if (!probe) {
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${size}px ${cs.fontFamily}`
      ascent = ctx.measureText("M").fontBoundingBoxAscent
    }
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]
      if (ch === " ") continue
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      for (const r of range.getClientRects()) {
        if (!r.width) continue
        const b = Number.isNaN(base) ? r.top + ascent : base
        const top = X_ONLY.test(ch) ? 0.14 : ASCENDS.test(ch) ? 0.74 : 0.54
        const foot = DESCENDS.test(ch) ? 0.22 : 0
        out.push({ x0: r.left - origin.left, x1: r.right - origin.left, y0: b - top * size - origin.top, y1: b + foot * size - origin.top })
      }
    }
  }
}

/** The lines of an element as the browser set them (scale included), to be echoed on the canvas. */
function echoLines(el: HTMLElement, origin: DOMRect, ctx: CanvasRenderingContext2D, out: Echo[]) {
  const cs = getComputedStyle(el)
  const s = parseFloat(cs.scale) || 1
  const font = `${cs.fontStyle} ${cs.fontWeight} ${parseFloat(cs.fontSize) * s}px ${cs.fontFamily}`
  const spacing = (parseFloat(cs.letterSpacing) || 0) * s
  ctx.font = font
  const ascent = ctx.measureText("M").fontBoundingBoxAscent
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  let line: Echo | null = null, top = NaN
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? ""
    for (let i = 0; i < text.length; i++) {
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      const r = range.getClientRects()[0]
      if (r?.width && !(Math.abs(r.top - top) <= 2)) {
        top = r.top
        line = { text: "", x: r.left - origin.left, y: r.top + ascent - origin.top, font, spacing }
        out.push(line)
      }
      if (line) line.text += text[i]
    }
  }
}

type NoiseProps = {
  /** The material, repeated to fill. */
  words?: string
  /** Left out, the noise arrives on its own: it swells, then hushes. Given, it follows: false swells, true hushes. */
  quiet?: boolean
  /** Given, the noise follows it instead, 0 to 1: density, weight, ink and echoes all rise with it. */
  level?: number
  /** The meter's reading at full noise. */
  peak?: number
  className?: string
}

export function Noise({ words = REFUSED, quiet, level, peak = 111, className }: NoiseProps) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const api = React.useRef<{ to(quiet: boolean): void; words(w: string): void; peak(n: number): void; level(n: number): void } | null>(null)
  const auto = quiet === undefined
  const first = React.useRef({ words, quiet, peak, level })
  const latest = React.useRef(level)

  React.useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext("2d")
    if (!canvas || !host || !ctx) return
    const still = matchMedia("(prefers-reduced-motion: reduce)")
    const fine = matchMedia("(hover: hover) and (pointer: fine)")
    const meter = host.querySelector<HTMLElement>("[data-noise-meter]")
    const levelled = first.current.level !== undefined
    let cancelled = false, frame = 0
    const off: (() => void)[] = []

    ;(async () => {
      // Below the fold, the field waits until it's nearly in view: nothing to measure before then.
      await new Promise<void>((done) => {
        const io = new IntersectionObserver((seen) => { if (seen.some((e) => e.isIntersecting)) { io.disconnect(); done() } }, { rootMargin: "400px" })
        io.observe(host)
        off.push(() => io.disconnect())
      })
      if (cancelled) return
      let lib: typeof import("@chenglou/pretext")
      try { lib = await import("@chenglou/pretext") } catch { return } // the page stays silent, which is fine
      if (cancelled) return
      const { prepareWithSegments, layoutNextLine } = lib
      type Prepared = ReturnType<typeof prepareWithSegments>
      let prepared: Prepared | null = null
      let ramp: { font: string; prepared: Prepared }[] = []
      let material = first.current.words, top = first.current.peak
      let font = "", prepFor = "", size = 13, lh = 20, W = 0, H = 0, dpr = 1, ink = "#000", per = 1
      let boxes: Box[] = [], echoes: Echo[] = [], halo = 16, cx = 0, cy = 0 // where the silence starts
      // The pause: where it is, where it's going, and how open it is.
      let px = -999, py = -999, tx = -999, ty = -999, open = 0, want = 0, R = 90
      let phase: Phase = { kind: "hush", at: -1e9, from: REST, meterFrom: 0 }
      let flow = 0, lastNow = 0, shown = -1
      // The level it's asked for, and the level it shows, easing after it.
      let aim = first.current.level ?? 0, lv = aim
      const rtl = () => document.documentElement.dir === "rtl"
      const depth = () => Math.round(lv * ECHOES)

      function measure() {
        const b = canvas!.getBoundingClientRect()
        const next: Box[] = []
        host!.querySelectorAll<HTMLElement>("[data-noise-glyphs]").forEach((el) => glyphBoxes(el, b, ctx!, next))
        if (levelled) {
          echoes = []
          host!.querySelectorAll<HTMLElement>("[data-noise-echo]").forEach((el) => echoLines(el, b, ctx!, echoes))
          // The echoes stand in the silence too: every letter's box, again, where its deepest echo falls.
          const n = depth(), d = n * step(), dx = rtl() ? -d : d
          if (n) for (let i = next.length - 1; i >= 0; i--) { const g = next[i]; next.push({ x0: g.x0 + dx, x1: g.x1 + dx, y0: g.y0 + d, y1: g.y1 + d }) }
        }
        host!.querySelectorAll<HTMLElement>("[data-hush]").forEach((el) => {
          for (const r of el.getClientRects()) if (r.width) next.push({ x0: r.left - b.left, x1: r.right - b.left, y0: r.top - b.top, y1: r.bottom - b.top })
        })
        boxes = next
        const centre = (host!.querySelector("[data-noise-center]") ?? host!.querySelector("[data-noise-glyphs]"))?.getBoundingClientRect()
        if (centre) { cx = centre.left + centre.width * 0.35 - b.left; cy = centre.top + centre.height / 2 - b.top }
        const glyphs = host!.querySelector<HTMLElement>("[data-noise-glyphs]")
        halo = glyphs ? Math.max(9, Math.min(30, parseFloat(getComputedStyle(glyphs).fontSize) * 0.07)) : 12
      }
      /** How far apart the echoes stand: a sliver of the echoed type's size. */
      function step() {
        const el = host!.querySelector<HTMLElement>("[data-noise-echo]")
        return el ? parseFloat(getComputedStyle(el).fontSize) * 0.026 : 0
      }

      async function prepare() {
        const b = canvas!.getBoundingClientRect()
        W = b.width; H = b.height
        size = W >= 2400 ? 15 : W >= 900 ? 13 : 12
        lh = Math.round(size * 1.6)
        R = Math.max(64, Math.min(150, W * 0.07))
        ink = getComputedStyle(canvas!).color
        const voice = getComputedStyle(document.documentElement).getPropertyValue("--db-voice").trim() || "sans-serif"
        const next = `400 ${size}px ${voice}`
        if (next !== font || prepFor !== material) {
          font = next
          prepFor = material
          // Enough copies to fill a wall of rows, however short the material.
          const copies = Math.max(4, Math.ceil(6000 / Math.max(1, material.length)))
          const text = material.repeat(copies)
          if (levelled) {
            const fonts = RAMP.map((w) => `${w} ${size}px ${voice}`)
            await Promise.all(fonts.map((f) => document.fonts.load(f, material)))
            ramp = fonts.map((f) => ({ font: f, prepared: prepareWithSegments(text, f) }))
            // One cursor walks every weight, so they must break the material into the same segments.
            if (ramp.some((r) => r.prepared.segments.length !== ramp[0].prepared.segments.length)) ramp = ramp.slice(0, 1)
            prepared = ramp[0].prepared
            font = ramp[0].font
            prepFor = material
          } else {
            await document.fonts.load(font, material)
            prepared = prepareWithSegments(text, font)
          }
          per = Math.max(1, Math.round(prepared.segments.length / copies))
        }
        dpr = Math.min(2, devicePixelRatio || 1)
        if (W * H * dpr * dpr > 9e6) dpr = 1
        canvas!.width = Math.round(W * dpr)
        canvas!.height = Math.round(H * dpr)
        measure()
      }

      const clamp = (n: number) => Math.min(1, Math.max(0, n))
      const ease = (n: number) => 1 - (1 - n) ** 3
      /** How far the hush has come at a distance from the centre. */
      const hushed = (now: number, d: number) => phase.kind === "hush" ? ease(clamp((now - phase.at - d * SPREAD) / HUSH)) : 0
      /** A levelled field's heat at a distance from the centre: loudest by the words, falling away from them. */
      const heat = (d: number) => lv * (0.3 + 0.7 * clamp(1 - d / Math.max(1, Math.hypot(W, H) * 0.42)))
      /** How loud the noise is at a distance from the centre: the alpha of its ink. */
      function level(now: number, d: number) {
        if (levelled) return REST + (LOUD + 0.15 - REST) * heat(d)
        if (still.matches) return REST
        if (phase.kind === "swell") { const s = clamp((now - phase.at) / SWELL); return phase.from + (LOUD - phase.from) * s * s }
        return phase.from - (phase.from - REST) * hushed(now, d)
      }
      /** The meter, 0 to 1: the loudness at the centre. */
      function reading(now: number) {
        if (levelled) return lv
        if (still.matches) return 0
        if (phase.kind === "swell") return phase.meterFrom + (1 - phase.meterFrom) * clamp((now - phase.at) / SWELL)
        return phase.meterFrom * (1 - hushed(now, 0))
      }
      const settle = () => phase.kind === "swell" ? SWELL + 1800 : HUSH + Math.hypot(W, H) * SPREAD
      const busy = (now: number) => {
        if (still.matches) return false
        if (levelled) return Math.abs(aim - lv) > 0.002 || lv > 0.01
        return now - phase.at < settle() + 50
      }

      function to(kind: Phase["kind"], now = performance.now()) {
        const d = Math.hypot(W, H) / 2
        phase = { kind, at: now, from: level(now, kind === "swell" ? d : 0), meterFrom: reading(now) }
        run()
      }

      function draw(now: number) {
        if (!prepared) return
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx!.clearRect(0, 0, W, H)
        ctx!.fillStyle = ink
        ctx!.strokeStyle = ink
        ctx!.textBaseline = "alphabetic"
        // Every run is placed by its left edge, whichever way the page reads.
        ctx!.direction = "ltr"
        ctx!.textAlign = "left"
        const m = reading(now)
        // The echoes: the words again, hollow, a step further back each, fainter as they go.
        const n = levelled ? depth() : 0
        if (n && echoes.length) {
          const d = step(), dx = rtl() ? -d : d
          ctx!.lineWidth = 1
          for (let k = n; k >= 1; k--) {
            ctx!.globalAlpha = 0.55 * (1 - (k - 1) / (n + 1))
            for (const e of echoes) {
              ctx!.font = e.font
              ctx!.letterSpacing = `${e.spacing}px`
              ctx!.strokeText(e.text, e.x + dx * k, e.y + d * k)
            }
          }
          ctx!.letterSpacing = "0px"
        }
        ctx!.font = font
        let current = font
        // The silence around the words opens as the noise quiets, and closes in as it swells.
        const pad = 3 + (halo - 3) * (1 - m)
        const MIN = size * 6.5
        const r = R * open
        // Louder is denser: the rows close up as the level rises.
        const row = levelled ? Math.round(size * (2.3 - 0.95 * lv)) : lh
        // Streaming: the rows begin further into the material as the noise runs, a word at a time.
        const dt = lastNow ? Math.min(64, now - lastNow) : 0
        lastNow = now
        const running = levelled ? lv : phase.kind === "hush" ? m : m * clamp(1 - (now - phase.at - SWELL) / 1800)
        if (!still.matches) flow += (dt / 1000) * STREAM * running
        let s = Math.floor(flow) % per
        while (s < prepared.segments.length - 1 && !prepared.segments[s].trim()) s++
        let cursor: Cursor = { segmentIndex: s, graphemeIndex: 0 }
        const fadeFrom = H * 0.62
        for (let y = 0; y + row <= H; y += row) {
          // What the row can't cross: every box within the silence, and the pause's chord.
          const cuts: [number, number][] = []
          for (const b of boxes) if (b.y1 + pad > y && b.y0 - pad < y + row) cuts.push([b.x0 - pad, b.x1 + pad])
          if (r > 1) {
            const dy = py < y ? y - py : py > y + row ? py - y - row : 0
            if (dy < r) { const hw = Math.sqrt(r * r - dy * dy); cuts.push([px - hw, px + hw]) }
          }
          cuts.sort((a, b) => a[0] - b[0])
          const fade = y + row > fadeFrom ? Math.max(0, 1 - (y + row - fadeFrom) / (H - fadeFrom)) : 1
          if (fade <= 0) break
          let x = 0
          const runs: [number, number][] = []
          for (const [a, b] of cuts) { if (a > x) runs.push([x, a]); x = Math.max(x, b) }
          if (x < W) runs.push([x, W])
          for (const [a, b] of runs) {
            const w = b - a
            if (w < MIN) continue
            const d = Math.hypot(a + w / 2 - cx, y - cy)
            // The weight ramp: each run is measured in its own weight, so heavier runs carry fewer words.
            let set = prepared
            if (ramp.length > 1) {
              const pick = ramp[Math.min(ramp.length - 1, Math.floor(heat(d) * ramp.length * 1.15))]
              set = pick.prepared
              if (pick.font !== current) { current = pick.font; ctx!.font = current }
            }
            let line = layoutNextLine(set, cursor, w)
            if (!line) { cursor = { segmentIndex: 0, graphemeIndex: 0 }; line = layoutNextLine(set, cursor, w); if (!line) continue }
            cursor = line.end
            const text = line.text.trimEnd()
            const gaps = (text.match(/ /g) ?? []).length
            // Spread the run to its edges so the silence has a clean outline, not a ragged one.
            const spare = w - line.width
            ctx!.wordSpacing = gaps && spare > 0 && spare / gaps < size * 1.2 ? `${spare / gaps}px` : "0px"
            ctx!.globalAlpha = level(now, d) * fade
            ctx!.fillText(text, a, y + row * 0.72)
          }
        }
        ctx!.globalAlpha = 1
        ctx!.wordSpacing = "0px"
        if (meter) {
          const n = Math.round(top * m)
          if (n !== shown) { shown = n; meter.textContent = n + (meter.dataset.noiseMeter ?? "") }
        }
      }

      function tick(now: number) {
        frame = 0
        if (levelled) lv = still.matches ? aim : lv + (aim - lv) * 0.2
        const moving = busy(now)
        if (moving || levelled) measure() // the type beside it may still be breathing: its letters are widening
        open += (want - open) * 0.12
        px += (tx - px) * 0.14
        py += (ty - py) * 0.14
        const pausing = Math.abs(want - open) > 0.005 || Math.abs(tx - px) > 0.4 || Math.abs(ty - py) > 0.4
        if (!pausing) open = want
        draw(now)
        if (moving || pausing) frame = requestAnimationFrame(tick)
        else lastNow = 0
      }
      function run() { if (!frame) frame = requestAnimationFrame(tick) }

      await prepare()
      if (cancelled) return
      canvas!.dataset.live = ""
      const now = performance.now()
      if (levelled) run()
      else if (first.current.quiet === false) to("swell", now)
      else if (first.current.quiet === undefined && !still.matches) {
        phase = { kind: "swell", at: now, from: 0, meterFrom: 0 }
        run()
        const t = window.setTimeout(() => to("hush"), SWELL)
        off.push(() => clearTimeout(t))
      } else draw(now)

      api.current = {
        to: (q) => to(q ? "hush" : "swell"),
        words: async (w) => { material = w; await prepare(); if (!cancelled) { draw(performance.now()); run() } },
        peak: (n) => { top = n; draw(performance.now()) },
        level: (n) => { aim = n; run() },
      }
      api.current.level(latest.current ?? aim) // it may have moved while pretext loaded

      const move = (e: PointerEvent) => {
        if (!fine.matches || still.matches || e.pointerType !== "mouse") return
        const b = canvas!.getBoundingClientRect()
        tx = e.clientX - b.left; ty = e.clientY - b.top
        if (want === 0) { px = tx; py = ty }
        want = 1
        run()
      }
      const leave = () => { want = 0; run() }
      host!.addEventListener("pointermove", move)
      host!.addEventListener("pointerleave", leave)
      off.push(() => { host!.removeEventListener("pointermove", move); host!.removeEventListener("pointerleave", leave) })

      const relayout = async () => { await prepare(); if (!cancelled) { draw(performance.now()); run() } }
      let lastW = 0, lastH = 0
      const ro = new ResizeObserver(() => {
        const b = canvas!.getBoundingClientRect()
        if (Math.abs(b.width - lastW) < 1 && Math.abs(b.height - lastH) < 1) return
        lastW = b.width; lastH = b.height
        relayout()
      })
      ro.observe(host!)
      off.push(() => ro.disconnect())
      // A new pair changes the face; a new scheme or mode changes the ink.
      const mo = new MutationObserver(() => relayout())
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-pair", "data-scheme", "data-mode", "data-key"] })
      off.push(() => mo.disconnect())
    })()

    return () => {
      cancelled = true
      api.current = null
      cancelAnimationFrame(frame)
      off.forEach((f) => f())
    }
  }, [])

  React.useEffect(() => { latest.current = level; if (level !== undefined) api.current?.level(level) }, [level])
  React.useEffect(() => { if (!auto && quiet !== undefined) api.current?.to(quiet) }, [auto, quiet])
  React.useEffect(() => { api.current?.words(words) }, [words])
  React.useEffect(() => { api.current?.peak(peak) }, [peak])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
