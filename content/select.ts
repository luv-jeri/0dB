import { defineComponent } from "./types"

export default defineComponent({
  name: "select",
  title: "Select",
  movement: "VI",
  contract: "db-select",
  summary: "A choice set inside a sentence: the chosen word is yours, italic over a hairline. It can be reset from the last word's letters, or wear the other choices above it as ruby.",
  underneath: "native",
  props: [
    { name: "variant", type: '"underline" | "compose" | "ruby"', default: '"underline"', description: "How the chosen word changes. underline: the word, italic over a hairline, simply changes. compose: the new word is set from the letters of the last, as a compositor resets a line; the letters both share slide to their new places, the others drop out and new ones drop in, and the hairline stretches to fit. ruby: the other choices are set small in our roman above the word, as ruby rides over Japanese; point at one to pick it, and it comes down onto the line as the old word goes up into its place. Ruby suits two to four choices. Either way the select underneath keeps the keyboard, the list and forms." },
    { name: "label", type: "ReactNode", description: "The words before the choice, such as Sort by. They label the select, and clicking them opens it." },
    { name: "children", type: "<option>[]", description: "The choices. A real select underneath, so keyboard, forms and autofill are the browser's own." },
    { name: "value / defaultValue / onChange", type: "native", description: "Every native select prop passes through." },
  ],
})
