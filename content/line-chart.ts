import { defineComponent } from "./types"

export default defineComponent({
  name: "line-chart",
  title: "Line chart",
  movement: "X",
  contract: "ot-line-chart",
  summary: "One hairline through the points, a ring on each, against one very large number that rolls to the point you're on.",
  underneath: "hook",
  props: [
    { name: "data", type: "{ label: string; value?: number; [key: string]: string | number | undefined }[]", description: "One point per entry, in order. With one series the number is value; with several, each series reads its own key. The first letter of each label sets the axis." },
    { name: "series", type: "{ key: string; label: string }[]", description: "Two or more lines. The first is a solid ink hairline, the second dotted graphite, the third dashed pencil; the one giant number becomes a short list of each at the point you're on, named roman, italic and pencil. Written for up to three." },
    { name: "label", type: "string", description: "Names the chart for assistive tech, such as Visits by month, 2026. Each point is a button labelled with its values." },
    { name: "unit", type: "string", description: "What the values count. The readout reads visits in September." },
    { name: "now", type: "number", default: "last", description: "Index of the point the number rests on. Its ring is the accent." },
    { name: "max", type: "number", description: "The value at the top of the plot. Defaults to the next round number above the largest." },
    { name: "format", type: "(value: number) => string", description: "Formats the numbers and the point labels. Defaults to en-GB grouping." },
    { name: "variant", type: '"linear" | "smooth" | "step"', default: '"linear"', description: "The path between points. linear: straight, point to point. smooth: one sweep through every point that never overshoots one (monotone), so the curve never claims a value the data doesn't have. step: level across each point's column and upright between them, the draughtsman's line." },
    { name: "ChartLines area", type: "boolean", default: "false", description: "The exported shared drawing body can stack series and draw the hatched drops beneath each line. Use AreaChart for the complete styled area chart." },
  ],
})
