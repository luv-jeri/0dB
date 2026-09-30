import { defineComponent } from "./types"

export default defineComponent({
  name: "badge",
  title: "Badge",
  movement: "VIII",
  contract: "db-tag",
  summary: "The one rounded shape: a hairline pill for a tag or a status.",
  underneath: "native",
  props: [
    { name: "variant", type: '"default" | "ink" | "accent"', default: '"default"', description: "Ink is reversed type in a filled pill, for one new thing. Accent is the view's one accent, for a live state." },
    { name: "onRemove", type: "() => void", description: "Makes the tag removable: the whole pill becomes a button with a cross, named Remove followed by the tag. Pointing at it strikes the word. It closes up, focus moves to the neighbouring tag, then onRemove runs. Pass aria-label if the children aren't plain text." },
  ],
})
