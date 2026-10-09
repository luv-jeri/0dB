import { defineComponent } from "./types"

export default defineComponent({
  name: "sign",
  title: "Sign",
  movement: "II",
  contract: "db-sign",
  summary: "An icon made of its own word, set along the strokes with Pretext or in middle-dot leaders, that says itself when pointed at.",
  underneath: "hook",
  props: [
    { name: "shape", type: "SignShape", description: "The sign's stroke geometry in 24-unit grid moves (M, L, O) and its word." },
    { name: "variant", type: '"dots" | "words"', default: '"words"', description: "words sets the word along the strokes; dots sets middle-dot leaders at every size." },
    { name: "size", type: "number | string", default: "24", description: "Size in pixels (or CSS dimension). The sign renders at a 1:1 aspect ratio." },
    { name: "face", type: '"roman" | "italic"', default: '"roman"', description: "roman is the default; italic marks personal expression (your mail, your home)." },
    { name: "label", type: "string", description: "Accessible label. Defaults to the shape's word. Pass empty string when sitting beside descriptive text to aria-hide." },
    { name: "force", type: '"hover" | "focus"', description: "Force the said state for docs specimens or testing." },
  ],
})
