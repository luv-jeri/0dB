import { defineComponent } from "./types"

export default defineComponent({
  name: "toggle-group",
  title: "Toggle group",
  movement: "VI",
  contract: "db-toggles",
  summary: "Words held apart by standing hairlines; a group can allow one held word or many.",
  underneath: "radix",
  uses: ["toggle"],
  props: [
    { name: "type", type: '"single" | "multiple"', description: "One held word at a time, or any number." },
    { name: "value / defaultValue / onValueChange", type: "string | string[]", description: "What's held: a string for single, an array for multiple." },
    { name: "ToggleGroupItem value", type: "string", description: "Each word in the group. Arrow keys move between them." },
  ],
})
