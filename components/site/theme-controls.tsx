"use client"

import * as React from "react"

import { Pick, Picks } from "@/registry/0db/ui/picks"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/0db/ui/popover"
import { Select } from "@/registry/0db/ui/select"
import { Switch } from "@/registry/0db/ui/switch"
import { Button } from "@/registry/0db/ui/button"
import { THEME_KEY } from "@/components/site/theme-script"

export type Theme = { mode?: string; scheme?: string; key?: string; pair?: string }

export const SCHEMES = ["cotton", "blueprint", "statue", "silence", "riso"]
export const PAIRS = [
  { value: "parma", note: "Archivo, Bodoni Moda", words: "Archivo and Bodoni" },
  { value: "press", note: "Schibsted Grotesk, Newsreader", words: "Schibsted and Newsreader" },
  { value: "paris", note: "Instrument Sans, EB Garamond", words: "Instrument and Garamond" },
  { value: "salon", note: "Bricolage Grotesque, Cormorant", words: "Bricolage and Cormorant" },
]
export const KEYS = ["ultramarine", "viridian", "ember", "violet"]

// The theme lives on <html>; the controls read it from there, so the head script and these agree.
const ATTRS = ["data-mode", "data-scheme", "data-key", "data-pair"]
function subscribe(changed: () => void) {
  const watch = new MutationObserver(changed)
  watch.observe(document.documentElement, { attributes: true, attributeFilter: ATTRS })
  return () => watch.disconnect()
}
const snapshot = () => ATTRS.map((a) => document.documentElement.getAttribute(a) ?? "").join(" ")
const parse = (s: string): Theme => {
  const [mode, scheme, key, pair] = s.split(" ").map((v) => v || undefined)
  return { mode, scheme, key, pair }
}

/** Apply a theme. The new page opens as a circle from the control that changed it (the focused one, unless given). */
function write(next: Theme, from?: Element | null) {
  const root = document.documentElement
  const at = from ?? (document.activeElement === document.body ? null : document.activeElement)
  if (at) {
    const r = at.getBoundingClientRect()
    root.style.setProperty("--vt-x", `${r.left + r.width / 2}px`)
    root.style.setProperty("--vt-y", `${r.top + r.height / 2}px`)
  } else {
    root.style.removeProperty("--vt-x")
    root.style.removeProperty("--vt-y")
  }
  const apply = () => {
    for (const k of ["mode", "scheme", "key", "pair"] as const) {
      const v = next[k]
      if (v && !(k === "scheme" && v === "cotton") && !(k === "pair" && v === "parma")) root.dataset[k] = v
      else delete root.dataset[k]
    }
  }
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches
  if (!still && "startViewTransition" in document) document.startViewTransition(apply)
  else apply()
  try { localStorage.setItem(THEME_KEY, JSON.stringify(next)) } catch {} // private mode: the choice lasts the visit
}

/** The theme on <html>, and a setter that takes the control it came from. */
export function useTheme() {
  const theme = parse(React.useSyncExternalStore(subscribe, snapshot, () => ""))
  const set = (patch: Theme, from?: Element | null) => write({ ...theme, ...patch }, from)
  return [theme, set] as const
}

/** Nocturne, and the tuning popover: scheme, key and pair. */
export function ThemeControls() {
  const [theme, set] = useTheme()
  // In the bar on wide screens; inside Tune where the bar has no room for it.
  const nocturne = (className: string) => (
    <Switch labelClassName={className} checked={theme.mode === "nocturne"} onCheckedChange={(on) => set({ mode: on ? "nocturne" : "day" })}>
      Nocturne is
    </Switch>
  )

  return (
    <div className="bar-controls">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="quiet">Tune</Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="tune">
          {nocturne("tune-nocturne")}
          <Picks legend="Scheme" name="scheme" value={theme.scheme ?? "cotton"} onValueChange={(scheme) => set({ scheme })}>
            {SCHEMES.map((s) => <Pick key={s} value={s}>{s}</Pick>)}
          </Picks>
          <Select label="Key" value={theme.key ?? ""} onChange={(e) => set({ key: e.target.value || undefined })}>
            <option value="">the scheme&apos;s own</option>
            {KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
          </Select>
          <Picks legend="Pair" name="pair" value={theme.pair ?? "parma"} onValueChange={(pair) => set({ pair })}>
            {PAIRS.map((p) => (
              <Pick key={p.value} value={p.value}>
                {p.value} <span className="tune-note">{p.note}</span>
              </Pick>
            ))}
          </Picks>
        </PopoverContent>
      </Popover>
      {nocturne("bar-nocturne")}
    </div>
  )
}
