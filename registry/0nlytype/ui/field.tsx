"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { useFormPresentation } from "@/registry/0nlytype/lib/use-form-presentation"
import { cn } from "@/registry/0nlytype/lib/utils"

/** Errors a Form found, keyed by the id of the control they belong to. */
const FieldErrors = React.createContext<Record<string, string>>({})
const FieldErrorsProvider = FieldErrors.Provider

type FieldContext = { id: string; hintId?: string; errorId?: string; invalid: boolean; maxLength?: number; sync: () => void }
const FieldCtx = React.createContext<FieldContext | null>(null)

/** What a control inside a Field needs: its id, what describes it, whether it's wrong. Empty outside a Field. */
function useFieldControl() {
  const ctx = React.useContext(FieldCtx)
  React.useLayoutEffect(() => { ctx?.sync() })
  return {
    id: ctx?.id,
    maxLength: ctx?.maxLength,
    "aria-invalid": ctx?.invalid ? (true as const) : undefined,
    "aria-describedby": [ctx?.hintId, ctx?.errorId].filter(Boolean).join(" ") || undefined,
  }
}

type FieldProps = Omit<React.ComponentProps<"div">, "id"> & {
  label?: React.ReactNode
  hint?: React.ReactNode
  /** What to fix, in plain words. Turns the baseline crimson and hangs the message from it. */
  error?: React.ReactNode
  /** Show how much is typed, "12 / 40", while the field has focus. */
  count?: boolean
  maxLength?: number
  /** The control's id. Made for you when omitted. */
  id?: string
  /**
   * How the label and your words share the line. line: the label above a baseline. overprint: the label is a heavy
   * condensed word and your italic is printed over it, knocked out in paper. signature: a cross marks where to write
   * and the label is a caption under the line, as on a printed form.
   */
  variant?: "line" | "overprint" | "signature"
}

/** One control on a baseline. Wraps an Input, Textarea, InputGroup or InputOTP and wires label, hint and error to it. */
function Field({ label, hint, error, count, maxLength, id, variant = "line", className, children, onInput, ref: forwardedRef, ...props }: FieldProps) {
  const made = React.useId()
  const controlId = id ?? made
  const formErrors = React.useContext(FieldErrors)
  const message = error ?? formErrors[controlId]
  const root = React.useRef<HTMLDivElement>(null)
  const composedRef = useComposedRefs(root, forwardedRef)
  const [typed, setTyped] = React.useState(0)
  const sync = React.useCallback(() => {
    const el = root.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>('input:not([type="hidden"]), textarea')
    setTyped(el?.value.length ?? 0)
  }, [])
  useFormPresentation(root, sync)

  const ctx: FieldContext = {
    id: controlId,
    hintId: hint ? `${controlId}-hint` : undefined,
    errorId: message ? `${controlId}-error` : undefined,
    invalid: Boolean(message),
    maxLength,
    sync,
  }

  return (
    <FieldCtx.Provider value={ctx}>
      <div
        ref={composedRef}
        data-slot="field"
        data-variant={variant}
        data-filled={typed > 0 ? "" : undefined}
        className={cn("db-field", className)}
        onInput={(e) => {
          onInput?.(e)
          if ((e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) setTyped(e.target.value.length)
        }}
        {...props}
      >
        {label ? (
          <label data-slot="field-label" className="db-label" htmlFor={controlId}>
            {label}
          </label>
        ) : null}
        {count ? (
          <span data-slot="field-count" className="db-field-count" aria-hidden="true">
            {typed}
            {maxLength ? ` / ${maxLength}` : null}
          </span>
        ) : null}
        {variant === "signature" ? <span className="db-field-mark" aria-hidden="true" /> : null}
        {children}
        {hint ? (
          <p data-slot="field-hint" id={ctx.hintId} className="db-field-hint">
            {hint}
          </p>
        ) : null}
        {message ? <FieldError id={ctx.errorId}>{message}</FieldError> : null}
      </div>
    </FieldCtx.Provider>
  )
}

/** The callout: a pill on a leader line, hung from the baseline it's about. */
function FieldError({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="field-error" className={cn("db-field-error", className)} {...props} />
}

type Control<T extends HTMLElement> = React.ComponentProps<T extends HTMLTextAreaElement ? "textarea" : "input">

/**
 * The accent line grows out from where you touched the line; for the keyboard,
 * from where the line starts (the right in a right-to-left page). Sets --o on `line`.
 */
function useLineOrigin<T extends HTMLInputElement | HTMLTextAreaElement>(line: (el: T) => HTMLElement, { onPointerDown, onFocus }: Control<T>) {
  const touched = React.useRef(false)
  return {
    onPointerDown(e: React.PointerEvent<T>) {
      onPointerDown?.(e as never)
      const r = e.currentTarget.getBoundingClientRect()
      line(e.currentTarget).style.setProperty("--o", `${Math.round(((e.clientX - r.left) / r.width) * 100)}%`)
      touched.current = true
    },
    onFocus(e: React.FocusEvent<T>) {
      onFocus?.(e as never)
      if (!touched.current) line(e.currentTarget).style.setProperty("--o", getComputedStyle(e.currentTarget).direction === "rtl" ? "100%" : "0%")
      touched.current = false
    },
  }
}

/** Your words arrive in italic; the placeholder stays in our voice, in pencil. Works alone or inside a Field. */
function Input({ className, ...props }: React.ComponentProps<"input">) {
  const field = useFieldControl()
  const origin = useLineOrigin<HTMLInputElement>((el) => el, props)
  return (
    <input
      data-slot="input"
      className={cn("db-input", className)}
      {...props}
      id={props.id ?? field.id}
      maxLength={props.maxLength ?? field.maxLength}
      aria-invalid={props["aria-invalid"] ?? field["aria-invalid"]}
      aria-describedby={props["aria-describedby"] ?? field["aria-describedby"]}
      {...origin}
    />
  )
}

/** Ruled like paper: the lines sit on the text's baselines and scroll with it. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const field = useFieldControl()
  const origin = useLineOrigin<HTMLTextAreaElement>((el) => el, props)
  return (
    <textarea
      data-slot="textarea"
      className={cn("db-input", className)}
      {...props}
      id={props.id ?? field.id}
      maxLength={props.maxLength ?? field.maxLength}
      aria-invalid={props["aria-invalid"] ?? field["aria-invalid"]}
      aria-describedby={props["aria-describedby"] ?? field["aria-describedby"]}
      {...origin}
    />
  )
}

export { Field, FieldError, FieldErrorsProvider, Input, Textarea, useFieldControl, useLineOrigin, type FieldProps }
