"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { useFormReset } from "@/registry/0db/lib/use-form-reset"
import { cn } from "@/registry/0db/lib/utils"

type AllocationItem = { id: string; label: string; disabled?: boolean }
type AllocationProps = Omit<React.ComponentProps<"fieldset">, "children" | "onChange" | "defaultValue"> & {
  label: React.ReactNode
  items: AllocationItem[]
  total: number
  value?: Record<string, number>
  defaultValue?: Record<string, number>
  onValueChange?: (value: Record<string, number>) => void
  step?: number
  unit?: string
  name?: string
  remainingLabel?: string
  excessLabel?: string
  format?: (value: number) => string
}

const numbers = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 4 })
/** Set several shares of one finite allowance. Unassigned space remains explicit; changing one never edits another. */
function Allocation({ label, items, total, value: controlled, defaultValue = {}, onValueChange, step = 1, unit = "", name, remainingLabel = "Unassigned", excessLabel = "Over allowance", format = (n) => numbers.format(n), disabled, form, className, ref: forwardedRef, ...props }: AllocationProps) {
  const id = React.useId()
  const [local, setLocal] = React.useState(defaultValue)
  const root = React.useRef<HTMLFieldSetElement>(null)
  const ref = useComposedRefs(root, forwardedRef)
  useFormReset(root, () => { if (controlled === undefined) setLocal(defaultValue) })
  const raw = controlled ?? local
  const value = Object.fromEntries(items.map((item) => [item.id, Object.hasOwn(raw, item.id) ? raw[item.id] : 0]))
  if (!Number.isFinite(total) || total < 0 || !Number.isFinite(step) || step <= 0 || new Set(items.map((item) => item.id)).size !== items.length || items.some((item) => !item.id || !Number.isFinite(value[item.id]) || value[item.id] < 0))
    throw new RangeError("Allocation needs unique ids, finite non-negative shares and total, and a positive step")
  const sum = Object.values(value).reduce((a, b) => a + b, 0)
  if (!Number.isFinite(sum)) throw new RangeError("Allocation shares overflow the finite allowance")
  const tolerance = Number.EPSILON * Math.max(total, sum) * Math.max(1, items.length) * 2
  const clean = (n: number) => Math.abs(n) <= tolerance ? 0 : Number(n.toPrecision(12))
  const remaining = clean(total - sum)
  const over = remaining < 0
  const [previous, setPrevious] = React.useState(remaining)
  const [acted, setActed] = React.useState(false)
  if (previous !== remaining) { setPrevious(remaining); setActed(true) }
  return <fieldset {...props} ref={ref} form={form} disabled={disabled} data-slot="allocation" data-acted={acted ? "" : undefined} className={cn("db-allocation", className)} aria-invalid={over || undefined}>
    <legend data-slot="allocation-label">{label}</legend>
    <div data-slot="allocation-balance" className="db-allocation-balance" data-invalid={over ? "" : undefined}>
      <span aria-hidden="true">{over ? excessLabel : remainingLabel}</span><output id={`${id}-balance`} aria-live="polite"><span className="db-sr">{over ? excessLabel : remainingLabel}: </span><bdi key={remaining} dir="ltr" className="db-yours">{format(Math.abs(remaining))}</bdi><small>{unit}</small></output>
    </div>
    <div data-slot="allocation-shares" className="db-allocation-shares">
      {items.map((item) => <div key={item.id} data-slot="allocation-share" className="db-allocation-share">
        <label htmlFor={`${id}-${item.id}`}>{item.label}</label>
        <input data-slot="allocation-input" id={`${id}-${item.id}`} type="number" min={0} max={Math.max(0, clean(total - (sum - value[item.id])))} step={step} form={form} name={name ? `${name}[${item.id}]` : undefined} value={value[item.id]} disabled={disabled || item.disabled} aria-describedby={`${id}-balance`} aria-invalid={over || undefined} onChange={(e) => {
          const n = e.target.value === "" ? 0 : e.target.valueAsNumber
          if (!Number.isFinite(n)) return
          const limit = Math.max(0, clean(total - (sum - value[item.id])))
          const bounded = Math.min(limit, Math.max(0, n))
          const share = bounded < n ? clean(Math.floor((limit + tolerance) / step) * step) : bounded
          const next = { ...value, [item.id]: share }
          if (controlled === undefined) setLocal(next)
          onValueChange?.(next)
        }} />
        <span className="db-allocation-dimension" aria-hidden="true" style={{ "--db-allocation-share": total ? Math.min(1, value[item.id] / total) : 0 } as React.CSSProperties} />
      </div>)}
    </div>
  </fieldset>
}

export { Allocation, type AllocationProps, type AllocationItem }
