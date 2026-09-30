"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { cn } from "@/registry/0db/lib/utils"

const SearchContext = React.createContext("")
const SearchSetter = React.createContext<(search: string) => void>(() => {})

// A row matches when the words you typed sit inside its value or keywords.
// ponytail: substring, not cmdk's fuzzy score, so the highlighter can mark exactly what matched.
const contains = (value: string, search: string, keywords?: string[]) =>
  [value, ...(keywords ?? [])].join(" ").toLowerCase().includes(search.trim().toLowerCase()) ? 1 : 0

/** The highlighter: wraps each place the query appears in <mark>. */
function marked(text: string, query: string): React.ReactNode {
  const q = query.trim().toLowerCase()
  if (!q) return text
  const lower = text.toLowerCase()
  const out: React.ReactNode[] = []
  let at = 0
  for (let i = lower.indexOf(q); i >= 0; i = lower.indexOf(q, at)) {
    if (i > at) out.push(text.slice(at, i))
    out.push(<mark key={i}>{text.slice(i, i + q.length)}</mark>)
    at = i + q.length
  }
  out.push(text.slice(at))
  return out
}

/** A command palette. What you type is set large and italic; matches are marked; the chosen row steps forward. */
function Command({ className, filter = contains, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  const [search, setSearch] = React.useState("")
  return (
    <SearchContext.Provider value={search}>
      <SearchSetter.Provider value={setSearch}>
        <CommandPrimitive data-slot="command" filter={filter} className={cn("db-command", className)} {...props} />
      </SearchSetter.Provider>
    </SearchContext.Provider>
  )
}
/** What you type is yours, so it is italic and as large as a headline. Give it a placeholder that names what to type. */
function CommandInput({ className, onValueChange, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  const search = React.useContext(SearchContext)
  const setSearch = React.useContext(SearchSetter)
  return (
    <CommandPrimitive.Input
      data-slot="command-input"
      aria-label={props["aria-label"] ?? props.placeholder}
      value={search}
      onValueChange={(next) => {
        setSearch(next)
        onValueChange?.(next)
      }}
      className={cn("db-command-input", className)}
      {...props}
    />
  )
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return <CommandPrimitive.List data-slot="command-list" className={cn("db-command-list", className)} {...props} />
}

/** Empty copy names something to try. */
function CommandEmpty({ className, children, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  const search = React.useContext(SearchContext)
  return (
    <CommandPrimitive.Empty data-slot="command-empty" className={cn("db-command-empty", className)} {...props}>
      {children ?? <>Nothing matches “{search}”.</>}
    </CommandPrimitive.Empty>
  )
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return <CommandPrimitive.Group data-slot="command-group" className={cn("db-command-group", className)} {...props} />
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return <CommandPrimitive.Separator data-slot="command-separator" className={cn("db-command-separator", className)} {...props} />
}

/** A row. Words in it are set as the name and marked where they match; other parts (CommandHint, CommandShortcut) sit at the end. */
function CommandItem({ className, children, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  const search = React.useContext(SearchContext)
  return (
    <CommandPrimitive.Item data-slot="command-item" className={cn("db-command-option", className)} {...props}>
      {React.Children.map(children, (child) =>
        typeof child === "string" ? <span className="db-command-name">{marked(child, search)}</span> : child,
      )}
    </CommandPrimitive.Item>
  )
}

/** A key that runs the row, drawn as a ring (base db-kbd). */
function CommandShortcut({ className, ...props }: React.ComponentProps<"kbd">) {
  return <kbd data-slot="command-shortcut" className={cn("db-kbd", className)} {...props} />
}

/** A quiet word at the end of a row, when it isn't a key: a year, a kind. */
function CommandHint({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="command-hint" className={cn("db-command-hint", className)} {...props} />
}

type CommandDialogProps = React.ComponentProps<typeof Command> & {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Read out by screen readers; not shown. */
  title?: string
}

/** The ⌘K palette: a modal over the page. Register the key yourself; this only opens where you tell it. */
function CommandDialog({ open, onOpenChange, title = "Search", children, ...props }: CommandDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay data-slot="command-overlay" className="db-command-overlay" />
        <DialogPrimitive.Content data-slot="command-dialog" aria-describedby={undefined} className="db-command-dialog db-corners">
          <DialogPrimitive.Title className="db-sr">{title}</DialogPrimitive.Title>
          <Command {...props}>{children}</Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandHint,
  type CommandDialogProps,
}
