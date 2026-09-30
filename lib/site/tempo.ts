/** A tempo token in ms. The browser may hand it back normalised to seconds ("1.4s" for 1400ms), so read the unit. */
export function tempo(name: string, el: Element = document.documentElement) {
  const v = getComputedStyle(el).getPropertyValue(name).trim()
  return parseFloat(v) * (v.endsWith("ms") ? 1 : 1000) || 0
}
