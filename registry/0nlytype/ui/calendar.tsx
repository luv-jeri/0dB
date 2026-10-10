"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"
import { roll } from "@/registry/0nlytype/lib/roll"

const DAY = 86_400_000
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const sameDay = (a?: Date | null, b?: Date | null) => !!a && !!b && +startOfDay(a) === +startOfDay(b)
const sameMonth = (a?: Date | null, b?: Date | null) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
const daysIn = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
/** Whole days from a to b (a clock change can't make it 11.96). */
const between = (a: Date, b: Date) => Math.round((+startOfDay(b) - +startOfDay(a)) / DAY)
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
  /**
   * How time is drawn. Dots, the poster: a large disc for every day, ink for the days gone, the accent
   * for today, hairline rings for the days to come, and half-moons for the wait. Ruler: the month as one
   * measured line, a tick a day, with the wait between today and your day drawn as a dimension.
   * Ghost: the days as figures only, read through the chosen day and its month set huge and faint
   * behind them. Parenthesis: the month set as one running line of figures, the time from today to your
   * day enclosed in parentheses.
   */
  variant?: "dots" | "ruler" | "ghost" | "parenthesis"
  /** The tracked line at the foot. Left out, it counts the days (in English); null leaves it out. */
  caption?: React.ReactNode
}

/**
 * A month drawn as time: the days gone, today, the days to come, and the wait for the day you choose.
 * The big numeral in the head is the chosen day (else today); the day you choose is yours, in italic.
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
  variant = "dots",
  caption: captionProp,
  className,
  ...props
}: CalendarProps) {
  const id = React.useId()
  const clock = useToday()
  const today = todayProp ? startOfDay(todayProp) : clock
  const ruler = variant === "ruler"
  const ghost = variant === "ghost"

  const [innerValue, setInnerValue] = React.useState(defaultValue)
  const value = valueProp ?? innerValue
  const [innerMonth, setInnerMonth] = React.useState(defaultMonth)
  const shown = monthProp ?? innerMonth ?? value ?? today
  const view = shown ? startOfMonth(shown) : null
  const last = view ? daysIn(view) : 0

  const [focus, setFocus] = React.useState<Date>()
  const [turn, setTurn] = React.useState<0 | 1 | -1>(0)
  const [acted, setActed] = React.useState(false)
  const [scrub, setScrub] = React.useState(false)
  const moved = React.useRef(false)
  const grid = React.useRef<HTMLDivElement>(null)

  const goTo = (to: Date, dir: 1 | -1) => {
    if (monthProp === undefined) setInnerMonth(to)
    onMonthChange?.(to)
    setTurn(dir)
  }
  const step = (delta: number) => goTo(new Date(view!.getFullYear(), view!.getMonth() + delta, 1), delta > 0 ? 1 : -1)
  const disabled = (date: Date) => disablePast && !!today && date < today
  const pick = (date: Date) => {
    if (disabled(date)) return
    if (valueProp === undefined) setInnerValue(date)
    onValueChange?.(date)
    setFocus(date)
    setTurn(0)
    setActed(true)
  }

  // The one tab stop: where you were, else the chosen day, else today, else the 1st.
  const stop = (view && [focus, value, today].find((d) => d && sameMonth(d, view))) || view

  // After a key moves the stop (perhaps into another month), focus follows it.
  React.useEffect(() => {
    if (!moved.current) return
    moved.current = false
    grid.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus()
  })

  // The head: the chosen day, else today, else the 1st, with its weekday. It rolls when it changes.
  const headDay = view ? (value && sameMonth(value, view) ? value : today && sameMonth(today, view) ? today : view) : null
  const yours = !!headDay && sameDay(headDay, value)
  const short = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const target = headDay ? `${two(headDay.getDate())}|${short.format(headDay)}|${two(headDay.getMonth() + 1)}` : ""
  const [seen, setSeen] = React.useState(target)
  const [held, setHeld] = React.useState<string | null>(null)
  if (target !== seen) {
    setSeen(target)
    if (seen && !ruler && !ghost) setHeld(seen) // keep the old numeral up while it rolls out; the ruler's glides, the ghost surfaces
  }
  const date = React.useRef<HTMLSpanElement>(null)
  const name = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => {
    if (held === null) return
    const dir = turn || (target > held ? 1 : -1)
    if (!date.current || !name.current) return setHeld(null)
    roll(date.current, () => setHeld(null), "0.4em", dir)
    roll(name.current, () => {}, "0.6em", dir)
  }, [held, target, turn])
  const [numeral, dayName, monthNo] = (held ?? target).split("|")

  const narrow = new Intl.DateTimeFormat(locale, { weekday: "narrow" })
  const long = new Intl.DateTimeFormat(locale, { weekday: "long" })
  const dated = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" })
  const spoken = (day: Date) => `${long.format(day)} ${dated.format(day)}` // "Wednesday 30 September 2026"
  const monthName = view?.toLocaleString(locale, { month: "long" }) ?? ""
  const monday = new Date(2024, 0, 1)
  const titleId = `${id}-title`

  // Weeks as rows of seven, Monday first. Before the 1st there is only paper; after the last day, nothing.
  const weeks: (Date | null)[][] = []
  if (view) {
    const cells = [...Array<null>(weekday(view)).fill(null), ...Array.from({ length: last }, (_, i) => addDays(view, i))]
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  }
  // The wait: the days between today and the chosen day. Counted, so the moons wax in turn toward yours.
  const waits = (day: Date) => !!value && !!today && day > today && day < startOfDay(value)
  let wait = 0
  // The ruler numbers the weeks' first days, but gives way to a neighbouring today or yours.
  const near = (day: Date) => [today, value].some((d) => d && !sameDay(d, day) && Math.abs(between(d, day)) === 1)

  // The foot says something true about the days on show.
  const gap = value && today ? between(today, value) : null
  const count = (n: number, one: string, many: string) => (n === 1 ? one : `${n} ${many}`)
  const told =
    !today || !view
      ? null
      : gap !== null
        ? gap > 1 ? `${gap} days to go` : gap === 1 ? "Tomorrow" : gap === 0 ? "Today is the day" : gap === -1 ? "Yesterday" : `${-gap} days ago`
        : sameMonth(today, view)
          ? last === today.getDate() ? `The last day of ${monthName}` : `${count(last - today.getDate(), "One day", "days")} left in ${monthName}`
          : view < today ? `All ${last} days gone` : `${last} days to come`

  // The aside encloses the time from today to your day, whichever comes first, both ends included.
  const [lo, hi] = variant === "parenthesis" && value && today ? (gap! >= 0 ? [today, startOfDay(value)] : [startOfDay(value), today]) : []
  const paren = (day: Date) => [sameDay(day, lo) && "open", sameDay(day, hi) && "close"].filter(Boolean).join(" ") || undefined

  // The ruler measures the wait as a dimension, from today to your day. An end off this month stays open.
  let span: { a: number; b: number; open: string } | null = null
  if (ruler && view && value && today && gap) {
    const [lo, hi] = gap > 0 ? [today, value] : [value, today]
    const end = new Date(view.getFullYear(), view.getMonth(), last)
    if (lo <= end && hi >= view) {
      const a = sameMonth(lo, view) ? lo.getDate() - 0.5 : 0
      const b = sameMonth(hi, view) ? hi.getDate() - 0.5 : last
      span = { a, b, open: [a === 0 && "start", b === last && "end"].filter(Boolean).join(" ") }
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!stop) return
    // Right to left, the next day is on the left.
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl"
    const to = {
      ArrowLeft: addDays(stop, rtl ? 1 : -1),
      ArrowRight: addDays(stop, rtl ? -1 : 1),
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

  // The ruler's ticks are narrow, so the hand draws along it: pressing and moving sketches the day
  // under the pointer, and letting go chooses it.
  const dayAt = (e: React.PointerEvent<HTMLElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    let x = (e.clientX - box.left) / box.width
    if (getComputedStyle(e.currentTarget).direction === "rtl") x = 1 - x
    return new Date(view!.getFullYear(), view!.getMonth(), Math.min(last, Math.max(1, Math.ceil(x * last))))
  }
  const scrubbing = ruler && view
    ? {
        onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
          if (e.button !== 0) return
          e.currentTarget.setPointerCapture(e.pointerId)
          setScrub(true)
          setFocus(dayAt(e))
        },
        onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => scrub && setFocus(dayAt(e)),
        onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => {
          if (!scrub) return
          setScrub(false)
          moved.current = true
          pick(dayAt(e))
        },
        onPointerCancel: () => setScrub(false),
      }
    : {}

  const p = headDay ? (headDay.getDate() - 0.5) / last : 0

  return (
    <div data-slot="calendar" data-variant={variant} className={cn("db-month", className)} {...props}>
      <div data-slot="calendar-head" className="db-month-head">
        <div
          // The ghost is set afresh for each day, so it surfaces anew.
          key={ghost ? target : undefined}
          className="db-month-at"
          aria-hidden="true"
          data-yours={yours ? "" : undefined}
          data-acted={ghost && (acted || turn) ? "" : undefined}
          data-side={p > 0.5 ? "start" : "end"}
          style={{ "--p": p } as React.CSSProperties}
        >
          <span ref={date} className="db-month-date">{numeral}</span>
          <span ref={name} className="db-month-dayname">{dayName}</span>
          {ghost ? <span className="db-month-mo">{monthNo}</span> : null}
        </div>
        <p id={titleId} className="db-month-title" aria-live="polite">
          <span className="db-month-name">{monthName}</span>
          <span className="db-month-year">{view ? ` ${view.getFullYear()}` : null}</span>
        </p>
        <div className="db-month-nav">
          <button type="button" aria-label="Previous month" disabled={!view} onClick={() => step(-1)}>
            <span aria-hidden="true" />
          </button>
          <button type="button" aria-label="Next month" disabled={!view} onClick={() => step(1)}>
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={grid}
        role="grid"
        aria-labelledby={titleId}
        data-slot="calendar-grid"
        data-turn={turn ? (turn > 0 ? "next" : "prev") : undefined}
        data-acted={acted ? "" : undefined}
        data-scrub={scrub ? "" : undefined}
        style={{ "--days": last } as React.CSSProperties}
        className="db-month-grid"
        onKeyDown={onKeyDown}
        {...scrubbing}
      >
        <div role="row" className="db-month-week">
          {Array.from({ length: 7 }, (_, i) => {
            const day = addDays(monday, i)
            return (
              <abbr key={i} role="columnheader" title={long.format(day)}>
                {narrow.format(day)}
              </abbr>
            )
          })}
        </div>
        <React.Fragment key={view ? +view : "unset"}>
          {weeks.map((week, w) => (
            <div key={w} role="row" className="db-month-week">
              {week.map((day, i) => {
                // --d is the cell's place in reading order: turning the month, the days sweep in by it.
                const d = w * 7 + i
                if (!day) return <span key={i} role="gridcell" aria-hidden="true" className="db-month-gap" />
                const when = today ? (day < today ? "past" : sameDay(day, today) ? "today" : "future") : undefined
                const inWait = waits(day)
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
                    aria-label={`${spoken(day)}${when === "today" ? ", today" : ""}`}
                    data-slot="calendar-day"
                    data-when={when}
                    data-between={inWait ? "" : undefined}
                    data-paren={paren(day)}
                    data-label={(i === 0 || day.getDate() === 1) && !near(day) ? "" : undefined}
                    style={{ "--d": d, "--k": inWait ? wait++ : undefined } as React.CSSProperties}
                    className="db-month-day"
                    // A pointer on the ruler chooses by letting go (above); a key's click has no detail.
                    onClick={(e) => (!ruler || e.detail === 0) && pick(day)}
                    onFocus={() => setFocus(day)}
                  >
                    <span className="db-month-disc" aria-hidden="true">
                      <span className="db-month-n">{day.getDate()}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </React.Fragment>
      </div>
      {ruler ? (
        <div className="db-month-span" aria-hidden="true">
          {span ? (
            <span data-open={span.open || undefined} style={{ "--a": span.a / last, "--b": span.b / last } as React.CSSProperties}>
              <span>{Math.abs(gap!)}</span>
            </span>
          ) : null}
        </div>
      ) : null}
      {captionProp === null ? null : <p className="db-month-foot">{captionProp ?? told ?? "\u00a0"}</p>}
    </div>
  )
}

export { Calendar, type CalendarProps }
