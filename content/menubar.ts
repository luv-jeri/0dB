import { defineComponent } from "./types"

export default defineComponent({
  name: "menubar",
  title: "Menubar",
  movement: "IX",
  contract: "db-menubar",
  summary: "A frame row of words along a hairline; each opens a menu, and a stroke slides to the open one.",
  underneath: "radix",
  uses: ["dropdown-menu", "popover"],
  props: [
    { name: "MenubarMenu", type: "Radix", description: "One word and its menu: a MenubarTrigger and a MenubarContent." },
    { name: "MenubarContent align / sideOffset", type: "Radix", default: '"start" / 16', description: "The menu wears the dropdown menu's list on the popover panel. It hangs 16px down to clear the hairline." },
    { name: "value / onValueChange", type: "string", description: "Which menu is open, when you want to control it. The stroke follows it." },
    { name: "Keyboard", type: "keys", description: "Down opens. Left and Right move between menus, open or closed. Escape closes and returns focus to the word." },
  ],
})
