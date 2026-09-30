"use client"

import * as React from "react"

import { Share } from "@/components/site/landing"
import { Noise } from "@/components/site/landing-noise"
import { Button } from "@/registry/0db/ui/button"
import { Input } from "@/registry/0db/ui/field"

// Make some noise: your words, set huge, and around them the same words run small and loud, as pretext flows
// every row around the letters. "Turn it down" spreads the silence out from your sentence until it rests,
// set light, at 0 dB. The link it shares carries the sentence, so whoever opens it hears it turned down too.

const START = "MAKE SOME NOISE!!!"

/** How loud a sentence reads, near enough: longer, more capitals and more exclamation marks are louder. */
export function loudness(text: string) {
  const t = text.trim()
  if (!t) return 0
  const letters = t.replace(/[^\p{L}]/gu, "")
  const caps = letters ? letters.replace(/[^\p{Lu}]/gu, "").length / letters.length : 0
  const bangs = (t.match(/!/g) ?? []).length
  return Math.min(140, Math.round(38 + Math.min(34, t.length * 0.9) + caps * 36 + Math.min(30, bangs * 7)))
}

export function Toy() {
  const [text, setText] = React.useState(START)
  const [quiet, setQuiet] = React.useState(true)
  const db = loudness(text)
  const say = text.trim() || " "

  // Opened from a shared link: the sentence arrives loud, then turns itself down.
  React.useEffect(() => {
    const shared = new URLSearchParams(location.search).get("say")?.slice(0, 80)
    if (!shared) return
    const loud = window.setTimeout(() => {
      setText(shared)
      setQuiet(false)
    })
    const hush = window.setTimeout(() => setQuiet(true), 1600)
    return () => {
      clearTimeout(loud)
      clearTimeout(hush)
    }
  }, [])

  return (
    <div className="toy" data-quiet={quiet || undefined}>
      <Noise className="toy-noise" words={`${say} ${db}dB  `} quiet={quiet} peak={db} />
      <p className="toy-say" data-noise-glyphs data-noise-center data-text={say}>
        <span>{say}</span>
      </p>
      <div className="toy-controls" data-hush>
        <label className="toy-field">
          <span className="toy-label">Your words</span>
          <Input
            className="toy-input"
            value={text}
            maxLength={80}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => {
              setText(e.target.value)
              setQuiet(false)
            }}
          />
        </label>
        <p className="toy-reading">
          <span className="toy-meter" dir="ltr" aria-hidden="true" data-noise-meter=" dB">
            0 dB
          </span>
          <span className="db-sr">{quiet ? "0 dB" : `${db} dB`}</span>
        </p>
        <div className="toy-actions">
          <Button variant="bracket" onClick={() => setQuiet((q) => !q)}>
            {quiet ? "Make some noise" : "Turn it down"}
          </Button>
          <Share url={`/?say=${encodeURIComponent(text.trim())}#noise`} title="Turned down to 0 dB">
            Share it
          </Share>
        </div>
      </div>
    </div>
  )
}
