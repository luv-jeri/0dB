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
    { name: "ContextMenu dir", type: '"ltr" | "rtl"', description: "Without one, the menu takes the direction of the page around its trigger, so its arrow keys and submenus run the page's way." },
    { name: "ContextMenuContent", type: "Radix", description: "Opens at the pointer, toward the line's end and down: to the left on a right-to-left page. Without room it opens back from the point; on a phone, with room neither way, it slides in to fit. There is no leader line, since nothing hangs it from a trigger." },
    { name: "ContextMenuContent variant", type: '"list" | "leaders" | "orbit"', default: '"list"', description: "How the list is set. A cross pins the point you pressed over every one. list: the word you point at takes the highlighter. leaders: each word is joined to its keys by leader dots, which ink from the word to its keys as you point at it. orbit: the words stand on an arc bowed away from the point, a dot on the arc for each; the one you point at inks and its dot lands as the accent. Put orbit's items straight in the list: a group counts as one step of the arc." },
    { name: "ContextMenuItem variant", type: '"default" | "destructive"', default: '"default"', description: "A destructive item sits heavier and says so in its words. It is never red." },
    { name: "ContextMenuCheckboxItem / RadioItem", type: "Radix", description: "Checked, the sentence turns to the expression italic." },
    { name: "ContextMenuSubTrigger", type: "Radix", description: "The only item with an arrow (→): it opens something. On a narrow screen its submenu drops open under it and the arrow turns down." },
  ],
})
