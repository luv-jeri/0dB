"use client"

import * as React from "react"
import { cn } from "@/registry/0db/lib/utils"
import { useComposedRefs } from "@/registry/0db/lib/refs"

type HalftoneProps = React.ComponentProps<"div"> & {
  src: string
  alt: string
  word?: string
  cols?: number
  resolve?: "scroll" | "load" | "none"
}
type Glyph = { char: string; weight: number; italic: boolean; width: number; density: number }
type Grid = { src: string; rows: (Glyph | null)[][]; size: number; cell: number }
const FACE = ["data-pair", "data-scheme", "data-mode", "data-key"]
const clamp = (n: number) => Math.max(0, Math.min(1, n))

/** Evidence arriving: the project's own letters give way to its real image. */
function Halftone({ src, alt, word, cols = 64, resolve = "scroll", className, ref: forwardedRef, ...props }: HalftoneProps) {
  const root = React.useRef<HTMLDivElement>(null)
  const ref = useComposedRefs(root, forwardedRef)
  const picture = React.useRef<HTMLImageElement>(null)
  const [grid, setGrid] = React.useState<Grid | null>(null)
  const current = grid?.src === src ? grid : null

  React.useEffect(() => {
    const el = root.current
    const img = picture.current
    if (!el || !img) return
    let cancelled = false
    let revision = 0
    let width = 0
    let frame = 0
    let started = 0
    const motion = matchMedia("(prefers-reduced-motion: reduce)")
    const colours = matchMedia("(forced-colors: active)")
    const off: (() => void)[] = []
    const progress = (value: number) => el.style.setProperty("--db-halftone-progress", String(clamp(value)))
    const scroll = () => progress((innerHeight * 0.9 - el.getBoundingClientRect().top) / (innerHeight * 0.65))
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => { frame = 0; scroll() })
    }
    const direct = () => {
      if (motion.matches || colours.matches) {
        cancelAnimationFrame(frame)
        frame = 0
        progress(1)
        setGrid(null)
      } else void lay()
    }
    async function lay() {
      const ticket = ++revision
      if (cancelled || !el || !img || !img.naturalWidth || motion.matches || colours.matches) return
      width = el.clientWidth
      if (!width) return
      try {
        const { prepareWithSegments } = await import("@chenglou/pretext")
        const style = getComputedStyle(el)
        const voice = style.getPropertyValue("--db-voice").trim()
        const expression = style.getPropertyValue("--db-expression").trim()
        const count = Math.max(8, Math.min(120, Math.round(Number.isFinite(cols) ? cols : 64)))
        const cell = width / count
        const size = cell * 1.6
        const rows = Math.max(1, Math.min(160, Math.round(count * img.naturalHeight / img.naturalWidth / 1.5)))
        const alphabet = Array.from(new Set(Array.from(word?.replace(/\s/g, "") || ".,:;iloxOWM@"))).slice(0, 64)
        const faces = [400, 500, 600, 700, 800].map((weight) => ({ weight, italic: false, font: `normal ${weight} ${size}px ${voice}` }))
        faces.push({ weight: 400, italic: true, font: `italic 400 ${size}px ${expression}` })
        await Promise.all(faces.map(({ font }) => document.fonts.load(font, alphabet.join(""))))
        // A separate CORS-enabled image keeps the real <img> readable even when sampling is denied.
        const source = new Image()
        source.crossOrigin = "anonymous"
        source.src = src
        await source.decode()
        if (cancelled || ticket !== revision || motion.matches || colours.matches) return
        const canvas = document.createElement("canvas")
        canvas.width = count
        canvas.height = rows
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        if (!ctx) return
        ctx.drawImage(source, 0, 0, count, rows)
        const pixels = ctx.getImageData(0, 0, count, rows).data
        const sample = document.createElement("canvas")
        sample.width = sample.height = Math.ceil(size * 3)
        const ink = sample.getContext("2d", { willReadFrequently: true })
        if (!ink) return
        const palette: Glyph[] = []
        for (const face of faces) {
          for (const char of alphabet) {
            const prepared = prepareWithSegments(char, face.font)
            const measured = prepared.widths.reduce((sum, value) => sum + value, 0)
            if (measured <= 0) continue
            ink.clearRect(0, 0, sample.width, sample.height)
            ink.font = face.font
            ink.textBaseline = "top"
            ink.fillText(char, size / 2, size / 2)
            const rgba = ink.getImageData(0, 0, sample.width, sample.height).data
            let density = 0
            for (let i = 3; i < rgba.length; i += 4) density += rgba[i] / 255
            palette.push({ char, weight: face.weight, italic: face.italic, width: measured, density })
          }
        }
        if (!palette.length) return
        const maximum = Math.max(...palette.map((glyph) => glyph.density)) || 1
        palette.forEach((glyph) => { glyph.density /= maximum })
        // Brightness and width both choose the glyph. Its measured advance centres it in the grid.
        const lookup = Array.from({ length: 256 }, (_, level) => {
          if (level < 10) return null
          return palette.reduce((best, glyph) => {
            const cost = (g: Glyph) => Math.abs(g.density - level / 255) * 3 + Math.abs(g.width - cell) / cell
            return cost(glyph) < cost(best) ? glyph : best
          })
        })
        const output = Array.from({ length: rows }, (_, y) => Array.from({ length: count }, (_, x) => {
          const p = (y * count + x) * 4
          const light = (pixels[p] * 0.2126 + pixels[p + 1] * 0.7152 + pixels[p + 2] * 0.0722) / 255
          return lookup[Math.round((1 - light) * pixels[p + 3])]
        }))
        if (cancelled || ticket !== revision) return
        if (resolve === "scroll") scroll()
        else if (resolve === "none") progress(0)
        setGrid({ src, rows: output, size, cell })
        if (resolve === "load" && !started) {
          started = performance.now()
          const token = style.getPropertyValue("--db-adagio").trim()
          const duration = (parseFloat(token) || 1400) * (token.endsWith("ms") ? 1 : 1000)
          const tick = (now: number) => {
            const p = clamp((now - started) / duration)
            progress(p)
            frame = p < 1 ? requestAnimationFrame(tick) : 0
          }
          progress(0)
          frame = requestAnimationFrame(tick)
        }
      } catch {
        if (!cancelled && ticket === revision) setGrid(null)
      }
    }
    const resize = new ResizeObserver(() => { if (width !== el.clientWidth) void lay() })
    resize.observe(el)
    const theme = new MutationObserver(() => { void lay() })
    theme.observe(document.documentElement, { attributes: true, attributeFilter: FACE })
    img.addEventListener("load", lay)
    motion.addEventListener("change", direct)
    colours.addEventListener("change", direct)
    if (resolve === "scroll") {
      window.addEventListener("scroll", schedule, { passive: true })
      window.addEventListener("resize", schedule)
      off.push(() => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule) })
    }
    void lay()
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      resize.disconnect()
      theme.disconnect()
      img.removeEventListener("load", lay)
      motion.removeEventListener("change", direct)
      colours.removeEventListener("change", direct)
      off.forEach((f) => f())
    }
  }, [src, word, cols, resolve])

  return (
    <div {...props} ref={ref} data-slot="halftone" data-ready={current ? "true" : undefined} className={cn("db-halftone", className)}>
      {/* The artifact, including its alternative text, never leaves the DOM. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={picture} className="db-halftone-image" src={src} alt={alt} />
      {current && <div className="db-halftone-type" aria-hidden="true" style={{ fontSize: current.size }}>
        {current.rows.map((row, y) => <div className="db-halftone-row" key={y} style={{ "--db-halftone-row": y, "--db-halftone-rows": current.rows.length } as React.CSSProperties}>
          {row.map((glyph, x) => <span className="db-halftone-cell" key={x}>{glyph && <span data-expression={glyph.italic || undefined} data-pencil={glyph.density < 0.5 || undefined} style={{ fontWeight: glyph.weight, width: glyph.width, transform: `scaleX(${Math.min(1, current.cell / glyph.width)})` }}>{glyph.char}</span>}</span>)}
        </div>)}
      </div>}
    </div>
  )
}

export { Halftone, type HalftoneProps }
