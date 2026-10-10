"use client"

import * as React from "react"

import { Noise } from "@/components/site/landing-noise"
import { SharePlaces, useShare } from "@/components/site/landing-share"
import { Button } from "@/registry/0nlytype/ui/button"
import { Input } from "@/registry/0nlytype/ui/field"

// Make some noise: your words, set huge, and around them the same words run small and loud, as pretext flows
// every row around the letters. "Turn it down" spreads the silence out from your sentence until it rests,
// set light, at 0 dB. The link it shares carries the sentence, so whoever opens it finds it already turned down.
// A fine pointer carries a pause in the noise, drawn as a ring with one word in it: Share. Inside the ring it
// is quiet, your words too. A click anywhere copies the link, and the ring stops and opens, and the places
// to send it stand in the silence. Touch and keys have the same thing in "Share it".

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
  const [hold, setHold] = React.useState<{ x: number; y: number; r: number } | null>(null)
  const db = loudness(text)
  const say = text.trim() || " "
  const root = React.useRef<HTMLDivElement>(null)
  const dismissing = React.useRef(false)
  const share = useShare(`/?say=${encodeURIComponent(text.trim())}#noise`)
  const { open, show } = share
  const held = open ? hold : null

  // Remember the gesture before useShare's document listener closes the panel.
  React.useEffect(() => {
    const press = (event: PointerEvent) => { dismissing.current = open && !!root.current?.contains(event.target as Node) }
    window.addEventListener("pointerdown", press, true)
    return () => window.removeEventListener("pointerdown", press, true)
  }, [open])

  // The ring stops where it's asked, or mid-words from a control, kept whole inside the section.
  const stop = React.useCallback(
    (x: number | null, y: number | null, from: Element | null) => {
      const el = root.current
      const disc = el?.querySelector<HTMLElement>(".toy-places")
      if (!el || !disc) return
      const b = el.getBoundingClientRect()
      const r = disc.offsetWidth / 2
      const say = el.querySelector(".toy-say")!.getBoundingClientRect()
      const within = (n: number, size: number) => (size < 2 * r ? size / 2 : Math.min(size - r, Math.max(r, n)))
      setHold({
        x: within(x ?? b.width / 2, b.width),
        y: within(y ?? say.top + say.height / 2 - b.top, b.height),
        r,
      })
      show(from, !!from)
    },
    [show],
  )

  // Opened from a shared link: the sentence arrives already turned down, with no timer and nothing moving. The
  // person who opened it did nothing yet; "Make some noise" is theirs to press.
  React.useEffect(() => {
    const shared = new URLSearchParams(location.search).get("say")?.slice(0, 80)
    if (!shared) return
    const arrive = window.setTimeout(() => setText(shared))
    return () => clearTimeout(arrive)
  }, [])

  return (
    <div
      ref={root}
      className="toy"
      data-quiet={quiet || undefined}
      data-held={held ? "" : undefined}
      onClick={(e) => {
        const dismissed = dismissing.current
        dismissing.current = false
        if (dismissed && e.detail > 0) return
        if (open || (e.target as Element).closest("input, button, a, label, textarea, .toy-controls")) return
        const b = e.currentTarget.getBoundingClientRect()
        stop(e.clientX - b.left, e.clientY - b.top, null)
      }}
    >
      <Noise className="toy-noise" words={`${say} ${db}dB  `} quiet={quiet} peak={db} hold={held} />
      <div className="toy-ring" aria-hidden="true" data-noise-ring>
        <span className="toy-ring-say">
          Share<span className="toy-ring-stop">.</span>
        </span>
      </div>
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
          <span className="ot-sr">{quiet ? "0 dB" : `${db} dB`}</span>
        </p>
        <div className="toy-actions">
          <Button variant="bracket" onClick={() => setQuiet((q) => !q)}>
            {quiet ? "Make some noise" : "Turn it down"}
          </Button>
          <button type="button" className="share" aria-expanded={open} onClick={(e) => (open ? share.close() : stop(null, null, e.currentTarget))}>
            Share it
          </button>
        </div>
      </div>
      <SharePlaces
        share={share}
        text={`I made some noise, then turned it down to 0 dB: “${say.trim()}”`}
        className="toy-places"
        style={hold ? ({ "--hx": `${hold.x}px`, "--hy": `${hold.y}px` } as React.CSSProperties) : undefined}
      />
    </div>
  )
}
