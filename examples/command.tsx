"use client"

import * as React from "react"

import { Button } from "@/registry/0db/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandHint,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/registry/0db/ui/command"
import { Kbd } from "@/registry/0db/ui/kbd"

const PROJECTS = [
  ["Halden", "Identity, 2026"],
  ["Northlight", "Web, 2026"],
  ["Oda Studio", "Identity, 2025"],
  ["Tidewater", "Motion, 2025"],
  ["Marram", "Web, 2025"],
]

function Palette({ onRun, whole }: { onRun: (said: string) => void; whole?: boolean }) {
  return (
    <>
      <CommandInput placeholder="Type to search" />
      <CommandList style={whole ? { maxHeight: "none" } : undefined}>
        <CommandEmpty>Nothing matches. Try a project, like Halden.</CommandEmpty>
        <CommandGroup heading="Projects">
          {PROJECTS.map(([name, hint]) => (
            <CommandItem key={name} value={name} keywords={[hint]} onSelect={() => onRun(`Opened ${name}.`)}>
              {name}
              <CommandHint>{hint}</CommandHint>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem value="Start a project" onSelect={() => onRun("Started a new project.")}>Start a project</CommandItem>
          <CommandItem value="Show the grid" keywords={["layout"]} onSelect={() => onRun("Showed the grid.")}>
            Show the grid
            <CommandShortcut>G</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  )
}

/** The palette opens from the button or from ⌘K / Ctrl+K; the key is registered here, not in the item. */
export default function Example() {
  const [open, setOpen] = React.useState(false)
  const [said, setSaid] = React.useState("")
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
  return (
    <div className="flex flex-wrap items-center" style={{ gap: "var(--db-space-5)" }}>
      <Button variant="bracket" onClick={() => setOpen(true)}>
        Search <Kbd>⌘K</Kbd>
      </Button>
      <p aria-live="polite">{said}</p>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search projects and actions">
        <Palette
          onRun={(next) => {
            setSaid(next)
            setOpen(false)
          }}
        />
      </CommandDialog>
    </div>
  )
}

export function States() {
  return (
    <Command aria-label="Commands">
      <Palette onRun={() => {}} whole />
    </Command>
  )
}
