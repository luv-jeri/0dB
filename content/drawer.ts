import { defineComponent } from "./types"

export default defineComponent({
  name: "drawer",
  title: "Drawer",
  movement: "IX",
  contract: "db-drawer",
  summary: "A sheet from below, lifted by the fermata's arc. Drag the arc down to put it away.",
  underneath: "native",
  props: [
    { name: "Drawer", type: "Dialog props", description: "The same open, defaultOpen, onOpenChange and alert as Dialog." },
    { name: "DrawerContent handleLabel", type: "string", default: '"Put this away"', description: "The accessible name of the arc. Tapping it, or pressing Enter on it, closes the drawer." },
  ],
})
