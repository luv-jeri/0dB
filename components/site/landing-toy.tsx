"use client"

import * as React from "react"

import { Share } from "@/components/site/landing"
import { TextFrame } from "@/components/site/landing-frame"
import { Cta } from "@/components/site/landing-hero"
import { Noise } from "@/components/site/landing-noise"
import { Button } from "@/registry/0db/ui/button"
import { Input } from "@/registry/0db/ui/field"
import { Slider } from "@/registry/0db/ui/slider"

// Make some noise: every click in the section turns it up. The level shows on 0dB's own slider, and in the
// type: your words grow heavier, larger and tighter, and echo deeper behind themselves, and the field of
// small type around them closes up and darkens toward them. Stop, and it dies away slowly. Past 100 dB a
// border of words has run all the way round the share moment, and it opens: pass it on. The link carries
// your words and your loudest, so whoever opens it lands on your noise. "Turn it down" hushes it to 0 dB.

const START = "MAKE SOME NOISE!!!"
const REPO = "https://github.com/luv-jeri/0dB"
const PEAK = 120 // dB at the top of the slider
const EARN = 100 // dB that opens the share moment
const PUNCH = 0.18 // a click's worth, of the whole range
const HOLD = 1200 // ms it holds after a click before it dies away
const DECAY = 0.05 // of the range a second, dying away

type Engine = { raise(): void; set(n: number, own?: boolean): void; hush(): void }

export function Toy() {
  const [text, setText] = React.useState(START)
  const [db, setDb] = React.useState(0)
  const [best, setBest] = React.useState(0)
  const [earned, setEarned] = React.useState(false)
  const [sent, setSent] = React.useState(0)
  const root = React.useRef<HTMLDivElement>(null)
  const engine = React.useRef<Engine | null>(null)
  const say = text.trim() || " "
  const level = db / PEAK

  React.useEffect(() => {
    const still = matchMedia("(prefers-reduced-motion: reduce)")
    let aim = 0, shown = 0, held = 0, frame = 0, last = 0, hushing = false, own = false
    function tick(now: number) {
      frame = 0
      const dt = last ? Math.min(64, now - last) / 1000 : 0
      last = now
      // It dies away on its own, slowly, a moment after the last click; reduced motion holds it where it is.
      if (!still.matches && !hushing && now - held > HOLD) aim = Math.max(0, aim - DECAY * dt)
      shown = still.matches ? aim : shown + (aim - shown) * (hushing ? 0.05 : 0.22)
      if (Math.abs(aim - shown) < 0.002) shown = aim
      const n = Math.round(shown * PEAK)
      setDb(n)
      if (own) {
        setBest((b) => Math.max(b, n))
        if (n >= EARN) setEarned(true)
      }
      if (!still.matches && (shown > 0 || aim > 0)) frame = requestAnimationFrame(tick)
      else { last = 0; hushing = false }
    }
    const go = () => { if (!frame) frame = requestAnimationFrame(tick) }
    engine.current = {
      raise: () => { own = true; hushing = false; aim = Math.min(1, aim + PUNCH); held = performance.now(); go() },
      set: (n, mine = true) => { own ||= mine; hushing = false; aim = shown = n; held = performance.now(); go() },
      hush: () => { hushing = true; aim = 0; go() },
    }

    // Opened from a shared link: their words, at their level, dying away until you turn it up again.
    const q = new URLSearchParams(location.search)
    const said = q.get("say")?.slice(0, 80)
    const at = Math.min(PEAK, Math.max(0, Math.round(Number(q.get("db")) || 0)))
    const arrive = window.setTimeout(() => {
      if (said) setText(said)
      if (at) { setSent(at); engine.current?.set(at / PEAK, false) }
    })

    // Any click in the section is noise, except on the things that do something else.
    const section = root.current?.closest("section")
    const click = (e: MouseEvent) => {
      if (!(e.target instanceof Element) || e.target.closest("a, button, input, label, [data-slot=slider]")) return
      engine.current?.raise()
    }
    section?.addEventListener("click", click)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(arrive)
      section?.removeEventListener("click", click)
      engine.current = null
    }
  }, [])

  const url = `/?say=${encodeURIComponent(text.trim())}&db=${best}#noise`

  return (
    <div ref={root} className="toy" data-earned={earned || undefined} style={{ "--level": level.toFixed(3) } as React.CSSProperties}>
      <Noise className="toy-noise" words={`${say}  `} level={level} />
      <p className="toy-say" data-noise-glyphs data-noise-center data-text={say}>
        <span data-noise-echo>{say}</span>
      </p>
      <div className="toy-controls" data-hush>
        <label className="toy-field">
          <span className="toy-label">Your words</span>
          <Input className="toy-input" value={text} maxLength={80} autoComplete="off" spellCheck={false} onChange={(e) => setText(e.target.value)} />
        </label>
        <Slider className="toy-level" variant="dynamics" label="Noise" max={PEAK} value={db} aria-valuetext={`${db} dB`} onValueChange={(v) => engine.current?.set(v / PEAK)} />
        <div className="toy-out">
          <p className="toy-db" dir="ltr" aria-hidden="true">
            {`${db} dB`}
          </p>
          <div className="toy-actions">
            <Button variant="bracket" onClick={() => engine.current?.raise()}>
              Turn it up
            </Button>
            <Button variant="bracket" onClick={() => engine.current?.hush()}>
              Turn it down
            </Button>
          </div>
        </div>
      </div>
      <div className="toy-moment" data-hush>
        <TextFrame
          className="toy-frame"
          words={earned ? `pass it on · ${say} · ${best} dB · ` : "louder · "}
          fill={earned ? 1 : Math.min(1, db / EARN)}
          run={earned ? 1 + level * 5 : 0}
        />
        <p className="toy-before" aria-hidden={earned || undefined}>
          {sent ? `Sent to you at ${sent} dB. Turn it up past ${EARN}, then pass it on.` : `Click anywhere here to turn it up. Past ${EARN} dB, it's yours to send.`}
        </p>
        <div className="toy-after" inert={!earned}>
          <p className="toy-ask">Loud enough. Now pass it on.</p>
          <p className="toy-why">Sharing helps us keep 0dB going. So does a star: it&apos;s how we know it&apos;s wanted.</p>
          <p className="toy-send">
            <Share url={url} title={`${best} dB of noise, turned down to 0 dB`}>
              Share it
            </Share>
            <Cta href={REPO}>Star it on GitHub</Cta>
          </p>
        </div>
        <p className="db-sr" role="status">
          {earned ? "Loud enough. Share it, or star it on GitHub." : ""}
        </p>
      </div>
    </div>
  )
}
