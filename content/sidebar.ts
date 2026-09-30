import { defineComponent } from "./types"

export default defineComponent({
  name: "sidebar",
  title: "Sidebar",
  movement: "VIII",
  contract: "db-sidebar",
  summary: "A column of words beside the work. Folded, it becomes a ruler: a numeral for each group, a tick for each link, and the name comes out into the margin when you point at it.",
  underneath: "hook",
  props: [
    { name: "Sidebar label", type: "string", description: "Names the nav landmark, such as Studio app or Docs." },
    { name: "Sidebar sheetLabel", type: "string", default: '"Index"', description: "Below 860px only a quiet trigger with this word shows, and it opens the same words in a sheet. Choosing a link puts the sheet away." },
    { name: "Sidebar folded", type: "boolean", default: "false", description: "The column folds to a ruler about 3rem wide: each group keeps its numeral (or initial), each link a tick, the page you are on the longest tick with the dot. Pointing at or focusing a tick draws a leader line to its full name in the margin. The words fold away in turn. Wide only: the sheet never folds. Pair it with your own button and aria-expanded." },
    { name: "Sidebar compact", type: "boolean", default: "false", description: "A size down, with the links closed up: for a long index, such as these docs." },
    { name: "SidebarHead", type: "p props", description: "The column's own name, at the top. Folded, it keeps its initial too." },
    { name: "SidebarGroup label", type: "string", description: 'A small pencil label over a list of links, such as a movement or a section. Folded, a leading roman numeral stays ("VI Controls" becomes VI); otherwise the initial. Pointing at it names the whole group.' },
    { name: "SidebarLink current", type: "boolean", default: "false", description: 'Marks the page you are on: aria-current="page", and the one accent dot.' },
    { name: "SidebarLink preview", type: "ReactNode", description: "What appears under the name in the margin while the column is folded and the link is pointed at or focused: a sentence about where it goes. The group's name sits between them. It is a pointer aid; the link's own words are always its accessible name." },
  { name: "SidebarLink asChild", type: "boolean", default: "false", description: "Render the child, such as next/link, with the sidebar's look. Plain-text children still fold." },
    { name: "Scrolling", type: "note", description: "The nav is the scroller: give it a height (or max-height) and it scrolls on the scrollbar's rail, which runs down the column's own rule." },
  { name: "Server components", type: "note", description: "Sidebar and its parts can be used from a server component; the state they need lives inside them." },
  ],
})
