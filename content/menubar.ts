import { defineComponent } from "./types"

export default defineComponent({
  name: "menubar",
  title: "Menubar",
  movement: "IX",
  contract: "ot-menubar",
  summary: "A frame row of words on a hairline; opening a word folds the line down into a pocket that holds its menu.",
  underneath: "radix",
  uses: ["dropdown-menu", "popover"],
  props: [
    { name: "MenubarMenu", type: "Radix", description: "One word and its menu: a MenubarTrigger and a MenubarContent." },
    { name: "MenubarContent align / sideOffset / alignOffset", type: "Radix", default: '"start" / -1.5 / -27', description: "The menu wears the dropdown menu's list, hung in the bar's own hairline: it rises over the rule so its paper hides it there, and its sides and foot carry the line on. Its words stand under the word that opened it. With no room below it turns above the words in a whole frame." },
    { name: "variant", type: '"pocket" | "leaders" | "caption"', default: '"pocket"', description: "pocket: the menus are plain lists in the folded pocket. leaders: the menus are set as a contents page, each word joined to its keys by leader dots. caption: the bar's far end keeps a status line of where you are (File / Export / As PDF), its last step arriving as you move; at rest it shows the bar's name. On a phone only the last step shows. Screen readers already hear the path, so the caption is hidden from them." },
    { name: "value / onValueChange", type: "string", description: "Which menu is open, when you want to control it." },
    { name: "dir", type: '"ltr" | "rtl"', description: "Left to right or right to left. Without it the bar takes the direction of the page around it, so the menus and the arrow keys follow." },
    { name: "Keyboard", type: "keys", description: "Down opens. Left and Right move between menus, open or closed. Escape closes and returns focus to the word." },
  ],
})
