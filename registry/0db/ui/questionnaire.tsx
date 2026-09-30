"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { roll } from "@/registry/0db/lib/roll"
import { Button } from "@/registry/0db/ui/button"
import { Field, FieldError, Textarea } from "@/registry/0db/ui/field"
import { Fraction } from "@/registry/0db/ui/fraction"
import { RadioGroup, RadioGroupItem } from "@/registry/0db/ui/radio-group"

type Answers = Record<string, string | undefined>

type Question = {
  id: string
  question: React.ReactNode
  /** The choices. Leave it out for a free-text question, which is always optional. */
  options?: string[]
  /** Free-text questions only: the label over the line. */
  label?: string
  /** Free-text questions only. */
  placeholder?: string
}

type QuestionnaireProps = Omit<React.ComponentProps<"form">, "onSubmit" | "children"> & {
  questions: Question[]
  /** Writes the answers into one sentence. Only what was answered is in `answers`. */
  sentence: (answers: Answers) => string
  onComplete?: (answers: Answers) => void
  /** The last question's action. */
  submitLabel?: string
  /** Said when a choice is needed to go on. */
  error?: string
}

/**
 * Questions one at a time, set large. The count rolls, the hairline fills, and each
 * question turns in from the side you're heading. At the end your answers are written
 * into one sentence in italic, word by word.
 */
function Questionnaire({
  questions,
  sentence,
  onComplete,
  submitLabel = "Send answers",
  error = "Choose one to go on, or skip this question.",
  className,
  ...props
}: QuestionnaireProps) {
  const base = React.useId()
  const total = questions.length
  const [at, setAt] = React.useState(0)
  const [dir, setDir] = React.useState<1 | -1>(1)
  const [turned, setTurned] = React.useState(false)
  const [answers, setAnswers] = React.useState<Answers>({})
  const [missing, setMissing] = React.useState(false)
  const [shown, setShown] = React.useState(1)
  const count = React.useRef<HTMLSpanElement>(null)
  const step = React.useRef<HTMLDivElement>(null)
  const again = React.useRef<HTMLButtonElement>(null)
  const moved = React.useRef(false)

  const done = at >= total
  const q = questions[at]
  const clean = (): Answers => Object.fromEntries(Object.entries(answers).filter(([, v]) => v?.trim()))

  // The count rolls the way you're heading.
  const n = Math.min(at + 1, total)
  React.useEffect(() => {
    if (n === shown) return
    const el = count.current?.querySelector<HTMLElement>(".db-yours")
    if (el) roll(el, () => setShown(n), "0.45em", n > shown ? 1 : -1)
    else setShown(n)
  }, [n, shown])

  // Focus goes to each new question (not on first load).
  React.useEffect(() => {
    if (!moved.current) return
    if (done) again.current?.focus({ preventScroll: true })
    else step.current?.querySelector<HTMLElement>("input:checked, input, textarea")?.focus({ preventScroll: true })
  }, [at, done])

  function go(to: number, heading: 1 | -1) {
    moved.current = true
    setDir(heading)
    setTurned(true)
    setMissing(false)
    setAt(to)
  }

  function set(id: string, value: string) {
    setMissing(false)
    setAnswers((a) => ({ ...a, [id]: value }))
  }

  return (
    <form
      data-slot="questionnaire"
      noValidate
      className={cn("db-quest", className)}
      onSubmit={(e) => {
        e.preventDefault()
        if (done) return
        if (q.options && !answers[q.id]) return setMissing(true)
        if (at === total - 1) onComplete?.(clean())
        go(at + 1, 1)
      }}
      {...props}
    >
      <div data-slot="questionnaire-head" className="db-quest-head">
        <Fraction ref={count} aria-hidden="true" count={shown} total={total} />
        <progress max={total} value={n} aria-label={done ? `All ${total} answered` : `Question ${n} of ${total}`} />
      </div>

      {q ? (
        <div
          key={at}
          ref={step}
          data-slot="questionnaire-step"
          data-arriving={turned ? "" : undefined}
          className="db-quest-step"
          style={{ "--from": dir * 3 } as React.CSSProperties}
        >
          <p id={`${base}-${q.id}`} data-slot="questionnaire-question" className="db-quest-q">
            {q.question}
          </p>
          {q.options ? (
            <RadioGroup aria-labelledby={`${base}-${q.id}`} value={answers[q.id] ?? ""} onValueChange={(v) => set(q.id, v)}>
              {q.options.map((o) => (
                <RadioGroupItem key={o} value={o}>
                  {o}
                </RadioGroupItem>
              ))}
            </RadioGroup>
          ) : (
            <Field label={q.label ?? "Optional"}>
              <Textarea
                rows={2}
                maxLength={200}
                placeholder={q.placeholder}
                aria-describedby={`${base}-${q.id}`}
                value={answers[q.id] ?? ""}
                onChange={(e) => set(q.id, e.target.value)}
              />
            </Field>
          )}
        </div>
      ) : null}

      {/* Always mounted, so the sentence is announced when it arrives. */}
      <div data-slot="questionnaire-end" data-done={done ? "" : undefined} className="db-quest-step">
        <p data-slot="questionnaire-sentence" className="db-quest-sentence" aria-live="polite">
          {done
            ? sentence(clean())
                .split(" ")
                .map((w, i) => (
                  <React.Fragment key={i}>
                    {i ? " " : null}
                    <span className="db-yours" style={{ "--i": i } as React.CSSProperties}>
                      {w}
                    </span>
                  </React.Fragment>
                ))
            : null}
        </p>
        {done ? (
          <Button
            ref={again}
            variant="quiet"
            onClick={() => {
              setAnswers({})
              go(0, -1)
            }}
          >
            Start again
          </Button>
        ) : null}
      </div>

      {missing ? <FieldError role="alert">{error}</FieldError> : null}

      {done ? null : (
        <div data-slot="questionnaire-actions" className="db-quest-actions">
          {at > 0 ? (
            <Button variant="quiet" onClick={() => go(at - 1, -1)}>
              Back
            </Button>
          ) : null}
          {at < total - 1 ? (
            <Button
              variant="quiet"
              onClick={() => {
                setAnswers((a) => ({ ...a, [q.id]: undefined }))
                go(at + 1, 1)
              }}
            >
              Skip
            </Button>
          ) : null}
          <Button variant="statement" type="submit">
            {at === total - 1 ? submitLabel : "Next"}
          </Button>
        </div>
      )}
    </form>
  )
}

export { Questionnaire, type QuestionnaireProps, type Question, type Answers }
