"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"

/** The attributes on <html> that can change the face. Not class: smooth scrolling toggles one on every scroll. */
const FACE = ["data-pair", "data-scheme", "data-mode", "data-key"]

type GatherProps = Omit<React.ComponentProps<"p">, "children"> & {
  /** The line, as plain text: pretext measures where each letter belongs. */
  children: string
  /** The element. Pass a dynamic class (`db-f`, `db-mf`…) for the size. */
  as?: "h2" | "h3" | "p"
  /** Where the letters start: dust scattered round their places, the forme (the line mirrored, as type stands before it is printed), or a coil (the line wound up at its start). */
  variant?: "dust" | "forme" | "coil"
  /** What travels as one piece: each letter, each word, or each line (a slug, as a Linotype casts it). */
  by?: "letter" | "word" | "line"
  /** Tie the settle to the scroll: the line gathers as it rises up the view, stops when the scroll stops, and scatters again when you scroll back. */
  scrub?: boolean
}

/** The same letter always starts in the same place: a small hash of its index. */
const rand = (i: number, salt: number) => {
  const s = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return s - Math.floor(s)
}

/**
 * A line whose letters start as dust (or mirrored, as the forme, or wound in a coil) and settle into place. Pretext lays the line out and measures
 * every letter's x, so the settled state is the real layout to the pixel; then the letters give way
 * to the real text, which is what you select and copy. The text stays in the DOM the whole time, so a
 * reader of the page always gets it. Nothing runs without script, or under reduced motion: it's just
 * the line.
 */
function Gather({ children: text, as = "p", variant = "dust", by = "letter", scrub = false, className, ref: forwardedRef, ...props }: GatherProps) {
  const Tag = as as "p"
  const ref = React.useRef<HTMLParagraphElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)

  React.useEffect(() => {
    const el = ref.current
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return // renders settled
    let cancelled = false
    const off: (() => void)[] = []
    // Whatever runs, letting go restores the plain line.
    const finish = () => {
      cancelled = true
      off.splice(0).forEach((f) => f())
    }

    // The real text steps aside (still there for readers) while the letters are measured.
    el.dataset.phase = "wait"
    const layer = document.createElement("span")
    layer.setAttribute("aria-hidden", "true")
    layer.className = "db-gather-glyphs"
    el.append(layer)
    off.push(() => {
      layer.remove()
      delete el.dataset.phase
    })

    ;(async () => {
      let lib: typeof import("@chenglou/pretext")
      try {
        lib = await import("@chenglou/pretext")
      } catch {
        return finish() // the plain line stays
      }
      if (cancelled) return
      const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" })

      let width = 0
      async function lay() {
        if (cancelled) return
        const style = getComputedStyle(el!)
        const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        try {
          await document.fonts.load(font, text)
        } catch {
          if (!cancelled) finish() // the plain line stays if the face cannot load
          return
        }
        if (cancelled) return
        const W = el!.clientWidth
        if (!W || (!scrub && !el!.dataset.phase)) return // hidden or already arrived (a scrub never arrives for good)
        width = W
        const size = parseFloat(style.fontSize)
        const lh = parseFloat(style.lineHeight) || size * 1.2
        const letterSpacing = parseFloat(style.letterSpacing) || 0 // "normal" is 0
        const measure = (s: string) => lib.measureNaturalWidth(lib.prepareWithSegments(s, font, { letterSpacing }))
        const prepared = lib.prepareWithSegments(text, font, { letterSpacing })
        const rtl = style.direction === "rtl"
        const align = style.textAlign === "start" ? (rtl ? "right" : "left") : style.textAlign === "end" ? (rtl ? "left" : "right") : style.textAlign

        const rows: { words: string; lw: number; inset: number }[] = []
        let cursor = { segmentIndex: 0, graphemeIndex: 0 }
        for (let row = 0; row < 200; row++) {
          const line = lib.layoutNextLine(prepared, cursor, W)
          if (!line) break
          cursor = line.end
          const words = line.text.trimEnd()
          const lw = measure(words)
          rows.push({ words, lw, inset: align === "center" ? (W - lw) / 2 : align === "right" ? W - lw : 0 })
        }

        // The coil: the whole text wound into one spiral beside the first row's start, its first letter on the
        // outermost turn, a little more than a letter's height between turns.
        const pitch = 1.15 * size, inner = size
        const R0 = Math.sqrt((rows.reduce((sum, r) => sum + r.lw + size / 3, 0) * pitch) / Math.PI + inner ** 2)
        const head = rows[0] ? (rtl ? rows[0].inset + rows[0].lw : rows[0].inset) : 0
        const cx = head + (rtl ? -R0 : R0), cy = (rows.length * lh) / 2
        let theta = 0, r = R0, u0 = 0, along = 0

        // The pieces of a row: its letters, its words (spaces between them), or the whole row.
        const pieces = (words: string) =>
          by === "line" ? [words] : by === "word" ? words.split(/(\s+)/) : Array.from(graphemes.segment(words), (s) => s.segment)
        const glyphs: HTMLSpanElement[] = []
        rows.forEach(({ words, lw, inset }, row) => {
          let before = ""
          for (const g of pieces(words)) {
            if (g.trim()) {
              // x is what comes before this piece, kerning included: the width up to and with it, less its own.
              const gw = measure(g)
              const x = inset + measure(before + g) - gw
              const n = glyphs.length
              let from: string
              if (variant === "forme") from = `--dx:${2 * inset + lw - 2 * x - gw}px;--dy:0px;--sx:-1` // the mirror of its place in the row
              else if (variant === "coil") {
                const u = along + (rtl ? inset + lw - x - gw / 2 : x - inset + gw / 2) // how far along the text, from its start
                theta += (u - u0) / r
                u0 = u
                r = Math.max(inner, R0 - (pitch * theta) / (2 * Math.PI))
                const px = cx + (rtl ? -1 : 1) * r * Math.sin(theta), py = cy + r * Math.cos(theta)
                from = `--dx:${px - x - gw / 2}px;--dy:${py - row * lh - lh / 2}px;--r:${(rtl ? 1 : -1) * theta}rad`
              } else from = `--dx:${Math.max(-x, Math.min((rand(n, 1) * 2 - 1) * 1.2 * size, W - x - (by === "letter" ? size / 2 : gw)))}px;--dy:${(rand(n, 2) * 2 - 1) * 0.8 * size}px`
              const glyph = document.createElement("span")
              glyph.textContent = g
              glyph.style.cssText = `left:${x}px;top:${row * lh}px;--n:${n};${from}`
              glyphs.push(glyph)
            }
            before += g
          }
          along += lw + size / 3
        })
        // In a scrub each piece's place in the order, 0 to 1, says when in the scroll it sets off.
        glyphs.forEach((glyph, n) => glyph.style.setProperty("--s", String(glyphs.length > 1 ? n / (glyphs.length - 1) : 0)))
        layer.replaceChildren(...glyphs)
        if (scrub) scrubbed()
        else if (el!.dataset.phase === "wait") el!.dataset.phase = "dust"
        else if (el!.dataset.phase === "gather") finish() // laid out again mid-flight: just arrive
      }

      // The scrub: how far the line has risen through the view, 0 as its top comes in at the foot, 1 once it is
      // two fifths down from the top (or as far as the page can scroll). Read from the real layout, so it follows
      // any smooth scroller that moves the page itself.
      let frame = 0
      function scrubbed() {
        if (cancelled) return
        const top = el!.getBoundingClientRect().top + scrollY, h = innerHeight
        const from = Math.max(0, top - h), to = Math.min(document.documentElement.scrollHeight - h, top - 0.4 * h)
        const p = to <= from ? 1 : Math.min(1, Math.max(0, (scrollY - from) / (to - from)))
        el!.style.setProperty("--p", String(p))
        if (p < 1) el!.dataset.phase = "scrub"
        else delete el!.dataset.phase // arrived: the real text, to select and copy, until you scroll back
      }
      // Asked for from the scroll event, the frame runs after a smooth scroller's own frame has moved the page, so the
      // letters and the page move in the same frame.
      const onScroll = () => {
        if (cancelled) return
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(scrubbed)
      }

      await lay()
      if (cancelled || (!scrub && !el.dataset.phase)) return

      const resized = new ResizeObserver(() => (el.clientWidth !== width ? lay() : scrub && onScroll()))
      resized.observe(el)
      // A change of pair or scheme on <html> can change the face: measure again.
      const restyled = new MutationObserver(() => lay())
      restyled.observe(document.documentElement, { attributeFilter: FACE })
      off.push(() => {
        resized.disconnect()
        restyled.disconnect()
      })

      if (scrub) {
        addEventListener("scroll", onScroll, { passive: true })
        addEventListener("resize", onScroll)
        off.push(() => {
          cancelAnimationFrame(frame)
          removeEventListener("scroll", onScroll)
          removeEventListener("resize", onScroll)
        })
        return
      }

      // The last letter to arrive gives the real text back.
      const arrived = (e: TransitionEvent) => {
        if (e.target === layer.lastElementChild) finish() // any of its properties: they share one duration
      }
      layer.addEventListener("transitionend", arrived)

      const settle = () => {
        if (cancelled || el.dataset.phase !== "dust") return
        void layer.offsetWidth // the dust has been drawn once, so it can travel
        el.dataset.phase = "gather"
      }
      const seen = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && settle(), { rootMargin: "0px 0px -12% 0px" })
      seen.observe(el)
      el.addEventListener("pointerenter", settle)
      off.push(() => {
        seen.disconnect()
        el.removeEventListener("pointerenter", settle)
        layer.removeEventListener("transitionend", arrived)
      })
    })()

    return () => {
      finish()
    }
  }, [text, variant, by, scrub])

  return (
    <Tag ref={composedRef} data-slot="gather" data-variant={variant === "dust" ? undefined : variant} data-by={by === "letter" ? undefined : by} className={cn("db-gather", className)} {...props}>
      <span className="db-gather-text">{text}</span>
    </Tag>
  )
}

export { Gather, type GatherProps }
