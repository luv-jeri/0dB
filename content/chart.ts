import { defineComponent } from "./types"

export default defineComponent({
  name: "chart",
  title: "Chart",
  movement: "X",
  contract: "ot-chart",
  summary: "Hairlines and dots against one very large number that rolls to the bar you point at.",
  underneath: "hook",
  props: [
    { name: "data", type: "{ label: string; value?: number; [key: string]: string | number | undefined }[]", description: "One bar per entry. With one series the number is value; with several, each series reads its own key. The first letter of each label sets the axis (the whole label, horizontal)." },
    { name: "series", type: "{ key: string; label: string }[]", description: "stems: two or more series. Each has its own stem, solid, dotted or dashed, with a ring, a disc or a ring, and the one giant number becomes a short list of each at the bar you're on, figures flush right as on a ledger, named roman, italic and pencil. Spark and isotype read the first series only. Written for up to three." },
    { name: "stacked", type: "boolean", default: "false", description: "stems with series: one stem per column cut into a length per series, a dot at every joint; the top joint is now's accent, and the readout sets a rule and the sum under the list. Otherwise the series stand side by side (grouped)." },
    { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "stems: horizontal sets a ledger, the whole names in a column at the start and each line running out from a baseline on the start edge to its dot; the name the number reads is inked. Left and Right follow the page's direction." },
    { name: "label", type: "string", description: "Names the chart for assistive tech, such as Visits by month, 2026. Each bar is also a button labelled with its own value." },
    { name: "unit", type: "string", description: "What the values count. The readout reads visits in September." },
    { name: "now", type: "number", default: "last", description: "Index of the bar the number rests on. It carries the accent." },
    { name: "max", type: "number", description: "What a full-height bar means. Defaults to the next round number above the largest value." },
    { name: "format", type: "(value: number) => string", description: "Formats the number and the bar labels. Defaults to en-GB grouping." },
    { name: "variant", type: '"stems" | "spark" | "isotype"', default: '"stems"', description: "stems: hairlines and dots against one very large number, as large as the chart allows. spark: word-sized, set inside a sentence; stems as tall as a capital, spanning the data's own range, the accent dot on now, and the number following in the text's own size. isotype: each bar a column of dots, one dot a fixed amount, ink for what was had and hairline rings for the room left to the ceiling; now's top dot is the accent, a key says what a dot counts, and pointing at a column counts its dots up." },
    { name: "each", type: "number", default: "a tenth of the ceiling", description: "isotype: what one dot counts. Values round to the nearest dot; the number and each bar's label stay exact." },
    { name: "ChartFrame layer", type: "(geometry: ChartGeometry) => ReactNode", description: "Optional drawing beneath the plot's points. Geometry provides normalized [from, to] spans per series and the series list; LineChart and AreaChart use this shared frame." },
  ],
})
