// Roll: the old text leaves one way and the new text arrives from the other,
// like a counter turning over. dir 1 counts up (out the top, in from below);
// -1 counts down. With reduced motion the text simply changes.
import type { ReactNode } from "react"

const turns = new WeakMap<Element, () => void>()
const still = () => typeof matchMedia === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches

export function roll(el: HTMLElement, apply: () => void, dist = "0.7em", dir: 1 | -1 = 1) {
  turns.get(el)?.()
  let live = true
  let motion: Animation | undefined
  const cancel = () => {
    live = false
    motion?.cancel()
    if (turns.get(el) === cancel) turns.delete(el)
  }
  turns.set(el, cancel)
  if (still() || !el.animate) {
    apply()
    cancel()
    return cancel
  }
  const up = `-${dist}`
  const down = dist
  motion = el.animate([{ opacity: 1, translate: "0 0" }, { opacity: 0, translate: `0 ${dir > 0 ? up : down}` }], {
    duration: 160,
    easing: "cubic-bezier(.65,0,.35,1)",
    fill: "forwards",
  })
  motion.finished.then(() => {
    if (!live) return
    apply()
    motion?.cancel()
    motion = el.animate([{ opacity: 0, translate: `0 ${dir > 0 ? down : up}` }, { opacity: 1, translate: "0 0" }], {
      duration: 320,
      easing: "cubic-bezier(.16,1,.3,1)",
      fill: "forwards",
    })
    motion.finished.then(cancel, () => {})
  }, () => {})
  return cancel
}

type DigitRollOptions = {
  whole: HTMLElement | null
  figures: (HTMLElement | null)[]
  dir: 1 | -1
  distance?: string
  instant?: boolean
  numeric?: boolean
}

const plain = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number"
const digit = /\p{Nd}/u
const number = /^[^\p{L}]*\p{Nd}[^\p{L}]*$/u
const alike = (a: string[], b: string[]) => number.test(a.join("")) && number.test(b.join("")) && a.every((c, i) => digit.test(c) ? digit.test(b[i]) : c === b[i])

/** One owner for the displayed value, pending carries and both halves of every turn. */
export function createDigitRoll(initial: ReactNode, publish: (value: ReactNode) => void) {
  let shown = initial
  let generation = 0
  let pending: ReturnType<typeof setTimeout>[] = []
  let turns: (() => void)[] = []
  const cancel = () => {
    generation++ // invalidate at scheduling time, including work that has not begun to animate
    pending.forEach(clearTimeout)
    turns.forEach((stop) => stop())
    pending = []
    turns = []
  }
  const update = (value: ReactNode, { whole, figures, dir, distance = "0.5em", instant, numeric }: DigitRollOptions) => {
    cancel()
    const mine = generation
    const show = (next: ReactNode) => {
      if (mine !== generation) return
      shown = next
      publish(next)
    }
    if (Object.is(value, shown)) return
    if (instant || still() || !plain(value) || !plain(shown)) return show(value)
    // Compare with what is actually displayed, not the previous (possibly unfinished) request.
    const a = [...String(shown)], b = [...String(value)]
    if (a.length !== b.length || (numeric && !alike(a, b))) {
      if (whole) turns.push(roll(whole, () => show(value), distance, dir))
      else show(value)
      return
    }
    for (let k = b.length - 1, n = 0; k >= 0; k--) {
      if (a[k] === b[k]) continue
      const put = () => {
        const text = [...String(shown)]
        text[k] = b[k]
        show(text.join(""))
      }
      const el = figures[k]
      if (!el) { put(); continue }
      pending.push(setTimeout(() => {
        if (mine === generation) turns.push(roll(el, put, distance, dir))
      }, n++ * 36)) // --db-arpeggio, units first
    }
  }
  return { update, cancel }
}
