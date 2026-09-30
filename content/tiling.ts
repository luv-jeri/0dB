import { defineComponent } from "./types"

export default defineComponent({
  name: "tiling",
  title: "Tiling",
  movement: "IV",
  contract: "db-tiling",
  summary: "Tiles on the 12-column grid, held apart by space and one hairline, never boxed: the sheet of \"Less is more.\", its notes kept to the corners.",
  underneath: "native",
  props: [
    { name: "variant", type: '"rules" | "crosses"', default: '"rules"', description: "rules: one ink hairline between neighbouring tiles, running a step past the tiling's edge, and none round the outside, so nothing is boxed. crosses: no lines at all; the space holds the tiles apart and a registration cross in the pencil marks every corner of every tile, the outer ones half a gap outside the block, as \"the uncreative\" marks its corners with + signs." },
    { name: "Tile", type: "div", description: "One tile. span is its width in columns out of 12 (default 4), rows the rows it stands through (default 1). In a tiling narrower than 40rem the grid falls to two columns: a tile of 6 or fewer takes one and a wider one both; under 24rem there is one column, and every tile is the whole width and one row high." },
    { name: "place", type: '"start-top" | "end-top" | "start-foot" | "end-foot"', default: '"start-top"', description: "On Tile: the corner its content keeps to, as the poster keeps its notes to the corners; the end corners set the text flush to the end. A child with margin-block-start: auto goes to the foot, so one tile can hold a note at its head and a paragraph at its foot." },
  ],
})
