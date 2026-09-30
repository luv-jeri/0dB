import { defineComponent } from "./types"

export default defineComponent({
  name: "alert",
  title: "Alert",
  movement: "VII",
  contract: "db-alert",
  summary: "A double bar: in a score, the sign that something changes here.",
  underneath: "native",
  uses: ["button"],
  props: [
    { name: "variant", type: '"default" | "error"', default: '"default"', description: "Default is role=status, said when the reader is next free. Error is role=alert, said at once, in the signal colour; use it for what failed and say what to fix." },
    { name: "arriving", type: "boolean", default: "false", description: "Draw the bar and bring the lines in one by one. Set it when the alert appears because of something the person did." },
    { name: "AlertTitle", type: "p", description: "The headline, in a full sentence." },
    { name: "AlertDescription", type: "p", description: "One or two lines of detail." },
    { name: "AlertActions", type: "div", description: "A row for the next step, set as Buttons." },
  ],
})
