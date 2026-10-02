import { defineComponent } from "./types"

export default defineComponent({
  name: "calligram",
  title: "Calligram",
  movement: "II",
  contract: "db-calligram",
  summary: "A paragraph that fills a shape, as Apollinaire's calligrams did: each line is as wide as the shape is at that height, so the outline is only implied. Or it falls as rain, or runs round a frame about one word.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The paragraph, as plain text: pretext measures it." },
    { name: "variant", type: '"fill" | "rain" | "mirror"', default: '"fill"', description: "fill: the paragraph fills `shape`. rain: after Apollinaire's \"Il pleut\", the words fall in leaning streaks of letters, a letter to a drop, each streak starting a little late; its height follows its streaks. mirror: after his \"Cœur couronne et miroir\", the paragraph is the frame of a square, a line to each side, clockwise from the top and turned to face out, ringing inward until the words run out, with `centre` large in the italic in the middle." },
    { name: "shape", type: '"circle" | "fermata" | "wave" | "square" | "arch" | "ring" | "diamond" | "open"', default: '"circle"', description: "For fill. circle: an idea; square: an existing product; arch: a website or store; ring: a workflow; diamond: an AI question; open: something else. fermata and wave retain their musical forms." },
    { name: "chord", type: "(y: number) => number | [number, number][]", description: "Overrides shape. At y from 0 (top) to 1 (bottom), return a centred width fraction or [start, end] runs in 0..1. Runs are clamped and merged. Define the function in a client component." },
    { name: "label", type: "string", description: "Gives the figure role=img and its accessible name; the words are aria-hidden. Allows dense type at icon sizes such as 4rem." },
    { name: "centre", type: "string", description: "For mirror: the word in the middle, in the expression italic, as large as the room inside the frame allows. It is read after the paragraph." },
    { name: "size", type: "string", default: '"34rem"', description: "The shape's diameter as a CSS length. It never grows wider than the space it's in." },
    { name: "fade", type: "boolean", default: "false", description: "Let the colour follow the shape: ink at its centre, pencil at its edge. In rain each streak darkens as it falls; in mirror the frame fades as it rings inward." },
  ],
})
