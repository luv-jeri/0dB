import { defineComponent } from "./types"

export default defineComponent({
  name: "kbd",
  title: "Kbd",
  movement: "II",
  contract: "db-kbd",
  summary: "A key, drawn as a ring. Pressed, it shrinks a little and the ring turns to ink.",
  underneath: "native",
  props: [
    { name: "pressed", type: "boolean", default: "false", description: "Draw the key pressed, for when your code listens for it." },
    { name: "children", type: "ReactNode", description: "The key's name." },
  ],
})
