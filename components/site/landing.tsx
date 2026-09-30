"use client"

import * as React from "react"

import { KEYS, PAIRS, SCHEMES, useTheme } from "@/components/site/theme-controls"
import { Button } from "@/registry/0db/ui/button"
import { Checkbox, CheckboxGroup } from "@/registry/0db/ui/checkbox"
import { Input } from "@/registry/0db/ui/field"
import { Select } from "@/registry/0db/ui/select"
import { Slider } from "@/registry/0db/ui/slider"
import { Switch } from "@/registry/0db/ui/switch"

// The home page's instruments. Each one plays a principle instead of stating it.

/** Ours in roman, yours in italic: you write your name, and the page answers with it. */
export function Hello() {
  const [name, setName] = React.useState("")
  const [hour, setHour] = React.useState(12)
  const who = name.trim()
  const late = hour >= 22 || hour < 5
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
  return (
    <div className="hello">
      <label className="hello-ask">
        My name is{" "}
        <span className="hello-fill">
          <Input
            className="hello-name"
            value={name}
            placeholder="yours"
            autoComplete="off"
            spellCheck={false}
            maxLength={32}
            onChange={(e) => {
              setName(e.target.value)
              setHour(new Date().getHours())
            }}
          />
          <span aria-hidden="true">.</span>
        </span>
      </label>
      <p className="hello-reply" aria-live="polite">
        {who ? (
          late ? (
            <>
              Working late, <span className="db-yours">{who}</span>? We&rsquo;ll keep it quiet.
            </>
          ) : (
            <>
              {greeting}, <span className="db-yours">{who}</span>.
            </>
          )
        ) : null}
      </p>
    </div>
  )
}

const LEFT_OUT = ["Icons", "Boxes", "Shadows", "Gradients", "Monospace", "A second colour"]

/** Silence is structure: what 0dB leaves out, already struck through. Unstrike one to see it matters. */
export function LeftOut() {
  return (
    <CheckboxGroup
      tally
      className="left-out"
      legend={<span className="db-sr">What 0dB leaves out</span>}
      done={(count, total) => (count === total ? "left out, and not missed." : "left out.")}
    >
      {LEFT_OUT.map((word) => (
        <Checkbox key={word} defaultChecked>
          {word}
        </Checkbox>
      ))}
    </CheckboxGroup>
  )
}

/** One note of colour: the whole page, retuned from one sentence. */
export function TuneSentence() {
  const [theme, set] = useTheme()
  return (
    <p className="tune-sentence">
      Print it in{" "}
      <span className="tune-bind">
        <Select aria-label="Scheme" value={theme.scheme ?? "cotton"} onChange={(e) => set({ scheme: e.target.value }, e.currentTarget)}>
          {SCHEMES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        ,
      </span>{" "}
      set it in{" "}
      <span className="tune-bind">
        <Select aria-label="Typefaces" value={theme.pair ?? "parma"} onChange={(e) => set({ pair: e.target.value }, e.currentTarget)}>
          {PAIRS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.words}
            </option>
          ))}
        </Select>
        ,
      </span>{" "}
      key it to{" "}
      <span className="tune-bind">
        <Select aria-label="Accent" rootClassName="tune-key" value={theme.key ?? ""} onChange={(e) => set({ key: e.target.value || undefined }, e.currentTarget)}>
          <option value="">its own colour</option>
          {KEYS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
        ,
      </span>{" "}
      and{" "}
      <Switch aria-label="Read it by night" on="night" off="day" checked={theme.mode === "nocturne"} onCheckedChange={(on) => set({ mode: on ? "nocturne" : "day" })}>
        read it by
      </Switch>
    </p>
  )
}

/** What a level sounds like, from the threshold up. */
const LEVELS: [number, string][] = [
  [0, "The threshold of hearing."],
  [10, "Breathing."],
  [20, "Leaves, moving."],
  [30, "A whisper."],
  [40, "A quiet library."],
  [50, "Rain."],
  [60, "A conversation."],
  [70, "A busy street."],
  [85, "Heavy traffic."],
  [90, "A lawnmower."],
  [100, "A motorbike."],
  [110, "A concert, near the front."],
  [120, "A jet, taking off."],
]
const HARM = 85

/** Type is the only ornament: loudness drawn with weight and width alone. At zero it spells the name. */
export function Loudness() {
  const [level, setLevel] = React.useState(0)
  const frame = React.useRef(0)
  React.useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const quiet = () => {
    cancelAnimationFrame(frame.current)
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setLevel(0)
    const from = level
    const began = performance.now()
    const tempo = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--db-adagio")) || 1400
    const tick = (now: number) => {
      const t = Math.min(1, (now - began) / tempo)
      const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2 // the breath curve, near enough
      setLevel(Math.round(from * (1 - eased)))
      if (t < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }

  const like = LEVELS.findLast(([at]) => level >= at)![1]
  const harm = level >= HARM
  return (
    <div className="loud" data-harm={harm || undefined} style={{ "--loud": level / 120 } as React.CSSProperties}>
      <p className="loud-figure" aria-hidden="true">
        {level}
        <span className="loud-unit">dB</span>
      </p>
      <p className="loud-like" aria-live="polite">
        {like}
        {harm ? <span className="loud-harm"> Hearing wears from here.</span> : null}
      </p>
      <div className="loud-hand">
        <Slider
          label="Loudness"
          min={0}
          max={120}
          value={level}
          unit=" dB"
          onValueChange={(v) => {
            cancelAnimationFrame(frame.current)
            setLevel(v)
          }}
        />
        <Button variant="quiet" disabled={level === 0} onClick={quiet}>
          Back to quiet
        </Button>
      </div>
    </div>
  )
}

const TEMPI = [
  {
    name: "Allegro",
    token: "allegro",
    seconds: "0.16",
    use: "Hover and press",
  },
  {
    name: "Moderato",
    token: "moderato",
    seconds: "0.32",
    use: "A state changes",
  },
  { name: "Andante", token: "andante", seconds: "0.64", use: "Panels arrive" },
  {
    name: "Adagio",
    token: "adagio",
    seconds: "1.40",
    use: "The overture, once",
  },
]

/** Nothing moves unless you do: four tempi, still until you point at one or play them together. */
export function Tempi() {
  const [across, setAcross] = React.useState(false)
  return (
    <div className="tempi" data-across={across || undefined}>
      <ul className="tempi-list">
        {TEMPI.map((t) => (
          <li key={t.token} className="tempo" style={{ "--tempo": `var(--db-${t.token})` } as React.CSSProperties}>
            <span className="tempo-name" lang="it">
              {t.name}
            </span>
            <span className="tempo-use">{t.use}</span>
            <span className="tempo-track" aria-hidden="true">
              <span className="tempo-dot" />
            </span>
            <span className="tempo-time">{t.seconds}&#8239;s</span>
          </li>
        ))}
      </ul>
      <Button variant="bracket" aria-pressed={across} onClick={() => setAcross((a) => !a)}>
        {across ? "Bring them back" : "Play all four"}
      </Button>
    </div>
  )
}
