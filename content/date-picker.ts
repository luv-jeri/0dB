import { defineComponent } from "./types"

export default defineComponent({
  name: "date-picker",
  title: "Date picker",
  movement: "VI",
  contract: "db-date",
  summary: "A date inside a sentence, like the select. It opens the month on a leader line; choose a day and it is written into the sentence in italic.",
  underneath: "radix",
  uses: ["popover", "calendar", "field"],
  props: [
    { name: "value / defaultValue / onValueChange", type: "Date, (date) => void", description: "The chosen day, controlled or not. It is written as words, such as Thursday, 1 October." },
    { name: "label", type: "string", description: "The words before the date, such as Deliver the brief by. They label the button, and clicking them opens the month. Inside a Field, use the Field's label." },
    { name: "placeholder", type: "string", default: '"choose a day"', description: "What the sentence says before a day is chosen." },
    { name: "disablePast", type: "boolean", default: "false", description: "Days before today can't be chosen." },
    { name: "variant", type: '"dots" | "ruler" | "ghost" | "parenthesis"', default: '"dots"', description: "How the month draws time; see Calendar. Each holds at popover size: the ghost scales with the month, and the parenthesis line wraps to it." },
    { name: "locale", type: "string", default: '"en-GB"', description: "Month and weekday names, for the line and the month." },
    { name: "Keyboard", type: "note", description: "Enter or Space opens the month; its arrows move by day and week and Enter chooses. Escape closes it and puts focus back on the date." },
  ],
})
