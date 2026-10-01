import { defineComponent } from "./types"

export default defineComponent({
  name: "item",
  title: "Item",
  movement: "X",
  contract: "db-item",
  summary: "A ledger line: what it is, a dotted leader, what you can do. Point at it and the leader inks across. Or every fifth line numbered in the margin; or the description running along the leader.",
  underneath: "native",
  props: [
    { name: "ItemGroup", type: "ul props", description: "The ledger the items sit in." },
    { name: "ItemGroup variant", type: '"leader" | "lineation" | "words"', default: '"leader"', description: "leader: a dotted leader on the baseline joins the title to the value. lineation: for a long list, every fifth line carries its number in the margin, and the line you point at or focus shows its own; below 40rem the numbers step in from the margin. words: the description runs in after the title, small, where the dots would be; a long one runs out in an ellipsis before the value, a short one leaves the dots to finish the line. The full text stays in the page for screen readers." },
    { name: "ItemTitle / ItemDescription", type: "span props", description: "What it is, and a line about it." },
    { name: "ItemMedia", type: "span props", description: "A small picture at the start of the line, such as an avatar." },
    { name: "ItemContent", type: "span props", description: "Holds the title and description." },
    { name: "ItemActions", type: "span props", description: "A value or an action at the end. It draws the leader that joins it to the content." },
  ],
})
