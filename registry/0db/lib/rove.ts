import type * as React from "react"

// Rove: a group with one tab stop. The arrows move focus to the next or previous item, Home and End jump to the ends;
// right to left, Left and Right follow the page. `round` wraps past the ends, for things set on a circle.
// Chart, line-chart and area-chart walk their points with it (a line, so no wrap); the pie's key and the radar's axes wrap.
const steps: Record<string, 1 | -1> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

export function rove(e: React.KeyboardEvent<HTMLElement>, selector: string, round = false) {
  const items = [...e.currentTarget.querySelectorAll<HTMLElement>(selector)]
  const at = items.indexOf(document.activeElement as HTMLElement)
  const step = steps[e.key]
  if (at < 0 || (!step && e.key !== "Home" && e.key !== "End")) return
  const flip = /^Arrow(Left|Right)$/.test(e.key) && getComputedStyle(e.currentTarget).direction === "rtl" ? -1 : 1
  let to = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : at + step * flip
  if (round) to = (to + items.length) % items.length
  if (to < 0 || to >= items.length) return
  e.preventDefault()
  items[to].focus()
}
