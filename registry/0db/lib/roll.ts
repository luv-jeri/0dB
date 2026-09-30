// Roll: the old text leaves one way and the new text arrives from the other,
// like a counter turning over. dir 1 counts up (out the top, in from below);
// -1 counts down. With reduced motion the text simply changes.
const turns = new WeakMap<Element, number>()

export function roll(el: HTMLElement, apply: () => void, dist = "0.7em", dir: 1 | -1 = 1) {
  const mine = (turns.get(el) ?? 0) + 1
  turns.set(el, mine)
  if (typeof matchMedia === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches || !el.animate) return apply()
  const up = `-${dist}`
  const down = dist
  el.animate([{ opacity: 1, translate: "0 0" }, { opacity: 0, translate: `0 ${dir > 0 ? up : down}` }], {
    duration: 160,
    easing: "cubic-bezier(.65,0,.35,1)",
    fill: "forwards",
  }).finished.then(() => {
    if (turns.get(el) !== mine) return
    apply()
    el.animate([{ opacity: 0, translate: `0 ${dir > 0 ? down : up}` }, { opacity: 1, translate: "0 0" }], {
      duration: 320,
      easing: "cubic-bezier(.16,1,.3,1)",
      fill: "forwards",
    })
  }, () => {})
}
