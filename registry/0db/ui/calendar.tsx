"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { roll } from "@/registry/0db/lib/roll"

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const sameDay = (a?: Date | null, b?: Date | null) => !!a && !!b && +startOfDay(a) === +startOfDay(b)
const sameMonth = (a?: Date | null, b?: Date | null) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
/** Monday is 0. */
const weekday = (d: Date) => (d.getDay() + 6) % 7
const two = (n: number) => String(n).padStart(2, "0")

/** Today's date after mount only, so the server and the first client render agree. */
const noop = () => () => {}
const useToday = () => {
  const day = React.useSyncExternalStore(noop, () => startOfDay(new Date()).getTime(), () => null)
  return day === null ? null : new Date(day)
}

type CalendarProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  /** The chosen day. */
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date) => void
  /** Any date in the month on show. */
  month?: Date
  defaultMonth?: Date
  onMonthChange?: (month: Date) => void
  /** Which day is today. Left out, it's the device's, known once the page has loaded. */
  today?: Date
  /** Days before today can't be chosen. */
  disablePast?: boolean
  locale?: string
}

/**
 * A month of dots: past days filled, today in the accent, the days to come as rings.
 * The day you choose shows its number in italic, because it's yours. Monday first.
 * Arrow keys move by day and week, Page Up and Page Down by month, Home and End to the ends of the week.
 */
function Calendar({
  value: valueProp,
  defaultValue,
  onValueChange,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  today: todayProp,
  disablePast = false,
  locale = "en-GB",
  className,
  ...props
}: CalendarProps) {
  const id = React.useId()
  const clock = useToday()
  const today = todayProp ? startOfDay(todayProp) : clock

  const [innerValue, setInnerValue] = React.useState(defaultValue)
  const value = valueProp ?? innerValue
  const [innerMonth, setInnerMonth] = React.useState(defaultMonth)
  const shown = monthProp ?? innerMonth ?? value ?? today
  const view = shown ? startOfMonth(shown) : null

  const [focus, setFocus] = React.useState<Date>()
  const [turn, setTurn] = React.useState<0 | 1 | -1>(0)
  const [acted, setActed] = React.useState(false)
  const moved = React.useRef(false)
  const grid = React.useRef<HTMLDivElement>(null)

  const goTo = (to: Date, dir: 1 | -1) => {
    if (monthProp === undefined) setInnerMonth(to)
    onMonthChange?.(to)
    setTurn(dir)
  }
  const step = (delta: number) => goTo(new Date(view!.getFullYear(), view!.getMonth() + delta, 1), delta > 0 ? 1 : -1)
  const pick = (date: Date) => {
    if (valueProp === undefined) setInnerValue(date)
    onValueChange?.(date)
    setFocus(date)
    setTurn(0)
    setActed(true)
  }
  const disabled = (date: Date) => disablePast && !!today && date < today

  // The one tab stop: where you were, else the chosen day, else today, else the 1st.
  const stop = view && [focus, value, today].find((d) => d && sameMonth(d, view)) || view

  // After a key moves the stop (perhaps into another month), focus follows it.
  React.useEffect(() => {
    if (!moved.current) return
    moved.current = false
    grid.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus()
  })

  // The big date over the month: the chosen day, else today, else the 1st. It rolls when it changes.
  const lead = view ? (value && sameMonth(value, view) ? value : today && sameMonth(today, view) ? today : view).getDate() : null
  const target = lead === null ? "" : two(lead)
  const [seen, setSeen] = React.useState(target)
  const [held, setHeld] = React.useState<string | null>(null)
  if (target !== seen) {
    setSeen(target)
    if (seen) setHeld(seen) // keep the old numeral up while it rolls out
  }
  const date = React.useRef<HTMLParagraphElement>(null)
  React.useEffect(() => {
    if (held === null) return
    if (date.current) roll(date.current, () => setHeld(null), "0.4em", turn || (+target > +held ? 1 : -1))
    else setHeld(null)
  }, [held, target, turn])

  const names = new Intl.DateTimeFormat(locale, { weekday: "narrow" })
  const days = new Intl.DateTimeFormat(locale, { weekday: "long" })
  const longDay = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" })
  const monday = new Date(2024, 0, 1)
  const titleId = `${id}-title`

  // Weeks as rows of seven; blanks before the 1st and after the last.
  const weeks: (Date | null)[][] = []
  if (view) {
    const last = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
    const cells = [...Array<null>(weekday(view)).fill(null), ...Array.from({ length: last }, (_, i) => addDays(view, i))]
    while (cells.length % 7) cells.push(null)
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  }
  let wait = 0

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!stop) return
    const to = {
      ArrowLeft: addDays(stop, -1),
      ArrowRight: addDays(stop, 1),
      ArrowUp: addDays(stop, -7),
      ArrowDown: addDays(stop, 7),
      Home: addDays(stop, -weekday(stop)),
      End: addDays(stop, 6 - weekday(stop)),
      PageUp: new Date(stop.getFullYear(), stop.getMonth() - 1, Math.min(stop.getDate(), new Date(stop.getFullYear(), stop.getMonth(), 0).getDate())),
      PageDown: new Date(stop.getFullYear(), stop.getMonth() + 1, Math.min(stop.getDate(), new Date(stop.getFullYear(), stop.getMonth() + 2, 0).getDate())),
    }[e.key]
    if (!to) return
    e.preventDefault()
    moved.current = true
    setFocus(to)
    if (!sameMonth(to, view)) goTo(startOfMonth(to), to > stop ? 1 : -1)
  }

  return (
    <div data-slot="calendar" className={cn("db-month", className)} {...props}>
      <div data-slot="calendar-head" className="db-month-head">
        <p ref={date} className="db-month-date" aria-hidden="true">{held ?? target}</p>
        <p id={titleId} className="db-month-title" aria-live="polite">
          <span className="db-month-name">{view?.toLocaleString(locale, { month: "long" })}</span>
          <span className="db-month-year">{view ? ` ${view.getFullYear()}` : null}</span>
        </p>
        <div className="db-month-nav">
          <button type="button" aria-label="Previous month" disabled={!view} onClick={() => step(-1)}>
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" aria-label="Next month" disabled={!view} onClick={() => step(1)}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <div
        ref={grid}
        role="grid"
        aria-labelledby={titleId}
        data-slot="calendar-grid"
        data-turn={turn ? "" : undefined}
        data-acted={acted ? "" : undefined}
        style={{ "--from": turn || undefined } as React.CSSProperties}
        className="db-month-grid"
        onKeyDown={onKeyDown}
      >
        <div role="row" className="db-month-week">
          {Array.from({ length: 7 }, (_, i) => {
            const day = addDays(monday, i)
            return (
              <abbr key={i} role="columnheader" title={days.format(day)}>
                {names.format(day)}
              </abbr>
            )
          })}
        </div>
        <React.Fragment key={view ? +view : "unset"}>
          {weeks.map((week, w) => (
            <div key={w} role="row" className="db-month-week">
              {week.map((day, i) => {
                if (!day) return <span key={i} role="gridcell" aria-hidden="true" className="db-month-gap" />
                const when = today ? (day < today ? "past" : sameDay(day, today) ? "today" : "future") : undefined
                const between = !!value && !!today && day > today && day < value
                const off = disabled(day)
                return (
                  <button
                    key={i}
                    type="button"
                    role="gridcell"
                    tabIndex={sameDay(day, stop) ? 0 : -1}
                    aria-selected={sameDay(day, value)}
                    aria-current={when === "today" ? "date" : undefined}
                    aria-disabled={off || undefined}
                    aria-label={longDay.format(day)}
                    data-slot="calendar-day"
                    data-when={when}
                    data-between={between ? "" : undefined}
                    style={{ "--d": day.getDate(), "--k": between ? wait++ : undefined } as React.CSSProperties}
                    className="db-month-day"
                    onClick={() => !off && pick(day)}
                    onFocus={() => setFocus(day)}
                  >
                    {day.getDate()}
                  </button>
                )
              })}
            </div>
          ))}
        </React.Fragment>
      </div>
    </div>
  )
}

export { Calendar, type CalendarProps }
