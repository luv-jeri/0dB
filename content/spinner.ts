import { defineComponent } from "./types"

export default defineComponent({
  name: "spinner",
  title: "Spinner",
  movement: "VII",
  contract: "db-dots",
  summary: "Three periods breathing in turn, always beside the words that say what's happening.",
  underneath: "native",
  props: [{ name: "className", type: "string", description: "Merged onto the root span. The spinner is aria-hidden: put the words beside it." }],
})
