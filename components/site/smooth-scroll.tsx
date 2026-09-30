"use client"

import * as React from "react"

/** Lenis, only while reduced motion is off. Anchor links keep working through it. */
export function SmoothScroll() {
  React.useEffect(() => {
    const still = matchMedia("(prefers-reduced-motion: reduce)")
    if (still.matches) return
    let lenis: import("lenis").default | undefined
    let gone = false
    import("lenis").then(({ default: Lenis }) => {
      if (gone) return
      lenis = new Lenis({ autoRaf: true, anchors: { offset: -96 } })
    })
    const stop = () => { if (still.matches) lenis?.destroy() }
    still.addEventListener("change", stop)
    return () => { gone = true; still.removeEventListener("change", stop); lenis?.destroy() }
  }, [])
  return null
}
