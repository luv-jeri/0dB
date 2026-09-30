"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type MarqueeProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The words: each child is one word or phrase in the band. */
  children: React.ReactNode
  /**
   * band: display words, each closed by a full stop, cropped by the frame's ends.
   * ticker: small capitals running between two hairlines.
   * counter: two rows of the band cropped against each other, running opposite ways.
   */
  variant?: "band" | "ticker" | "counter"
  /** How far the words travel for each pixel the page scrolls. */
  speed?: number
  /** Travel towards the start as you scroll down, instead of reading along towards the end. */
  reverse?: boolean
  /** Names the list of words for readers. */
  label?: string
}

/**
 * A band of words that moves only with the page's scroll. Its offset is read from where the band stands in the view,
 * so it stops the moment the scroll stops, runs back when you scroll back, and keeps step with smooth scrolling.
 * The first run of words is the list readers get; the copies that fill the band are hidden from them.
 */
function Marquee({ children, variant = "band", speed = 0.4, reverse = false, label, className, ...props }: MarqueeProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [copies, setCopies] = React.useState(2)
  const words = React.Children.toArray(children)

  React.useEffect(() => {
    const el = ref.current
    const run = el?.querySelector<HTMLElement>(".db-marquee-words")
    if (!el || !run || matchMedia("(prefers-reduced-motion: reduce)").matches) return // the words wrap and stand still
    let period = 0, frame = 0
    // How far the band has risen through the view, times the speed, wrapped to one run of words. Read from the real
    // layout in a frame asked for by the scroll event, which runs after a smooth scroller's own frame.
    const read = () => {
      if (!period) return
      const travelled = (innerHeight - el.getBoundingClientRect().top) * speed
      el.style.setProperty("--o", `${((travelled % period) + period) % period}px`)
    }
    const measure = () => {
      period = run.offsetWidth // one run, its trailing gap included: a new face or size changes it
      el.style.setProperty("--period", `${period}px`)
      if (period) setCopies(Math.max(2, Math.ceil(el.clientWidth / period) + 1))
      read()
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(read)
    }
    const resized = new ResizeObserver(measure)
    resized.observe(el)
    resized.observe(run)
    addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      resized.disconnect()
      removeEventListener("scroll", onScroll)
    }
  }, [speed])

  const rows = variant === "counter" ? 2 : 1
  return (
    <div ref={ref} data-slot="marquee" data-variant={variant === "band" ? undefined : variant} className={cn("db-marquee", className)} {...props}>
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="db-marquee-row" data-back={reverse !== (row === 1) || undefined}>
          <div className="db-marquee-track">
            {Array.from({ length: copies }, (_, copy) => {
              const read = row === 0 && copy === 0
              return (
                <ul key={copy} className="db-marquee-words" aria-label={read ? label : undefined} aria-hidden={read ? undefined : true} inert={!read}>
                  {words.map((word, i) => (
                    <li key={i}>{word}</li>
                  ))}
                </ul>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export { Marquee, type MarqueeProps }
