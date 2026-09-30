import { defineComponent } from "./types"

export default defineComponent({
  name: "chart",
  title: "Chart",
  movement: "X",
  contract: "db-chart",
  summary: "Hairlines and dots against one very large number that rolls to the bar you point at.",
  underneath: "hook",
  props: [
    { name: "data", type: "{ label: string; value: number }[]", description: "One bar per entry. The first letter of each label sets the axis." },
    { name: "label", type: "string", description: "Names the chart for assistive tech, such as Visits by month, 2026. Each bar is also a button labelled with its own value." },
    { name: "unit", type: "string", description: "What the values count. The readout reads visits in September." },
    { name: "now", type: "number", default: "last", description: "Index of the bar the number rests on. It carries the accent." },
    { name: "max", type: "number", description: "What a full-height bar means. Defaults to the next round number above the largest value." },
    { name: "format", type: "(value: number) => string", description: "Formats the number and the bar labels. Defaults to en-GB grouping." },
  ],
})
