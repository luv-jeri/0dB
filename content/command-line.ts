import { defineComponent } from "./types"

export default defineComponent({
  name: "command-line",
  title: "Command line",
  movement: "X",
  contract: "db-command-line",
  summary: "One line to type, on a baseline like a field already filled in. The address recedes, the part that's yours is italic, and copying draws the line in the accent.",
  underneath: "hook",
  props: [
    { name: "command", type: "string", description: "The command. With runner, leave the runner off: \"shadcn@latest add https://…/button.json\"." },
    { name: "runner", type: "boolean", default: "false", description: "Run it through the package manager the reader picks: npx, pnpm dlx, yarn or bunx. Every command line on the page shares the pick, and the next visit remembers it." },
    { name: "emphasis", type: "string", description: "The part of an address that's the reader's, set in italic: an item's name." },
  ],
})
