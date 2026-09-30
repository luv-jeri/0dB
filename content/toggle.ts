import { defineComponent } from "./types"

export default defineComponent({
  name: "toggle",
  title: "Toggle",
  movement: "VI",
  contract: "db-toggle",
  summary: "A word you can hold down. Held, it wears the fermata: an arc rises over the word, then a dot lands inside it.",
  underneath: "radix",
  props: [
    { name: "pressed / defaultPressed", type: "boolean", description: "Whether the word is held. Controlled or not." },
    { name: "onPressedChange", type: "(pressed: boolean) => void", description: "Called when the word is pressed or released." },
    { name: "disabled", type: "boolean", default: "false", description: "Dimmed to pencil; the arc doesn't sketch." },
  ],
})
