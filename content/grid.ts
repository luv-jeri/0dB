import { defineComponent } from "./types"

export default defineComponent({
  name: "grid",
  title: "Grid",
  movement: "IV",
  contract: "ot-grid",
  summary: "A quiet structure behind a section: a faint square grid, or a fine point at each crossing, with a registration cross on each corner and the columns numbered and the rows lettered along the border, like a drafting sheet. It never moves.",
  underneath: "native",
  props: [
    { name: "variant", type: '"rules" | "dots"', default: '"rules"', description: "rules draws faint hairlines, the construction grid the posters lay under their words. dots leaves the rules out and sets a fine point on each crossing, as a drafting sheet is dotted." },
    { name: "cell", type: "number | string", default: "60 (--ot-space-7)", description: "The side of one square, in pixels or any CSS length. The first row and column are the border that carries the labels, so the content stands one cell in, on a line." },
    { name: "children", type: "ReactNode", description: "What stands on the grid." },
  ],
})
