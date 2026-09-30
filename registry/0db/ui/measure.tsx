"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type MeasureProps = Omit<React.ComponentProps<"div">, "children" | "defaultValue"> & {
  /** The paragraph. Plain text: pretext measures it. */
  children: string
  /** Characters a line, to begin with. */
  defaultMeasure?: number
  /** The shortest measure the handle allows, in characters. */
  min?: number
  /** The longest measure the handle allows, in characters. */
  max?: number
}

/** Below this a line is too short to read in; above COMFORT_TO the eye loses the next line. */
const COMFORT_FROM = 45
const COMFORT_TO = 75

const verdict = (n: number) => (n < COMFORT_FROM ? "too short to read in" : n <= COMFORT_TO ? "comfortable" : "the eye loses the next line")

type Engine = { lay: (px: number) => string[]; ch: number; lh: number; room: number }

/**
 * A paragraph whose measure you set by dragging its right edge. The edge is a hairline with a ring
 * on a track above it, and the range where a line reads well is marked on that track in the accent.
 * Pretext lays the lines again whenever the width changes, so they follow the hand. The handle is a
 * slider (arrows step a character, Page steps ten), the measure is the italic, and the verdict is
 * pencil. The lines are aria-hidden; the text is there once for a reader.
 */
function Measure({ children: text, defaultMeasure = 62, min = 20, max = 110, className, style, ...props }: MeasureProps) {
  const stage = React.useRef<HTMLDivElement>(null)
  const body = React.useRef<HTMLParagraphElement>(null)
  const [measure, setMeasure] = React.useState(defaultMeasure)
  const [engine, setEngine] = React.useState<Engine | null>(null)

  // The most characters the container can hold: the handle stops at the edge of the page.
  const room = engine ? Math.max(min, Math.min(max, engine.room)) : max
  const n = Math.min(Math.max(measure, min), room)
  const lines = React.useMemo(() => engine?.lay(n * engine.ch) ?? null, [engine, n])

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
        const style = getComputedStyle(el!)
        const next = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        if (next !== font || !prepared) {
          font = next
          await document.fonts.load(font, text)
          prepared = lib.prepareWithSegments(text, font)
          // A character is the average one in this text, so "62 characters a line" is what the lines really hold.
          ch = lib.layoutNextLine(prepared, { segmentIndex: 0, graphemeIndex: 0 }, 1e6)!.width / text.length
        }
        const size = parseFloat(style.fontSize)
        const p = prepared
        if (cancelled) return
        setEngine({
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
      restyled.observe(document.documentElement, { attributes: true })
      off.push(() => { resized.disconnect(); restyled.disconnect() })
    })()

    return () => {
      cancelled = true
      off.forEach((f) => f())
    }
  }, [text])

  const set = (v: number) => setMeasure(Math.min(Math.max(Math.round(v), min), room))
  // Dragging: the pointer's distance from the paragraph's left edge, in characters.
  const drag = (e: React.PointerEvent) => {
    if (!engine || !(e.buttons & 1) || !stage.current) return
    set((e.clientX - stage.current.getBoundingClientRect().left) / engine.ch)
  }
  const press = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag(e)
  }
  const keys = (e: React.KeyboardEvent) => {
    const to: Record<string, number> = { ArrowRight: n + 1, ArrowUp: n + 1, ArrowLeft: n - 1, ArrowDown: n - 1, PageUp: n + 10, PageDown: n - 10, Home: min, End: room }
    if (!(e.key in to)) return
    e.preventDefault()
    set(to[e.key])
  }
  const handlers = { onPointerDown: press, onPointerMove: drag }

  return (
    <div data-slot="measure" className={cn("db-measure", className)} style={{ "--n": n, "--ch": engine ? `${engine.ch}px` : undefined, ...style } as React.CSSProperties} {...props}>
      <p className="db-measure-read" aria-hidden="true">
        <span className="db-measure-count">{n} characters a line</span>
        <span className="db-measure-verdict">{verdict(n)}</span>
      </p>
      <div ref={stage} className="db-measure-stage">
        <div className="db-measure-track" aria-hidden="true" {...handlers}>
          <span className="db-measure-good" />
        </div>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Measure"
          aria-orientation="horizontal"
          aria-valuemin={min}
          aria-valuemax={room}
          aria-valuenow={n}
          aria-valuetext={`${n} characters a line, ${verdict(n)}`}
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
