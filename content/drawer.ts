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
    { name: "DrawerContent variant", type: '"arc" | "thirds" | "solid"', default: '"arc"', description: "How the drawer answers the hand. arc: drag the arc down past a short pull, or tap it, and it goes. thirds: it opens at a third of the window and stops at a third, two thirds or the whole height; the arc follows your drag both ways and lets go on the nearest third (below half of one, it goes), a tap raises it a third, and the share stands in the far corner as a Fraction, yours in italic. The arc is then a vertical slider: the arrow keys step it, Home and End go to a third and the whole; Escape closes. solid: pulling the arc first takes out the silence between the drawer's parts, so it closes up and sinks under your hand, as a compositor sets type solid; let go once it is solid and it goes, short of that the silence springs back." },
    { name: "DrawerContent handleLabel", type: "string", default: '"Put this away" (thirds: "Height of the drawer")', description: "The accessible name of the arc. Tapping it, or pressing Enter on it, closes the drawer; in thirds it raises it a third." },
  ],
})
