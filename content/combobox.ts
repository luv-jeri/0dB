import { defineComponent } from "./types"

export default defineComponent({
  name: "combobox",
  title: "Combobox",
  movement: "VI",
  contract: "db-combo",
  summary: "A field that suggests. Type and the letters you typed are marked in each match, the suggestions arrive in turn, and what you chose sits on the line in italic.",
  underneath: "cmdk",
  uses: ["popover", "command", "field"],
  props: [
    { name: "options", type: "{ value, label, hint? }[]", description: "The choices. Labels should be unique: they are what the list is matched and marked on. A hint is a quiet word at the end of the row, and typing it finds the row too." },
    { name: "value / defaultValue / onValueChange", type: "string, (value) => void", description: "The chosen option's value, controlled or not." },
    { name: "label", type: "string", description: "Set above the line. Inside a Field, the Field's label is used instead." },
    { name: "placeholder", type: "string", default: '"Choose one"', description: "What the closed line says before anything is chosen." },
    { name: "empty", type: "string", default: '"Nothing matches. Try part of a name."', description: "Shown when nothing matches. Name something to try." },
    { name: "Keyboard", type: "note", description: "Enter, Space or the down arrow opens the list. Type to narrow it, arrow keys move the dot, Enter picks. Escape closes it and puts focus back on the line." },
    { name: "className / id / aria-*", type: "native", description: "Passed to the button that opens the list. Inside a Field it takes the Field's id, hint and error." },
  ],
})
