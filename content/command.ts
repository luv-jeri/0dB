import { defineComponent } from "./types"

export default defineComponent({
  name: "command",
  title: "Command",
  movement: "VIII",
  contract: "db-command",
  summary: "What you type is set as large as a headline, in italic. Matches are marked; the chosen row steps forward.",
  underneath: "cmdk",
  props: [
    { name: "CommandDialog open / onOpenChange", type: "boolean / (open) => void", description: "The ⌘K palette as a modal (Radix Dialog). It opens where you tell it; register ⌘K / Ctrl+K yourself." },
    { name: "CommandDialog title", type: "string", default: '"Search"', description: "Read out by screen readers; not shown." },
    { name: "CommandItem value / keywords / onSelect", type: "string / string[] / () => void", description: "What the row is called, other words that find it, and what Enter does. A row matches when what you typed sits inside its value or keywords, and the words in it are marked." },
    { name: "CommandGroup heading", type: "ReactNode", description: "A small heading over a group of rows." },
    { name: "CommandEmpty", type: "ReactNode", description: "Shown when nothing matches. Name something to try." },
    { name: "CommandShortcut", type: "kbd", description: "A key that runs the row, drawn as a ring." },
    { name: "CommandHint", type: "span", description: "A quiet word at the end of a row that isn't a key: a year, a kind." },
    { name: "filter", type: "(value, search, keywords) => number", description: "On Command. Replaces the substring match; the highlighter still marks what you typed." },
  ],
})
