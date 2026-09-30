import { defineComponent } from "./types"

export default defineComponent({
  name: "meta",
  title: "Meta",
  movement: "IV",
  contract: "db-meta",
  summary: "A frame row: small words held apart by hairlines that stretch to fill the row.",
  underneath: "native",
  props: [
    { name: "children", type: "ReactNode", description: "The words. A hairline goes between each child." },
  ],
})
