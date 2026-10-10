import { defineComponent } from "./types"

export default defineComponent({
  name: "tabs",
  title: "Tabs",
  movement: "VIII",
  contract: "ot-tabs",
  summary: "Words with their counts raised. A line inches to the one in view and the count of what's showing sinks into the rule; or the chosen word takes its width from the others; or the rule beside a stack of words opens onto the panel.",
  underneath: "radix",
  props: [
    { name: "variant", type: '"line" | "rubato" | "open"', default: '"line"', description: "On Tabs. line: a line inches to the word in view, leading edge first. rubato: no line; the chosen word widens and thickens (font-stretch 75% to 125%, weight 300 to 600) while the others give up the width, and the words are spread to both ends so the bar keeps its length. open: the words stacked large in ruled cells beside the panel, with a hairline between; the hairline breaks beside the chosen word so its cell opens onto the panel, and the break moves leading edge first. open sets orientation to vertical unless you pass one." },
    { name: "value / defaultValue / onValueChange", type: "Radix", description: "Radix Tabs: roving focus, arrows (Left / Right, or Up / Down when vertical) and Home / End select." },
    { name: "dir", type: '"ltr" | "rtl"', description: "On Tabs. Left out, the tabs take the direction of the page around them as they mount, so on a right-to-left page the words run from the right and Left and Right swap." },
    { name: "TabsTrigger count", type: "number | string", description: "How many things are behind the tab, raised beside its name." },
    { name: "TabsCount", type: "number | string", description: "Inside TabsList. The count of what's showing, set huge and cropped by the rule; it rolls up when it grows and down when it shrinks. Hidden below 700px." },
  ],
})
