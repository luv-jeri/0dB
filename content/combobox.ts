import { defineComponent } from "./types"

export default defineComponent({
  name: "combobox",
  title: "Combobox",
  movement: "VI",
  contract: "ot-combo",
  summary: "A field that suggests. Type and the letters you typed are marked in each match, the suggestions arrive in turn, and what you chose sits on the line in italic; with multiple, your choices are written there as one sentence.",
  underneath: "cmdk",
  uses: ["popover", "command", "field"],
  props: [
    { name: "variant", type: '"list" | "concordance" | "pencil"', default: '"list"', description: "list: the line opens a list, and the letters you typed are marked in each match. concordance: the matches hang from what you typed, lined up on it in one column, as a concordance sets a word in the middle of every line that holds it; typing moves the column and the rows glide to it. pencil: you type on the line itself, and the rest of the best match is pencilled in after the caret in our roman; Tab (or the arrow toward the end) takes it and it inks into your italic, and the first five matches sit under the line." },
    { name: "options", type: "{ value, label, hint? }[]", description: "The choices. Labels should be unique: they are what the list is matched and marked on. A hint is a quiet word at the end of the row, and typing it finds the row too." },
    { name: "value / defaultValue / onValueChange", type: "string, (value) => void", description: "The chosen option's value, controlled or not. With multiple, an array of values in the order they were chosen." },
    { name: "multiple", type: "boolean", default: "false", description: "Any number of choices, with list or concordance (the pencil stays single). What you chose is written on the line as one sentence in your italic, the badge's series tags (\"Didot, Futura and Univers\"); pressing a word strikes it and the sentence closes up round the gap. The rest of the line opens the list, which stays open while you choose; Enter toggles a row, and a chosen row turns italic rather than taking the accent. className goes on the line that holds the words." },
    { name: "name", type: "string", description: "With multiple, each chosen value is sent with the form as its own hidden input under this name; a disabled control submits none." },
    { name: "label", type: "string", description: "Set above the line. Inside a Field, the Field's label is used instead." },
    { name: "placeholder", type: "string", default: '"Choose one"', description: "What the closed line says before anything is chosen." },
    { name: "empty", type: "string", default: '"Nothing matches. Try part of a name."', description: "Shown when nothing matches. Name something to try." },
    { name: "Keyboard", type: "note", description: "Enter, Space or the down arrow opens the list. Type to narrow it, arrow keys move the dot, Enter picks. Escape closes it and puts focus back on the line. The pencil is typed into directly: Up and Down move through the matches, Enter picks, Tab takes the pencilled rest, Escape puts the line back. With multiple, Enter toggles a row and the list stays open; each chosen word on the line is its own button before the trigger, and Enter or Space takes it out." },
    { name: "className / id / aria-*", type: "native", description: "Passed to the button that opens the list, or the input for pencil. Caller aria-* attributes take precedence over a Field's hint and error. Pencil accepts native input props and forwards ref to its input; handlers run before its internal behaviour. className styles the pencil wrapper." },
  ],
})
