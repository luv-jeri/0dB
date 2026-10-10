"use client"

import * as React from "react"
import NextLink from "next/link"

import { signs } from "@/lib/site/signs"
import { registryURL } from "@/lib/site/config.mjs"
import { Sign, mirrored, type SignShape, type SignVariant } from "@/registry/0db/ui/sign"
import { Field, Input } from "@/registry/0db/ui/field"
import { ToggleGroup, ToggleGroupItem } from "@/registry/0db/ui/toggle-group"
import { CommandLine } from "@/registry/0db/ui/command-line"
import { Link } from "@/registry/0db/ui/link"
import { SignStill } from "@/components/site/sign-still"

const all = Object.entries(signs)
const VARIANTS: SignVariant[] = ["dots", "words", "fill"]
// The grid renders this many tiles at first and as many more each time its end comes near, so the page opens light.
const BATCH = 48

const watchDir = (change: () => void) => {
  const watcher = new MutationObserver(change)
  watcher.observe(document.documentElement, { attributeFilter: ["dir"] })
  return () => watcher.disconnect()
}
const rtlNow = () => getComputedStyle(document.documentElement).direction === "rtl"

/**
 * One sign in the grid: drawn still, as one SVG, until it's pointed at or focused; then the live Sign takes its
 * place, held at rest for a frame so the word is said with the motion and not already standing.
 */
function SignTile({ name, shape, variant, face, size, rtl, picked, onPick }: { name: string; shape: SignShape; variant: SignVariant; face: "roman" | "italic"; size: number; rtl: boolean; picked: boolean; onPick: (name: string) => void }) {
  const [live, setLive] = React.useState(false)
  const [waking, setWaking] = React.useState(false)
  React.useEffect(() => {
    if (!waking) return
    let frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => setWaking(false)) })
    return () => cancelAnimationFrame(frame)
  }, [waking])
  const wake = () => { if (!live) { setLive(true); setWaking(true) } }
  return (
    <li>
      <button type="button" className="doc-sign" aria-pressed={picked} data-waking={waking || undefined} onClick={() => onPick(name)} onPointerEnter={wake} onFocus={wake}>
        <span className="doc-sign-art">
          {live ? <Sign shape={shape} variant={variant} face={face} size={size} label="" /> : <SignStill shape={rtl && shape.mirror ? mirrored(shape) : shape} variant={variant} face={face} size={size} />}
        </span>
        <span className="doc-sign-word">{shape.word}</span>
        <span className="doc-sign-name">{name}</span>
      </button>
    </li>
  )
}

/**
 * Every sign: point at one and it says its word, press it and the line to install that sign in the chosen variant
 * comes up above the grid. The search matches the item's name or the word it says. Tiles are drawn still and come
 * alive one by one as they're pointed at, and the grid fills in batches as it's scrolled, so the page stays light.
 */
export function SignCatalogue() {
  const [query, setQuery] = React.useState("")
  const [variant, setVariant] = React.useState<SignVariant>("words")
  const [size, setSize] = React.useState("48")
  const [face, setFace] = React.useState<"roman" | "italic">("roman")
  const [picked, setPicked] = React.useState("search")
  const [limit, setLimit] = React.useState(BATCH)
  const rtl = React.useSyncExternalStore(watchDir, rtlNow, () => false)
  const end = React.useRef<HTMLDivElement>(null)
  const q = query.trim().toLowerCase()
  const shown = q ? all.filter(([name, shape]) => name.includes(q) || shape.word.includes(q)) : all
  const item = `sign-${picked}-${variant}`
  const count = shown.length === all.length ? `${all.length} signs, each in three variants` : `${shown.length} of ${all.length} signs`
  const more = shown.length > limit

  React.useEffect(() => {
    const el = end.current
    if (!el || !more) return
    const near = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setLimit((l) => l + BATCH) }, { rootMargin: "100% 0px" })
    near.observe(el)
    return () => near.disconnect()
  }, [more, limit])

  return (
    <div className="doc-signs">
      <div className="doc-signs-controls">
        <Field label="Find a sign" className="doc-signs-find">
          <Input type="search" value={query} placeholder="A name or a word" onChange={(event) => { setQuery(event.target.value); setLimit(BATCH) }} />
        </Field>
        <div className="doc-signs-choice">
          <span className="db-label" id="doc-signs-variant">Variant</span>
          <ToggleGroup variant="bracket" type="single" value={variant} onValueChange={(v) => v && setVariant(v as SignVariant)} aria-labelledby="doc-signs-variant">
            {VARIANTS.map((v) => <ToggleGroupItem key={v} value={v}>{v}</ToggleGroupItem>)}
          </ToggleGroup>
        </div>
        <div className="doc-signs-choice">
          <span className="db-label" id="doc-signs-size">Size</span>
          <ToggleGroup variant="bracket" type="single" value={size} onValueChange={(v) => v && setSize(v)} aria-labelledby="doc-signs-size">
            <ToggleGroupItem value="24">24</ToggleGroupItem>
            <ToggleGroupItem value="48">48</ToggleGroupItem>
            <ToggleGroupItem value="120">120</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="doc-signs-choice">
          <span className="db-label" id="doc-signs-face">Face</span>
          <ToggleGroup variant="bracket" type="single" value={face} onValueChange={(v) => v && setFace(v as "roman" | "italic")} aria-labelledby="doc-signs-face">
            <ToggleGroupItem value="roman">roman</ToggleGroupItem>
            <ToggleGroupItem value="italic">italic</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <div className="doc-signs-picked">
        <p className="doc-signs-count" aria-live="polite">{count}</p>
        <CommandLine runner command={`shadcn@latest add ${registryURL(item)}`} emphasis={item} />
      </div>
      {shown.length ? (
        <>
          <ul className="doc-signs-grid" style={{ "--tile": size === "24" ? "6.5rem" : size === "48" ? "8.5rem" : "11rem", "--art": `${Math.max(72, Number(size))}px` } as React.CSSProperties}>
            {shown.slice(0, limit).map(([name, shape]) => (
              <SignTile key={name} name={name} shape={shape} variant={variant} face={face} size={Number(size)} rtl={rtl} picked={picked === name} onPick={setPicked} />
            ))}
          </ul>
          {more ? <div ref={end} className="doc-signs-more" /> : null}
        </>
      ) : (
        <p className="doc-signs-none">No sign says “{query.trim()}” yet. <Link asChild><NextLink href="/requests/">Ask for it</NextLink></Link>.</p>
      )}
    </div>
  )
}
