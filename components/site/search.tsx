"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/registry/0db/ui/button"
import { Kbd } from "@/registry/0db/ui/kbd"
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/registry/0db/ui/command"

export type SearchGroup = { heading: string; entries: { label: string; href: string; hint?: string; keywords?: string[] }[] }

/** ⌘K: every item, page and token, matched by cmdk. */
export function Search({ groups }: { groups: SearchGroup[] }) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen((o) => !o) }
    }
    addEventListener("keydown", onKey)
    return () => removeEventListener("keydown", onKey)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    if (href.startsWith("copy:")) navigator.clipboard?.writeText(href.slice(5)).catch(() => {})
    else router.push(href)
  }

  return (
    <>
      <Button variant="quiet" className="bar-search" onClick={() => setOpen(true)} aria-keyshortcuts="Meta+K Control+K">
        Search <Kbd dir="ltr">⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search the docs">
        <CommandInput placeholder="A component, a page or a token" />
        <CommandList>
          <CommandEmpty>Nothing by that name. Try “menu” or “accent”.</CommandEmpty>
          {groups.map((g) => (
            <CommandGroup key={g.heading} heading={g.heading}>
              {g.entries.map((e) => (
                <CommandItem key={e.href} value={`${g.heading} ${e.label}`} keywords={e.keywords} onSelect={() => go(e.href)}>
                  {e.label}
                  {e.hint ? <span className="search-hint">{e.hint}</span> : null}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
