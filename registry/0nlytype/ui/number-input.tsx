"use client"

import * as React from "react"

import { useDigitRoll } from "@/registry/0nlytype/lib/use-digit-roll"
import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { reader, raw } from "@/registry/0nlytype/lib/number"
import { cn } from "@/registry/0nlytype/lib/utils"
import { Button } from "@/registry/0nlytype/ui/button"
import { useFieldControl, useLineOrigin } from "@/registry/0nlytype/ui/field"

type Unit = string | (Partial<Record<Intl.LDMLPluralRule, string>> & { other: string })

type NumberInputProps = Omit<React.ComponentProps<"input">, "type" | "value" | "defaultValue" | "min" | "max" | "step" | "size" | "onChange"> & {
  value?: number | null
  defaultValue?: number | null
  onValueChange?: (value: number | null) => void
  min?: number
  max?: number
  step?: number
  /** How the number reads when you're not typing it, passed to Intl.NumberFormat: { style: "currency", currency: "EUR" }. */
  format?: Intl.NumberFormatOptions
  /** The locale for reading and writing it. Fixed by default so the server and the browser agree on the first paint. */
  locale?: string
  /** Ours, after your figure, upright in pencil. Forms by plural category agree with the number: { one: "guest", other: "guests" }. */
  unit?: Unit
  /**
   * line: your figure on a field's baseline, less and more in brackets at its end. scale: your figure stands over a
   * ruler that hangs from the baseline; drag the ruler to turn the number, or step it and the ruler slides a tick.
   */
  variant?: "line" | "scale"
  /** Pins a state for documentation ("focus"); set on the root. */
  "data-force"?: string
}

const decimals = (n: number) => (String(n).split(".")[1] ?? "").length

/**
 * The formatted number, turned over like a counter's wheels: if it keeps its length only the figures that changed
 * turn, the units first and each place one arpeggio later; otherwise it turns over whole. `instant` skips the turn.
 */
function Figures({ text, value, instant }: { text: string; value: number | null; instant: boolean }) {
  const { shown: valueShown, whole, figs } = useDigitRoll(text, { order: value ?? 0, instant })
  const shown = String(valueShown)

  return (
    <span ref={whole} className="db-number-figures" aria-hidden="true">
      {[...shown].map((c, k) => (
        <span key={shown.length - k} ref={(el) => void (figs.current[k] = el)} className="db-number-figure">
          {c}
        </span>
      ))}
    </span>
  )
}

/**
 * A number on a baseline. Your figure is italic and reads formatted; type into it and you edit the plain figures.
 * Up and Down step it, Page Up and Page Down step ten, Home and End go to the ends; less and more do it by hand.
 * Each step turns the changed figures over like a counter.
 */
function NumberInput({
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 1,
  format,
  locale = "en",
  unit,
  variant = "line",
  name,
  disabled,
  readOnly,
  placeholder,
  className,
  onFocus,
  onBlur,
  onKeyDown,
  onPointerDown,
  "data-force": force,
  ref: forwardedRef, ...props
}: NumberInputProps) {
  const field = useFieldControl()
  const [own, setOwn] = React.useState<number | null>(defaultValue)
  const current = value !== undefined ? value : own
  const [typed, setDraft] = React.useState("")
  const [editing, setEditing] = React.useState(false)
  const [held, setHeld] = React.useState(false)
  const input = React.useRef<HTMLInputElement>(null)
  const composedRef = useComposedRefs(input, forwardedRef)
  const read = React.useMemo(() => reader(locale), [locale])
  const origin = useLineOrigin<HTMLInputElement>((el) => el.closest<HTMLElement>(".db-number") ?? el, { onPointerDown, onFocus } as React.ComponentProps<"input">)

  // While you type, the input holds what you typed; otherwise the plain figures of the value, whoever changed it.
  const draft = editing ? typed : raw(current, locale)

  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n))
  const commit = (n: number | null) => {
    if (value === undefined) setOwn(n)
    if (!Object.is(n, current)) onValueChange?.(n)
  }
  /** Moves by whole steps from min (or zero), so 0.1 + 0.2 lands on 0.3 and not beside it. */
  const stepBy = (steps: number, from = current) => {
    if (disabled || readOnly) return
    const base = min ?? 0
    const places = Math.max(decimals(step), decimals(base))
    const at = from === null ? base : base + Math.round((from - base) / step + steps) * step
    commit(clamp(Number(at.toFixed(places))))
    setEditing(false)
  }

  // The figures you read take a true minus sign, not the hyphen the formatter gives.
  const text = current === null ? "" : new Intl.NumberFormat(locale, format).format(current).replace(/-/g, "\u2212")
  const forms = new Intl.PluralRules(locale)
  const said = unit === undefined ? "" : typeof unit === "string" ? unit : (unit[forms.select(current ?? 0)] ?? unit.other)
  const atMin = current !== null && min !== undefined && current <= min
  const atMax = current !== null && max !== undefined && current >= max

  const press = (steps: number) => ({
    tabIndex: -1,
    disabled: disabled || readOnly || (steps < 0 ? atMin : atMax),
    // Keeps focus (and the caret) where it was: the buttons are the hand's way in, the keys are the keyboard's.
    onPointerDown: (e: React.PointerEvent) => e.preventDefault(),
    onClick: () => stepBy(steps, editing ? (read(draft) ?? current) : current),
  })

  // scale: the ruler follows the hand, one step per tick, and the number with it.
  const drag = React.useRef<{ x: number; from: number | null } | null>(null)
  const pitch = 10 // px per step, as --db-number-pitch
  const tape = {
    onPointerDown(e: React.PointerEvent<HTMLElement>) {
      if (disabled || readOnly || e.button !== 0) return
      e.currentTarget.setPointerCapture(e.pointerId)
      drag.current = { x: e.clientX, from: current }
      setHeld(true)
    },
    onPointerMove(e: React.PointerEvent<HTMLElement>) {
      const d = drag.current
      if (!d) return
      stepBy(Math.round((d.x - e.clientX) / pitch), d.from)
    },
    onPointerUp() {
      drag.current = null
      setHeld(false)
    },
    onPointerCancel() {
      drag.current = null
      setHeld(false)
    },
  }

  return (
    <div
      data-slot="number-input"
      data-variant={variant}
      data-editing={editing ? "" : undefined}
      data-held={held ? "" : undefined}
      data-empty={current === null ? "" : undefined}
      data-force={force}
      className={cn("db-number", className)}
      style={{ "--at": ((current ?? 0) / step) % 100000 } as React.CSSProperties}
    >
      <span className="db-number-reading">
        <span className="db-number-cell">
          <input
            data-slot="number-input-control"
            {...props}
            ref={composedRef}
            className="db-number-input"
            type="text"
            inputMode={(min ?? -1) >= 0 && Number.isInteger(step) ? "numeric" : "decimal"}
            role="spinbutton"
            autoComplete="off"
            id={props.id ?? field.id}
            aria-invalid={props["aria-invalid"] ?? field["aria-invalid"]}
            aria-describedby={props["aria-describedby"] ?? field["aria-describedby"]}
            aria-valuenow={current ?? undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={current === null ? undefined : `${text}${said ? ` ${said}` : ""}`}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            value={draft}
            onChange={(e) => {
              setEditing(true)
              setDraft(e.target.value)
              const n = read(e.target.value)
              if (n !== undefined) commit(n)
            }}
            onPointerDown={(e) => {
              origin.onPointerDown(e)
              if (disabled || readOnly || editing) return
              setDraft(draft) // a touch in the figures puts the caret among the plain ones
              setEditing(true)
            }}
            onFocus={origin.onFocus}
            onBlur={(e) => {
              onBlur?.(e)
              const n = read(draft)
              commit(n === undefined ? current : n === null ? null : clamp(n))
              setEditing(false)
            }}
            onKeyDown={(e) => {
              onKeyDown?.(e)
              if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.nativeEvent.isComposing) return
              const from = editing ? (read(draft) ?? current) : current
              const keys: Record<string, () => void> = {
                ArrowUp: () => stepBy(1, from),
                ArrowDown: () => stepBy(-1, from),
                PageUp: () => stepBy(10, from),
                PageDown: () => stepBy(-10, from),
                ...(min !== undefined ? { Home: () => stepBy(0, min) } : {}),
                ...(max !== undefined ? { End: () => stepBy(0, max) } : {}),
                Enter: () => {
                  const n = read(draft)
                  commit(n === undefined ? current : n === null ? null : clamp(n))
                  setEditing(false)
                },
                Escape: () => setEditing(false),
              }
              const act = keys[e.key]
              if (!act || readOnly || disabled) return
              if (e.key !== "Enter") e.preventDefault()
              act()
            }}
          />
          <Figures text={text} value={current} instant={held} />
        </span>
        {said ? (
          <span className="db-number-unit" aria-hidden="true">
            {said}
          </span>
        ) : null}
      </span>
      <Button variant="bracket" className="db-number-less" aria-label="Less" {...press(-1)}>
        less
      </Button>
      <Button variant="bracket" className="db-number-more" aria-label="More" {...press(1)}>
        more
      </Button>
      {variant === "scale" ? <span className="db-number-tape" aria-hidden="true" {...tape} /> : null}
      {name ? <input type="hidden" name={name} value={current ?? ""} disabled={disabled} /> : null}
    </div>
  )
}

export { NumberInput, type NumberInputProps }
