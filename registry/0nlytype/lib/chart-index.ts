/** Reconcile a highlighted axis before dereferencing data; -1 means no highlight. */
export function activeIndex(index: number, length: number, fallback = -1) {
  return Number.isInteger(index) && index >= 0 && index < length ? index : length > 0 ? fallback : -1
}
