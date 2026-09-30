"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { roll } from "@/registry/0db/lib/roll"
import { Button } from "@/registry/0db/ui/button"

const Slide = React.createContext({ index: 0, total: 0 })

const pad = (n: number) => String(n).padStart(2, "0")

type CarouselProps = React.ComponentProps<"div"> & {
  /** Names the slides for the keyboard: the track takes focus, so it needs a name. */
  trackLabel?: string
  previousLabel?: string
  nextLabel?: string
}

/**
 * One slide at a time, snapped. The count between the arrows rolls the way you travel.
 * Swipe, scroll, use the arrows, or focus the track and press the arrow keys.
 * Slides are CarouselItems, as direct children.
 */
function Carousel({ trackLabel = "Slides", previousLabel = "Previous", nextLabel = "Next", className, children, ...props }: CarouselProps) {
  const track = React.useRef<HTMLDivElement>(null)
  const now = React.useRef<HTMLSpanElement>(null)
  const items = React.Children.toArray(children)
  const total = items.length
  const [at, setAt] = React.useState(0)
  const [shown, setShown] = React.useState(0)
  const was = React.useRef(0)

  // The slide most in view is the one you're on.
  React.useEffect(() => {
    const t = track.current
    if (!t) return
    const watch = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = [...t.children].indexOf(e.target)
          if (!e.isIntersecting || i === was.current) continue
          const dir = i > was.current ? 1 : -1
          was.current = i
          setAt(i)
          if (now.current) roll(now.current, () => setShown(i), "0.6em", dir)
          else setShown(i)
        }
      },
      { root: t, threshold: 0.6 },
    )
    ;[...t.children].forEach((c) => watch.observe(c))
    return () => watch.disconnect()
  }, [total])

  const go = (i: number) => {
    const slide = track.current?.children[Math.max(0, Math.min(total - 1, i))]
    slide?.scrollIntoView({ inline: "start", block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
  }

  return (
    <div data-slot="carousel" role="region" aria-roledescription="carousel" className={cn("db-carousel", className)} {...props}>
      <div
        ref={track}
        data-slot="carousel-track"
        tabIndex={0}
        aria-label={trackLabel}
        className="db-carousel-track"
        onKeyDown={(e) => {
          const rtl = getComputedStyle(e.currentTarget).direction === "rtl"
          const to = { ArrowLeft: at + (rtl ? 1 : -1), ArrowRight: at + (rtl ? -1 : 1) }[e.key]
          if (to === undefined) return
          e.preventDefault()
          go(to)
        }}
      >
        {items.map((item, index) => (
          <Slide.Provider key={index} value={{ index, total }}>
            {item}
          </Slide.Provider>
        ))}
      </div>
      <div data-slot="carousel-nav" className="db-carousel-nav">
        <Button variant="bracket" aria-label={previousLabel} disabled={at === 0} onClick={() => go(at - 1)}>
          <span className="db-carousel-arrow" aria-hidden="true">←</span>
        </Button>
        <span data-slot="carousel-count" className="db-carousel-count" aria-live="polite" aria-atomic="true">
          <span ref={now} className="db-carousel-now">{pad(shown + 1)}</span> / {pad(total)}
        </span>
        <Button variant="bracket" aria-label={nextLabel} disabled={at >= total - 1} onClick={() => go(at + 1)}>
          <span className="db-carousel-arrow" aria-hidden="true">→</span>
        </Button>
      </div>
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { index, total } = React.useContext(Slide)
  return (
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
      className={cn("db-carousel-slide", className)}
      {...props}
    />
  )
}

/** A name set so large the frame crops it. */
function CarouselTitle({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="carousel-title" className={cn("db-carousel-title", className)} {...props} />
}

export { Carousel, CarouselItem, CarouselTitle }
