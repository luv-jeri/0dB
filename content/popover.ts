import { defineComponent } from "./types"

export default defineComponent({
  name: "popover",
  title: "Popover",
  movement: "IX",
  contract: "db-pop",
  summary: "A panel hung from what opened it, on a leader line. Escape or a click elsewhere puts it away.",
  underneath: "radix",
  props: [
    { name: "PopoverContent variant", type: '"leader" | "brace" | "cut"', default: '"leader"', description: "leader: the panel hangs on a hairline from a dot on the trigger's edge. brace: the panel has no box; a brace over its words gathers their width to one point at the trigger's middle, and the point follows the trigger when the panel shifts to stay on screen. cut: the panel's edge cuts through the trigger's words at half their height and the panel rides over their lower half; the join is the cut. All three hang above or below the trigger." },
    { name: "PopoverContent side / align / sideOffset", type: "Radix", default: '"bottom" / "start" (brace: "center") / 27 (brace: 6, cut: 0)', description: "Where the panel hangs. The leader and the brace show when it sits above or below the trigger." },
    { name: "PopoverAnchor", type: "Radix", description: "Hangs the panel from another element than the trigger." },
    { name: "PopoverClose", type: "Radix", description: "Puts the panel away. Use asChild to wear a button." },
    { name: "db-pop", type: "class", description: "The panel's class, shared with the menus and pickers that open the same way." },
  ],
})
