import { defineComponent } from "./types"

export default defineComponent({
  name: "sidebar",
  title: "Sidebar",
  movement: "VIII",
  contract: "db-sidebar",
  summary: "A column of words beside the work. Folded, each word keeps only its initial, set large and light; the page you're on carries the dot.",
  underneath: "hook",
  props: [
    { name: "Sidebar label", type: "string", description: "Names the nav landmark, such as Studio app or Docs." },
    { name: "Sidebar sheetLabel", type: "string", default: '"Index"', description: "Below 860px only a quiet trigger with this word shows, and it opens the same words in a sheet. Choosing a link puts the sheet away." },
    { name: "Sidebar folded", type: "boolean", default: "false", description: "Each word keeps only its initial; the rest folds away in turn. Wide only: the sheet never folds. Pair it with your own button and aria-expanded." },
    { name: "SidebarHead", type: "p props", description: "The column's own name, at the top. Folded, it keeps its initial too." },
    { name: "SidebarGroup label", type: "string", description: "A small pencil label over a list of links, such as a movement or a section." },
    { name: "SidebarLink current", type: "boolean", default: "false", description: 'Marks the page you are on: aria-current="page", and the one accent dot.' },
    { name: "SidebarLink asChild", type: "boolean", default: "false", description: "Render the child, such as next/link, with the sidebar's look. Plain-text children still fold." },
    { name: "Server components", type: "note", description: "Sidebar and its parts can be used from a server component; the state they need lives inside them." },
  ],
})
