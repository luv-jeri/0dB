"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { cn } from "@/registry/0db/lib/utils"

type StrataProps = React.ComponentProps<"div"> & { trigger?: "scroll" | "load" }
type StrataPlaneProps = React.ComponentProps<"div"> & {
  depth: number
  tilt?: "x" | "y" | "none"
  from?: "start" | "end" | "above" | "below"
}

/** Depth means a thought not yet set. Its reading order never changes as the planes come forward. */
function Strata({ trigger = "scroll", children, className, ref: forwardedRef, ...props }: StrataProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
  const played = React.useRef(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const planes = Array.from(el.querySelectorAll<HTMLElement>(":scope > .db-strata-plane"))
    const ordered = [...planes].sort((a, b) => Number(b.dataset.depth) - Number(a.dataset.depth))
    ordered.forEach((plane, i) => plane.style.setProperty("--db-strata-order", String(i)))
    el.style.setProperty("--db-strata-count", String(Math.max(1, planes.length)))
    const still = matchMedia("(prefers-reduced-motion: reduce)")
    const native = CSS.supports("animation-timeline", "view()")
    let frame = 0
    const set = (p: number) => el.style.setProperty("--p", String(p))
    function read() {
      frame = 0
      if (still.matches) return set(1)
      const box = el!.getBoundingClientRect(), top = box.top + scrollY
      const from = Math.max(0, top - innerHeight)
      const to = Math.min(document.documentElement.scrollHeight - innerHeight, top - innerHeight + (innerHeight + box.height) * 0.65)
      set(to <= from ? 1 : Math.max(0, Math.min(1, (scrollY - from) / (to - from))))
    }
    function scroll() { if (!frame) frame = requestAnimationFrame(read) }
    function configure() {
      cancelAnimationFrame(frame); frame = 0
      if (still.matches) {
        el!.removeAttribute("data-ready")
        set(1)
        played.current = true
      } else if (trigger === "load") {
        // Toggling reduced motion off must not replay an opening already read.
        if (!played.current) { el!.dataset.ready = "load"; played.current = true }
      } else if (native) { el!.dataset.ready = "scroll"; el!.style.removeProperty("--p") }
      else { el!.dataset.ready = "fallback"; read() }
    }
    frame = requestAnimationFrame(configure)
    if (trigger === "scroll" && !native) {
      addEventListener("scroll", scroll, { passive: true })
      addEventListener("resize", scroll)
    }
    still.addEventListener("change", configure)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener("scroll", scroll)
      removeEventListener("resize", scroll)
      still.removeEventListener("change", configure)
      el.removeAttribute("data-ready")
      el.style.removeProperty("--p")
    }
  }, [trigger, children])

  return <div ref={composedRef} data-slot="strata" data-trigger={trigger} className={cn("db-strata", className)} {...props}>{children}</div>
}

function StrataPlane({ depth, tilt = "y", from = "start", className, style, ...props }: StrataPlaneProps) {
  const distance = Number.isFinite(depth) ? Math.max(0, Math.min(1, depth)) : 0
  return <div data-slot="strata-plane" data-depth={distance} data-tilt={tilt} data-from={from} className={cn("db-strata-plane", className)} style={{ ...style, "--db-strata-depth": distance } as React.CSSProperties} {...props} />
}

export { Strata, StrataPlane, type StrataProps, type StrataPlaneProps }
