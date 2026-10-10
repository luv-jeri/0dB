"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"
import { Calendar, type CalendarProps } from "@/registry/0nlytype/ui/calendar"
import { useFieldControl } from "@/registry/0nlytype/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/0nlytype/ui/popover"

type DatePickerProps = Omit<React.ComponentProps<"button">, "value" | "defaultValue" | "onChange" | "type"> & {
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
  /** The words before the date: "Deliver the brief by". Clicking them opens the month. */
  label?: string
  /** What the line says before a day is chosen. */
  placeholder?: string
  /** Days before today can't be chosen. */
  disablePast?: boolean
  locale?: string
  /** How the month draws time: "dots" (the default, the poster), "ruler", "ghost" or "parenthesis". */
  variant?: CalendarProps["variant"]
  /** Classes for the sentence around the date. className goes to the button. */
  rootClassName?: string
  /** Pins a state for documentation ("hover", "focus"); set on the button. */
  "data-force"?: string
}

/** "Thursday, 1 October": the date as words. */
function words(date: Date, locale: string) {
  let previous = ""
  return new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" })
    .formatToParts(date)
    .map((part) => {
      const out = part.type === "literal" && previous === "weekday" && !part.value.includes(",") ? ", " : part.value
      previous = part.type
      return out
    })
    .join("")
}

/**
 * A date inside a sentence, like the select. It opens the month on a leader line;
 * choose a day and it is written into the sentence in italic. Works alone or inside a Field.
 */
function DatePicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  label,
  placeholder = "choose a day",
  disablePast,
  locale = "en-GB",
  variant,
  className,
  rootClassName,
  ...props
}: DatePickerProps) {
  const field = useFieldControl()
  const [open, setOpen] = React.useState(false)
  const [own, setOwn] = React.useState(defaultValue)
  const value = valueProp ?? own
  const id = props.id ?? field.id
  const Root = label ? "label" : "span"

  const pick = (date: Date) => {
    if (valueProp === undefined) setOwn(date)
    onValueChange?.(date)
    setOpen(false)
  }

  // A Field's label names the button, which hides the button's own words; say the date as a description too.
  const spoken = field.id && value ? `${field.id}-date` : undefined

  return (
    <Root data-slot="date-picker" className={cn("ot-date-root", rootClassName)}>
      {label ? <span>{label}</span> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            data-slot="date-picker-trigger"
            data-set={value ? "" : undefined}
            className={cn("ot-date", className)}
            {...props}
            id={id}
            data-invalid={field["aria-invalid"] ? "" : undefined}
            aria-describedby={[props["aria-describedby"] ?? field["aria-describedby"], spoken].filter(Boolean).join(" ") || undefined}
          >
            {value ? words(value, locale) : placeholder}
          </button>
        </PopoverTrigger>
        <PopoverContent
          data-slot="date-picker-content"
          className="ot-date-pop"
          aria-label={label ?? "Choose a day"}
          // Open on the day (the chosen one, else today), not on the month's first arrow.
          onOpenAutoFocus={(e) => {
            const day = (e.currentTarget as HTMLElement).querySelector<HTMLElement>('[data-slot="calendar-day"][tabindex="0"]')
            if (!day) return
            e.preventDefault()
            day.focus()
          }}
        >
          <Calendar value={value} disablePast={disablePast} locale={locale} variant={variant} onValueChange={pick} />
        </PopoverContent>
      </Popover>
      {spoken ? (
        <span id={spoken} className="ot-sr">
          {words(value!, locale)}
        </span>
      ) : null}
    </Root>
  )
}

export { DatePicker, type DatePickerProps }
