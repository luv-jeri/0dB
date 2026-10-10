import { defineComponent } from "./types"

export default defineComponent({
  name: "radio-group",
  title: "Radio group",
  movement: "VI",
  contract: "ot-choice",
  summary: "Words in a row. The one you choose turns italic, because it's yours now. One dot glides beneath it along a slur, or the italic itself slides through the words to it and sets a full stop after it. A ballot cross can be written after it, or, in a heavy column, its italic swells.",
  underneath: "native",
  props: [
    { name: "name", type: "string", description: "Shared by every radio so a form submits the choice. Generated if left out." },
    { name: "legend", type: "ReactNode", description: "The small label over the words. Without one, give the group an aria-label." },
    { name: "variant", type: '"legato" | "glissando" | "ballot" | "sforzando"', default: '"legato"', description: "legato: one accent dot glides under the chosen word along a slur, drawn out like a drop of ink as it goes; pointing sketches that slur in pencil to a ring. glissando: no dot; the italic itself slides through the words between, leading edge first, and an accent full stop lands after the chosen word; pointing sketches the stop as a ring. ballot: a pen cross is written after the chosen word in the accent, in two strokes, as on a ballot paper, and the one it leaves runs out; pointing sketches the cross in pencil. Every word keeps the margin for it. sforzando: the words stand in a column, heavy and narrow, and the chosen one's italic swells in the accent under the word above; it sets its own column, so orientation doesn't apply." },
    { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "The words run in a line and wrap, or stand in a column. In a column the legato dot hangs in the margin before the word." },
    { name: "value / defaultValue", type: "string", description: "The chosen item's value." },
    { name: "onValueChange", type: "(value: string) => void", description: "Called with the new value when the choice changes." },
    { name: "RadioGroupItem value", type: "string", description: "What this word stands for." },
    { name: "RadioGroupItem children", type: "string", description: "The word. Plain text, because the italic copy is drawn from it." },
    { name: "RadioGroupItem disabled", type: "boolean", default: "false", description: "The word steps back and can't be chosen." },
    { name: "RadioGroupItem labelClassName", type: "string", description: "Classes for the word's label wrapper. className goes to the native radio." },
  ],
})
