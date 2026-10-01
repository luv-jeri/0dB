import { defineComponent } from "./types"

export default defineComponent({
  name: "toggle-group",
  title: "Toggle group",
  movement: "VI",
  contract: "db-toggles",
  summary: "Words in a row you can hold down, one or many; held neighbours are tied under one slur or share one pair of parentheses, held words are numbered in the order you held them, or cross into the margin.",
  underneath: "radix",
  props: [
    { name: "variant", type: '"slur" | "bracket" | "fingering" | "margin"', default: '"slur"', description: "How held words are marked. slur: hairlines stand between the words, and a run of held neighbours is tied under one engraved slur. bracket: no hairlines; the held words are set in italic parentheses, and neighbours share one pair. fingering: no hairlines; each held word gets a small italic numeral over it, the order you held them in, like the fingering over a score's notes; pointing at a free word pencils the number it would get, and letting one go counts the later ones down. Use it with type multiple. margin: the words stand in a column, flush against a hairline with an empty margin as wide as the column on its other side; a held word crosses the hairline into the margin and turns italic, flush against the hairline's other side, like a book's side head, so what you hold reads down the margin. Pointing leans a word toward the hairline." },
    { name: "type", type: '"single" | "multiple"', description: "One held word at a time, or any number. Held one at a time, the mark glides from the old word to the new one." },
    { name: "value / defaultValue / onValueChange", type: "string | string[]", description: "What's held: a string for single, an array for multiple." },
    { name: "ToggleGroupItem value", type: "string", description: "Each word in the group. Arrow keys move between them, Home and End go to the ends, Space holds." },
    { name: "dir", type: '"ltr" | "rtl"', description: "Left out, the group takes the direction of the page around it, words and arrow keys alike." },
  ],
})
