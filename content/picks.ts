import { defineComponent } from "./types"

export default defineComponent({
  name: "picks",
  title: "Picks",
  movement: "VI",
  contract: "db-picks",
  summary: "A list of choices that carry their own content. A dot hangs beside the one you took; pointing at another shows a ring where it would land.",
  underneath: "native",
  props: [
    { name: "name", type: "string", description: "Shared by every radio so a form submits the choice. Generated if left out." },
    { name: "legend", type: "ReactNode", description: "The small label over the list. Without one, give the group an aria-label." },
    { name: "value / defaultValue", type: "string", description: "The chosen pick's value." },
    { name: "onValueChange", type: "(value: string) => void", description: "Called with the new value when the choice changes." },
    { name: "Pick value", type: "string", description: "What this choice stands for." },
    { name: "Pick children", type: "ReactNode", description: "Anything: a name with a line under it, a swatch, a specimen." },
  ],
})
