import { defineComponent } from "./types"

export default defineComponent({
  name: "radar-chart",
  title: "Radar chart",
  movement: "X",
  contract: "db-radar",
  summary: "Several measures on one shape: a hairline polygon on a dotted construction sheet, each axis named in small caps at its end, and the axis you point at measured off as a dimension line with its figure on it.",
  underneath: "hook",
  props: [
    { name: "data", type: "{ label: string; value?: number; [key: string]: string | number | undefined }[]", description: "One axis per entry, clockwise from the top. With one series the length is value; with several, each series reads its own key. Fewer than three axes draw a note saying so instead of a shape." },
    { name: "series", type: "{ key: string; label: string }[]", description: "Two or three shapes on one sheet. The first is an ink hairline, the second dashed graphite, the third dotted pencil, each named in a key under the sheet (the second in italic). Pointing at an axis measures every series off it, each dimension line one step further from the spoke, and the key gives each figure. Written for up to three." },
    { name: "label", type: "string", description: "Names the chart for assistive tech, such as How three typefaces compare. Each axis name is a button that reads its values against the rim." },
    { name: "max", type: "number", description: "The value at the rim, shared by every axis. Defaults to the next round number above the largest. With one series, the measured figure reads against it in pencil, 8/10." },
    { name: "format", type: "(value: number) => string", description: "Formats the figures. Defaults to en-GB grouping." },
    { name: "now", type: "number", default: "0", description: "Index of the axis the keyboard starts on." },
    { name: "cell", type: "number", default: "27", description: "The side of one square of the dotted sheet behind the chart, in pixels (the grid item's cell)." },
  ],
})
