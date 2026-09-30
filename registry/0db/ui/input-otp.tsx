"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { useFieldControl } from "@/registry/0db/ui/field"

type InputOTPProps = Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "maxLength" | "type"> & {
  /** How many digits. */
  length?: number
  /** A separator stands after every this many slots (0 for none). Three and three for six. */
  group?: number
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /**
   * How the code waits and ends. line: short baselines, three and three; whole, they ink in turn. close-up: a dot
   * waits for each digit; whole, the spaces close and the proofreader's close-up mark ties the halves into one figure.
   * lyric: each digit is read back in words under it, as lyrics sit under their notes, so you can check it aloud.
   */
  variant?: "line" | "close-up" | "lyric"
  /** Called once, when the last slot fills. */
  onComplete?: (value: string) => void
  /** Pins a state for documentation ("focus"); set on the root. */
  "data-force"?: string
}

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

/**
 * One real input holds the code, so paste, autofill and the keyboard all work natively.
 * The slots only draw it. Whole, the lines ink in turn; wrong (aria-invalid), they turn crimson together.
 */
function InputOTP({
  length = 6,
  variant = "line",
  group = length % 2 === 0 ? length / 2 : length % 3 === 0 ? 3 : 0,
  value,
  defaultValue = "",
  onValueChange,
  onComplete,
  className,
  "data-force": force,
  onFocus,
  onBlur,
  onPointerUp,
  ...props
}: InputOTPProps) {
  const field = useFieldControl()
  const [own, setOwn] = React.useState(defaultValue)
  const [focused, setFocused] = React.useState(false)
  const code = (value ?? own).slice(0, length)
  const wrong = props["aria-invalid"] ?? field["aria-invalid"]
  const invalid = wrong === true || wrong === "true"
  const full = code.length === length
  const here = (focused || force?.includes("focus")) && !full ? code.length : -1

  const set = (raw: string) => {
    const next = raw.replace(/\D/g, "").slice(0, length)
    if (value === undefined) setOwn(next)
    onValueChange?.(next)
    if (next.length === length && next !== code) onComplete?.(next)
  }

  const slots: React.ReactNode[] = []
  const lyric = variant === "lyric"
  for (let i = 0; i < length; i++) {
    if (i > 0 && group > 0 && i % group === 0) slots.push(<span key={`sep${i}`} className="db-code-sep" aria-hidden="true" />)
    slots.push(
      <span key={i} data-slot="input-otp-slot" className="db-code-slot" style={{ "--i": i } as React.CSSProperties} data-here={i === here ? "" : undefined} aria-hidden="true">
        {code[i] ? <span key={code[i]}>{code[i]}</span> : null}
        {lyric && code[i] ? (
          <span key={`w${code[i]}`} className="db-code-word">
            {WORDS[+code[i]]}
            {i === length - 1 ? "." : group > 0 && (i + 1) % group === 0 ? "," : null}
          </span>
        ) : null}
      </span>
    )
  }

  return (
    <div data-slot="input-otp" data-variant={variant} data-force={force} data-state={full ? (invalid ? "wrong" : "done") : undefined} className={cn("db-code", className)}>
      <input
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern={`[0-9]{${length}}`}
        {...props}
        id={props.id ?? field.id}
        aria-invalid={props["aria-invalid"] ?? field["aria-invalid"]}
        aria-describedby={props["aria-describedby"] ?? field["aria-describedby"]}
        value={code}
        onChange={(e) => set(e.target.value)}
        // A pasted code replaces what's there, so a full code fills every slot.
        onPaste={(e) => {
          e.preventDefault()
          set(e.clipboardData.getData("text"))
        }}
        onFocus={(e) => {
          setFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          onBlur?.(e)
        }}
        // Always type at the end, so Backspace takes back the last digit.
        onPointerUp={(e) => {
          onPointerUp?.(e)
          e.currentTarget.setSelectionRange(code.length, code.length)
        }}
      />
      {slots}
    </div>
  )
}

export { InputOTP, type InputOTPProps }
