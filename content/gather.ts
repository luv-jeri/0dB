import { defineComponent } from "./types"

export default defineComponent({
  name: "gather",
  title: "Gather",
  movement: "II",
  contract: "ot-gather",
  summary: "A line whose letters, words or rows start as dust, as the mirrored forme or wound in a coil, and settle into place as it scrolls into view, or step by step with the scroll, then give way to the real text.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The line, as plain text: pretext measures where each letter belongs." },
    { name: "variant", type: '"dust" | "forme" | "coil"', default: '"dust"', description: "Where the letters start. dust: scattered round their places at pp. forme: the line mirrored in pencil, as type stands in the chase before it is printed; each letter turns over as it crosses to its place and inks. coil: the whole text wound into one spiral beside the first row's start, first letter outermost; it unwinds from its free end." },
    { name: "by", type: '"letter" | "word" | "line"', default: '"letter"', description: "What travels as one piece. letter: each letter. word: each word whole, a few letters' time after the last. line: each row whole, as a Linotype casts a slug, twice that apart. Every variant works by any piece: a forme word or row is mirrored whole, a coil word or row lies along the spiral." },
    { name: "scrub", type: "boolean", default: "false", description: "Tie the settle to the scroll instead of playing it once. The line is dust as its top comes in at the foot of the view and set once it is two fifths down from the top (or as far as the page scrolls); each piece travels its share of that, in reading order, stops when the scroll stops, and scatters again when you scroll back. By word, this is words arriving one by one as you read down. Read from the real layout, so it keeps step with smooth scrolling." },
    { name: "as", type: '"h2" | "h3" | "p"', default: '"p"', description: "The element. Pass a dynamic class such as ot-f or ot-mf for the size." },
  ],
})
