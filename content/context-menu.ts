import { defineComponent } from "./types"

export default defineComponent({
  name: "context-menu",
  title: "Context menu",
  movement: "IX",
  contract: "db-menu",
  summary: "The same list of words, opened where you pressed and spreading from that point like ink.",
  underneath: "radix",
  uses: ["dropdown-menu", "popover"],
  props: [
    { name: "ContextMenuTrigger", type: "Radix", description: "The area that answers a right-click, a long press, the ContextMenu key or Shift+F10. Give it tabIndex={0} so the keyboard can reach it." },
    { name: "ContextMenuContent", type: "Radix", description: "Opens at the pointer. There is no leader line, since nothing hangs it from a trigger." },
    { name: "ContextMenuItem variant", type: '"default" | "destructive"', default: '"default"', description: "A destructive item sits heavier and says so in its words. It is never red." },
    { name: "ContextMenuCheckboxItem / RadioItem", type: "Radix", description: "Checked, the sentence turns to the expression italic." },
    { name: "ContextMenuSubTrigger", type: "Radix", description: "The only item with an arrow (→): it opens something." },
  ],
})
