"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type DialValue = string | number
type DialOption = DialValue | { value: DialValue; label?: string }

type DialProps = Omit<React.ComponentProps<"fieldset">, "defaultValue" | "onChange"> & {
  /** arc: a few choices on a half circle, no script. tuner: a long scale on the rim of a wheel you turn. dynamics: the number's type size is its loudness, from niente to fff. tumbler: set figure by figure, the one you turn held in parentheses. */
  variant?: "arc" | "tuner" | "dynamics" | "tumbler"
  /** The form field's name. */
  name?: string
  /** The question, as a small label over the dial. It also names the range. */
  legend: React.ReactNode
  /** The choices, in order. The arc takes up to nine; the tuner any number. */
  options?: DialOption[]
  /** Tuner without options, and dynamics: the scale runs from min to max by step. Tumbler: whole numbers from min to max. */
  min?: number
  max?: number
  step?: number
  /** Tuner: a numeral every this many steps, with a half-length tick halfway between. */
  major?: number
  value?: DialValue
  defaultValue?: DialValue
  onValueChange?: (value: DialValue) => void
  /** Small words for the number, e.g. "weeks": under the arc, after the tuner's reading. */
  unit?: string
  /** Pins a state for documentation ("hover", "focus"); set on the root. */
  "data-force"?: string
}

const valueOf = (o: DialOption) => (typeof o === "object" ? o.value : o)
const labelOf = (o: DialOption) => (typeof o === "object" ? (o.label ?? String(o.value)) : String(o))

/**
 * A number you turn to. The arc is a radio on a half circle, with no script: the chosen
 * number swells into italic and the dot travels. The tuner is a native range drawn as the
 * rim of a wheel you turn, for more numbers than fit in view.
 */
function Dial({ variant = "arc", ...props }: DialProps) {
  if (variant === "dynamics") return <Dynamics {...props} />
  if (variant === "tumbler") return <Tumbler {...props} />
  return variant === "arc" ? <Arc {...props} /> : <Turning variant={variant} {...props} />
}

function Arc({ name, legend, options = [], value, defaultValue, onValueChange, unit, className, style, ...props }: Omit<DialProps, "variant">) {
  const generated = React.useId()
  return (
    <fieldset data-slot="dial" data-variant="arc" className={cn("db-dial", className)} style={{ "--n": options.length, ...style } as React.CSSProperties} {...props}>
      <legend className="db-label">{legend}</legend>
      <div data-slot="dial-face" className="db-dial-face">
        {options.map((option, i) => {
          const v = valueOf(option)
          const text = labelOf(option)
          const mine = (x: DialValue | undefined) => x !== undefined && String(x) === String(v)
          return (
            <label key={String(v)} data-slot="dial-item" data-text={text} style={{ "--i": i } as React.CSSProperties}>
              <input
                type="radio"
                name={name ?? generated}
                value={String(v)}
                aria-label={unit ? `${text} ${unit}` : undefined}
                {...(value === undefined ? { defaultChecked: mine(defaultValue) } : { checked: mine(value) })}
                onChange={() => onValueChange?.(v)}
              />
              <span>{text}</span>
            </label>
          )
        })}
        <span className="db-dial-arc" aria-hidden="true" />
        <span className="db-dial-dot" aria-hidden="true" />
        {unit ? (
          <span className="db-dial-unit" aria-hidden="true">
            {unit}
          </span>
        ) : null}
      </div>
    </fieldset>
  )
}

type Kind = "minor" | "half" | "major"

/** The numbers a turning dial runs through, by index: from the options, or from min to max by step. */
function scaleOf(options: DialOption[] | undefined, min: number, max: number, step: number, major: number) {
  if (options) {
    const labels = options.map(labelOf)
    return {
      numeric: false,
      count: options.length,
      valueAt: (i: number) => valueOf(options[i]),
      label: (i: number) => labels[i] ?? "",
      mark: (i: number) => labels[i] ?? "",
      indexOf: (v: DialValue) => Math.max(0, options.findIndex((o) => String(valueOf(o)) === String(v))),
      kind: (i: number): Kind => (i % major === 0 ? "major" : major % 2 === 0 && i % (major / 2) === 0 ? "half" : "minor"),
    }
  }
  const digits = (String(step).split(".")[1] ?? "").length
  const count = Math.max(1, Math.floor((max - min) / step + 1e-9) + 1)
  const at = (i: number) => Number((min + i * step).toFixed(digits))
  // Marks fall on round numbers (88, 89 on a 87.5 to 108 scale), not on min plus a count.
  const on = (i: number, every: number) => Math.abs(at(i) / every - Math.round(at(i) / every)) < 1e-6
  return {
    numeric: true,
    count,
    valueAt: at,
    label: (i: number) => (i >= 0 && i < count ? at(i).toFixed(digits) : ""),
    mark: (i: number) => String(at(i)),
    indexOf: (v: DialValue) => Math.min(count - 1, Math.max(0, Math.round((Number(v) - min) / step))),
    kind: (i: number): Kind => (on(i, major * step) ? "major" : major % 2 === 0 && on(i, (major / 2) * step) ? "half" : "minor"),
  }
}

type Live = {
  wheel: HTMLElement | null
  drum: HTMLElement | null
  input: HTMLInputElement | null
  last: number
  label: (i: number) => string
  commit: (i: number) => void
  recentre: (i: number) => void
}

// ponytail: hand-tuned; the feel lives in these four numbers.
const SPRING = [121, 13.6] // ω 11, ζ 0.62: it lands with one small swing past (about 8%), the house spiccato
const CATCH = [676, 52] // ω 26, critically damped: the wheel catches up with a scroll without swinging
const COAST = 0.32 // seconds for a flick's speed to fall to a third
const STRETCH = 64 // px the rim gives under the hand past either end

/**
 * The wheel's physics, outside React. One position, in steps, that a hand, a scroll or a key
 * moves; each frame it's written to the face as --pos and CSS places every mark from it.
 */
function createTurn(start: number) {
  let live: Live = { wheel: null, drum: null, input: null, last: 0, label: String, commit: () => {}, recentre: () => {} }
  let pos = start
  let vel = 0
  let target = start
  let scrolled = start
  let mode: "rest" | "held" | "coast" | "spring" | "wheel" = "rest"
  let follow = false // a hand or a scroll is turning it, so the value follows the wheel
  let committed = start
  let centre = start
  let raf = 0
  let then = 0
  let timer = 0
  let pitch = 24
  let k = 1
  let dir = 1
  let still = false
  let grip: { x: number; from: number; moved: boolean; halted: boolean; trail: [number, number][] } | null = null

  const clamp = (i: number) => Math.min(live.last, Math.max(0, i))

  // Read at the start of each gesture, so a resize, a direction or a motion setting is always current.
  const measure = () => {
    const wheel = live.wheel
    if (!wheel) return
    const cs = getComputedStyle(wheel)
    pitch = parseFloat(cs.getPropertyValue("--db-dial-pitch")) || 24
    k = parseFloat(cs.getPropertyValue("--k")) || 1
    dir = cs.direction === "rtl" ? -1 : 1
    still = matchMedia("(prefers-reduced-motion: reduce)").matches
  }

  const paint = () => {
    const { wheel, drum, last, label } = live
    wheel?.parentElement?.style.setProperty("--pos", pos.toFixed(4))
    const near = clamp(Math.round(pos))
    if (near !== centre) {
      centre = near
      live.recentre(near)
    }
    if (follow && near !== committed) {
      committed = near
      live.commit(near)
    }
    if (drum) {
      // The drum turns with the wheel like a counter: between two numbers, both show.
      const p = Math.min(last, Math.max(0, pos))
      const i = still ? Math.round(p) : Math.floor(p)
      drum.dataset.a = label(i)
      drum.dataset.b = label(i + 1)
      drum.style.setProperty("--f", still ? "0" : (p - i).toFixed(4))
    }
  }

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - then) / 1000)
    then = now
    const n = Math.max(1, Math.ceil(dt / 0.008))
    for (let j = 0; j < n; j++) {
      const h = dt / n
      if (mode === "coast") {
        vel *= Math.exp(-h / COAST)
        pos += vel * h
        // Slow enough, or past an end: catch the step it's heading for.
        if (pos < 0 || pos > live.last || Math.abs(vel) * pitch < 90) {
          mode = "spring"
          target = clamp(Math.round(pos + vel / 11))
        }
      } else {
        const [stiff, damp] = mode === "wheel" ? CATCH : SPRING
        vel += (-stiff * (pos - (mode === "wheel" ? scrolled : target)) - damp * vel) * h
        pos += vel * h
      }
    }
    if (mode === "spring" && Math.abs(pos - target) < 0.001 && Math.abs(vel) < 0.01) {
      pos = target
      vel = 0
      mode = "rest"
    }
    paint()
    raf = mode === "rest" || mode === "held" ? 0 : requestAnimationFrame(frame)
  }

  const run = () => {
    if (raf) return
    then = performance.now()
    raf = requestAnimationFrame(frame)
  }

  const land = (i: number) => {
    target = clamp(i)
    if (still) {
      pos = target
      vel = 0
      mode = "rest"
      paint()
      return
    }
    mode = "spring"
    run()
  }

  /** A key or a tap: the value is set now, and the wheel turns to it. */
  const set = (i: number) => {
    measure()
    follow = false
    const to = clamp(i)
    if (to !== committed) {
      committed = to
      live.commit(to)
    }
    land(to)
  }

  const held = (el: Element, on: boolean) => el.closest("fieldset")?.toggleAttribute("data-held", on)

  return {
    /** React hands over the current elements, range and callbacks after every render. */
    sync(next: Live) {
      live = next
    },
    committed: () => committed,
    set,
    /** The value changed from outside: the wheel turns to it. */
    to(i: number) {
      // While a hand or a scroll turns it, the wheel leads and React's renders trail it: ignore their echo.
      if (follow && mode !== "rest") return
      measure()
      follow = false
      committed = i
      land(i)
    },
    down(e: React.PointerEvent<HTMLElement>) {
      const input = live.input
      if (e.button !== 0 || !input || input.matches(":disabled")) return
      e.preventDefault() // keeps the focus given below, and stops text selection
      input.focus({ preventScroll: true })
      measure()
      e.currentTarget.setPointerCapture(e.pointerId)
      const halted = mode !== "rest" && Math.abs(vel) > 1 // still settling counts as still
      cancelAnimationFrame(raf)
      raf = 0
      clearTimeout(timer)
      mode = "held"
      follow = true
      vel = 0
      grip = { x: e.clientX, from: pos, moved: false, halted, trail: [[e.timeStamp, e.clientX]] }
      held(e.currentTarget, true)
    },
    move(e: React.PointerEvent<HTMLElement>) {
      if (!grip) return
      const dx = e.clientX - grip.x
      if (!grip.moved && Math.abs(dx) < 4) return
      grip.moved = true
      const last = live.last
      const raw = grip.from - (dx * dir) / pitch
      const over = raw < 0 ? raw : raw > last ? raw - last : 0
      const give = STRETCH / pitch
      // Past an end the rim stretches, less the further you pull.
      pos = over ? (over < 0 ? 0 : last) + Math.sign(over) * give * (1 - 1 / ((Math.abs(over) * 0.55) / give + 1)) : raw
      grip.trail.push([e.timeStamp, e.clientX])
      while (grip.trail.length > 2 && e.timeStamp - grip.trail[0][0] > 100) grip.trail.shift()
      paint()
    },
    up(e: React.PointerEvent<HTMLElement>) {
      if (!grip) return
      const g = grip
      grip = null
      held(e.currentTarget, false)
      if (!g.moved) {
        // A tap turns the wheel to the mark under it; a tap on a moving wheel only stops it.
        const wheel = live.wheel
        if (e.type !== "pointerup" || g.halted || !wheel) return land(Math.round(pos))
        const r = wheel.getBoundingClientRect()
        const x = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (pitch * k)))
        return set(Math.round(pos + Math.asin(x) * k * dir))
      }
      const [t0, x0] = g.trail[0]
      const [t1, x1] = g.trail[g.trail.length - 1]
      vel = e.timeStamp - t1 < 60 && t1 > t0 ? (-((x1 - x0) / (t1 - t0)) * 1000 * dir) / pitch : 0
      if (still) return land(Math.round(pos))
      mode = "coast"
      run()
    },
    wheel(e: WheelEvent) {
      const { input, last } = live
      // A smooth scroller on the page (Lenis) leaves a wheel alone that carries this mark, as the scrollbar's host does.
      const claim = (on: boolean) => (e.currentTarget as Element).toggleAttribute("data-lenis-prevent-wheel", on)
      // A sideways swipe always turns it; the plain wheel only once it has focus, so the page still scrolls past it.
      const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      measure()
      const d = (sideways ? e.deltaX * dir : e.deltaY) * (e.deltaMode === 0 ? 1 / pitch : e.deltaMode === 1 ? 1 : 10)
      const from = mode === "wheel" ? scrolled : mode === "spring" ? target : pos // a scroll adds to where it is heading
      const ours = input && !input.matches(":disabled") && (sideways || document.activeElement === input)
      // At an end, the page scrolls on.
      if (!ours || (from <= 0 && d < 0) || (from >= last && d > 0)) {
        claim(false)
        return
      }
      claim(true)
      e.preventDefault()
      follow = true
      scrolled = clamp(from + d)
      clearTimeout(timer)
      timer = window.setTimeout(() => land(Math.round(scrolled)), 140)
      if (still) {
        pos = Math.round(scrolled)
        paint()
        return
      }
      mode = "wheel"
      run()
    },
    stop() {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    },
  }
}

function Turning({
  variant,
  name,
  legend,
  options,
  min = 0,
  max = 100,
  step = 1,
  major = 10,
  value,
  defaultValue,
  onValueChange,
  unit,
  className,
  ...props
}: Omit<DialProps, "variant"> & { variant: "tuner" }) {
  const scale = React.useMemo(() => scaleOf(options, min, max, step, major), [options, min, max, step, major])
  const last = scale.count - 1
  const [own, setOwn] = React.useState(() => (defaultValue === undefined ? 0 : scale.indexOf(defaultValue)))
  const index = value === undefined ? own : scale.indexOf(value)
  const [start] = React.useState(index)
  const [base, setBase] = React.useState(index)
  const legendId = React.useId()
  const wheel = React.useRef<HTMLSpanElement>(null)
  const drum = React.useRef<HTMLSpanElement>(null)
  const input = React.useRef<HTMLInputElement>(null)
  const [turn] = React.useState(() => createTurn(start))

  React.useLayoutEffect(() => {
    turn.sync({
      wheel: wheel.current,
      drum: drum.current,
      input: input.current,
      last,
      label: scale.label,
      commit: (i) => {
        if (value === undefined) setOwn(i)
        onValueChange?.(scale.valueAt(i))
      },
      recentre: setBase,
    })
  }, [turn, last, scale, value, onValueChange])

  // The wheel listener can't be passive: a turn claims the scroll.
  React.useEffect(() => {
    const face = wheel.current?.parentElement
    const onWheel = (e: WheelEvent) => turn.wheel(e)
    face?.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      face?.removeEventListener("wheel", onWheel)
      turn.stop()
    }
  }, [turn])

  React.useEffect(() => {
    if (index !== turn.committed()) turn.to(index)
  }, [turn, index])

  // Only the marks near the top exist; the rest of the scale is made as the wheel brings it round.
  // ponytail: a fixed reach covers the half turn in view while the stylesheet's --k stays under 21.
  const reach = 34
  const marks: number[] = []
  for (let i = Math.max(0, base - reach); i <= Math.min(last, base + reach); i++) marks.push(i)
  const chars = scale.numeric ? Math.max(scale.label(0).length, scale.label(last).length) : Math.max(...Array.from({ length: scale.count }, (_, i) => scale.label(i).length))
  const jump = major

  return (
    <fieldset data-slot="dial" data-variant={variant} className={cn("db-dial", className)} {...props}>
      <legend id={legendId} className="db-label">
        {legend}
      </legend>
      <div
        data-slot="dial-face"
        className="db-dial-face"
        aria-hidden="true"
        style={{ "--pos": start, "--chars": chars } as React.CSSProperties}
        onPointerDown={turn.down}
        onPointerMove={turn.move}
        onPointerUp={turn.up}
        onPointerCancel={turn.up}
      >
        <span className="db-dial-read">
          <span ref={drum} className="db-dial-drum" data-a={scale.label(start)} data-b={scale.label(start + 1)} />
          {unit ? <span className="db-dial-unit">{unit}</span> : null}
        </span>
        <span ref={wheel} className="db-dial-scale">
          {marks.map((i) => {
            const kind = scale.kind(i)
            return (
              <span key={i} className="db-dial-tick" data-kind={kind} style={{ "--v": i } as React.CSSProperties}>
                {kind === "major" ? <span>{scale.mark(i)}</span> : null}
              </span>
            )
          })}
          <span className="db-dial-index" />
        </span>
      </div>
      <input
        ref={input}
        type="range"
        className="db-sr"
        name={scale.numeric ? name : undefined}
        min={scale.numeric ? min : 0}
        max={scale.numeric ? Number(scale.valueAt(last)) : last}
        step={scale.numeric ? step : 1}
        value={scale.numeric ? Number(scale.valueAt(index)) : index}
        aria-labelledby={legendId}
        aria-valuetext={unit ? `${scale.label(index)} ${unit}` : scale.label(index)}
        onChange={(e) => turn.set(scale.numeric ? scale.indexOf(e.target.value) : Number(e.target.value))}
        onKeyDown={(e) => {
          // A native range jumps a tenth of its length; a dial jumps a major mark.
          if (e.key !== "PageUp" && e.key !== "PageDown") return
          e.preventDefault()
          turn.set(turn.committed() + (e.key === "PageUp" ? jump : -jump))
        }}
      />
      {!scale.numeric && name ? <input type="hidden" name={name} value={String(scale.valueAt(index))} /> : null}
    </fieldset>
  )
}

const EXHALE = "cubic-bezier(.16,1,.3,1)" // --db-exhale
const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches
const clampTo = (lo: number, hi: number, n: number) => Math.min(hi, Math.max(lo, n))

// The score's dynamics, quietest first. The type scale is named after them already (--db-pp … --db-fff), so the dial
// sets its number at the size its loudness would be printed.
const DYNAMICS = [
  ["ppp", "pianississimo"],
  ["pp", "pianissimo"],
  ["p", "piano"],
  ["mp", "mezzo piano"],
  ["mf", "mezzo forte"],
  ["f", "forte"],
  ["ff", "fortissimo"],
  ["fff", "fortississimo"],
] as const
const dynamicOf = (u: number) => (u <= 0 ? (["niente", "niente"] as const) : DYNAMICS[Math.min(7, Math.ceil(u * 8) - 1)])

/**
 * Dynamics: a native range under a number whose size is its loudness. Drag it (right or up is louder), scroll it
 * once it has focus, or use the keys; the marking under it names the dynamic.
 */
function Dynamics({ name, legend, min = 0, max = 100, step = 1, value, defaultValue, onValueChange, unit, className, style, ...props }: Omit<DialProps, "variant">) {
  const [own, setOwn] = React.useState(() => Number(defaultValue ?? min))
  const snap = (n: number) => clampTo(min, max, Number((Math.round((n - min) / step) * step + min).toFixed(6)))
  const v = snap(Number(value ?? own))
  const u = max > min ? (v - min) / (max - min) : 0
  const [mark, word] = dynamicOf(u)
  const legendId = React.useId()
  const input = React.useRef<HTMLInputElement>(null)
  const face = React.useRef<HTMLDivElement>(null)
  const grip = React.useRef<{ x: number; y: number; from: number } | null>(null)
  const live = React.useRef<{ v: number; set: (n: number) => void }>({ v, set: () => {} })

  const set = (n: number) => {
    const next = snap(n)
    if (next === v) return
    if (value === undefined) setOwn(next)
    onValueChange?.(next)
  }
  React.useLayoutEffect(() => {
    live.current = { v, set }
  })

  // The wheel turns it only once it has focus, so the page still scrolls past; at either end it hands the scroll back.
  React.useEffect(() => {
    const el = face.current
    const onWheel = (e: WheelEvent) => {
      const { v: now, set: to } = live.current
      const d = Math.sign(Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : -e.deltaY)
      if (!d || document.activeElement !== input.current || input.current?.disabled || (d < 0 && now <= min) || (d > 0 && now >= max)) return
      e.preventDefault()
      to(now + d * step)
    }
    el?.addEventListener("wheel", onWheel, { passive: false })
    return () => el?.removeEventListener("wheel", onWheel)
  }, [min, max, step])

  // The whole range is a short drag: about 260px, right or up for louder.
  const travel = 260 / Math.max(1, (max - min) / step)
  return (
    <fieldset data-slot="dial" data-variant="dynamics" className={cn("db-dial", className)} style={{ "--u": u.toFixed(4), "--chars": Math.max(String(min).length, String(max).length), ...style } as React.CSSProperties} {...props}>
      <legend id={legendId} className="db-label">
        {legend}
      </legend>
      <div
        ref={face}
        data-slot="dial-face"
        className="db-dial-face"
        aria-hidden="true"
        onPointerDown={(e) => {
          if (e.button !== 0 || !input.current || input.current.disabled) return
          e.preventDefault()
          input.current.focus({ preventScroll: true })
          e.currentTarget.setPointerCapture(e.pointerId)
          grip.current = { x: e.clientX, y: e.clientY, from: v }
          e.currentTarget.closest("fieldset")?.setAttribute("data-held", "")
        }}
        onPointerMove={(e) => {
          const g = grip.current
          if (!g) return
          const dx = (e.clientX - g.x) * (getComputedStyle(e.currentTarget).direction === "rtl" ? -1 : 1)
          set(g.from + Math.round((dx - (e.clientY - g.y)) / travel) * step)
        }}
        onPointerUp={(e) => {
          grip.current = null
          e.currentTarget.closest("fieldset")?.removeAttribute("data-held")
        }}
        onPointerCancel={(e) => {
          grip.current = null
          e.currentTarget.closest("fieldset")?.removeAttribute("data-held")
        }}
      >
        <span className="db-dial-loud">
          <span className="db-dial-numeral">{v}</span>
          {unit ? <span className="db-dial-unit">{unit}</span> : null}
        </span>
        <span className="db-dial-marking" data-mark={mark}>
          {mark}
        </span>
      </div>
      <input
        ref={input}
        type="range"
        className="db-sr"
        name={name}
        min={min}
        max={max}
        step={step}
        value={v}
        aria-labelledby={legendId}
        aria-valuetext={`${v}${unit ? ` ${unit}` : ""}, ${word}`}
        onChange={(e) => set(Number(e.target.value))}
      />
    </fieldset>
  )
}

/**
 * Tumbler: a whole number set figure by figure, like the wheels of a lock. The figure you turn stands in
 * parentheses, as "20(25)" holds the part that changes. Underneath, a native number input.
 */
function Tumbler({ name, legend, min = 0, max = 100, value, defaultValue, onValueChange, unit, className, ...props }: Omit<DialProps, "variant">) {
  const lo = Math.max(0, Math.ceil(min)) // ponytail: whole numbers from zero up; negatives and decimals wait for a need
  const hi = Math.max(lo, Math.floor(max))
  const n = String(hi).length
  const [own, setOwn] = React.useState(() => Number(defaultValue ?? lo))
  const v = clampTo(lo, hi, Math.round(Number(value ?? own)))
  const [at, setAt] = React.useState(n - 1) // which figure the parentheses hold, from the left
  const text = String(v).padStart(n, "0")
  const lead = n - String(v).length
  const legendId = React.useId()
  const hintId = React.useId()
  const input = React.useRef<HTMLInputElement>(null)
  const face = React.useRef<HTMLDivElement>(null)
  const figs = React.useRef<(HTMLSpanElement | null)[]>([])
  const was = React.useRef(text)
  const grip = React.useRef<{ y: number; from: number; k: number } | null>(null)
  const live = React.useRef<{ v: number; at: number; set: (n: number) => void }>({ v, at, set: () => {} })
  const place = (k: number) => 10 ** (n - 1 - k)

  const set = (next: number) => {
    const to = clampTo(lo, hi, Math.round(next))
    if (to === v) return
    if (value === undefined) setOwn(to)
    onValueChange?.(to)
  }
  React.useLayoutEffect(() => {
    live.current = { v, at, set }
  })

  // A changed figure turns in from below when the number grew, from above when it fell: the units first, the carry a
  // step behind, as a counter's wheels do.
  React.useLayoutEffect(() => {
    const before = was.current
    was.current = text
    if (before === text || still()) return
    const dir = Number(text) > Number(before) ? 1 : -1
    let order = 0
    for (let k = n - 1; k >= 0; k--) {
      if (before[k] === text[k]) continue
      figs.current[k]?.animate([{ translate: `0 ${dir * 0.45}em`, opacity: 0 }, { translate: "0 0", opacity: 1 }], { duration: 320, easing: EXHALE, delay: order++ * 36, fill: "backwards" }) // --db-moderato, --db-arpeggio
    }
  }, [text, n])

  React.useEffect(() => {
    const el = face.current
    const onWheel = (e: WheelEvent) => {
      const { v: now, at: k, set: to } = live.current
      const d = -Math.sign(e.deltaY)
      if (!d || document.activeElement !== input.current || input.current?.disabled || (d < 0 && now <= lo) || (d > 0 && now >= hi)) return
      e.preventDefault()
      to(now + d * 10 ** (n - 1 - k))
    }
    el?.addEventListener("wheel", onWheel, { passive: false })
    return () => el?.removeEventListener("wheel", onWheel)
  }, [lo, hi, n])

  const keys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const k = e.key
    let handled = true
    if (k === "ArrowUp" || k === "ArrowDown") set(v + (k === "ArrowUp" ? 1 : -1) * place(at))
    else if (k === "ArrowLeft" || k === "ArrowRight") setAt(clampTo(0, n - 1, at + (k === "ArrowLeft" ? -1 : 1)))
    else if (k === "Home" || k === "End") set(k === "Home" ? lo : hi)
    else if (/^[0-9]$/.test(k)) {
      // Typing sets the held figure and moves on to the next, as a code is entered.
      set(Number(text.slice(0, at) + k + text.slice(at + 1)))
      setAt(Math.min(n - 1, at + 1))
    } else handled = false
    if (handled) e.preventDefault()
  }

  return (
    <fieldset data-slot="dial" data-variant="tumbler" className={cn("db-dial", className)} {...props}>
      <legend id={legendId} className="db-label">
        {legend}
      </legend>
      <div
        ref={face}
        data-slot="dial-face"
        className="db-dial-face"
        aria-hidden="true"
        dir="ltr"
        onPointerDown={(e) => {
          const fig = (e.target as Element).closest<HTMLElement>("[data-k]")
          if (e.button !== 0 || !input.current || input.current.disabled) return
          e.preventDefault()
          input.current.focus({ preventScroll: true })
          const k = fig ? Number(fig.dataset.k) : at
          setAt(k)
          e.currentTarget.setPointerCapture(e.pointerId)
          grip.current = { y: e.clientY, from: v, k }
          e.currentTarget.closest("fieldset")?.setAttribute("data-held", "")
        }}
        onPointerMove={(e) => {
          const g = grip.current
          if (!g) return
          set(g.from + Math.trunc((g.y - e.clientY) / 24) * place(g.k)) // a figure a finger's width up or down
        }}
        onPointerUp={(e) => {
          grip.current = null
          e.currentTarget.closest("fieldset")?.removeAttribute("data-held")
        }}
        onPointerCancel={(e) => {
          grip.current = null
          e.currentTarget.closest("fieldset")?.removeAttribute("data-held")
        }}
      >
        <span className="db-dial-figures" style={{ "--at": at } as React.CSSProperties}>
          {[...text].map((f, k) => (
            <span key={k} ref={(el) => void (figs.current[k] = el)} data-k={k} data-lead={k < lead && k < n - 1 ? "" : undefined} className="db-dial-figure">
              {f}
            </span>
          ))}
          <span className="db-dial-cursor" />
        </span>
        {unit ? <span className="db-dial-unit">{unit}</span> : null}
      </div>
      <input
        ref={input}
        type="number"
        role="spinbutton"
        className="db-sr"
        name={name}
        min={lo}
        max={hi}
        step={1}
        value={v}
        inputMode="none"
        aria-labelledby={legendId}
        aria-describedby={hintId}
        aria-valuetext={unit ? `${v} ${unit}` : String(v)}
        onChange={(e) => e.target.value !== "" && set(Number(e.target.value))}
        onKeyDown={keys}
      />
      <span id={hintId} className="db-sr">
        Up and down turn the figure in parentheses; left and right choose another.
      </span>
    </fieldset>
  )
}

export { Dial, type DialProps, type DialOption, type DialValue }
