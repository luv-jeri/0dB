# 0nlyType: activity-feed

Extracted from DESIGN.md.

### db-feed (activity-feed)
- Underneath: native, composed of `item`, `avatar`, `marker` and `collapsible`.
- Anatomy: `<section class="db-feed" data-variant="ledger | almanac | lapse" aria-label>` holding day markers and `ul.db-items.db-feed-run` of `li.db-item.db-feed-entry` (`data-newest` on the first when nothing is new). Each entry: `.db-feed-bead` (aria-hidden: an `s` avatar, or `.db-feed-dot` for what the system did), the title (`b.db-feed-who`, then what happened, the object in `.db-yours`), an optional detail, the leader, and `<time>` at the end. Past `initial`, the rest waits in a `details.db-feed-more` whose summary says "and 4 more"; `fresh` puts a ribbon marker ("Where you left off") before the first entry you've seen. `at` is read as written ("2026-09-30T09:52") and formatted in UTC, so the server and the page agree.
- A history set as a ledger, newest first: who in ink, what they did in graphite, a dotted leader to the time. One hairline runs down the margin through each stretch of entries, starting and stopping at the beads on the first lines; the newest bead is the one accent (the ring of its avatar, or its dot). No cards, no icons: a person is their initial, the system a full stop.
- Ledger (the default), after contents pages: days are divider markers ("Today", "Yesterday", or the date), each day's entries hung on its own thread.
- Almanac, after the "Less but better" calendar: each day opens on its date set huge and heavy (`--db-f`, 700, tight), the month over the year in small capitals beside it and the weekday (or `days` label) at the far end, the way the calendar sets a leaf.
- Lapse, after Principle 1 and the marker's lapse: the time between entries is given as silence. A quiet of an hour or more breaks the thread with a lapse marker ("5 hours earlier") whose room grows with how long it went quiet; a new day is a lapse named for the day.
- Pointing at an entry inks its leader and its time (the item's move). Opening the rest, its entries arrive down the line in turn. Right to left the thread and beads move to the right. Forced colours: the thread and dots are CanvasText, the newest Highlight.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Activity feed (`activity-feed`) | Arpeggio | Opened, the rest arrive down the line in turn; pointing inks an entry's leader and time |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Activity feed (`activity-feed`) | Contents pages; "Less but better" calendar | A ledger of what happened: who, what, a leader to when; one hairline threads the beads, the newest in the accent |
| Almanac activity feed (`activity-feed`) | "Less but better" calendar | Each day opens on its date set huge and heavy, month and year beside it |
| Lapse activity feed (`activity-feed`) | Principle 1; the marker's lapse | The quiet between entries is given as silence that grows with the gap |
