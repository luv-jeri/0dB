import { defineComponent } from "./types"

export default defineComponent({
  name: "item",
  title: "Item",
  movement: "X",
  contract: "db-item",
  summary: "A ledger line: what it is, a dotted leader, what you can do. Point at it and the leader inks across.",
  underneath: "native",
  props: [
    { name: "ItemGroup", type: "ul props", description: "The ledger the items sit in." },
    { name: "ItemMedia", type: "span props", description: "A small picture at the start of the line, such as an avatar." },
    { name: "ItemContent", type: "span props", description: "Holds the title and description." },
    { name: "ItemActions", type: "span props", description: "A value or an action at the end. It draws the leader that joins it to the content." },
  ],
})
