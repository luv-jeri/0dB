import { defineComponent } from "./types"

export default defineComponent({
  name: "passage",
  title: "Passage",
  movement: "II",
  contract: "db-passage",
  summary: "A thought re-set: the old lines exhale, the new lines arrive, and the page makes room for their length.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The current reading. Both versions are measured at the current width with Pretext." },
    { name: "as", type: '"p" | "div"', default: '"p"', description: "The text's native block." },
    { name: "announce", type: "boolean", default: "false", description: "Politely announce the new reading; measured copies are always hidden from assistive technology." },
    { name: "onSettled", type: "() => void", description: "Runs once the latest changed reading is set, including the plain-text fallback. Interrupted readings do not call back." },
  ],
})
