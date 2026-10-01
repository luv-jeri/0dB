import { defineComponent } from "./types"

export default defineComponent({
  name: "input-group",
  title: "Input group",
  movement: "VI",
  contract: "db-input-group",
  summary: "Ours in roman, yours in italic, on one line. The accent draws only under the part you type. Or your figure stands large with our words stacked beside it, or an arrow leads from your words to the action.",
  underneath: "native",
  props: [
    { name: "variant", type: '"line" | "legend" | "arrow"', default: '"line"', description: "How ours and yours share the line. line: prefix, your words and suffix in reading order; a suffix follows your words. legend: your figure set large, with our words stacked beside it in two small lines, the first in ink, as in the \"28 December\" calendar. Put the input first. arrow: a hairline arrow runs from your words to the action at the end; the shaft gives way as you write, inks once what you wrote is valid, and steps forward when you point at the action." },
    { name: "InputGroupText", type: "ReactNode", description: "What we supply, a prefix or a suffix, upright in pencil." },
    { name: "InputGroupText agree", type: "{ one?, few?, many?, other }", description: "Forms of a unit that agree with the number typed, chosen by the page's plural rules: 1 night, 3 nights. The unit comes before the text's own words." },
    { name: "InputGroupInput", type: "native", description: "What you type, in italic. A real input; it takes a surrounding Field's id, hint and error." },
    { name: "InputGroupButton", type: "Button props", default: 'variant="quiet"', description: "An action at the end of the line." },
  ],
})
