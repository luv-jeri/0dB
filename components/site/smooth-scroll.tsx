"use client"

import * as React from "react"

/** Lenis, only while reduced motion is off. Anchor links keep working through it. */
export function SmoothScroll() {
  React.useEffect(() => {
    const still = matchMedia("(prefers-reduced-motion: reduce)")
    if (still.matches) return
    let lenis: import("lenis").default | undefined
    let gone = false
    let requested = false
    // Native scrolling works immediately; smoothing is loaded when someone acts.
    const start = () => {
      if (requested || still.matches) return
      requested = true
      import("lenis").then(({ default: Lenis }) => {
        if (gone || still.matches) return
        lenis = new Lenis({ autoRaf: true, anchors: { offset: -96 } })
      }).catch(() => {})
    }
    const events = ["wheel", "pointerdown", "keydown"] as const
    events.forEach((event) => addEventListener(event, start, { passive: true }))
    const stop = () => { if (still.matches) lenis?.destroy() }
    still.addEventListener("change", stop)
    return () => { gone = true; events.forEach((event) => removeEventListener(event, start)); still.removeEventListener("change", stop); lenis?.destroy() }
  }, [])
  return null
}
