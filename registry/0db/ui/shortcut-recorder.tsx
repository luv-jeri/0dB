"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { useFormReset } from "@/registry/0db/lib/use-form-reset"
import { cn } from "@/registry/0db/lib/utils"

type Shortcut = { key: string; modifiers: ("Control" | "Alt" | "Shift" | "Meta")[] }
type ShortcutRecorderProps = Omit<React.ComponentProps<"fieldset">, "children" | "onChange" | "defaultValue"> & {
  label: React.ReactNode
  value?: Shortcut | null
  defaultValue?: Shortcut | null
  onValueChange?: (value: Shortcut | null) => void
  requireModifier?: boolean
  name?: string
  recordLabel?: string
  cancelLabel?: string
  clearLabel?: string
  emptyLabel?: string
  hint?: string
}

/** Capture only while this button has focus. Tab and Escape always keep their usual escape route. */
function ShortcutRecorder({ label, value: controlled, defaultValue = null, onValueChange, requireModifier = true, name, recordLabel = "Record", cancelLabel = "Cancel", clearLabel = "Clear", emptyLabel = "Not assigned", hint = "Press a key with Control, Alt or Meta. Escape cancels; Tab leaves.", disabled, form, className, ref: forwardedRef, ...props }: ShortcutRecorderProps) {
  const id = React.useId()
  const [local, setLocal] = React.useState<Shortcut | null>(defaultValue)
  const [recording, setRecording] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const record = React.useRef<HTMLButtonElement>(null)
  const held = React.useRef<string | null>(null)
  React.useEffect(() => { if (disabled) held.current = null }, [disabled])
  const [wasDisabled, setWasDisabled] = React.useState(disabled)
  if (wasDisabled !== disabled) { setWasDisabled(disabled); if (disabled) { setRecording(false); setMessage("") } }
  const value = controlled === undefined ? local : controlled
  const root = React.useRef<HTMLFieldSetElement>(null)
  const ref = useComposedRefs(root, forwardedRef)
  useFormReset(root, () => { if (controlled === undefined) setLocal(defaultValue); held.current = null; setRecording(false); setMessage("") })
  const active = recording && !disabled
  const change = (next: Shortcut | null) => { if (controlled === undefined) setLocal(next); onValueChange?.(next) }
  return <fieldset {...props} ref={ref} form={form} disabled={disabled} data-slot="shortcut-recorder" data-recording={active ? "" : undefined} className={cn("db-shortcut", className)}>
    <legend data-slot="shortcut-label">{label}</legend>
    <div data-slot="shortcut-chord" className="db-shortcut-chord" aria-live="polite">
      {value ? [...value.modifiers, value.key].map((key, i) => <React.Fragment key={`${key}-${i}`}>{i > 0 ? <span className="db-shortcut-join" aria-hidden="true">+</span> : null}<kbd data-slot="shortcut-key" className="db-yours">{key === " " ? "Space" : key}</kbd></React.Fragment>) : <span className="db-shortcut-empty">{emptyLabel}</span>}
    </div>
    <div className="db-shortcut-actions">
      <button ref={record} type="button" data-slot="shortcut-record" aria-pressed={active} aria-describedby={`${id}-hint`} onBlur={() => { held.current = null; setRecording(false); setMessage("") }} onClick={() => { setRecording(!active); setMessage("") }} onKeyUp={(e) => {
        if (held.current !== (e.code || e.key)) return
        e.preventDefault()
        e.stopPropagation()
        held.current = null
      }} onKeyDown={(e) => {
        if (held.current === (e.code || e.key)) { e.preventDefault(); e.stopPropagation(); return }
        if (!active || e.defaultPrevented || e.nativeEvent.isComposing) return
        if (e.key === "Tab") { setRecording(false); return }
        if (e.key === "Escape") { held.current = e.code || e.key; e.preventDefault(); e.stopPropagation(); setRecording(false); setMessage(""); return }
        if (["Control", "Alt", "Shift", "Meta", "Dead", "Process", "Unidentified"].includes(e.key)) return
        e.preventDefault()
        e.stopPropagation()
        if (e.repeat) return
        if (requireModifier && !e.ctrlKey && !e.altKey && !e.metaKey) { setMessage("Include Control, Alt or Meta."); return }
        const modifiers: Shortcut["modifiers"] = []
        if (e.ctrlKey) modifiers.push("Control")
        if (e.altKey) modifiers.push("Alt")
        if (e.shiftKey) modifiers.push("Shift")
        if (e.metaKey) modifiers.push("Meta")
        held.current = e.code || e.key
        change({ key: e.key.length === 1 ? e.key.toUpperCase() : e.key, modifiers })
        setRecording(false)
        setMessage("")
      }}>{active ? cancelLabel : recordLabel}</button>
      {value ? <button type="button" data-slot="shortcut-clear" onClick={() => { change(null); setRecording(false); setMessage(""); record.current?.focus() }}>{clearLabel}</button> : null}
    </div>
    <p data-slot="shortcut-hint" id={`${id}-hint`} className="db-shortcut-hint">{hint}</p>
    <span className="db-sr" role="status">{message}</span>
    {name ? <input type="hidden" form={form} name={name} value={value ? JSON.stringify(value) : ""} /> : null}
  </fieldset>
}

export { ShortcutRecorder, type ShortcutRecorderProps, type Shortcut }
