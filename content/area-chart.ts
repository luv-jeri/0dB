import { defineComponent } from "./types"

export default defineComponent({
  name: "area-chart",
  title: "Area chart",
  movement: "X",
  contract: "ot-area-chart",
  summary: "Volume as a barcode: no fill, only hairlines dropped from the line to the baseline at a close, even rhythm.",
  underneath: "hook",
  props: [
    { name: "data", type: "{ label: string; value?: number; [key: string]: string | number | undefined }[]", description: "One point per entry, in order. With one series the number is value; with several, each series reads its own key." },
    { name: "series", type: "{ key: string; label: string }[]", description: "Two or more bands, stacked in order from the baseline. Each keeps its own rhythm of drops, three, six and twelve pixels apart, and the readout lists each with a rule and the sum under it. Written for up to three." },
    { name: "label", type: "string", description: "Names the chart for assistive tech. Each point is a button labelled with its values and, stacked, the sum." },
    { name: "unit", type: "string", description: "What the values count. The readout reads visits in September, or visits in all under a sum." },
    { name: "now", type: "number", default: "last", description: "Index of the point the number rests on. Its ring is the accent." },
    { name: "max", type: "number", description: "The value at the top of the plot. Defaults to the next round number above the largest, or the largest sum." },
    { name: "format", type: "(value: number) => string", description: "Formats the numbers and the point labels. Defaults to en-GB grouping." },
    { name: "variant", type: '"linear" | "smooth" | "step"', default: '"linear"', description: "The line along the top of the drops, as in line-chart: straight, one monotone sweep, or level across each column (the drops then stand as a histogram)." },
  ],
})
