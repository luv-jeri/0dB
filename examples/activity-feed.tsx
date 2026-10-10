import { State } from "@/components/site/state"
import { ActivityFeed, type ActivityEntry } from "@/registry/0nlytype/ui/activity-feed"

const entries: ActivityEntry[] = [
  { id: "a1", who: "Ada Lindqvist", what: <>approved <i className="ot-yours">the harbour mark</i></>, detail: "It holds at stamp size. Send it to the ferry office.", at: "2026-09-30T16:40" },
  { id: "a2", who: "Bruno Maček", what: <>uploaded <i className="ot-yours">harbour-mono.svg</i></>, at: "2026-09-30T16:12" },
  { id: "a3", what: "The proof for the ferry office went out", at: "2026-09-30T11:05" },
  { id: "a4", who: "Chiara Onofri", what: <>moved <i className="ot-yours">Signage</i> to review</>, at: "2026-09-30T09:52" },
  { id: "a5", who: "Ada Lindqvist", what: <>left a note on <i className="ot-yours">the wordmark</i></>, detail: "The k and the r touch below eight point.", at: "2026-09-29T18:20" },
  { id: "a6", who: "Bruno Maček", what: <>set <i className="ot-yours">the timetable</i> in Archivo</>, at: "2026-09-29T14:03" },
  { id: "a7", what: "Two people joined the project", at: "2026-09-26T10:30" },
  { id: "a8", who: "Chiara Onofri", what: <>started <i className="ot-yours">Harbour identity</i></>, at: "2026-09-26T10:02" },
]

const days = { "2026-09-30": "Today", "2026-09-29": "Yesterday" }

export default function Example() {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)] justify-items-stretch gap-16">
      <div className="grid w-full max-w-[40rem] gap-3">
        <span className="ot-label">Ledger</span>
        <ActivityFeed entries={entries} days={days} initial={5} />
      </div>
      <div className="grid w-full max-w-[40rem] gap-3">
        <span className="ot-label">Almanac</span>
        <ActivityFeed variant="almanac" entries={entries} days={days} initial={6} />
      </div>
      <div className="grid w-full max-w-[40rem] gap-3">
        <span className="ot-label">Lapse</span>
        <ActivityFeed variant="lapse" entries={entries} days={days} initial={6} />
      </div>
    </div>
  )
}

const wide = { width: "26rem", maxWidth: "100%" }
const few = entries.slice(0, 3)

export function States() {
  return (
    <>
      <State label="Newest"><div style={wide}><ActivityFeed entries={few} days={days} /></div></State>
      <State label="Pointed at"><div style={wide}><ActivityFeed entries={few.slice(1, 2)} days={days} data-force="hover" /></div></State>
      <State label="New since you looked"><div style={wide}><ActivityFeed entries={few} days={days} fresh={2} /></div></State>
      <State label="The rest, folded"><div style={wide}><ActivityFeed entries={few} days={days} initial={1} /></div></State>
      <State label="Right to left"><div style={wide} dir="rtl"><ActivityFeed entries={few} days={days} /></div></State>
      <State label="Nothing yet"><div style={wide}><ActivityFeed entries={[]} /></div></State>
    </>
  )
}
