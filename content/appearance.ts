import { defineComponent } from "./types"

export default defineComponent({
  name: "appearance",
  title: "Appearance",
  movement: "VI",
  contract: "db-appearance",
  summary: "Choose the look: scheme, key and type pair as three lists of picks, and the answer written back as one sentence, “Cotton, in ultramarine, set in Archivo and Bodoni.”, which the night toggle finishes. The new page opens as a circle from whatever you touched.",
  underneath: "hook",
  props: [
    { name: "value", type: "{ mode?, scheme?, key?, pair? }", description: "The appearance, when you hold it (controlled). Leave it out and the control reads the four switches on <html>, writes them there and keeps them in localStorage under 0nlytype-theme." },
    { name: "onValueChange", type: "(value, from) => void", description: "Called with the whole appearance after each change, and the element that made it." },
    { name: "useAppearance()", type: "[value, set(patch, from?)]", description: "The appearance on <html>, for your own controls: set a patch and it is applied, kept, and opens from the element you pass (or the focused one)." },
    { name: "applyAppearance(value, from?)", type: "function", description: "The same, outside React. Restore the stored choice before first paint with a one-line script in <head> that reads 0nlytype-theme and sets the attributes." },
    { name: "SCHEMES, KEYS, PAIRS", type: "arrays", description: "The names the switches take: five schemes, four keys and four pairs, each pair with its faces in words." },
  ],
})
