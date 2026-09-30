"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { Button } from "@/registry/0db/ui/button"
import { FieldErrorsProvider } from "@/registry/0db/ui/field"

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const Busy = React.createContext(false)

/** Words for a control that fails: its data-error if it has one, else the browser's own message. */
const problem = (el: Control) => el.dataset.error || el.validationMessage

type FormProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  /** Runs once every control is valid. The submit button is busy until it settles. */
  onSubmit: (data: FormData) => Promise<void> | void
}

/**
 * Fields on the grid and one statement button to send. The browser's own bubbles are off;
 * instead each failing control gets its callout in its Field, and focus goes to the first.
 * Give a control `data-error="…"` to say it in your own words.
 */
function Form({ onSubmit, onInput, className, children, ...props }: FormProps) {
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [busy, setBusy] = React.useState(false)
  const running = React.useRef(false)

  return (
    <FieldErrorsProvider value={errors}>
      <Busy.Provider value={busy}>
        <form
          data-slot="form"
          noValidate
          aria-busy={busy || undefined}
          className={cn("db-form", className)}
          onInput={(e) => {
            onInput?.(e)
            // Once a control has an error, it clears the moment it's right (or says what's still wrong).
            const el = e.target as Control
            if (!el.id) return
            setErrors((prev) => {
              if (!(el.id in prev)) return prev
              const next = { ...prev }
              if (el.validity.valid) delete next[el.id]
              else next[el.id] = problem(el)
              return next
            })
          }}
          onSubmit={async (e) => {
            e.preventDefault()
            const form = e.currentTarget
            if (running.current) return
            const bad = (Array.from(form.elements) as Control[]).filter((el) => el.willValidate && el.validity && !el.validity.valid)
            setErrors(Object.fromEntries(bad.filter((el) => el.id).map((el) => [el.id, problem(el)])))
            if (bad.length) return bad[0].focus()
            running.current = true
            setBusy(true)
            try {
              await onSubmit(new FormData(form))
            } finally {
              running.current = false
              setBusy(false)
            }
          }}
          {...props}
        >
          {children}
        </form>
      </Busy.Provider>
    </FieldErrorsProvider>
  )
}

type FormSubmitProps = Omit<React.ComponentProps<typeof Button>, "busy"> & {
  /** What the button says while the form is sending, keeping the action's name: "Send" becomes "Sending". */
  busy?: string
}

/** The one statement button that sends the form. It says what it's doing while it does it. */
function FormSubmit({ busy, variant = "statement", ...props }: FormSubmitProps) {
  const sending = React.useContext(Busy)
  return <Button type="submit" variant={variant} busy={sending && (busy ?? true)} {...props} />
}

export { Form, FormSubmit, type FormProps }
