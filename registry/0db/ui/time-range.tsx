"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { useFormReset } from "@/registry/0db/lib/use-form-reset"
import { cn } from "@/registry/0db/lib/utils"

type TimeRangeValue = { start: string; end: string }
/** Civil minutes only: this interval has no date or timezone and never silently crosses midnight. */
function timeRangeMinutes(value: TimeRangeValue, overnight = false): number | null {
  const parse = (time: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time) ? Number(time.slice(0, 2)) * 60 + Number(time.slice(3)) : null
  const start = parse(value.start), end = parse(value.end)
  if (start === null || end === null) return null
  if (end < start) return overnight ? 1440 - start + end : null
  return end - start
}

type TimeRangeProps = Omit<React.ComponentProps<"fieldset">, "children" | "onChange" | "defaultValue"> & {
  label: React.ReactNode
  value?: TimeRangeValue
  defaultValue?: TimeRangeValue
  onValueChange?: (value: TimeRangeValue) => void
  overnight?: boolean
  startLabel?: string
  endLabel?: string
  invalidLabel?: string
  emptyLabel?: string
  formatDuration?: (minutes: number) => string
  startProps?: Omit<React.ComponentProps<"input">, "type" | "value" | "defaultValue" | "children">
  endProps?: Omit<React.ComponentProps<"input">, "type" | "value" | "defaultValue" | "children">
}

function TimeRange({ label, value: controlled, defaultValue = { start: "", end: "" }, onValueChange, overnight = false, startLabel = "From", endLabel = "Until", invalidLabel = "Set the end after the start.", emptyLabel = "Set both times", formatDuration = (n) => `${Math.floor(n / 60)}h ${n % 60}m`, startProps, endProps, className, disabled, form, ref: forwardedRef, ...props }: TimeRangeProps) {
  const id = React.useId()
  const root = React.useRef<HTMLFieldSetElement>(null)
  const ref = useComposedRefs(root, forwardedRef)
  const [local, setLocal] = React.useState(defaultValue)
  useFormReset(root, () => { if (controlled === undefined) setLocal(defaultValue) })
  const value = controlled ?? local
  const minutes = timeRangeMinutes(value, overnight)
  const invalid = Boolean(value.start && value.end && minutes === null)
  const startMinute = /^([01]\d|2[0-3]):[0-5]\d$/.test(value.start) ? Number(value.start.slice(0, 2)) * 60 + Number(value.start.slice(3)) : 0
  const firstShare = minutes === null ? 0 : Math.min(minutes, 1440 - startMinute)
  const wrappedShare = minutes === null ? 0 : Math.max(0, minutes - firstShare)
  React.useEffect(() => {
    root.current?.querySelector<HTMLInputElement>('[data-slot="time-range-end"]')?.setCustomValidity(invalid ? invalidLabel : "")
  }, [invalid, invalidLabel])
  return <fieldset {...props} ref={ref} form={form} disabled={disabled} data-slot="time-range" aria-invalid={invalid || undefined} className={cn("db-time-range", className)}>
    <legend data-slot="time-range-label">{label}</legend>
    <div className="db-time-range-pair">
      {(["start", "end"] as const).map((part) => {
        const native = part === "start" ? startProps : endProps
        const inputId = native?.id ?? `${id}-${part}`
        return <label key={part} className="db-time-range-part" htmlFor={inputId}><span>{part === "start" ? startLabel : endLabel}</span><input {...native} id={inputId} form={native?.form ?? form} data-slot={`time-range-${part}`} type="time" step={60} value={value[part]} aria-describedby={[native?.["aria-describedby"], `${id}-duration`].filter(Boolean).join(" ")} aria-invalid={invalid || native?.["aria-invalid"]} onChange={(e) => {
          native?.onChange?.(e)
          if (e.defaultPrevented) return
          const next = { ...value, [part]: e.target.value }
          if (controlled === undefined) setLocal(next)
          onValueChange?.(next)
        }} /></label>
      })}
    </div>
    <div data-slot="time-range-measure" className="db-time-range-measure" aria-hidden="true"><span style={{ "--db-time-start": startMinute / 1440, "--db-time-share": firstShare / 1440 } as React.CSSProperties} />{wrappedShare > 0 ? <span style={{ "--db-time-start": 0, "--db-time-share": wrappedShare / 1440 } as React.CSSProperties} /> : null}</div>
    <div className="db-time-range-scale" aria-hidden="true"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>
    <output data-slot="time-range-duration" data-complete={minutes !== null ? "" : undefined} id={`${id}-duration`} className="db-time-range-duration" aria-live="polite" data-invalid={invalid ? "" : undefined}>{invalid ? invalidLabel : minutes === null ? emptyLabel : formatDuration(minutes)}</output>
  </fieldset>
}

export { TimeRange, timeRangeMinutes, type TimeRangeProps, type TimeRangeValue }
