import { defineComponent } from "./types"

export default defineComponent({
  name: "reverb",
  title: "Reverb",
  movement: "II",
  contract: "db-reverb",
  summary: "A phrase that echoes into silence: each line quieter, more open and a dynamic smaller, drifting right like a canon, ending on a rest.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The phrase, as plain text. Readers get it once; the echoes are for the eye." },
    { name: "echoes", type: "number", default: "5", description: "How many times it comes back." },
    { name: "from", type: '"ffff" | "fff" | "ff" | "f" | "mf" | "mp" | "p" | "pp"', default: '"mf"', description: "The dynamic the phrase is set in. Each echo steps one down, and stays at pp." },
  ],
})
