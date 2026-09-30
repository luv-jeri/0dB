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
    { name: "DropdownMenuContent side / align / sideOffset", type: "Radix", default: '"bottom" / "start" / 27', description: "Where the list hangs. It wears the popover's panel (db-pop), so it shares the leader line and the in and out." },
    { name: "DropdownMenuContent variant", type: '"list" | "leaders" | "marginalia"', default: '"list"', description: "How the list is set. list: the word you point at takes the highlighter. leaders: a book's contents page; each word is joined to its keys by leader dots, and the dots of the word you point at ink from the word to its keys (submenus keep the leaders). marginalia: the word you point at is explained by a small note hung beside the list on a hairline arrow, gliding from word to word; with no room beside the list it stands under it." },
    { name: "DropdownMenuItem hint", type: "string", description: "For marginalia: the note hung beside the item while you point at it. Screen readers hear it as the item's description. Checkbox, radio and sub-trigger items take it too." },
    { name: "DropdownMenuItem variant", type: '"default" | "destructive"', default: '"default"', description: "A destructive item sits a little heavier and says so in its words (\"Delete Halden for good\"). It is never red; red is for errors." },
    { name: "DropdownMenuCheckboxItem / RadioItem", type: "Radix", description: "Checked, the sentence turns to the expression italic. No tick, no dot; screen readers get aria-checked." },
    { name: "DropdownMenuShortcut", type: "span", description: "Shortcut keys as db-kbd caps. \"⌘D\" is two keys; a string with spaces splits on them. It reads ⌘D on a right-to-left page too." },
    { name: "DropdownMenu dir", type: '"ltr" | "rtl"', description: "Without one, the menu takes the direction of the page around its trigger: on a right-to-left page it hangs from the trigger's right end, submenus open to the left, and Left opens them." },
    { name: "DropdownMenuSubTrigger", type: "Radix", description: "The only item with an arrow (→): it opens something. Right opens, Left closes (mirrored right to left)." },
    { name: "DropdownMenuSubContent", type: "Radix", description: "Opens beside its item. On a narrow screen, with room on neither side, it drops open under the item, in by the words' inset, and hangs from it on a leader; the item's arrow turns down (↓)." },
    { name: "Keyboard", type: "keys", description: "Down and Up move, Home and End go to the ends, Enter runs, Escape closes and returns focus to the trigger." },
  ],
})
