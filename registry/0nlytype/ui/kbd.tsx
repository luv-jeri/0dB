import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"

type KbdProps = React.ComponentProps<"kbd"> & {
  /** Draws the key pressed: the corners close into the whole cap, in ink, and it goes down a little. */
  pressed?: boolean
  /** typewriter draws the key as a ring that inks into a disc; chord stacks a combination's modifiers small before its key. */
  variant?: "typewriter" | "chord"
}

const MODIFIERS = "⌘⇧⌥⌃"

/** "⌘⇧K" or "Ctrl+Shift+K" into its modifiers and its key. */
function chord(keys: string): [string[], string] {
  if (keys.length > 1 && keys.includes("+")) {
    const parts = keys.split("+").map((k) => k.trim()).filter(Boolean)
    return [parts.slice(0, -1), parts.at(-1) ?? keys]
  }
  let i = 0
  while (i < keys.length - 1 && MODIFIERS.includes(keys[i])) i++
  return [[...keys.slice(0, i)], keys.slice(i)]
}

/** A key, drawn as the corners of its cap. */
function Kbd({ className, pressed, variant, children, ...props }: KbdProps) {
  let body = children
  if (variant === "chord" && typeof children === "string") {
    const [mods, key] = chord(children)
    body = mods.length ? (
      <>
        <span className="db-kbd-mods">
          {mods.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </span>
        <span className="db-kbd-key">{key}</span>
      </>
    ) : (
      <span className="db-kbd-key">{key}</span>
    )
  }
  return (
    <kbd data-slot="kbd" data-variant={variant} data-pressed={pressed || undefined} className={cn("db-kbd", className)} {...props}>
      {body}
    </kbd>
  )
}

export { Kbd, type KbdProps }
