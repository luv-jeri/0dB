"use client"

import * as React from "react"

import { createDigitRoll } from "@/registry/0db/lib/roll"

/** Shared counter wheels; a new value or preference change cancels unfinished work. */
export function useDigitRoll(value: React.ReactNode, { order, distance = "0.5em", instant = false, numeric = false }: { order: number | string; distance?: string; instant?: boolean; numeric?: boolean }) {
  const [shown, setShown] = React.useState(value)
  const [roller] = React.useState(() => createDigitRoll(value, setShown))
  const whole = React.useRef<HTMLSpanElement>(null)
  const figs = React.useRef<(HTMLSpanElement | null)[]>([])
  const was = React.useRef(order)
  React.useLayoutEffect(() => {
    const dir = order < was.current ? -1 : 1
    was.current = order
    const preference = matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => roller.update(value, { whole: whole.current, figures: figs.current, dir, distance, numeric, instant: instant || preference.matches })
    update()
    preference.addEventListener("change", update)
    return () => {
      preference.removeEventListener("change", update)
      roller.cancel()
    }
  }, [value, order, distance, instant, numeric, roller])
  return { shown, whole, figs }
}
