import { defineComponent } from "./types"

export default defineComponent({
  name: "badge",
  title: "Badge",
  movement: "VIII",
  contract: "db-tag",
  summary: "The one rounded shape: a hairline pill for a tag or a status; or tags written as one list in the italic; or a seal with its legend set round a ring.",
  underneath: "native",
  props: [
    { name: "variant", type: '"default" | "ink" | "accent" | "series" | "seal"', default: '"default"', description: "Ink is reversed type in a filled pill, for one new thing. Accent is the view's one accent, for a live state. series drops the pill: sibling tags are written as one list in the italic (yours), and ours are the commas and the \"and\", which re-set themselves as a tag leaves; set --and on the tags to change the conjunction. seal is a coin: the legend set round a hairline ring, the children (a figure or up to three letters) in the middle; pointing turns the legend a little." },
    { name: "legend", type: "string", description: "seal only: the words set round the rim, about 12 to 24 characters. The seal is an image named by its face and its legend (\"01, First edition · 2026\"); pass aria-label if the face isn't plain text." },
    { name: "onRemove", type: "() => void", description: "Makes the tag removable: the whole pill becomes a button with a cross, named Remove followed by the tag. Pointing at it strikes the word. It closes up, focus moves to the neighbouring tag, then onRemove runs. Pass aria-label if the children aren't plain text. Works with series; not with seal." },
  ],
})
