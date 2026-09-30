import { defineComponent } from "./types"

export default defineComponent({
  name: "rows",
  title: "Rows",
  movement: "VIII",
  contract: "db-rows",
  summary: "An index of hairline-separated rows. The one you point at reverses out of ink and steps forward with an arrow; or repeats are set as ditto marks; or a ring before each row fills once you have been there.",
  underneath: "native",
  props: [
    { name: "Rows variant", type: '"reverse" | "ditto" | "trail"', default: '"reverse"', description: "reverse: the row you point at reverses out of ink. ditto: a kind or a year that repeats the row above is set as a ditto mark (″) in pencil, worked out after every render; pointing at or focusing a row spells it out. trail: a ring hangs before each row (stepping in below 40rem): a hairline ring for a row not yet opened, ink once the browser has visited the link (:visited, so nothing is stored), the accent for the row with aria-current. Pointing inks the ring's line." },
    { name: "Row aria-current", type: '"page" | …', description: "Set on the link. trail marks it with the accent: where you are." },
    { name: "Row href", type: "string", description: "Makes the row a link. Without it, or asChild, the row is plain and doesn't react." },
    { name: "Row asChild", type: "boolean", default: "false", description: "Render your own link (Next's Link, say) inside the row with the row's look." },
    { name: "RowTitle", type: "span", description: "The name, set large." },
    { name: "RowKind", type: "span", description: "What it is, in graphite." },
    { name: "RowMeta", type: "span", description: "The quiet fact at the end: a year, a count." },
  ],
})
