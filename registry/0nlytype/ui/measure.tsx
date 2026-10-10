"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"

/** The <html> switches that change the face; smooth scrolling toggles a class there on every scroll, which must not re-lay the text. */
const FACE = ["data-pair", "data-scheme", "data-mode", "data-key"]

type MeasureProps = Omit<React.ComponentProps<"div">, "children" | "defaultValue"> & {
  /** The paragraph. Plain text: pretext measures it. */
  children: string
  /** Characters a line, to begin with. */
  defaultMeasure?: number
  /** The shortest measure the handle allows, in characters. */
  min?: number
  /** The longest measure the handle allows, in characters. */
  max?: number
  /** track: the handle rides a hairline. alphabets: a ruler of lowercase alphabets, the measure read in alphabets. columns: the page takes as many columns of that measure as it holds. */
  variant?: "track" | "alphabets" | "columns"
}

/** Below this a line is too short to read in; above COMFORT_TO the eye loses the next line. */
const COMFORT_FROM = 45
const COMFORT_TO = 75

const verdict = (n: number) => (n < COMFORT_FROM ? "too short to read in" : n <= COMFORT_TO ? "comfortable" : "the eye loses the next line")

type Engine = { lay: (px: number) => string[]; ch: number; lh: number; room: number; width: number; em: number; abc: number[] }

const ALPHABET = "abcdefghijklmnopqrstuvwxyz"
const SAY = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

/** A length in lowercase alphabets, to the quarter: "2½ alphabets", "¾ of an alphabet". */
function inAlphabets(x: number) {
  const q = Math.round(x * 4)
  const [whole, part] = [Math.floor(q / 4), ["", "¼", "½", "¾"][q % 4]]
  if (!whole) return part ? `${part} of an alphabet` : "no alphabet"
  return `${whole}${part} alphabet${whole === 1 && !part ? "" : "s"}`
}

/**
 * A paragraph whose measure you set by dragging its right edge. The edge is a hairline with a ring
 * on a track above it, and the range where a line reads well is marked on that track in the accent.
 * Pretext lays the lines again whenever the width changes, so they follow the hand. The handle is a
 * slider (arrows step a character, Page steps ten), the measure is the italic, and the verdict is
 * pencil. The lines are aria-hidden; the text is there once for a reader.
 * `alphabets` makes the track a ruler of lowercase alphabets, as a type specimen gives a face's
 * alphabet length, and reads the measure in alphabets; `columns` sets as many columns of the
 * measure as the page holds, so narrowing the line brings another column in.
 */
function Measure({ children: text, defaultMeasure = 62, min = 20, max = 110, variant = "track", className, style, ...props }: MeasureProps) {
  const stage = React.useRef<HTMLDivElement>(null)
  const body = React.useRef<HTMLParagraphElement>(null)
  const [measure, setMeasure] = React.useState(defaultMeasure)
  const [engine, setEngine] = React.useState<Engine | null>(null)

  // The most characters the container can hold: the handle stops at the edge of the page.
  const room = engine ? Math.max(min, Math.min(max, engine.room)) : max
  const n = Math.min(Math.max(measure, min), room)
  const lines = React.useMemo(() => engine?.lay(n * engine.ch) ?? null, [engine, n])
  // columns: as many columns of this measure as the page holds, two ems apart, never more than there are lines.
  const gap = engine ? 2 * engine.em : 0
  const cols = variant === "columns" && engine && lines ? Math.max(1, Math.min(lines.length, Math.floor((engine.width + gap) / (n * engine.ch + gap)))) : 1
  // alphabets: how many lowercase alphabets the line is, and the ruler's letter the edge falls on.
  const px = engine ? n * engine.ch : 0
  const abcs = engine && engine.abc[26] ? px / engine.abc[26] : 0
  const edge = engine ? engine.abc.findIndex((w, i) => i > 0 && w > px) - 1 : -1
  const said = variant === "alphabets" ? `${inAlphabets(abcs)} a line` : `${n} characters a line`
  const judged = variant === "columns" && cols > 1 ? `${verdict(n)}, in ${SAY[cols] ?? cols} columns` : verdict(n)

  React.useEffect(() => {
    const el = body.current, box = stage.current
    if (!el || !box) return
    let cancelled = false
    const off: (() => void)[] = []

    ;(async () => {
      let lib: typeof import("@chenglou/pretext")
      try {
        lib = await import("@chenglou/pretext")
      } catch {
        return // the plain paragraph stays
      }
      let font = "", prepared: ReturnType<typeof lib.prepareWithSegments> | undefined, ch = 8

      async function measureFace() {
        if (cancelled || !el!.isConnected) return
        const style = getComputedStyle(el!)
        const next = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        if (next !== font || !prepared) {
          font = next
          await document.fonts.load(font, text)
          if (cancelled || !el!.isConnected) return
          prepared = lib.prepareWithSegments(text, font)
          // A character is the average one in this text, so "62 characters a line" is what the lines really hold.
          ch = lib.layoutNextLine(prepared, { segmentIndex: 0, graphemeIndex: 0 }, 1e6)!.width / text.length
        }
        const size = parseFloat(style.fontSize)
        const p = prepared
        // The ruler of alphabets: where each of its letters ends, kerning and all, as far as the handle can go.
        const ctx = document.createElement("canvas").getContext("2d")!
        ctx.font = font
        const ruler = ALPHABET.repeat(Math.ceil((max * ch) / ctx.measureText(ALPHABET).width) + 1)
        const abc = Array.from({ length: ruler.length + 1 }, (_, i) => ctx.measureText(ruler.slice(0, i)).width)
        if (cancelled) return
        setEngine({
          width: box!.clientWidth,
          em: size,
          abc,
          ch,
          lh: parseFloat(style.lineHeight) || size * 1.6,
          room: Math.floor(box!.clientWidth / ch),
          lay(px) {
            const out: string[] = []
            let cursor = { segmentIndex: 0, graphemeIndex: 0 }
            for (let guard = 0; guard < 2000; guard++) {
              const line = lib.layoutNextLine(p, cursor, px)
              if (!line) break
              out.push(line.text.trimEnd())
              cursor = line.end
            }
            return out
          },
        })
      }

      await measureFace()
      if (cancelled) return
      let width = box.clientWidth
      const resized = new ResizeObserver(() => {
        if (box.clientWidth !== width) { width = box.clientWidth; measureFace() }
      })
      resized.observe(box)
      // A change of pair or scheme on <html> can change the face: measure again.
      const restyled = new MutationObserver(() => measureFace())
      restyled.observe(document.documentElement, { attributeFilter: FACE })
      off.push(() => { resized.disconnect(); restyled.disconnect() })
    })()

    return () => {
      cancelled = true
      off.forEach((f) => f())
    }
  }, [text, max])

  const set = (v: number) => setMeasure(Math.min(Math.max(Math.round(v), min), room))
  // Dragging: the pointer's distance from the paragraph's left edge, in characters.
  const drag = (e: React.PointerEvent) => {
    if (!engine || !(e.buttons & 1) || !stage.current) return
    const box = stage.current.getBoundingClientRect()
    // The edge is the line's end: the right in left-to-right, the left in right-to-left.
    set((getComputedStyle(stage.current).direction === "rtl" ? box.right - e.clientX : e.clientX - box.left) / engine.ch)
  }
  const press = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag(e)
  }
  const keys = (e: React.KeyboardEvent) => {
    // Right to left, the line grows leftward, so the arrows follow the edge.
    const out = stage.current && getComputedStyle(stage.current).direction === "rtl" ? -1 : 1
    const to: Record<string, number> = { ArrowRight: n + out, ArrowUp: n + 1, ArrowLeft: n - out, ArrowDown: n - 1, PageUp: n + 10, PageDown: n - 10, Home: min, End: room }
    if (!(e.key in to)) return
    e.preventDefault()
    set(to[e.key])
  }
  const handlers = { onPointerDown: press, onPointerMove: drag }

  return (
    <div
      data-slot="measure"
      data-variant={variant}
      className={cn("db-measure", className)}
      style={{ "--n": n, "--ch": engine ? `${engine.ch}px` : undefined, "--cols": cols, "--gap": `${gap}px`, ...style } as React.CSSProperties}
      {...props}
    >
      <p className="db-measure-read" aria-hidden="true">
        {/* The readout is the library's English: each part is its own left-to-right run, so a right-to-left page keeps "30 characters a line" in order. */}
        <span className="db-measure-count" dir="ltr">
          <span className="db-measure-n">{said.split(" ")[0]}</span> {said.split(" ").slice(1).join(" ")}
        </span>
        <span className="db-measure-verdict" dir="ltr">{judged}</span>
      </p>
      <div ref={stage} className="db-measure-stage">
        <div className="db-measure-track" aria-hidden="true" {...handlers}>
          {variant === "alphabets" ? (
            <span className="db-measure-abc">
              {ALPHABET.repeat(engine ? (engine.abc.length - 1) / 26 : Math.ceil(max / 26) + 1)
                .split("")
                .map((c, i) => (
                  <span key={i} data-in={i < edge || undefined} data-edge={i === edge || undefined}>
                    {c}
                  </span>
                ))}
            </span>
          ) : null}
          <span className="db-measure-good" />
          {/* The comfortable range's ends, as figures under the track, where the page is wide enough to hold them. */}
          {[COMFORT_FROM, COMFORT_TO].map((at) =>
            engine && at <= room ? (
              <span key={at} className="db-measure-at" style={{ "--at": at } as React.CSSProperties}>
                {at}
              </span>
            ) : null,
          )}
        </div>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Measure"
          aria-orientation="horizontal"
          aria-valuemin={min}
          aria-valuemax={room}
          aria-valuenow={n}
          aria-valuetext={`${n} characters a line${variant === "alphabets" ? `, ${inAlphabets(abcs)}` : ""}, ${judged}`}
          className="db-measure-handle"
          onKeyDown={keys}
          {...handlers}
        >
          <span className="db-measure-ring" />
        </div>
        <p ref={body} className="db-measure-body">
          <span className="db-sr">{text}</span>
          {lines ? (
            <span aria-hidden="true" className="db-measure-lines">
              {lines.map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </span>
          ) : (
            <span aria-hidden="true">{text}</span>
          )}
        </p>
      </div>
    </div>
  )
}

export { Measure, type MeasureProps }
