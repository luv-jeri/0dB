"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { ModeToggle } from "@/registry/0db/ui/mode-toggle"
import { Pick, PickDescription, Picks, PickTitle } from "@/registry/0db/ui/picks"

/** The four switches on <html>. Each is optional: no scheme is cotton, no key is the scheme's own, no pair is parma. */
type AppearanceValue = { mode?: string; scheme?: string; key?: string; pair?: string }

/** Where the choice is kept: one JSON object, the four switches together. */
const APPEARANCE_KEY = "0db-theme"

const SCHEMES = ["cotton", "blueprint", "statue", "silence", "riso"]
/** Each scheme's own accent, by name, for the sentence. */
const OWN: Record<string, string> = { cotton: "ultramarine", blueprint: "orange", statue: "gold", silence: "cobalt", riso: "magenta" }
const KEYS = ["ultramarine", "viridian", "ember", "violet"]
const PAIRS = [
  { value: "parma", note: "Archivo, Bodoni Moda", words: "Archivo and Bodoni" },
  { value: "press", note: "Schibsted Grotesk, Newsreader", words: "Schibsted and Newsreader" },
  { value: "paris", note: "Instrument Sans, EB Garamond", words: "Instrument and Garamond" },
  { value: "salon", note: "Bricolage Grotesque, Cormorant", words: "Bricolage and Cormorant" },
]

// The choice lives on <html>; everything reads it from there, so a head script, the page and every control agree.
const ATTRS = ["data-mode", "data-scheme", "data-key", "data-pair"]
function subscribe(changed: () => void) {
  const watch = new MutationObserver(changed)
  watch.observe(document.documentElement, { attributes: true, attributeFilter: ATTRS })
  return () => watch.disconnect()
}
const snapshot = () => ATTRS.map((a) => document.documentElement.getAttribute(a) ?? "").join(" ")
const parse = (s: string): AppearanceValue => {
  const [mode, scheme, key, pair] = s.split(" ").map((v) => v || undefined)
  return { mode, scheme, key, pair }
}

/**
 * Put a choice on <html> and keep it. The new page opens as a circle from the control that changed it: the one given,
 * else the focused one. Reduced motion, or a browser without view transitions, changes it at once.
 */
function applyAppearance(next: AppearanceValue, from?: Element | null) {
  const root = document.documentElement
  const at = from ?? (document.activeElement === document.body ? null : document.activeElement)
  if (at) {
    const r = at.getBoundingClientRect()
    root.style.setProperty("--db-appearance-x", `${r.left + r.width / 2}px`)
    root.style.setProperty("--db-appearance-y", `${r.top + r.height / 2}px`)
  } else {
    root.style.removeProperty("--db-appearance-x")
    root.style.removeProperty("--db-appearance-y")
  }
  const apply = () => {
    for (const k of ["mode", "scheme", "key", "pair"] as const) {
      const v = next[k]
      if (v && !(k === "scheme" && v === "cotton") && !(k === "pair" && v === "parma")) root.dataset[k] = v
      else delete root.dataset[k]
    }
  }
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches
  // A control can ask for its own scene change (the mode toggle's data-scene): it becomes the transition's type.
  const scene = at?.getAttribute("data-scene")
  if (still || !("startViewTransition" in document)) apply()
  else if (scene) {
    try { document.startViewTransition({ update: apply, types: [scene] }) }
    catch { document.startViewTransition(apply) } // ponytail: browsers without types get the house circle
  } else document.startViewTransition(apply)
  try { localStorage.setItem(APPEARANCE_KEY, JSON.stringify(next)) } catch {} // private mode: the choice lasts the visit
}

/** The appearance on <html>, and a setter that takes a patch and the control it came from. */
function useAppearance() {
  const now = parse(React.useSyncExternalStore(subscribe, snapshot, () => ""))
  const set = (patch: AppearanceValue, from?: Element | null) => applyAppearance({ ...now, ...patch }, from)
  return [now, set] as const
}

/** The choice as one sentence: "Cotton, in ultramarine, set in Archivo and Bodoni." Yours in the italic. */
function sentence({ scheme = "cotton", key, pair = "parma" }: AppearanceValue) {
  const words = PAIRS.find((p) => p.value === pair)?.words ?? pair
  return { scheme: scheme[0].toUpperCase() + scheme.slice(1), key: key ?? OWN[scheme] ?? "its own colour", pair: words }
}

type AppearanceProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  /** The appearance, when you hold it. Leave it out and the control reads and writes <html> and keeps the choice. */
  value?: AppearanceValue
  /** Called with the whole appearance after every change, and the element that made it. */
  onValueChange?: (value: AppearanceValue, from: Element | null) => void
}

/**
 * Choose the look: scheme, key and pair as three lists of picks, and the answer written back above them as one
 * sentence, "Cotton, in ultramarine, set in Archivo and Bodoni.", which the night toggle finishes: "Read by light."
 * Yours in the italic. On its own it writes the four switches on <html>, keeps them under 0db-theme, and the new page
 * opens as a circle from whatever you touched.
 */
function Appearance({ value, onValueChange, className, ...props }: AppearanceProps) {
  const [page, setPage] = useAppearance()
  const now = value ?? page
  const change = (patch: AppearanceValue, from: Element | null = null) => {
    if (value === undefined) setPage(patch, from)
    onValueChange?.({ ...now, ...patch }, from)
  }
  const said = sentence(now)
  const scheme = now.scheme ?? "cotton"
  const id = React.useId()
  // One accent in view: only the list you're in (or were last in) marks its choice with the accent dot.
  const [at, setAt] = React.useState<"scheme" | "key" | "pair">("scheme")
  const here = (list: typeof at) => ({ "data-here": at === list ? "" : undefined, onFocus: () => setAt(list) })

  return (
    <div data-slot="appearance" className={cn("db-appearance", className)} {...props}>
      <p className="db-appearance-answer">
        <output htmlFor={`${id}-scheme ${id}-key ${id}-pair`}>
          <span className="db-yours">{said.scheme}</span>, in <span className="db-yours">{said.key}</span>, set in <span className="db-yours">{said.pair}</span>.
        </output>{" "}
        <ModeToggle variant="sentence" mode={now.mode === "nocturne" ? "nocturne" : "day"} onModeChange={(mode, e) => change({ mode }, e.currentTarget)} />
      </p>
      <div className="db-appearance-picks">
        <Picks id={`${id}-scheme`} {...here("scheme")} legend="Scheme" value={scheme} onValueChange={(v) => change({ scheme: v })}>
          {SCHEMES.map((s) => <Pick key={s} value={s}>{s}</Pick>)}
        </Picks>
        <Picks id={`${id}-key`} {...here("key")} legend="Key" value={now.key ?? ""} onValueChange={(v) => change({ key: v || undefined })}>
          <Pick value="">
            <PickTitle>its own</PickTitle>
            <PickDescription>{OWN[scheme] ?? "the scheme's"}</PickDescription>
          </Pick>
          {KEYS.map((k) => <Pick key={k} value={k}>{k}</Pick>)}
        </Picks>
        <Picks id={`${id}-pair`} {...here("pair")} legend="Pair" value={now.pair ?? "parma"} onValueChange={(v) => change({ pair: v })}>
          {PAIRS.map((p) => (
            <Pick key={p.value} value={p.value}>
              <PickTitle>{p.value}</PickTitle>
              <PickDescription>{p.note}</PickDescription>
            </Pick>
          ))}
        </Picks>
      </div>
    </div>
  )
}

export { Appearance, useAppearance, applyAppearance, APPEARANCE_KEY, SCHEMES, KEYS, PAIRS, type AppearanceProps, type AppearanceValue }
