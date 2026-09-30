import { defineComponent } from "./types"

export default defineComponent({
  name: "progress",
  title: "Progress",
  movement: "VII",
  contract: "db-progress",
  summary: "A hairline that fills, and the percentage set as an italic numeral.",
  underneath: "native",
  props: [
    { name: "value", type: "number", description: "How much is done, out of max." },
    { name: "max", type: "number", default: "100", description: "The total. The numeral shows value as a percentage of it." },
    { name: "label", type: "string", description: "What is being done, in words (Uploading 12 files). It also names the bar for assistive technology; without it the bar is named Progress." },
  ],
})
