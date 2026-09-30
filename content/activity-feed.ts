import { defineComponent } from "./types"

export default defineComponent({
  name: "activity-feed",
  title: "Activity feed",
  movement: "X",
  contract: "db-feed",
  summary: "A history of what happened, grouped by day: who, what, and a dotted leader to when, on one hairline down the margin. The newest carries the accent; the rest waits behind \"and 4 more\".",
  underneath: "native",
  props: [
    { name: "entries", type: "ActivityEntry[]", description: "Newest first; the feed never reorders them. Each is { id, who?, what, detail?, at, time? }. who names the avatar and leads the sentence (leave it out for what the system did, and a dot stands in); what is the rest of the sentence; at is local time written out (\"2026-09-30T09:52\"), read as written so the server and the browser agree." },
    { name: "variant", type: '"ledger" | "almanac" | "lapse"', default: '"ledger"', description: "ledger: each day begins at a divider. almanac: each day begins with its date set as the calendar poster sets it, the day huge and heavy, month over year beside it, the weekday at the far end. lapse: no rules; the silence between two entries grows with the time between them (an hour or more), and a new day is said inside its silence." },
    { name: "initial", type: "number", description: "How many show before the rest folds behind \"and 4 more\". Defaults to all." },
    { name: "fresh", type: "number", default: "0", description: "How many at the top are new since the person last looked. The ribbon is laid under them and takes the accent from the newest." },
    { name: "days", type: "Record<string, ReactNode>", description: "Names for days, by date: { \"2026-09-30\": \"Today\" }. Other days are written out in the locale." },
    { name: "locale", type: "string", default: '"en-GB"', description: "For the written-out days." },
    { name: "label", type: "string", default: '"Activity"', description: "Names the feed for assistive technology." },
    { name: "more / less", type: "(count: number) => ReactNode", description: "The control's words, closed and open: \"and 4 more\", \"Hide these 4\"." },
    { name: "lapse", type: "(minutes: number) => ReactNode", description: "Lapse only: the words for a pause within a day (\"3 hours earlier\")." },
    { name: "seen", type: "ReactNode", default: '"Where you left off"', description: "The ribbon's words." },
    { name: "empty", type: "ReactNode", default: '"Nothing has happened yet."', description: "Said when there are no entries." },
  ],
})
