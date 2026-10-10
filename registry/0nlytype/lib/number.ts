/** The locale's decimal mark, and a reader for what someone typed: grouping, currency and spaces are ignored. */
export function reader(locale: string) {
  const formatter = new Intl.NumberFormat(locale, { useGrouping: false })
  const decimal = formatter.formatToParts(1.5).find((p) => p.type === "decimal")?.value ?? "."
  const digits = new Map(Array.from({ length: 10 }, (_, n) => [formatter.format(n), String(n)]))
  /** A number, null for nothing typed, undefined for something that isn't a number. */
  return (text: string): number | null | undefined => {
    const normalized = [...text].map((c) => digits.get(c) ?? c).join("")
    const bare = normalized.replace(/[−–]/g, "-").split(decimal).map((s) => s.replace(/[^\d-]/g, "")).join(".")
    if (!/\d/.test(bare)) return /[^\s]/.test(text) ? undefined : null
    const n = Number(bare)
    return Number.isFinite(n) ? n : undefined
  }
}

/** The figures you edit: the locale's decimal mark, no grouping, as many decimals as the number has. */
export const raw = (n: number | null, locale: string) => (n === null ? "" : new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 20 }).format(n))
