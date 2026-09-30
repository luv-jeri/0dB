import { defineComponent } from "./types"

export default defineComponent({
  name: "steps",
  title: "Steps",
  movement: "VIII",
  contract: "db-steps",
  summary: "A real sequence, numbered in large thin figures, with the current one in the accent.",
  underneath: "native",
  props: [
    { name: "Step current", type: "boolean", default: "false", description: "The step the person is on. Its numeral is the view's one accent." },
    { name: "Step done", type: "boolean", default: "false", description: "A finished step: its numeral turns ink." },
  ],
})
