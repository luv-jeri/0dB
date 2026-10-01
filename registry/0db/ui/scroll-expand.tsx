"use client"

import * as React from "react"

import { Corners } from "@/registry/0db/ui/corners"
import { Meta } from "@/registry/0db/ui/meta"
import { useComposedRefs } from "@/registry/0db/lib/refs"
import { cn } from "@/registry/0db/lib/utils"

type ScrollExpandProps = Omit<React.ComponentProps<"figure">, "children"> & {
  /** What the plate holds. It is all there for readers from the start; only the view of it is cropped. */
  children: React.ReactNode
  /** The words in the meta row under the plate, held apart by hairlines. The row grows with the crop. */
  caption?: React.ReactNode
  /** mark: the crop opens from a small square in the middle. horizon: from a hairline across the whole measure, up and down. */
  variant?: "mark" | "horizon"
  /** Pins how far it has opened, 0 to 1, instead of following the scroll. */
  progress?: number
}

/**
 * A plate cropped by four corner marks that open as the page scrolls, from a small mark to the full
 * measure. It is scrubbed: it opens only as far as the scroll has gone, stops when the scroll stops and
 * closes again when you scroll back. The share of the measure it has reached is read out at the end of
 * the caption. Under reduced motion, or without script, it stands open.
 */
function ScrollExpand({ children, caption, variant = "mark", progress, className, ref: forwardedRef, ...props }: ScrollExpandProps) {
  const ref = React.useRef<HTMLElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
  const share = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const set = (p: number) => {
      el.style.setProperty("--p", p.toFixed(4))
      if (share.current) share.current.textContent = p.toFixed(2)
    }
    if (progress !== undefined) return set(Math.min(1, Math.max(0, progress)))
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return set(1)

    // 0 as the plate's top comes in at the foot of the view, 1 once its middle is at the middle of the view
    // (or as far as the page can scroll). Read from the real layout, so it follows a smooth scroller that
    // moves the page itself.
    let frame = 0
    const read = () => {
      const box = el.getBoundingClientRect(), h = innerHeight
      const top = box.top + scrollY
      const from = Math.max(0, top - h), to = Math.min(document.documentElement.scrollHeight - h, top + box.height / 2 - h / 2)
      set(to <= from ? 1 : Math.min(1, Math.max(0, (scrollY - from) / (to - from))))
    }
    // Asked for from the scroll event, the frame runs after a smooth scroller's own frame has moved the page,
    // so the crop and the page move in the same frame.
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(read)
    }
    read()
    addEventListener("scroll", onScroll, { passive: true })
    addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener("scroll", onScroll)
      removeEventListener("resize", onScroll)
    }
  }, [progress])

  return (
    <figure ref={composedRef} data-slot="scroll-expand" data-variant={variant === "mark" ? undefined : variant} className={cn("db-expand", className)} {...props}>
      <Corners className="db-expand-frame">
        <div className="db-expand-plate">{children}</div>
      </Corners>
      <figcaption className="db-expand-caption">
        <Meta>
          {React.Children.toArray(caption)}
          <span ref={share} className="db-expand-share" aria-hidden="true">1.00</span>
        </Meta>
      </figcaption>
    </figure>
  )
}

export { ScrollExpand, type ScrollExpandProps }
