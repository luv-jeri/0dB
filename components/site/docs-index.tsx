"use client"

import * as React from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/registry/0db/ui/button"
import { Sidebar, SidebarGroup, SidebarLink } from "@/registry/0db/ui/sidebar"

export type IndexGroup = { label: string; links: { href: string; title: string; summary?: string }[] }

// Folding is remembered, and every open docs tab folds together.
const STORE = "0db-index-folded"
const heard = new Set<() => void>()
function subscribe(notify: () => void) {
  heard.add(notify)
  addEventListener("storage", notify)
  return () => {
    heard.delete(notify)
    removeEventListener("storage", notify)
  }
}
function isFolded() {
  try {
    return localStorage.getItem(STORE) === "1"
  } catch {
    return false
  }
}
function setFolded(next: boolean) {
  try {
    localStorage.setItem(STORE, next ? "1" : "0")
  } catch {} // private mode: the fold lasts the page
  heard.forEach((notify) => notify())
}

/** The docs' left index: the pages, then every item by movement. The page you're on takes the accent. Folds to a ruler: a numeral per movement, a tick per page, and pointing at one names it with a line about it. */
export function DocsIndex({ groups }: { groups: IndexGroup[] }) {
  const path = usePathname()
  const here = path.endsWith("/") ? path : path + "/"
  const folded = React.useSyncExternalStore(subscribe, isFolded, () => false)
  return (
    <div className="docs-index" data-folded={folded || undefined}>
      <Button
        variant="quiet"
        className="docs-index-fold"
        aria-expanded={!folded}
        aria-controls="docs-index"
        aria-label={folded ? "Unfold the index" : "Fold the index"}
        onClick={() => setFolded(!folded)}
      >
        {folded ? "Unfold" : "Fold"}
      </Button>
      <Sidebar id="docs-index" label="Documentation" className="docs-index-list" folded={folded} compact>
        {groups.map((g) => (
          <SidebarGroup key={g.label} label={g.label}>
            {g.links.map((l) => (
              <SidebarLink key={l.href} asChild current={here === l.href} preview={l.summary}>
                <NextLink href={l.href}>{l.title}</NextLink>
              </SidebarLink>
            ))}
          </SidebarGroup>
        ))}
      </Sidebar>
    </div>
  )
}
