import { defineComponent } from "./types"

export default defineComponent({
  name: "rows",
  title: "Rows",
  movement: "VIII",
  contract: "db-rows",
  summary: "An index of hairline-separated rows. The one you point at reverses out of ink and steps forward with an arrow.",
  underneath: "native",
  props: [
    { name: "Row href", type: "string", description: "Makes the row a link. Without it, or asChild, the row is plain and doesn't react." },
    { name: "Row asChild", type: "boolean", default: "false", description: "Render your own link (Next's Link, say) inside the row with the row's look." },
    { name: "RowTitle", type: "span", description: "The name, set large." },
    { name: "RowKind", type: "span", description: "What it is, in graphite." },
    { name: "RowMeta", type: "span", description: "The quiet fact at the end: a year, a count." },
  ],
})
