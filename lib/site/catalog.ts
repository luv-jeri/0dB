import type { Movement } from "@/content/types"
import { entries } from "@/lib/site/entries"

export const movements: { num: Movement; name: string }[] = [
  { num: "II", name: "Type" },
  { num: "IV", name: "Space and line" },
  { num: "VI", name: "Controls" },
  { num: "VII", name: "Signals" },
  { num: "VIII", name: "Wayfinding" },
  { num: "IX", name: "Surfaces" },
  { num: "X", name: "Data" },
  { num: "XI", name: "Conversation" },
]

export type Entry = (typeof entries)[number]

/** Every item, by movement, each movement in the specimen's order. */
export const catalog = movements.map((m) => ({ ...m, items: entries.filter((e) => e.meta.movement === m.num) }))

/** The flat reading order the item pages page through. */
export const ordered: Entry[] = catalog.flatMap((m) => m.items)

export const movementName = (num: Movement) => movements.find((m) => m.num === num)?.name ?? num

/** What an item stands on, in words. */
export const UNDER = { native: "Native HTML", hook: "Native HTML and a hook", radix: "Radix", cmdk: "cmdk" } as const
