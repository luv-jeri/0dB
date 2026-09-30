"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type Mode = "day" | "nocturne"

const WORDS = { day: "Day", nocturne: "Nocturne" }

/** One composing line. Native text reserves the longer measure even before pretext arrives. */
function TypesetMode() {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const root = ref.current
    if (!root) return
    let cancelled = false
    let revision = 0
    let signature = ""
    const off: (() => void)[] = []

    ;(async () => {
      let lib: typeof import("@chenglou/pretext")
      try { lib = await import("@chenglou/pretext") } catch { return }
      if (cancelled) return
      const plain = root.querySelector<HTMLElement>(".db-mode-typeset-plain")!
      const pencil = root.querySelector<HTMLElement>(".db-mode-typeset-pencil")!
      const layer = root.querySelector<HTMLElement>(".db-mode-typeset-letters")!
      async function lay() {
        const version = ++revision
        const styles = [plain, pencil].map((el) => getComputedStyle(el))
        const fonts = styles.map((s) => `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`)
        const tracking = parseFloat(styles[0].letterSpacing) || 0
        const next = fonts.join("|") + tracking
        if (next === signature) return
        try { await Promise.all(fonts.map((font) => document.fonts.load(font, "Day Nocturne"))) } catch { return }
        if (cancelled || version !== revision) return
        const measure = (s: string) => lib.measureNaturalWidth(lib.prepareWithSegments(s, fonts[0]))
        const lines = Object.fromEntries(Object.entries(WORDS).map(([mode, word]) => {
          const width = measure(word) + (word.length - 1) * tracking
          const letters = Array.from(word, (letter, i) => {
            const w = measure(letter)
            const x = measure(word.slice(0, i + 1)) - w + i * tracking
            return { letter, x, rtl: width - x - w, i, order: word.length - i - 1 }
          })
          return [mode, letters]
        })) as Record<Mode, { letter: string; x: number; rtl: number; i: number; order: number }[]>
        const used = new Set<number>()
        const glyphs: HTMLElement[] = []
        function glyph(day: typeof lines.day[number] | undefined, night: typeof lines.nocturne[number] | undefined) {
          const el = document.createElement("span")
          el.dataset.in = day && night ? "both" : day ? "day" : "nocturne"
          const ink = document.createElement("span")
          ink.textContent = (day ?? night)!.letter
          el.append(ink)
          for (const mode of ["day", "nocturne"] as const) {
            const at = (mode === "day" ? day : night) ?? (day ?? night)!
            el.style.setProperty(`--db-mode-${mode}-x`, `${at.x}px`)
            el.style.setProperty(`--db-mode-${mode}-rtl`, `${at.rtl}px`)
            el.style.setProperty(`--db-mode-${mode}-order`, String(at.i))
            el.style.setProperty(`--db-mode-${mode}-reverse`, String(at.order))
            if (!(mode === "day" ? day : night)) continue
            const other = lines[mode === "day" ? "nocturne" : "day"]
            // Preview just two sorts from the reading edge; English spelling stays intact in RTL.
            for (const direction of ["ltr", "rtl"] as const) {
              const order = direction === "ltr" ? at.i : at.order
              if (order > 1) continue
              const to = other[direction === "ltr" ? order : other.length - order - 1]
              const preview = document.createElement("i")
              preview.dataset.mode = mode
              preview.dataset.direction = direction
              preview.textContent = to.letter
              const distance = direction === "ltr" ? to.x - at.x : at.rtl - to.rtl
              preview.style.setProperty("--db-mode-preview-x", `${distance * 0.18}px`)
              el.append(preview)
            }
          }
          glyphs.push(el)
        }
        // Keep a shared glyph in the stick and glide it between its measured places.
        // These particular names have no shared glyphs, so all of them fade in place.
        lines.day.forEach((day) => {
          const match = lines.nocturne.findIndex((night, i) => !used.has(i) && night.letter === day.letter)
          if (match >= 0) used.add(match)
          glyph(day, lines.nocturne[match])
        })
        lines.nocturne.forEach((night, i) => { if (!used.has(i)) glyph(undefined, night) })
        layer.replaceChildren(...glyphs)
        signature = next
        root!.dataset.laid = ""
      }
      await lay()
      if (cancelled) return
      const resized = new ResizeObserver(() => { void lay() })
      resized.observe(root)
      const restyled = new MutationObserver(() => { void lay() })
      restyled.observe(document.documentElement, { attributeFilter: ["data-pair", "data-scheme", "data-mode", "data-key"] })
      off.push(() => resized.disconnect(), () => restyled.disconnect())
    })()

    return () => {
      cancelled = true
      off.forEach((f) => f())
      delete root.dataset.laid
    }
  }, [])

  return (
    <span ref={ref} className="db-mode-typeset">
      <span className="db-mode-typeset-measure">Nocturne</span>
      <span className="db-mode-typeset-plain" data-word="day">Day</span>
      <span className="db-mode-typeset-plain" data-word="nocturne">Nocturne</span>
      <i className="db-mode-typeset-pencil">Nocturne</i>
      <span className="db-mode-typeset-letters" />
    </span>
  )
}

type ModeToggleProps = Omit<React.ComponentProps<"button">, "children" | "onChange"> & {
  /**
   * Eight ways to draw the same choice. eclipse: a disc slides over a ring; horizon: the dot rises or sets; words: the chosen word,
   * drawn like a select, rolls to the other; fermata: the arc is an eyelid; sentence: "Read by light." and "Read by night.";
   * knockout: "midday" and "midnight", the second half reversed out of the ink as night falls; hour: 12:00 and 00:00, the hour
   * turning forward whichever way you go; typeset: one word resets into the other, letter by measured letter.
   */
  variant?: "eclipse" | "horizon" | "words" | "fermata" | "sentence" | "knockout" | "hour" | "typeset"
  /** The mode, when you hold it (controlled). */
  mode?: Mode
  /** The mode to start in, when the toggle holds it. */
  defaultMode?: Mode
  /** Called with the mode the person chose, and the click that chose it. The toggle applies nothing to the page. */
  onModeChange?: (mode: Mode, event: React.MouseEvent<HTMLButtonElement>) => void
  /** Pins a state for documentation ("hover", "focus"); set on the root. */
  "data-force"?: string
}

/**
 * The day and night toggle. One button, pressed when it is night, drawn eight ways: a disc sliding
 * across a ring, a dot above or below a hairline, a word on a hairline that rolls to the other, the fermata
 * as an eye, a sentence whose last word rolls, midday turning to midnight in an ink block, or a clock
 * turning from noon to midnight, or one word being reset by a compositor. It only reports the choice; the page applies it,
 * for instance `document.documentElement.dataset.mode = mode`.
 */
function ModeToggle({ variant = "eclipse", mode, defaultMode = "day", onModeChange, onClick, onPointerMove, onFocus, className, "data-force": force, "aria-label": label, ...props }: ModeToggleProps) {
  const [own, setOwn] = React.useState<Mode>(defaultMode)
  const now = mode ?? own
  const [preview, setPreview] = React.useState(true)
  // The hour only turns once the mode has changed, so nothing rolls on first paint.
  const [start] = React.useState(now)
  const [turned, setTurned] = React.useState(false)
  if (!turned && now !== start) setTurned(true)
  return (
    <button
      type="button"
      data-slot="mode-toggle"
      data-variant={variant}
      data-force={force}
      data-turned={variant === "hour" && turned ? "" : undefined}
      role={variant === "typeset" ? "switch" : undefined}
      aria-checked={variant === "typeset" ? now === "nocturne" : undefined}
      aria-pressed={variant === "typeset" ? undefined : now === "nocturne"}
      aria-label={label ?? "Night mode"}
      data-preview={variant === "typeset" && preview ? "" : undefined}
      onPointerMove={(e) => { if (!preview) setPreview(true); onPointerMove?.(e) }}
      onFocus={(e) => { setPreview(true); onFocus?.(e) }}
      className={cn("db-mode", className)}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        if (variant === "typeset") setPreview(false)
        const next: Mode = now === "nocturne" ? "day" : "nocturne"
        if (mode === undefined) setOwn(next)
        onModeChange?.(next, e)
      }}
      {...props}
    >
      <span className="db-mode-art" aria-hidden="true">
        {variant === "typeset" ? <TypesetMode /> : variant === "words" ? (
          <span className="db-mode-roll">
            <span>day</span>
            <span>night</span>
          </span>
        ) : variant === "sentence" ? (
          <>
            Read by{" "}
            <span className="db-mode-state">
              <span>light</span>
              <span>night</span>
            </span>
            <span className="db-mode-stop" />
          </>
        ) : variant === "knockout" ? (
          <>
            <span className="db-mode-mid">mid</span>
            <span className="db-mode-block">
              <span>day</span>
              <span>night</span>
            </span>
          </>
        ) : variant === "hour" ? (
          <span className="db-mode-hour">
            <span className="db-mode-digit"><span>1</span><span>0</span></span>
            <span className="db-mode-digit"><span>2</span><span>0</span></span>
            <span className="db-mode-min">:00</span>
          </span>
        ) : null}
      </span>
    </button>
  )
}

export { ModeToggle, type ModeToggleProps, type Mode }
