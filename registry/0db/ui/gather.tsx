"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type GatherProps = Omit<React.ComponentProps<"p">, "children"> & {
  /** The line, as plain text: pretext measures where each letter belongs. */
  children: string
  /** The element. Pass a dynamic class (`db-f`, `db-mf`…) for the size. */
  as?: "h2" | "h3" | "p"
}

/** The same letter always starts in the same place: a small hash of its index. */
const rand = (i: number, salt: number) => {
  const s = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return s - Math.floor(s)
}

/**
 * A line whose letters start as dust and settle into place. Pretext lays the line out and measures
 * every letter's x, so the settled state is the real layout to the pixel; then the letters give way
 * to the real text, which is what you select and copy. The text stays in the DOM the whole time, so a
 * reader of the page always gets it. Nothing runs without script, or under reduced motion: it's just
 * the line.
 */
function Gather({ children: text, as = "p", className, ...props }: GatherProps) {
  const Tag = as as "p"
  const ref = React.useRef<HTMLParagraphElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return // renders settled
    let cancelled = false
    const off: (() => void)[] = []
    // Whatever runs, letting go restores the plain line.
    const finish = () => off.splice(0).forEach((f) => f())

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
      const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" })

      let width = 0
      async function lay() {
        const style = getComputedStyle(el!)
        const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        await document.fonts.load(font, text)
        const W = el!.clientWidth
        if (cancelled || !W || !el!.dataset.phase) return // gone, hidden, or already arrived
        width = W
        const size = parseFloat(style.fontSize)
        const lh = parseFloat(style.lineHeight) || size * 1.2
        const letterSpacing = parseFloat(style.letterSpacing) || 0 // "normal" is 0
        const measure = (s: string) => lib.measureNaturalWidth(lib.prepareWithSegments(s, font, { letterSpacing }))
        const prepared = lib.prepareWithSegments(text, font, { letterSpacing })
        const align = style.textAlign

        const glyphs: HTMLSpanElement[] = []
        let cursor = { segmentIndex: 0, graphemeIndex: 0 }
        for (let row = 0; row < 200; row++) {
          const line = lib.layoutNextLine(prepared, cursor, W)
          if (!line) break
          cursor = line.end
          const words = line.text.trimEnd()
          const inset = align === "center" ? (W - measure(words)) / 2 : align === "right" || align === "end" ? W - measure(words) : 0
          let before = ""
          for (const { segment: g } of graphemes.segment(words)) {
            if (g.trim()) {
              // x is what comes before this letter, kerning included: the width up to and with it, less its own.
              const x = inset + measure(before + g) - measure(g)
              const n = glyphs.length
              const glyph = document.createElement("span")
              glyph.textContent = g
              glyph.style.cssText = `left:${x}px;top:${row * lh}px;--n:${n};--dx:${Math.max(-x, Math.min((rand(n, 1) * 2 - 1) * 1.2 * size, W - x - size / 2))}px;--dy:${(rand(n, 2) * 2 - 1) * 0.8 * size}px`
              glyphs.push(glyph)
            }
            before += g
          }
        }
        layer.replaceChildren(...glyphs)
        if (el!.dataset.phase === "wait") el!.dataset.phase = "dust"
        else if (el!.dataset.phase === "gather") finish() // laid out again mid-flight: just arrive
      }

      await lay()
      if (cancelled || !el.dataset.phase) return

      // The last letter to arrive gives the real text back.
      const arrived = (e: TransitionEvent) => {
        if (e.target === layer.lastElementChild && e.propertyName === "opacity") finish()
      }
      layer.addEventListener("transitionend", arrived)

      const settle = () => {
        if (el.dataset.phase !== "dust") return
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

      const resized = new ResizeObserver(() => el.clientWidth !== width && lay())
      resized.observe(el)
      // A change of pair or scheme on <html> can change the face: measure again.
      const restyled = new MutationObserver(() => lay())
      restyled.observe(document.documentElement, { attributes: true })
      off.push(() => {
        resized.disconnect()
        restyled.disconnect()
      })
    })()

    return () => {
      cancelled = true
      finish()
    }
  }, [text])

  return (
    <Tag ref={ref} data-slot="gather" className={cn("db-gather", className)} {...props}>
      <span className="db-gather-text">{text}</span>
    </Tag>
  )
}

export { Gather, type GatherProps }
