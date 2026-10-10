"use client"

import * as React from "react"

import { OVERTURE_ATTR, OVERTURE_DEADLINE, OVERTURE_SCRIPT } from "@/lib/site/overture.mjs"
import { Button } from "@/registry/0db/ui/button"

// The home overture's one clock. A script in the hero's HTML (lib/site/overture.mjs) decides on a browser's first
// visit and sets data-overture-at on <html>; the title's exhale (landing.css) and the Noise field's swell and hush
// (landing-noise) both play only while it is there. This file ends them together: at the deadline, or the moment
// the person does anything (a key, a press, a touch, the wheel, a scroll, the "Skip intro" control), or if they ask
// for reduced motion. Ending removes the attribute, which settles the title; the field is told through onOvertureEnd.
// Nothing here is stored: the choice to play was made, and recorded, before the first paint.

export type OvertureEnd = "deadline" | "skip" | "input" | "motion"

const listeners = new Set<(why: OvertureEnd) => void>()
let stop: (() => void) | null = null

export const overtureActive = () => typeof document !== "undefined" && document.documentElement.hasAttribute(OVERTURE_ATTR)

/** Milliseconds left before the deadline, counted from when the overture began. */
export function overtureLeft() {
  const at = Number(document.documentElement.getAttribute(OVERTURE_ATTR))
  return Number.isFinite(at) ? Math.max(0, OVERTURE_DEADLINE - (performance.now() - at)) : 0
}

/** Tells you when the overture ends, however it ends. Returns the way to stop listening. */
export function onOvertureEnd(fn: (why: OvertureEnd) => void) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

export function endOverture(why: OvertureEnd) {
  if (!overtureActive()) return
  stop?.()
  // The person pressed Skip: the control is about to leave, so focus goes on to the first action instead of the page's top.
  const skip = document.querySelector<HTMLElement>(".hero-skip")
  const hadFocus = !!skip && document.activeElement === skip
  document.documentElement.removeAttribute(OVERTURE_ATTR)
  if (hadFocus) document.querySelector<HTMLElement>(".hero-cta a")?.focus()
  listeners.forEach((fn) => fn(why))
}

/** Listens for the end, once. Idempotent; the page's own scripts and the person's first move all converge on endOverture. */
function arm() {
  if (stop || !overtureActive()) return
  const motion = matchMedia("(prefers-reduced-motion: reduce)")
  if (overtureLeft() <= 0 || motion.matches || scrollY > 4) { endOverture("input"); return }
  const timer = window.setTimeout(() => endOverture("deadline"), overtureLeft())
  const key = (e: KeyboardEvent) => { if (e.key !== "Tab" && e.key !== "Shift" && e.key !== "Control" && e.key !== "Alt" && e.key !== "Meta") endOverture("input") }
  const input = () => endOverture("input")
  const scrolled = () => { if (scrollY > 4) endOverture("input") }
  const reduced = () => { if (motion.matches) endOverture("motion") }
  document.addEventListener("keydown", key, true)
  document.addEventListener("pointerdown", input, true)
  document.addEventListener("touchstart", input, { capture: true, passive: true })
  document.addEventListener("wheel", input, { capture: true, passive: true })
  addEventListener("scroll", scrolled, { passive: true })
  motion.addEventListener("change", reduced)
  stop = () => {
    clearTimeout(timer)
    document.removeEventListener("keydown", key, true)
    document.removeEventListener("pointerdown", input, true)
    document.removeEventListener("touchstart", input, true)
    document.removeEventListener("wheel", input, true)
    removeEventListener("scroll", scrolled)
    motion.removeEventListener("change", reduced)
    stop = null
  }
}

/**
 * The visible way out. Always in the HTML, shown by CSS only while the overture plays, so it is a real control
 * for the whole of the intro and costs nothing after it. It arms the clock once the page is interactive.
 */
export function Overture() {
  React.useLayoutEffect(() => { arm() }, [])
  return (
    <Button variant="bracket" type="button" className="hero-skip" onClick={() => endOverture("skip")}>
      Skip intro
    </Button>
  )
}

/**
 * The decision, as a script in the page's HTML so it runs before the hero paints. It is the pattern Next's guide
 * gives for client-only state: a real script on the server, inert text once React renders it in the browser (so a
 * client-side visit to the home page, which never runs it, does not warn).
 */
export function OvertureScript() {
  return <script type={typeof window === "undefined" ? "text/javascript" : "text/plain"} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: OVERTURE_SCRIPT }} />
}
