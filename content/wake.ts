import { defineComponent } from "./types"

export default defineComponent({
  name: "wake",
  title: "Wake",
  movement: "II",
  contract: "ot-wake",
  summary: "A paragraph that parts around your pointer like water around a hand: the lines it crosses split in two and the words move on.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The paragraph, as plain text: pretext measures it." },
    { name: "radius", type: "number", default: "3.2", description: "How far the text gives way around the pointer, in em." },
    { name: "mark", type: "boolean", default: "false", description: "Draw a hairline where the text has parted: a ring inside the circle, a hairline down the river, a rule in each breath of the caesura, or a ring round the reach of the weight." },
    { name: "variant", type: '"circle" | "river" | "caesura" | "weight"', default: '"circle"', description: "The shape of the parting. circle: a hole round your hand, the rows it crosses split in two. river: the typesetter's river of white, made on purpose; a gutter half the radius wide runs the paragraph's whole height at your hand and every row reads across it, so the paragraph becomes two columns that follow you. caesura: the pause in the middle of a verse; the paragraph opens at the line you point at, a breath above it and below, so that line stands alone while you stay, and the paragraph closes as you go (the breath is at most the two lines of room under it). weight: the letterpress's impression; nothing parts, the letters under your hand press heavier on the face's weight axis and, where it has a width axis, narrower by as much, so each keeps its set width and no line moves; they rest when your hand is still and ease back as it leaves." },
  ],
})
