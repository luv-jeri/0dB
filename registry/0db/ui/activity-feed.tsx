import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { Avatar } from "@/registry/0db/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/registry/0db/ui/collapsible"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/registry/0db/ui/item"
import { Marker } from "@/registry/0db/ui/marker"

type ActivityEntry = {
  id: string
  /** Who did it. It names the avatar on the line and leads the sentence. Leave it out for what the system did: a dot stands in. */
  who?: string
  /** What happened, as the rest of the sentence after the name: "approved the harbour mark". */
  what: React.ReactNode
  /** A line under it: what they wrote, what changed. */
  detail?: React.ReactNode
  /**
   * When, as local time written out: "2026-09-30T09:52". The day and the time are read from it as written, so the
   * server and the browser always agree.
   */
  at: string
  /** The time as shown at the end of the line. Defaults to the hours and minutes of `at`. */
  time?: React.ReactNode
}

type Variant = "ledger" | "almanac" | "lapse"

type ActivityFeedProps = Omit<React.ComponentProps<"section">, "children"> & {
  /** Newest first. The feed never reorders them. */
  entries: ActivityEntry[]
  /**
   * ledger: each day begins at a divider, and every line runs on a leader to its time. almanac: each day begins with its
   * date set as the calendar poster sets it, the day huge, month over year beside it, the weekday at the far end.
   * lapse: no rules; the silence between two entries grows with the time between them, and a new day is said in it.
   */
  variant?: Variant
  /** How many show before "and 4 more". Defaults to all. */
  initial?: number
  /** How many at the top are new since the person last looked: the ribbon is laid under them, and it takes the accent. */
  fresh?: number
  /** Names for days, by date ("2026-09-30": "Today"). Others are written out. */
  days?: Record<string, React.ReactNode>
  /** For the written-out days. */
  locale?: string
  /** Names the feed for assistive technology. */
  label?: string
  /** The control that shows the rest. */
  more?: (count: number) => React.ReactNode
  /** The same control once the rest is shown. */
  less?: (count: number) => React.ReactNode
  /** Lapse only: the words for a pause within a day, given its minutes. */
  lapse?: (minutes: number) => React.ReactNode
  /** The ribbon's words. */
  seen?: React.ReactNode
  /** What it says when nothing has happened. */
  empty?: React.ReactNode
}

// ponytail: `at` is read as written (no time zones): its offset, if any, is ignored for the day and the time.
const dayOf = (at: string) => at.slice(0, 10)
const ms = (at: string) => Date.parse(/(z|[+-]\d\d:?\d\d)$/i.test(at) ? at : `${at}Z`)
const utc = (date: string) => Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10))
const fmt = (locale: string, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { ...o, timeZone: "UTC" })

/** A pause at least this long is given its own silence. */
const PAUSE = 60

function pauseWords(m: number) {
  if (m < 60) return `${Math.round(m)} minutes earlier`
  if (m < 120) return "An hour earlier"
  return `${Math.round(m / 60)} hours earlier`
}

type Block =
  | { kind: "day"; date: string; gap: number }
  | { kind: "pause"; gap: number }
  | { kind: "seen" }
  | { kind: "run"; entries: { entry: ActivityEntry; i: number }[] }

/** The feed's lines as blocks: a day's head, a pause, the ribbon, or a run of entries that share one line down the margin. */
function blocks(entries: ActivityEntry[], from: number, to: number, variant: Variant, fresh: number): Block[] {
  const out: Block[] = []
  for (let i = from; i < to; i++) {
    const e = entries[i], prev = entries[i - 1]
    const gap = prev ? (ms(prev.at) - ms(e.at)) / 60000 : 0
    if (i > 0 && i === fresh) out.push({ kind: "seen" })
    if (!prev || dayOf(prev.at) !== dayOf(e.at)) out.push({ kind: "day", date: dayOf(e.at), gap })
    else if (variant === "lapse" && gap >= PAUSE) out.push({ kind: "pause", gap })
    const last = out.at(-1)
    if (last?.kind === "run") last.entries.push({ entry: e, i })
    else out.push({ kind: "run", entries: [{ entry: e, i }] })
  }
  return out
}

/**
 * A history of what happened, newest first and grouped by day: who (an avatar on a hairline down the margin), what,
 * and a dotted leader to when. The newest carries the accent; "and 4 more" holds the rest.
 */
function ActivityFeed({
  entries,
  variant = "ledger",
  initial,
  fresh = 0,
  days = {},
  locale = "en-GB",
  label = "Activity",
  more = (n) => `and ${n} more`,
  less = (n) => `Hide these ${n}`,
  lapse = pauseWords,
  seen = "Where you left off",
  empty = "Nothing has happened yet.",
  className,
  ...props
}: ActivityFeedProps) {
  const shown = Math.min(entries.length, initial ?? entries.length)
  const rest = entries.length - shown
  const longDay = fmt(locale, { weekday: "long", day: "numeric", month: "long" })

  const day = (b: Extract<Block, { kind: "day" }>) => {
    const named = days[b.date]
    if (variant === "almanac") {
      const t = utc(b.date)
      return (
        <p key={`d${b.date}`} data-slot="activity-day" className="db-feed-day">
          <span className="db-feed-date">{fmt(locale, { day: "numeric" }).format(t)}</span>
          <span className="db-feed-month">
            <span>{fmt(locale, { month: "long" }).format(t)}</span>
            <span>{fmt(locale, { year: "numeric" }).format(t)}</span>
          </span>
          <span className="db-feed-weekday">{named ?? fmt(locale, { weekday: "short" }).format(t)}</span>
        </p>
      )
    }
    const words = named ?? longDay.format(utc(b.date))
    return variant === "lapse" ? (
      <Marker key={`d${b.date}`} variant="lapse" minutes={b.gap}>{words}</Marker>
    ) : (
      <Marker key={`d${b.date}`} variant="divider">{words}</Marker>
    )
  }

  const line = ({ entry: e, i }: { entry: ActivityEntry; i: number }) => (
    <Item key={e.id} data-slot="activity-entry" className="db-feed-entry" data-newest={i === 0 && !fresh ? "" : undefined}>
      <ItemMedia className="db-feed-bead" aria-hidden="true">
        {e.who ? <Avatar size="s" alt={e.who} /> : <span className="db-feed-dot" />}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {e.who ? <b className="db-feed-who">{e.who}</b> : null}
          {e.who ? " " : null}
          {e.what}
        </ItemTitle>
        {e.detail ? <ItemDescription>{e.detail}</ItemDescription> : null}
      </ItemContent>
      <ItemActions>
        <time dateTime={e.at}>{e.time ?? e.at.slice(11, 16)}</time>
      </ItemActions>
    </Item>
  )

  const render = (list: Block[]) =>
    list.map((b, k) => {
      if (b.kind === "day") return day(b)
      if (b.kind === "pause") return <Marker key={`p${k}`} variant="lapse" minutes={b.gap}>{lapse(b.gap)}</Marker>
      if (b.kind === "seen") return <Marker key="seen" variant="ribbon">{seen}</Marker>
      return <ItemGroup key={`r${b.entries[0].entry.id}`} className="db-feed-run">{b.entries.map(line)}</ItemGroup>
    })

  return (
    <section data-slot="activity-feed" data-variant={variant === "ledger" ? undefined : variant} aria-label={label} className={cn("db-feed", className)} {...props}>
      {entries.length === 0 ? <Marker>{empty}</Marker> : render(blocks(entries, 0, shown, variant, fresh))}
      {rest > 0 && (
        <Collapsible className="db-feed-more">
          <CollapsibleTrigger openLabel={less(rest)}>{more(rest)}</CollapsibleTrigger>
          <CollapsibleContent className="db-feed-rest">{render(blocks(entries, shown, entries.length, variant, fresh))}</CollapsibleContent>
        </Collapsible>
      )}
    </section>
  )
}

export { ActivityFeed, type ActivityEntry, type ActivityFeedProps }
