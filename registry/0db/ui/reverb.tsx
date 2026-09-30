"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { cn } from "@/registry/0db/lib/utils"

/** The <html> switches that change the face; smooth scrolling toggles a class there on every scroll, which must not re-lay the text. */
const FACE = ["data-pair", "data-scheme", "data-mode", "data-key"]

/** How much further the echoes drift when pointed at. */
const BREATH = 1.2

/** The dynamics, loudest first: each echo steps one down, and stays at pp. */
const DYNAMICS = ["ffff", "fff", "ff", "f", "mf", "mp", "p", "pp"] as const
type Dynamic = (typeof DYNAMICS)[number]

type ReverbProps = Omit<React.ComponentProps<"p">, "children"> & {
  /** The phrase, as plain text. It's read once; the echoes are for the eye. */
  children: string
  /** How many times it comes back. */
  echoes?: number
  /** The dynamic the phrase is set in. */
  from?: Dynamic
  /** canon: each echo drifts on by a word. antiphon: the echoes answer from either wall in turn. vowels: the consonants go first. */
  variant?: "canon" | "antiphon" | "vowels"
}

const VOWEL = /^[aeiouyàáâãäåæèéêëìíîïòóôõöøùúûüýÿœ]/i

/**
 * For the vowels: the letters of the phrase, and the echo each one is lost in. In a live room the
 * reverberation masks the short consonants first and the long vowels ring on, so the consonants
 * (and the punctuation) go first, in a fixed order hashed from their place, then the vowels. By the
 * last echo about a tenth is left. Spaces are never lost, so every echo keeps the phrase's layout.
 */
function fading(text: string, n: number) {
  const seg = typeof Intl !== "undefined" && "Segmenter" in Intl ? [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)].map((s) => s.segment) : Array.from(text)
  const letters = seg.map((g, i) => ({ g, i })).filter(({ g }) => /\S/.test(g))
  const hash = (i: number) => (((i + 1) * 2654435761) >>> 0) / 4294967296
  const order = [...letters].sort((a, b) => Number(VOWEL.test(a.g)) + hash(a.i) - (Number(VOWEL.test(b.g)) + hash(b.i)))
  const lost = new Array<number>(seg.length).fill(Infinity)
  order.forEach(({ i }, j) => {
    // letter j of the order is lost in the first echo k where round(L k / (n + 0.5)) passes it
    for (let k = 1; k <= n; k++) if (j < Math.round((letters.length * k) / (n + 0.5))) { lost[i] = k; break }
  })
  return seg.map((g, i) => ({ g, lost: lost[i] }))
}

/**
 * A phrase that echoes into silence. Each line repeats it quieter: the colour goes from ink through
 * graphite to pencil and then fades, the letters open, the size steps down a dynamic. Each echo is
 * shifted right by the width of the last one's first word, which pretext measures, so they drift
 * like a canon. It ends on a rest. Before pretext has measured, the echoes simply stack.
 * The antiphon sends the echoes back from either wall in turn, as the two choirs of San Marco
 * answered each other across the church; the vowels keep every echo under the phrase, letter for
 * letter, and lose the consonants first.
 */
function Reverb({ children: text, echoes = 5, from = "mf", variant = "canon", className, ref: forwardedRef, ...props }: ReverbProps) {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
  const n = Math.max(1, Math.round(echoes))
  const first = DYNAMICS.indexOf(from)
  // 0 is the phrase itself; 1…n are the echoes.
  const line = (k: number) => {
    // The vowels keep the phrase's own size and spacing, so every echo lies letter for letter under it.
    const d = DYNAMICS[variant === "vowels" ? first : Math.min(first + k, DYNAMICS.length - 1)]
    return {
      "--size": `var(--db-${d})`,
      "--lh": `var(--db-${d}-lh)`,
      "--tr": `var(--db-${d}-tr)`,
      "--open": variant === "vowels" ? 0 : k * 0.02, // the letters open a little more each time, in em
      "--k": k,
      "--o": k <= 2 ? 1 : 1 - (0.7 * (k - 2)) / Math.max(1, n - 2), // ink, graphite, pencil, then it fades
    } as React.CSSProperties
  }

  const letters = React.useMemo(() => (variant === "vowels" ? fading(text, n) : null), [variant, text, n])

  React.useEffect(() => {
    const el = ref.current
    // Only the canon drifts; the antiphon keeps to its walls, the vowels to the phrase's columns.
    if (!el || variant !== "canon") return
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
      restyled.observe(document.documentElement, { attributeFilter: FACE })
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
  }, [text, n, from, variant])

  return (
    <p ref={composedRef} data-slot="reverb" data-variant={variant} className={cn("db-reverb", className)} {...props}>
      <span className="db-reverb-line" style={line(0)}>
        {text}
      </span>
      <span aria-hidden="true" className="db-reverb-echoes">
        {Array.from({ length: n }, (_, i) => i + 1).map((k) => (
          <span key={k} className="db-reverb-line db-reverb-echo" data-tone={k === 1 ? "graphite" : "pencil"} data-side={variant === "antiphon" ? (k % 2 ? "end" : "start") : undefined} style={line(k)}>
            {letters ? letters.map(({ g, lost }, i) => (lost <= k ? <span key={i} className="db-reverb-lost">{g}</span> : g)) : text}
          </span>
        ))}
        <i className="db-reverb-rest" data-side={variant === "antiphon" ? ((n + 1) % 2 ? "end" : "start") : undefined} style={line(n + 1)} />
      </span>
    </p>
  )
}

export { Reverb, type ReverbProps, type Dynamic }
