"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

/** The dynamics, loudest first: each echo steps one down, and stays at pp. */
/** How much further the echoes drift when pointed at. */
const BREATH = 1.2

const DYNAMICS = ["ffff", "fff", "ff", "f", "mf", "mp", "p", "pp"] as const
type Dynamic = (typeof DYNAMICS)[number]

type ReverbProps = Omit<React.ComponentProps<"p">, "children"> & {
  /** The phrase, as plain text. It's read once; the echoes are for the eye. */
  children: string
  /** How many times it comes back. */
  echoes?: number
  /** The dynamic the phrase is set in. */
  from?: Dynamic
}

/**
 * A phrase that echoes into silence. Each line repeats it quieter: the colour goes from ink through
 * graphite to pencil and then fades, the letters open, the size steps down a dynamic. Each echo is
 * shifted right by the width of the last one's first word, which pretext measures, so they drift
 * like a canon. It ends on a rest. Before pretext has measured, the echoes simply stack.
 */
function Reverb({ children: text, echoes = 5, from = "mf", className, ...props }: ReverbProps) {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const n = Math.max(1, Math.round(echoes))
  const first = DYNAMICS.indexOf(from)
  // 0 is the phrase itself; 1…n are the echoes.
  const line = (k: number) => {
    const d = DYNAMICS[Math.min(first + k, DYNAMICS.length - 1)]
    return {
      "--size": `var(--db-${d})`,
      "--lh": `var(--db-${d}-lh)`,
      "--tr": `var(--db-${d}-tr)`,
      "--open": k * 0.02, // the letters open a little more each time, in em
      "--k": k,
      "--o": k <= 2 ? 1 : 1 - (0.7 * (k - 2)) / Math.max(1, n - 2), // ink, graphite, pencil, then it fades
    } as React.CSSProperties
  }

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false
    let frame = 0
    let width = 0
    const off: (() => void)[] = []

    ;(async () => {
      let lib: typeof import("@chenglou/pretext")
      try {
        lib = await import("@chenglou/pretext")
      } catch {
        return // the echoes stay stacked
      }
      const word = text.trim().split(/\s+/)[0]

      async function lay() {
        const lines = [...el!.querySelectorAll<HTMLElement>(".db-reverb-line")]
        const styles = lines.map((l) => getComputedStyle(l))
        const fonts = styles.map((s) => `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`)
        await document.fonts.load(fonts[0], text)
        if (cancelled) return
        // Each echo starts where the last one's first word ends, in its own type.
        const drift: number[] = [0]
        const room: number[] = [] // what each line leaves free of the container
        const W = el!.clientWidth
        width = W
        lines.forEach((_, k) => {
          const letterSpacing = parseFloat(styles[k].letterSpacing) || 0 // "normal" is 0
          const measure = (s: string) => lib.measureNaturalWidth(lib.prepareWithSegments(s, fonts[k], { letterSpacing }))
          room.push(W - Math.min(measure(text), W))
          drift.push(drift[k] + measure(word))
        })
        // If the canon would run out of the page, close it up so it fits, with room to breathe out.
        const fit = Math.max(0, Math.min(1, ...room.map((r, k) => (k ? r / (BREATH * drift[k]) : 1))))
        lines.forEach((l, k) => k && l.style.setProperty("--x", `${drift[k] * fit}px`))
        el!.querySelector<HTMLElement>(".db-reverb-rest")?.style.setProperty("--x", `${drift[lines.length] * fit}px`)
        // Only now may the shift ease, so that arriving isn't a move.
        if (!frame) frame = requestAnimationFrame(() => (el!.dataset.ready = ""))
      }

      await lay()
      if (cancelled) return
      // A change of pair or scheme on <html> can change the face: measure again.
      const restyled = new MutationObserver(() => lay())
      restyled.observe(document.documentElement, { attributes: true })
      const resized = new ResizeObserver(() => el.clientWidth !== width && lay())
      resized.observe(el)
      off.push(() => {
        restyled.disconnect()
        resized.disconnect()
      })
    })()

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      off.forEach((f) => f())
      delete el.dataset.ready
    }
  }, [text, n, from])

  return (
    <p ref={ref} data-slot="reverb" className={cn("db-reverb", className)} {...props}>
      <span className="db-reverb-line" style={line(0)}>
        {text}
      </span>
      <span aria-hidden="true" className="db-reverb-echoes">
        {Array.from({ length: n }, (_, i) => i + 1).map((k) => (
          <span key={k} className="db-reverb-line db-reverb-echo" data-tone={k === 1 ? "graphite" : "pencil"} style={line(k)}>
            {text}
          </span>
        ))}
        <i className="db-reverb-rest" style={line(n + 1)} />
      </span>
    </p>
  )
}

export { Reverb, type ReverbProps, type Dynamic }
