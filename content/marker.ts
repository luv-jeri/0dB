import { defineComponent } from "./types"

export default defineComponent({
  name: "marker",
  title: "Marker",
  movement: "XI",
  contract: "db-marker",
  summary: "A quiet line in a conversation: a status, where a day begins, where you left off, or how long it went quiet.",
  underneath: "native",
  props: [
    {
      name: "variant",
      type: '"status" | "divider" | "ribbon" | "lapse"',
      default: '"status"',
      description:
        "divider: where a day begins, the word standing on the rule it pushed apart. ribbon: where you left off, one accent line across the page with its word at the end, like the ribbon in a book. lapse: a pause, given as silence: no rule, only room around the words and space between their letters, more the longer it was. A divider with no word is a plain rule (role separator), one unbroken hairline.",
    },
    { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Divider only. vertical stands the rule up between two things in a row, as tall as the row (put it in a flex or grid row). A word, if any, turns on its side and reads down it like a book's spine, the rules running above and below it." },
    { name: "dot", type: "boolean", default: "false", description: "A small dot before a status." },
    { name: "minutes", type: "number", default: "0", description: "Lapse only: how long the pause was. The room grows on a log scale, from a breath at a minute to the widest at a week." },
    { name: "arriving", type: "boolean", default: "false", description: "Plays the arrival when it mounts: a divider's rules draw outward, a ribbon draws from where you started reading, a lapse opens." },
  ],
})
