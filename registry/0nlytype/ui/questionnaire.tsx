"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"
import { Button } from "@/registry/0nlytype/ui/button"
import { Field, FieldError, Textarea } from "@/registry/0nlytype/ui/field"
import { Fraction } from "@/registry/0nlytype/ui/fraction"
import { RadioGroup, RadioGroupItem } from "@/registry/0nlytype/ui/radio-group"

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
  /**
   * sentence (the default): one question at a time; at the end, your answers written into one sentence.
   * interview: every question asked stays above the next, small, with your answer beside it, like the
   * printed interview's Q and A; press an answer to go back to it. definition: at the end you are
   * defined, as the dictionary sets an entry: the headword reversed out of ink, then the sentence.
   */
  variant?: "sentence" | "interview" | "definition"
  questions: Question[]
  /** Writes the answers into one sentence. Only what was answered is in `answers`. */
  sentence: (answers: Answers) => string
  onComplete?: (answers: Answers) => void
  /** The last question's action. */
  submitLabel?: string
  /** Said when a choice is needed to go on. */
  error?: string
  /** Definition only: the headword and its part of speech, from the answers. */
  entry?: (answers: Answers) => { word: string; kind: string }
  /** Answers to start from, to resume a questionnaire. */
  defaultAnswers?: Answers
  /** The question to start at, to resume one (its length is the end). */
  defaultStep?: number
}

/**
 * Questions one at a time, set large. In an interview the asked ones stay above as Q and A; in a
 * definition the end is a dictionary entry. The count rolls, the hairline fills, and each
 * question turns in from the side you're heading. At the end your answers are written
 * into one sentence in italic, word by word.
 */
function Questionnaire({
  variant = "sentence",
  questions,
  sentence,
  onComplete,
  submitLabel = "Send answers",
  error = "Choose one to go on, or skip this question.",
  entry,
  defaultAnswers,
  defaultStep = 0,
  className,
  ...props
}: QuestionnaireProps) {
  const base = React.useId()
  const total = questions.length
  const [at, setAt] = React.useState(() => Math.min(Math.max(0, defaultStep), total))
  const [dir, setDir] = React.useState<1 | -1>(1)
  const [turned, setTurned] = React.useState(false)
  const [answers, setAnswers] = React.useState<Answers>(() => defaultAnswers ?? {})
  const [missing, setMissing] = React.useState(false)
  const step = React.useRef<HTMLDivElement>(null)
  const again = React.useRef<HTMLButtonElement>(null)
  const moved = React.useRef(false)

  const done = at >= total
  const q = questions[at]
  const clean = (): Answers => Object.fromEntries(Object.entries(answers).filter(([, v]) => v?.trim()))
  const said = done && variant === "definition" && entry ? entry(clean()) : null

  // The count rolls the way you're heading (the fraction turns its own figures over).
  const n = Math.min(at + 1, total)

  // Focus goes to each new question (not on first load).
  React.useEffect(() => {
    if (!moved.current) return
    if (done) again.current?.focus({ preventScroll: true })
    else (step.current?.querySelector<HTMLElement>("input:checked") ?? step.current?.querySelector<HTMLElement>("input, textarea"))?.focus({ preventScroll: true })
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
      data-variant={variant}
      className={cn("ot-quest", className)}
      onSubmit={(e) => {
        e.preventDefault()
        if (done) return
        if (q.options && !answers[q.id]) return setMissing(true)
        if (at === total - 1) onComplete?.(clean())
        go(at + 1, 1)
      }}
      {...props}
    >
      <div data-slot="questionnaire-head" className="ot-quest-head">
        <Fraction aria-hidden="true" count={n} total={total} />
        <progress max={total} value={n} aria-label={done ? `All ${total} answered` : `Question ${n} of ${total}`} />
      </div>

      {variant === "interview" && at > 0 ? (
        <ol data-slot="questionnaire-log" className="ot-quest-log">
          {questions.slice(0, at).map((p, i) => {
            const a = answers[p.id]?.trim()
            return (
              <li key={p.id}>
                <p id={`${base}-log-${p.id}`} className="ot-quest-log-q">
                  <span className="ot-quest-hang" aria-hidden="true">Q</span>
                  {p.question}
                </p>
                <p className="ot-quest-log-a">
                  <span className="ot-quest-hang" aria-hidden="true">A</span>
                  <button type="button" aria-describedby={`${base}-log-${p.id}`} onClick={() => go(i, -1)}>
                    {a ? <span className="ot-yours">{a}</span> : "Skipped"}
                    <span className="ot-sr">, change</span>
                  </button>
                </p>
              </li>
            )
          })}
        </ol>
      ) : null}

      {q ? (
        <div
          key={at}
          ref={step}
          data-slot="questionnaire-step"
          data-arriving={turned ? "" : undefined}
          className="ot-quest-step"
          style={{ "--from": dir * 3 } as React.CSSProperties}
        >
          <p id={`${base}-${q.id}`} data-slot="questionnaire-question" className="ot-quest-q">
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
      <div data-slot="questionnaire-end" data-done={done ? "" : undefined} className="ot-quest-step">
        <div data-slot="questionnaire-said" className="ot-quest-said" aria-live="polite">
          {said ? (
            <p data-slot="questionnaire-entry" className="ot-quest-entry">
              <span className="ot-quest-word ot-yours">{said.word}</span>
              <span className="ot-quest-kind">{said.kind}</span>
            </p>
          ) : null}
          {done ? (
            <p data-slot="questionnaire-sentence" className="ot-quest-sentence">
              {sentence(clean())
                .split(" ")
                .map((w, i) => (
                  <React.Fragment key={i}>
                    {i ? " " : null}
                    <span className="ot-yours" style={{ "--i": i } as React.CSSProperties}>
                      {w}
                    </span>
                  </React.Fragment>
                ))}
            </p>
          ) : null}
        </div>
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
        <div data-slot="questionnaire-actions" className="ot-quest-actions">
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
