import { defineComponent } from "./types"

export default defineComponent({
  name: "popover",
  title: "Popover",
  movement: "IX",
  contract: "db-pop",
  summary: "A panel hung from what opened it, on a leader line. Escape or a click elsewhere puts it away.",
  underneath: "radix",
  props: [
    { name: "PopoverContent side / align / sideOffset", type: "Radix", default: '"bottom" / "start" / 8', description: "Where the panel hangs. The leader line shows when it sits above or below the trigger." },
    { name: "PopoverAnchor", type: "Radix", description: "Hangs the panel from another element than the trigger." },
    { name: "PopoverClose", type: "Radix", description: "Puts the panel away. Use asChild to wear a button." },
    { name: "db-pop", type: "class", description: "The panel's class, shared with the menus and pickers that open the same way." },
  ],
})
