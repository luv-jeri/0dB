"use client"

import * as React from "react"
import NextLink from "next/link"

import { signs } from "@/lib/site/signs"
import { registryURL } from "@/lib/site/config.mjs"
import { Sign, type SignVariant } from "@/registry/0db/ui/sign"
import { Field, Input } from "@/registry/0db/ui/field"
import { ToggleGroup, ToggleGroupItem } from "@/registry/0db/ui/toggle-group"
import { CommandLine } from "@/registry/0db/ui/command-line"
import { Link } from "@/registry/0db/ui/link"

const all = Object.entries(signs)
const VARIANTS: SignVariant[] = ["dots", "words", "fill"]

/**
 * Every sign, live: point at one and it says its word, press it and the line to install that sign in the
 * chosen variant comes up above the grid. The search matches the item's name or the word it says.
 */
export function SignCatalogue() {
  const [query, setQuery] = React.useState("")
  const [variant, setVariant] = React.useState<SignVariant>("words")
  const [size, setSize] = React.useState("48")
  const [face, setFace] = React.useState<"roman" | "italic">("roman")
  const [picked, setPicked] = React.useState("search")
  const q = query.trim().toLowerCase()
  const shown = q ? all.filter(([name, shape]) => name.includes(q) || shape.word.includes(q)) : all
  const item = `sign-${picked}-${variant}`
  const count = shown.length === all.length ? `${all.length} signs, each in three variants` : `${shown.length} of ${all.length} signs`

  return (
    <div className="doc-signs">
      <div className="doc-signs-controls">
        <Field label="Find a sign" className="doc-signs-find">
          <Input type="search" value={query} placeholder="A name or a word" onChange={(event) => setQuery(event.target.value)} />
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
        <ul className="doc-signs-grid" style={{ "--tile": size === "24" ? "6.5rem" : size === "48" ? "8.5rem" : "11rem" } as React.CSSProperties}>
          {shown.map(([name, shape]) => (
            <li key={name}>
              <button type="button" className="doc-sign" aria-pressed={picked === name} onClick={() => setPicked(name)}>
                <span className="doc-sign-art"><Sign shape={shape} variant={variant} face={face} size={Number(size)} label="" /></span>
                <span className="doc-sign-word">{shape.word}</span>
                <span className="doc-sign-name">{name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="doc-signs-none">No sign says “{query.trim()}” yet. <Link asChild><NextLink href="/requests/">Ask for it</NextLink></Link>.</p>
      )}
    </div>
  )
}
