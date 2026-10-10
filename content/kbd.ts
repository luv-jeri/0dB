import { defineComponent } from "./types"

export default defineComponent({
  name: "kbd",
  title: "Kbd",
  movement: "II",
  contract: "ot-kbd",
  summary: "A key, drawn as the corners of its cap. Pressed, the corners close into the whole cap and it goes down a little.",
  underneath: "native",
  props: [
    { name: "pressed", type: "boolean", default: "false", description: "Draw the key pressed, for when your code listens for it." },
    { name: "variant", type: '"typewriter" | "chord"', description: "typewriter draws the key as a round typewriter key: a ring that, pressed, inks into a disc with the letter reversed out of it. chord takes a combination as a string (\"⌘⇧S\" or \"Ctrl+Shift+S\") and stacks its modifiers small before the key, like the figures over a bass note." },
    { name: "children", type: "ReactNode", description: "The key's name. Always read left to right, on a right-to-left page too." },
  ],
})
