"use client"

import * as React from "react"

import { signs } from "@/lib/site/signs"
import { Sign, type SignVariant } from "@/registry/0db/ui/sign"

type Set = { variant: SignVariant | "all"; size: number; face: "roman" | "italic"; from: number; count: number; say: boolean; names: string[] }

const none = () => () => {}

/** Reads the set from the address once mounted, so the sheet stays a static page. */
export function Sheet() {
  const search = React.useSyncExternalStore(none, () => window.location.search, () => null)
  const set = React.useMemo<Set | null>(() => {
    if (search == null) return null
    const q = new URLSearchParams(search)
    const [variant, size] = (q.get("set") ?? "words-120").split("-")
    return { variant: variant as SignVariant | "all", size: Number(size) || 120, face: q.get("face") === "italic" ? "italic" : "roman", from: Number(q.get("from")) || 0, count: Number(q.get("count")) || 9999, say: q.get("say") === "1", names: q.get("names")?.split(",") ?? [] }
  }, [search])
  if (!set) return null
  const entries = Object.entries(signs).filter(([name]) => !set.names.length || set.names.includes(name)).slice(set.from, set.from + set.count)
  const variants: SignVariant[] = set.variant === "all" ? ["dots", "words", "fill"] : [set.variant]
  const tile = Math.max(variants.length * (set.size + 12) + 12, 96)
  return (
    <>
      <h1 className="lab-name">{set.variant}, {set.size}px{set.face === "italic" ? ", italic" : ""}: {entries.length} signs</h1>
      <div className="lab-sheet" style={{ "--tile": `${tile}px` } as React.CSSProperties}>
        {entries.map(([name, shape]) => (
          <figure key={name} className="lab-tile" data-force={set.say ? "hover" : undefined}>
            <span className="lab-variants">
              {variants.map((v) => <button key={v} type="button" className="lab-hit"><Sign shape={shape} variant={v} face={set.face} size={set.size} /></button>)}
            </span>
            <figcaption className="lab-key">{name}<br />{shape.word}</figcaption>
          </figure>
        ))}
      </div>
    </>
  )
}
