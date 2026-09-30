"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type RadioGroupContextValue = {
  name: string
  value: string | undefined
  select: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

function useRadioGroup() {
  const ctx = React.useContext(RadioGroupContext)
  if (!ctx) throw new Error("RadioGroupItem must sit inside <RadioGroup>.")
  return ctx
}

type RadioGroupProps = Omit<React.ComponentProps<"fieldset">, "defaultValue" | "onChange"> & {
  /** Shared by every radio, so a form submits the choice. Defaults to a generated name. */
  name?: string
  /** The small label over the words. Without one, give the group an aria-label. */
  legend?: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

/**
 * Words in a row. The chosen word turns italic, because it's yours now; one
 * accent dot glides beneath it. Native radios underneath, so arrow keys move the choice.
 */
function RadioGroup({ name, legend, value: controlled, defaultValue, onValueChange, className, children, ...props }: RadioGroupProps) {
  const generated = React.useId()
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = controlled ?? uncontrolled
  const box = React.useRef<HTMLFieldSetElement>(null)
  const dot = React.useRef<HTMLSpanElement>(null)
  const was = React.useRef(value)

  const select = React.useCallback(
    (next: string) => {
      if (controlled === undefined) setUncontrolled(next)
      onValueChange?.(next)
    },
    [controlled, onValueChange],
  )
  const ctx = React.useMemo(() => ({ name: name ?? generated, value, select }), [name, generated, value, select])

  // The dot's place: --c is the chosen word's centre, --y lifts it to a wrapped row.
  const follow = React.useCallback(() => {
    const el = box.current
    const chosen = el?.querySelector<HTMLElement>("input:checked")?.closest("label")
    if (!el || !chosen) return
    const b = el.getBoundingClientRect()
    const r = chosen.getBoundingClientRect()
    const lastRow = Math.max(...[...el.querySelectorAll("label")].map((l) => l.getBoundingClientRect().bottom))
    el.style.setProperty("--c", `${r.left - b.left + r.width / 2}px`)
    el.style.setProperty("--y", `${r.bottom - lastRow}px`)
  }, [])

  React.useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const from = parseFloat(el.style.getPropertyValue("--c")) || 0
    const moved = was.current !== value
    was.current = value
    // Nothing glides until the person has chosen: the first place is just where it starts.
    if (moved) el.setAttribute("data-ready", "")
    follow()
    const far = Math.abs(parseFloat(el.style.getPropertyValue("--c")) - from)
    // The dot is a drop of ink: it stretches along the way it travels.
    if (moved && far > 1 && dot.current?.animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dot.current.animate([{ scale: "1 1" }, { scale: `${1 + Math.min(far, 240) / 90} 0.72`, offset: 0.5 }, { scale: "1 1" }], {
        duration: 320,
        easing: "cubic-bezier(.65,0,.35,1)",
      })
    }
  }, [value, follow])

  // Words re-flow on resize and when the fonts arrive; the dot follows.
  // ponytail: watches the words present at mount; add a MutationObserver if items come and go.
  React.useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(follow)
    ro.observe(el)
    el.querySelectorAll("label").forEach((l) => ro.observe(l))
    document.fonts?.ready.then(follow)
    return () => ro.disconnect()
  }, [follow])

  return (
    <RadioGroupContext.Provider value={ctx}>
      <fieldset ref={box} data-slot="radio-group" className={cn("db-choice", className)} {...props}>
        {legend ? <legend className="db-label">{legend}</legend> : null}
        {children}
        <span ref={dot} data-slot="radio-group-dot" className="db-choice-dot" aria-hidden="true" />
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
    <label data-slot="radio-group-item" data-force={force} data-text={children} className={labelClassName}>
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
      <span>{children}</span>
    </label>
  )
}

export { RadioGroup, RadioGroupItem, type RadioGroupProps, type RadioGroupItemProps }
