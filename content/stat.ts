import { defineComponent } from "./types"

export default defineComponent({
  name: "stat",
  title: "Stat",
  movement: "X",
  contract: "ot-stat",
  summary: "A named value: a giant thin figure whose feet sink under one hairline, the name small beneath; a changed figure turns over like a counter's wheels.",
  underneath: "native",
  props: [
    { name: "Stats", type: "dl props", description: "The row the stats stand in; they wrap to the width, one per line on a phone. A single stat still goes in Stats, since each is a term and its value." },
    { name: "Stats variant", type: '"crop" | "beside" | "grid"', default: '"crop"', description: "crop: SPECTRA's giant thin figures, each set as large as its cell allows, their feet cut off by one hairline that runs under the whole row, the name small under it. beside: WOVE's 03, the figure heavy and whole with its name and a line about it set beside it, on its cap line. grid: \"Less is more.\", each stat a cell of a hairline grid, its name in the first corner and its figure in the far one; the lines run only between cells." },
    { name: "Stat value", type: "number | string", description: "The figure. A number is formatted; a string (\"12:40\", \"98%\") is set as it is. When it changes, only the figures that changed turn over, units first, the way the value went." },
    { name: "Stat label", type: "ReactNode", description: "What the figure counts: visits in September. Read before the figure." },
    { name: "Stat note", type: "ReactNode", description: "A line about it, in pencil: up 12% on August." },
    { name: "Stat format", type: "(value: number) => string", default: "en-GB grouping", description: "Formats a number value, such as Intl.NumberFormat for pounds." },
  ],
})
