"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { Button } from "@/registry/0db/ui/button"
import { FieldErrorsProvider } from "@/registry/0db/ui/field"

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const Busy = React.createContext(false)
const Sent = React.createContext(false)

/** Words for a control that fails: its data-error if it has one, else the browser's own message. */
const problem = (el: Control) => el.dataset.error || el.validationMessage

type FormProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  /** Runs once every control is valid. The submit button is busy until it settles. */
  onSubmit: (data: FormData) => Promise<void> | void
  /**
   * grid (default): fields on the grid, each error hung from its own line.
   * letter: the fields are blanks in a letter you write; what's wrong is said once, in a postscript.
   * postmark: once it's sent, a postmark with the day and the time comes down on the corner.
   */
  variant?: "grid" | "letter" | "postmark"
}

/**
 * Fields on the grid and one statement button to send. The browser's own bubbles are off;
 * instead each failing control gets its callout in its Field, and focus goes to the first.
 * Give a control `data-error="…"` to say it in your own words.
 */
function Form({ onSubmit, onInput, variant = "grid", className, children, ...props }: FormProps) {
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [busy, setBusy] = React.useState(false)
  const [sent, setSent] = React.useState<Date | null>(null)
  const running = React.useRef(false)

  return (
    <FieldErrorsProvider value={errors}>
      <Busy.Provider value={busy}>
        <Sent.Provider value={Boolean(sent)}>
          <form
            data-slot="form"
            data-variant={variant === "grid" ? undefined : variant}
            noValidate
            aria-busy={busy || undefined}
            className={cn("db-form", className)}
            onInput={(e) => {
              onInput?.(e)
              setSent(null) // changed after sending: it's a draft again
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
              setSent(null)
              try {
                await onSubmit(new FormData(form))
                setSent(new Date())
              } finally {
                running.current = false
                setBusy(false)
              }
            }}
            {...props}
          >
            {children}
            {variant === "letter" ? <FormPostscript errors={errors} /> : null}
            {variant === "postmark" && sent ? <FormPostmark date={sent} /> : null}
          </form>
        </Sent.Provider>
      </Busy.Provider>
    </FieldErrorsProvider>
  )
}

type FormSubmitProps = Omit<React.ComponentProps<typeof Button>, "busy"> & {
  /** What the button says while the form is sending, keeping the action's name: "Send" becomes "Sending". */
  busy?: string
  /** What it says once sent, until something changes: "Send" becomes "Sent". */
  sent?: string
}

/** The one statement button that sends the form. It says what it's doing while it does it. */
function FormSubmit({ busy, sent, variant = "statement", children, ...props }: FormSubmitProps) {
  const sending = React.useContext(Busy)
  const done = React.useContext(Sent)
  return (
    <Button type="submit" variant={variant} busy={sending && (busy ?? true)} {...props}>
      {done && sent ? sent : children}
    </Button>
  )
}

/**
 * The letter's postscript: after a failed send, everything still to fix, said once below the letter.
 * Each sentence takes you to its blank. The Form renders it for the letter; it's exported to pin in docs.
 */
function FormPostscript({ errors, className, ...props }: React.ComponentProps<"div"> & { errors: Record<string, string> }) {
  const entries = Object.entries(errors)
  if (!entries.length) return null
  return (
    <div data-slot="form-postscript" className={cn("db-form-ps", className)} {...props}>
      <span className="db-form-ps-mark">P.S.</span>{" "}
      {entries.map(([id, message], i) => (
        <React.Fragment key={id}>
          {i ? " " : null}
          <a
            href={`#${id}`}
            className="db-form-ps-fix"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(id)?.focus()
            }}
          >
            {message}
          </a>
        </React.Fragment>
      ))}
    </div>
  )
}

/**
 * The postmark: sent, and when, in a double ring set down askew on the form's corner. Exported to pin in docs.
 * The day and time are set in the reader's own locale and time zone. A postmark rendered on the server must
 * pin both, or the server's words and the browser's differ and React redraws it.
 */
function FormPostmark({
  date,
  locale,
  timeZone,
  className,
  ...props
}: React.ComponentProps<"p"> & { date: Date; locale?: string; timeZone?: string }) {
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { ...o, timeZone }).format(date)
  return (
    <p data-slot="form-postmark" role="status" className={cn("db-form-postmark", className)} {...props}>
      <span>Sent</span>{" "}
      <time dateTime={date.toISOString()}>
        <span className="db-form-postmark-day">{f({ day: "numeric" })}</span> <span>{f({ month: "short", year: "numeric" })}</span>{" "}
        <span>{f({ hour: "numeric", minute: "2-digit" })}</span>
      </time>
    </p>
  )
}

export { Form, FormSubmit, FormPostscript, FormPostmark, type FormProps }
