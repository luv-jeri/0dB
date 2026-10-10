"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"

type Variant = "legato" | "glissando" | "ballot" | "sforzando"

type RadioGroupContextValue = {
  name: string
  value: string | undefined
  select: (value: string) => void
  variant: Variant
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

function useRadioGroup() {
  const ctx = React.useContext(RadioGroupContext)
  if (!ctx) throw new Error("RadioGroupItem must sit inside <RadioGroup>.")
  return ctx
}

type Pt = { x: number; y: number }
type Flight = { a: Pt; c: Pt; b: Pt; anim: Animation }

const BREATH = "cubic-bezier(.65,0,.35,1)" // --db-breath
const EXHALE = "cubic-bezier(.16,1,.3,1)" // --db-exhale
const SPICCATO = "cubic-bezier(.34,1.5,.5,1)" // --db-spiccato
const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches
// Registered lengths come back from getComputedStyle resolved to px.
const length = (el: Element, prop: string) => parseFloat(getComputedStyle(el).getPropertyValue(prop)) || 0

// Where the dot sits for a word, in the group's own px: under the word's middle, or hung in the margin before it
// when the words stand in a column. The CSS ring (label::before) reads the same two lengths.
// offset* and computed lengths both ignore a zoomed ancestor (the landing page previews pieces at zoom 0.7),
// so nothing here needs dividing back by the scale.
function seat(l: HTMLElement, column: boolean, rtl: boolean, drop: number, nudge: number): Pt {
  if (!column) return { x: l.offsetLeft + l.offsetWidth / 2, y: l.offsetTop + l.offsetHeight + drop }
  return { x: rtl ? l.offsetLeft + l.offsetWidth + drop : l.offsetLeft - drop, y: l.offsetTop + l.offsetHeight / 2 + nudge }
}

// The slur from one seat to another: a quadratic curve that bows away from the words, the way a slur hangs under
// a legato phrase (or out into the margin, in a column). c is its control point; the curve bows half as far,
// and the bow stays shallow however long the slur.
function bow(a: Pt, b: Pt, out: Pt, em: number): Pt {
  const d = Math.min(Math.hypot(b.x - a.x, b.y - a.y) * 0.22, em * 1.1)
  return { x: (a.x + b.x) / 2 + out.x * d, y: (a.y + b.y) / 2 + out.y * d }
}
// The curve's blossom: f(t, t) is the point at t, and f(t0, t1) the control point of the piece from t0 to t1.
function blossom(a: Pt, c: Pt, b: Pt, u: number, v: number): Pt {
  const [p, q, r] = [(1 - u) * (1 - v), (1 - u) * v + u * (1 - v), u * v]
  return { x: p * a.x + q * c.x + r * b.x, y: p * a.y + q * c.y + r * b.y }
}
const xy = (p: Pt) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`

// The pencil slur, stopped short of the dot and the ring so it reads as a mark between them, not through them.
function slurPath(a: Pt, c: Pt, b: Pt, gap: number) {
  const t = Math.min(0.3, gap / (Math.hypot(b.x - a.x, b.y - a.y) || 1))
  return `M${xy(blossom(a, c, b, t, t))}Q${xy(blossom(a, c, b, t, 1 - t))} ${xy(blossom(a, c, b, 1 - t, 1 - t))}`
}

// Runs a pencil line's dash offset from one value to another (1 is not yet drawn, 0 drawn, -1 passed through).
// The inline style holds the end, so cancelling leaves the line where it was going.
function pen(path: SVGPathElement, from: number, to: number, duration: number, easing: string) {
  path.getAnimations().forEach((a) => a.cancel())
  path.style.strokeDashoffset = `${to}`
  if (duration > 0 && from !== to && !still()) path.animate({ strokeDashoffset: [`${from}`, `${to}`] }, { duration, easing })
}

// Glissando's lens: the stretch of the line of words where the italic shows, in px along that line.
function setLens(el: HTMLElement, [a, b]: [number, number]) {
  el.style.setProperty("--db-choice-a", `${a}px`)
  el.style.setProperty("--db-choice-b", `${b}px`)
}
// Sets the lens without its transition (a resize, the first place), then lets it move again.
function quiet(el: HTMLElement, span: [number, number]) {
  el.setAttribute("data-still", "")
  setLens(el, span)
  getComputedStyle(el).getPropertyValue("--db-choice-a")
  el.removeAttribute("data-still")
}
const NOWHERE: [number, number] = [-1e5, -1e5]

// Ballot: the cross a hand sets after its choice on a ballot paper, two strokes in one path (the dash runs on from
// the first into the second): a short one down to the right, then a longer one, set off higher, that bows and runs
// past it, in a 20 × 20 box.
const BALLOT = "M3.4 5.2C7.2 8.1 11.6 12.3 16.4 17.6M18.1 0.9C13.6 6.2 9.4 11.4 4.2 19.3"
const crossOf = (l: Element | null | undefined) => l?.querySelector<SVGPathElement>(":scope > .db-choice-ballot > path") ?? null
// Runs a pen mark from one dash offset to another (1 not yet drawn, 0 drawn, -1 passed through, which looks the same as 1).
// It ends on the stylesheet's own value unless held; a held sketch stays drawn until the next trace cancels it.
function trace(path: SVGPathElement | null, from: number, to: number, duration: number, hold = false) {
  path?.getAnimations().forEach((a) => a.cancel())
  if (path && !still()) path.animate({ strokeDashoffset: [`${from}`, `${to}`] }, { duration, easing: BREATH, fill: hold ? "forwards" : "none" })
}

type RadioGroupProps = Omit<React.ComponentProps<"fieldset">, "defaultValue" | "onChange"> & {
  /** Shared by every radio, so a form submits the choice. Defaults to a generated name. */
  name?: string
  /** The small label over the words. Without one, give the group an aria-label. */
  legend?: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** legato: one accent dot glides from word to word along a slur. glissando: the italic itself slides through the words between, and an accent full stop lands after the chosen one. ballot: a pen cross in the accent is written after the chosen word. sforzando: the words stand in a heavy column and the chosen one swells into a large accent italic over its neighbours. */
  variant?: Variant
  /** The words run in a line and wrap, or stand in a column. */
  orientation?: "horizontal" | "vertical"
}

/**
 * Words in a row (or a column). The chosen word turns italic, because it's yours now. Legato: one accent dot
 * glides beneath it along a slur, and pointing sketches that slur in pencil. Glissando: the italic slides
 * through the words between, and an accent full stop lands after the word. Ballot: a pen cross is written after
 * it in the accent. Sforzando: the words stand in a heavy column and the chosen one swells into a large accent
 * italic across its neighbours. Native radios underneath, so arrow keys move the choice.
 */
function RadioGroup({
  name,
  legend,
  value: controlled,
  defaultValue,
  onValueChange,
  variant = "legato",
  orientation = "horizontal",
  className,
  children,
  onPointerOver,
  onPointerLeave,
  ref: forwardedRef, ...props
}: RadioGroupProps) {
  const generated = React.useId()
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = controlled ?? uncontrolled
  const box = React.useRef<HTMLFieldSetElement>(null)
  const composedRef = useComposedRefs(box, forwardedRef)
  const dot = React.useRef<HTMLSpanElement>(null)
  const slur = React.useRef<SVGPathElement>(null)
  const was = React.useRef(value)
  const seen = React.useRef(false) // painted at least once, so a change is the person's and not the first render's
  const where = React.useRef<Pt | null>(null) // legato: the chosen word's seat, where the dot rests
  const flight = React.useRef<Flight | null>(null)
  const sketched = React.useRef<HTMLLabelElement | null>(null) // legato: the word the pencil slur runs to
  const lens = React.useRef<[number, number] | null>(null) // glissando: the chosen word's span along the line of words

  const select = React.useCallback(
    (next: string) => {
      if (controlled === undefined) setUncontrolled(next)
      onValueChange?.(next)
    },
    [controlled, onValueChange],
  )
  const ctx = React.useMemo(() => ({ name: name ?? generated, value, select, variant }), [name, generated, value, select, variant])

  // The geometry both variants need, read fresh each time: the words, the chosen one, which way the slur bows.
  const read = React.useCallback(() => {
    const el = box.current!
    const labels = [...el.querySelectorAll<HTMLLabelElement>(":scope > label")]
    const column = orientation === "vertical"
    const rtl = getComputedStyle(el).direction === "rtl"
    const em = parseFloat(getComputedStyle(el).fontSize) || 16
    const out = column ? { x: rtl ? 1 : -1, y: 0 } : { x: 0, y: 1 }
    // A legend moves where the dot and the slur are laid from (they sit below it) but not the words' offsets,
    // so the seat is taken back by the slur's own corner, which stands where the dot's origin does.
    const r = el.getBoundingClientRect()
    const k = r.width / (el.offsetWidth || r.width) || 1
    const s = el.querySelector(":scope > .db-choice-slur")?.getBoundingClientRect()
    const o = s ? { x: (s.left - r.left) / k, y: (s.top - r.top) / k } : { x: 0, y: 0 }
    const at = (l: HTMLElement) => {
      const p = seat(l, column, rtl, length(el, "--db-choice-drop"), length(el, "--db-choice-nudge"))
      return { x: p.x - o.x, y: p.y - o.y }
    }
    return { el, labels, chosen: labels.find((l) => l.querySelector("input:checked")) ?? null, em, out, at }
  }, [orientation])

  // Glissando lays the words end to end on one line of reading, so the italic can slide from word to word
  // whichever row or column they sit in. Each word learns its start on that line (--db-choice-s) and the width
  // of its italic and its roman (--db-choice-w, -r: where the full stop lands, and the room it keeps);
  // the lens (--db-choice-a to -b) is where the italic shows.
  const measure = React.useCallback((g: ReturnType<typeof read>) => {
    const f = length(g.el, "--db-choice-f")
    const width = (l: HTMLElement, part: string) => `${l.querySelector<HTMLElement>(part)?.offsetWidth ?? 0}px`
    g.labels.forEach((l) => {
      l.style.setProperty("--db-choice-w", width(l, ".db-choice-yours"))
      l.style.setProperty("--db-choice-r", width(l, ".db-choice-word"))
    })
    let s = 0
    let span: [number, number] | null = null
    for (const l of g.labels) {
      l.style.setProperty("--db-choice-s", `${s}px`)
      if (l === g.chosen) span = [s, s + l.offsetWidth]
      s += l.offsetWidth + f * 2 // two feathers apart, so a word's soft edge never reaches its neighbour
    }
    return span
  }, [])

  // Puts every mark in its place without moving it: the dot, the pencil slur the docs pin, the italic's lens.
  const place = React.useCallback(() => {
    if (!box.current) return
    const g = read()
    if (variant === "glissando") {
      lens.current = measure(g)
      quiet(g.el, lens.current ?? NOWHERE)
    } else {
      where.current = g.chosen ? g.at(g.chosen) : null
      if (where.current) {
        g.el.style.setProperty("--db-choice-x", `${where.current.x}px`)
        g.el.style.setProperty("--db-choice-y", `${where.current.y}px`)
      }
      // The docs pin a word as pointed at; it shows its pencil slur without a pointer.
      const pinned = g.labels.find((l) => l !== g.chosen && l.matches('[data-force~="hover"]'))
      if (slur.current && pinned && where.current) {
        const [a, b] = [where.current, g.at(pinned)]
        slur.current.setAttribute("d", slurPath(a, bow(a, b, g.out, g.em), b, dot.current?.offsetWidth || 7))
        pen(slur.current, 0, 0, 0, "")
      }
    }
    g.el.setAttribute("data-ready", "")
  }, [read, measure, variant])

  // Pointing sketches: a pencil slur runs from the dot to a ring at the word you point at.
  // Leaving, the line passes through, the way it was drawn.
  const sketch = (l: HTMLLabelElement | null) => {
    if (variant === "ballot") return sketchCross(l)
    const path = slur.current
    if (!path || !box.current || l === sketched.current) return
    sketched.current = l
    const a = where.current
    if (l && a && !l.querySelector("input:checked, input:disabled")) {
      const g = read()
      const b = g.at(l)
      path.setAttribute("d", slurPath(a, bow(a, b, g.out, g.em), b, dot.current?.offsetWidth || 7))
      return pen(path, 1, 0, 320, EXHALE) // --db-moderato
    }
    const now = parseFloat(getComputedStyle(path).strokeDashoffset) || 0
    pen(path, Math.abs(now) < 1 ? now : -1, -1, 160, EXHALE) // --db-allegro
  }

  // Ballot: pointing sketches the cross in pencil after the word; leaving, the pen runs on and the cross passes through.
  const sketchCross = (l: HTMLLabelElement | null) => {
    if (l === sketched.current) return
    const left = sketched.current
    sketched.current = l
    if (left && !left.querySelector("input:checked")) trace(crossOf(left), 0, -1, 160) // --db-allegro
    if (l && !l.querySelector("input:checked, input:disabled")) trace(crossOf(l), 1, 0, 480, true) // between moderato and andante
  }

  React.useLayoutEffect(() => {
    const before = was.current
    const moved = before !== value && seen.current
    was.current = value
    if (!box.current) return
    if (!moved) return place()
    const g = read()

    if (variant === "ballot") {
      // The old cross runs on and passes through; the new one is written after its word, or, if the pencil already
      // sketched it there, only inks (a sketch still being written runs on to the end in the accent).
      const old = g.labels.find((l) => l.querySelector<HTMLInputElement>("input")?.value === before)
      if (old) trace(crossOf(old), 0, -1, 320) // --db-moderato
      const path = crossOf(g.chosen)
      if (g.chosen && sketched.current !== g.chosen) trace(path, 1, 0, 480)
      return
    }

    if (variant === "glissando") {
      const from = lens.current
      const to = measure(g)
      lens.current = to
      if (!to) return quiet(g.el, NOWHERE)
      // The italic travels leading edge first, then gathers itself in: a longer slide takes a little longer.
      g.el.setAttribute("data-moved", "") // from now on the full stop lands each time; the first render's never does
      g.el.setAttribute("data-heading", from && to[0] < from[0] ? "start" : "end")
      g.el.style.setProperty("--db-choice-far", `${from ? Math.min(Math.abs(to[0] - from[0]) / 480, 1) : 0}`)
      // With nothing chosen before, the italic opens out of the middle of the word.
      if (!from) quiet(g.el, [(to[0] + to[1]) / 2, (to[0] + to[1]) / 2])
      return setLens(g.el, to)
    }

    const f = flight.current
    const mid = f?.anim.playState === "running" ? f.anim.effect?.getComputedTiming().progress : null
    const from = f && mid != null ? blossom(f.a, f.c, f.b, mid, mid) : where.current
    place()
    const to = where.current
    if (!dot.current) return
    f?.anim.cancel()
    flight.current = null
    const path = slur.current
    const far = from && to ? Math.hypot(to.x - from.x, to.y - from.y) : 0
    if (!to || !from || far < 1 || still()) {
      if (path) pen(path, -1, -1, 0, "")
      sketched.current = null
      // The first choice has nowhere to glide from: the dot lands where it is.
      if (to && !from && !still()) dot.current.animate({ scale: ["0", "1"] }, { duration: 320, easing: SPICCATO }) // --db-moderato
      return
    }
    // The dot glides along the slur like a drop of ink: drawn out along its path at mid-flight, round again as it lands.
    const c = bow(from, to, g.out, g.em)
    const pull = Math.min(far, 240) / 110
    const duration = 320 + Math.min(far, 320) // --db-moderato, a little longer the further it goes, never past --db-andante
    const frames = Array.from({ length: 17 }, (_, i) => {
      const t = i / 16
      const p = blossom(from, c, to, t, t)
      const [dx, dy] = [(1 - t) * (c.x - from.x) + t * (to.x - c.x), (1 - t) * (c.y - from.y) + t * (to.y - c.y)]
      const s = 1 + pull * Math.sin(Math.PI * t)
      return { offset: t, translate: `${p.x}px ${p.y}px`, rotate: `${Math.atan2(dy, dx)}rad`, scale: `${s} ${1 / Math.sqrt(s)}` }
    })
    flight.current = { a: from, c, b: to, anim: dot.current.animate(frames, { duration, easing: BREATH }) }
    // The pencil slur the pointer sketched is used up as the dot runs along it; a choice made by key runs clean.
    if (path) pen(path, sketched.current === g.chosen ? 0 : -1, -1, duration, BREATH)
    sketched.current = g.chosen
  }, [value, place, read, measure, variant])

  // Words re-flow on resize and when the fonts arrive; the marks follow without moving.
  // ponytail: watches the words present at mount; add a MutationObserver if items come and go.
  React.useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => place())
    ro.observe(el)
    el.querySelectorAll("label").forEach((l) => ro.observe(l))
    document.fonts?.ready.then(() => place())
    const frame = requestAnimationFrame(() => (seen.current = true))
    return () => {
      ro.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [place])

  return (
    <RadioGroupContext.Provider value={ctx}>
      <fieldset
        ref={composedRef}
        data-slot="radio-group"
        data-variant={variant}
        data-orientation={orientation}
        className={cn("db-choice", className)}
        onPointerOver={(e) => {
          onPointerOver?.(e)
          if (variant === "legato" || variant === "ballot") sketch((e.target as Element).closest("label"))
        }}
        onPointerLeave={(e) => {
          onPointerLeave?.(e)
          if (variant === "legato" || variant === "ballot") sketch(null)
        }}
        {...props}
      >
        {legend ? <legend className="db-label">{legend}</legend> : null}
        {children}
        {variant === "legato" ? (
          <>
            <svg data-slot="radio-group-slur" className="db-choice-slur" aria-hidden="true">
              <path ref={slur} pathLength={1} />
            </svg>
            <span ref={dot} data-slot="radio-group-dot" className="db-choice-dot" aria-hidden="true" />
          </>
        ) : null}
      </fieldset>
    </RadioGroupContext.Provider>
  )
}

type RadioGroupItemProps = Omit<React.ComponentProps<"input">, "type" | "name" | "checked" | "defaultChecked" | "value" | "children"> & {
  value: string
  /** The word. It is the control, and it turns italic when chosen. */
  children: string
  /** Classes for the label, which is the root. className goes to the input. */
  labelClassName?: string
  /** Pins a state for documentation ("hover", "focus"); set on the root. */
  "data-force"?: string
}

function RadioGroupItem({ value, children, className, labelClassName, "data-force": force, onChange, ...props }: RadioGroupItemProps) {
  const group = useRadioGroup()
  return (
    <label data-slot="radio-group-item" data-force={force} className={labelClassName}>
      <input
        type="radio"
        name={group.name}
        value={value}
        checked={group.value === value}
        className={className}
        onChange={(e) => {
          onChange?.(e)
          group.select(value)
        }}
        {...props}
      />
      <span className="db-choice-word">{children}</span>
      {/* The same word in the expression italic, laid in the same cell. The radio's name comes from the roman. */}
      <span data-slot="radio-group-yours" className="db-choice-yours" aria-hidden="true">
        {children}
      </span>
      {group.variant === "ballot" ? (
        <svg data-slot="radio-group-ballot" className="db-choice-ballot" viewBox="0 0 20 20" aria-hidden="true">
          <path d={BALLOT} pathLength={1} />
        </svg>
      ) : null}
    </label>
  )
}

export { RadioGroup, RadioGroupItem, type RadioGroupProps, type RadioGroupItemProps }
