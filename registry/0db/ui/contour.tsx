"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type Shape = "diminuendo" | "crescendo" | "hairpin"

/** How much of the measure a line may take, `t` of the way through the text. */
const share: Record<Shape, (t: number, least: number) => number> = {
  diminuendo: (t, least) => 1 - (1 - least) * t,
  crescendo: (t, least) => least + (1 - least) * t,
  hairpin: (t, least) => least + (1 - least) * (1 - Math.abs(2 * t - 1)),
}

type Line = { text: string; t: number }

type ContourProps = Omit<React.ComponentProps<"p">, "children"> & {
  /** The paragraph. Plain text: pretext measures it. */
  children: string
  /** diminuendo narrows to the end, crescendo opens towards it, hairpin swells and closes. */
  shape?: Shape
  /** The narrowest a line may be, as a share of the measure. */
  least?: number
  /** Let the colour follow the shape: ink where it's loud, pencil where it's quiet. */
  fade?: boolean
}

/**
 * A paragraph set to a contour, the way a score draws a swell. Pretext lays each line to its own
 * width, so the words taper like a diminuendo or open like a crescendo; with `fade` the colour falls
 * away with them. Until the fonts have come and the layout is done, it's a plain paragraph, and a
 * reader of the page always gets the plain text.
 */
function Contour({ children: text, shape = "diminuendo", least = 0.3, fade = false, className, ...props }: ContourProps) {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const [lines, setLines] = React.useState<Line[] | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false
    let font = ""
    let width = 0
    const off: (() => void)[] = []

    ;(async () => {
      let lib: typeof import("@chenglou/pretext")
      try {
        lib = await import("@chenglou/pretext")
      } catch {
        return // the plain paragraph stays
      }
      let prepared: ReturnType<typeof lib.prepareWithSegments> | undefined

      async function lay() {
        const style = getComputedStyle(el!)
        const next = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        if (next !== font || !prepared) {
          font = next
          await document.fonts.load(font, text)
          prepared = lib.prepareWithSegments(text, font)
        }
        width = el!.clientWidth
        const total = Math.max(1, prepared.segments.length)
        const out: Line[] = []
        let cursor = { segmentIndex: 0, graphemeIndex: 0 }
        for (let guard = 0; guard < 500; guard++) {
          const t = cursor.segmentIndex / total
          const line = lib.layoutNextLine(prepared, cursor, Math.max(width * share[shape](t, least), 48))
          if (!line) break
          out.push({ text: line.text.trimEnd(), t })
          cursor = line.end
        }
        if (!cancelled) setLines(out)
      }

      await lay()
      if (cancelled) return
      const resized = new ResizeObserver(() => {
        if (el.clientWidth !== width) lay()
      })
      resized.observe(el)
      off.push(() => resized.disconnect())
      // A change of pair or scheme on <html> can change the face: lay out again if it did.
      const restyled = new MutationObserver(() => lay())
      restyled.observe(document.documentElement, { attributes: true })
      off.push(() => restyled.disconnect())
    })()

    return () => {
      cancelled = true
      off.forEach((f) => f())
    }
  }, [text, shape, least])

  return (
    <p ref={ref} data-slot="contour" data-shape={shape} data-fade={fade || undefined} className={cn("db-contour", className)} {...props}>
      {lines ? (
        <>
          <span className="db-sr">{text}</span>
          <span aria-hidden="true" className="db-contour-lines">
            {lines.map((line, i) => (
              <span key={i} style={{ "--t": line.t } as React.CSSProperties}>
                {line.text}
              </span>
            ))}
          </span>
        </>
      ) : (
        text
      )}
    </p>
  )
}

export { Contour, type ContourProps }
