"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ThemeControls } from "@/components/site/theme-controls"
import { Search, type SearchGroup } from "@/components/site/search"
import { tempo } from "@/lib/site/tempo"

type Place = { num: string; name: string }

/** The fixed row: the mark, where you are (it rolls when that changes), search and the theme. */
export function TopRow({ places, groups }: { places: Record<string, Place>; groups: SearchGroup[] }) {
  const path = usePathname()
  const place = places[path] ?? places[path + "/"] ?? { num: "", name: "" }
  const now = React.useRef<HTMLParagraphElement>(null)
  const last = React.useRef(place.name)

  // The words change with the page; this only rolls them in from the side you're heading.
  React.useEffect(() => {
    const el = now.current
    if (!el || last.current === place.name) return
    const order = Object.values(places).map((p) => p.name)
    const dir = order.indexOf(place.name) >= order.indexOf(last.current) ? 1 : -1
    last.current = place.name
    el.animate([{ translate: `0 ${0.7 * dir}em`, opacity: 0 }, { translate: "0 0", opacity: 1 }], { duration: tempo("--db-moderato", el), easing: "cubic-bezier(.16,1,.3,1)" })
  }, [place.name, places])

  return (
    <header className="bar">
      <Link className="bar-mark" href="/" aria-label="0dB, home">
        <svg viewBox="0 0 20 13" aria-hidden="true"><path d="M1.5 11.5 A8.5 8.5 0 0 1 18.5 11.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="10" cy="10.2" r="1.7" fill="currentColor" /></svg>
        <span>0dB</span>
      </Link>
      <p className="bar-now" ref={now} aria-live="polite">
        <span className="bar-num">{place.num}</span> <span>{place.name}</span>
      </p>
      <div className="bar-end">
        <Search groups={groups} />
        <ThemeControls />
      </div>
    </header>
  )
}
