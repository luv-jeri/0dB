import { defineComponent } from "./types"

export default defineComponent({
  name: "tabs",
  title: "Tabs",
  movement: "VIII",
  contract: "db-tabs",
  summary: "Words with their counts raised. A line inches to the one in view, leading edge first, and the count of what's showing sinks into the rule.",
  underneath: "radix",
  props: [
    { name: "value / defaultValue / onValueChange", type: "Radix", description: "Radix Tabs: roving focus, arrows and Home / End select." },
    { name: "TabsTrigger count", type: "number | string", description: "How many things are behind the tab, raised beside its name." },
    { name: "TabsCount", type: "number | string", description: "Inside TabsList. The count of what's showing, set huge and cropped by the rule; it rolls up when it grows and down when it shrinks. Hidden below 700px." },
  ],
})
