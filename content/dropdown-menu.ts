import { defineComponent } from "./types"

export default defineComponent({
  name: "dropdown-menu",
  title: "Dropdown menu",
  movement: "IX",
  contract: "db-menu",
  summary: "A list of words on the popover panel; the one you point at is marked with the highlighter.",
  underneath: "radix",
  uses: ["popover", "kbd"],
  props: [
    { name: "DropdownMenuContent side / align / sideOffset", type: "Radix", default: '"bottom" / "start" / 8', description: "Where the list hangs. It wears the popover's panel (db-pop), so it shares the leader line and the in and out." },
    { name: "DropdownMenuItem variant", type: '"default" | "destructive"', default: '"default"', description: "A destructive item sits a little heavier and says so in its words (\"Delete Halden for good\"). It is never red; red is for errors." },
    { name: "DropdownMenuCheckboxItem / RadioItem", type: "Radix", description: "Checked, the sentence turns to the expression italic. No tick, no dot; screen readers get aria-checked." },
    { name: "DropdownMenuShortcut", type: "span", description: "Shortcut keys as db-kbd rings. \"⌘D\" is two keys; a string with spaces splits on them." },
    { name: "DropdownMenuSubTrigger", type: "Radix", description: "The only item with an arrow (→): it opens something. Right opens, Left closes." },
    { name: "Keyboard", type: "keys", description: "Down and Up move, Home and End go to the ends, Enter runs, Escape closes and returns focus to the trigger." },
  ],
})
