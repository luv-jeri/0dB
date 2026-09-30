"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { Scrollbar, type ScrollbarSection } from "@/registry/0db/ui/scrollbar"

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]

// The sections are whatever the page has marked, read from the document after each commit: a string, so React can tell when it changed.
const read = () =>
  JSON.stringify(
    [...document.querySelectorAll<HTMLElement>("[data-rail][id]")].map((s, i) => ({ id: s.id, num: ROMAN[i] ?? String(i + 1), name: s.dataset.rail! })),
  )
const never = () => () => {}

/** The page's scrollbar, once, for every route. Any element with an id and data-rail="Name" becomes a mark on it, numbered in order. */
export function PageRail() {
  usePathname() // a new page renders this again, and the sections are read again with it
  const sections = React.useSyncExternalStore(never, () => read(), () => "[]") // (a fresh function each time, so React looks again after the commit)
  return <Scrollbar variant="page" className="page-rail" sections={JSON.parse(sections) as ScrollbarSection[]} />
}
