/** Marginalia hangs at inline-end, which is the physical left in RTL. */
export function marginaliaUnder(rect: Pick<DOMRect, "left" | "right">, width: number, direction: string) {
  return (direction === "rtl" ? rect.left : width - rect.right) < 220
}
