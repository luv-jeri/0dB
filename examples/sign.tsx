"use client"

import * as React from "react"
import { Sign } from "@/registry/0db/ui/sign"
import { signs } from "@/lib/site/signs"
import { State } from "@/components/site/state"

export default function Example() {
  const [query, setQuery] = React.useState("")
  const [variant, setVariant] = React.useState<"words" | "dots">("words")
  const [face, setFace] = React.useState<"roman" | "italic">("roman")
  const [size, setSize] = React.useState<number>(24)

  const signEntries = React.useMemo(() => Object.entries(signs), [])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return signEntries
    return signEntries.filter(([name, shape]) =>
      name.toLowerCase().includes(q) || shape.word.toLowerCase().includes(q)
    )
  }, [signEntries, query])

  return (
    <div className="grid grid-cols-1 gap-(--db-space-8)">
      {/* Controls header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-(--db-rule) pb-(--db-space-4)">
        <div className="flex flex-wrap items-baseline gap-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search signs by name or word…"
            className="w-64 border border-(--db-rule) bg-transparent px-3 py-1 text-(--db-p) font-sans placeholder:text-(--db-pencil) focus:border-(--db-accent) focus:outline-none"
          />
          <span className="text-(--db-p) font-sans text-(--db-graphite)">
            {filtered.length === signEntries.length
              ? `${signEntries.length} signs`
              : `${filtered.length} of ${signEntries.length} signs`}
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-6 text-(--db-p) font-sans">
          <div className="flex items-baseline gap-2">
            <span className="text-(--db-pencil)">Variant:</span>
            <button
              type="button"
              onClick={() => setVariant("words")}
              className={`cursor-pointer px-1 ${variant === "words" ? "text-(--db-ink) underline" : "text-(--db-graphite)"}`}
            >
              words
            </button>
            <span className="text-(--db-pencil)">/</span>
            <button
              type="button"
              onClick={() => setVariant("dots")}
              className={`cursor-pointer px-1 ${variant === "dots" ? "text-(--db-ink) underline" : "text-(--db-graphite)"}`}
            >
              dots
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-(--db-pencil)">Face:</span>
            <button
              type="button"
              onClick={() => setFace("roman")}
              className={`cursor-pointer px-1 ${face === "roman" ? "text-(--db-ink) underline" : "text-(--db-graphite)"}`}
            >
              roman
            </button>
            <span className="text-(--db-pencil)">/</span>
            <button
              type="button"
              onClick={() => setFace("italic")}
              className={`cursor-pointer px-1 ${face === "italic" ? "text-(--db-ink) underline italic" : "text-(--db-graphite)"}`}
            >
              italic
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-(--db-pencil)">Size:</span>
            {[16, 24, 32, 48].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`cursor-pointer px-1 ${size === s ? "text-(--db-ink) underline" : "text-(--db-graphite)"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of signs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
        {filtered.map(([name, shape]) => (
          <div
            key={name}
            tabIndex={0}
            className="group flex flex-col items-center justify-center gap-2 rounded border border-transparent p-3 transition-colors hover:border-(--db-rule) focus:border-(--db-accent) focus:outline-none"
            title={`${name} ("${shape.word}")`}
          >
            <div className="flex items-center justify-center" style={{ width: size, height: size }}>
              <Sign shape={shape} variant={variant} face={face} size={size} />
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-sans text-(--db-ink)">{name}</span>
              <span className="text-[10px] font-sans italic text-(--db-pencil)">&ldquo;{shape.word}&rdquo;</span>
            </div>
          </div>
        ))}
      </div>

      {/* Attribution notice */}
      <div className="border-t border-(--db-rule) pt-(--db-space-4) text-[12px] font-sans text-(--db-pencil)">
        Sign drawings are derived from <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-(--db-ink) underline">Lucide</a> icons (ISC Licence; see <a href="/styles/0db/ICON-NOTICES.md" className="text-(--db-ink) underline">ICON-NOTICES.md</a>) and hand-drawn signs. Set with <a href="https://github.com/chenglou/pretext" target="_blank" rel="noopener noreferrer" className="text-(--db-ink) underline">@chenglou/pretext</a>.
      </div>
    </div>
  )
}

export function States() {
  const searchShape = signs.search
  const nextShape = signs["arrow-right"]
  const mailShape = signs.mail

  return (
    <>
      <State label="Words (rest)">
        {searchShape && <Sign shape={searchShape} variant="words" size={24} />}
      </State>
      <State label="Words (said)">
        {searchShape && <Sign shape={searchShape} variant="words" size={24} data-force="hover" />}
      </State>
      <State label="Dots (rest)">
        {searchShape && <Sign shape={searchShape} variant="dots" size={24} />}
      </State>
      <State label="Dots (said)">
        {searchShape && <Sign shape={searchShape} variant="dots" size={24} data-force="hover" />}
      </State>
      <State label="Italic (said)">
        {mailShape && <Sign shape={mailShape} variant="words" face="italic" size={24} data-force="hover" />}
      </State>
      <State label="Arrow next (rest)">
        {nextShape && <Sign shape={nextShape} variant="words" size={24} />}
      </State>
      <State label="Arrow next (said)">
        {nextShape && <Sign shape={nextShape} variant="words" size={24} data-force="hover" />}
      </State>
    </>
  )
}
