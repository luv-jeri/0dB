"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/registry/0db/ui/radio-group"
import { CopyButton } from "@/registry/0db/ui/source"

/** What runs a package without installing it, per package manager. */
const RUNNERS = { npm: "npx", pnpm: "pnpm dlx", yarn: "yarn", bun: "bunx --bun" } as const
type Runner = keyof typeof RUNNERS
const STORE = "0db-runner"

// Every command line on the page shares one choice, and the next visit remembers it.
let chosen: Runner | undefined
const heard = new Set<() => void>()
const isRunner = (v: unknown): v is Runner => typeof v === "string" && v in RUNNERS
function current(): Runner {
  if (chosen) return chosen
  try {
    const stored = localStorage.getItem(STORE)
    if (isRunner(stored)) return stored
  } catch {} // private mode: the choice lasts the visit
  return "npm"
}
function subscribe(notify: () => void) {
  heard.add(notify)
  addEventListener("storage", notify)
  return () => {
    heard.delete(notify)
    removeEventListener("storage", notify)
  }
}
function choose(next: Runner) {
  chosen = next
  try {
    localStorage.setItem(STORE, next)
  } catch {}
  heard.forEach((notify) => notify())
}

type CommandLineProps = Omit<React.ComponentProps<"figure">, "children"> & {
  /** The command, without a runner when `runner` is set: "shadcn@latest add https://…/button.json". */
  command: string
  /** Run it through a package manager the reader picks (npx, pnpm dlx, yarn, bunx). The pick is shared and remembered. */
  runner?: boolean
  /** The part that's the reader's, set in italic: an item's name inside a URL. */
  emphasis?: string
}

/**
 * One line to type, set on a baseline like a field already filled in. The runner and the address
 * recede to pencil; the words that matter are ink, and the part that's yours is italic.
 * Copying draws the baseline in the accent.
 */
function CommandLine({ command, runner = false, emphasis, className, ...props }: CommandLineProps) {
  const pick = React.useSyncExternalStore(subscribe, current, () => "npm" as Runner)
  const prefix = runner ? `${RUNNERS[pick]} ` : ""
  const [copied, setCopied] = React.useState(0)
  return (
    <figure data-slot="command-line" className={cn("db-command-line", className)} {...props}>
      {runner ? (
        <RadioGroup aria-label="Package manager" className="db-command-line-runners" value={pick} onValueChange={(v) => isRunner(v) && choose(v)}>
          {(Object.keys(RUNNERS) as Runner[]).map((r) => (
            <RadioGroupItem key={r} value={r}>
              {r}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      ) : null}
      <div key={copied} data-copied={copied || undefined} className="db-command-line-row">
        <code data-slot="command-line-text" className="db-command-line-text">
          {prefix ? <span className="db-command-line-quiet">{prefix}</span> : null}
          {words(command, emphasis)}
        </code>
        <CopyButton text={prefix + command} onCopied={() => setCopied((c) => c + 1)} />
      </div>
    </figure>
  )
}

/** Addresses recede, all but the emphasis; a long one breaks after a slash. */
function words(command: string, emphasis?: string) {
  return command.split(/(\s+)/).map((word, i) => {
    if (!/^[a-z]+:\/\//.test(word)) return <React.Fragment key={i}>{word}</React.Fragment>
    const at = emphasis ? word.lastIndexOf(emphasis) : -1
    const before = at < 0 ? word : word.slice(0, at)
    return (
      <span key={i} className="db-command-line-quiet">
        {breakable(before)}
        {at < 0 ? null : (
          // The name and what follows it (".json") hold together: no line starts with ".json" or "card".
          <span className="db-command-line-whole">
            <em className="db-command-line-yours">{emphasis}</em>
            {word.slice(at + emphasis!.length)}
          </span>
        )}
      </span>
    )
  })
}

const breakable = (s: string) =>
  s.split(/(?<=\/)/).map((part, i) => (
    <React.Fragment key={i}>
      {i ? <wbr /> : null}
      {part}
    </React.Fragment>
  ))

export { CommandLine, type CommandLineProps }
