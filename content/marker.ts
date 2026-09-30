import { defineComponent } from "./types"

export default defineComponent({
  name: "marker",
  title: "Marker",
  movement: "XI",
  contract: "db-marker",
  summary: "A quiet line in a conversation: a status, or where a day begins.",
  underneath: "native",
  props: [
    { name: "variant", type: '"status" | "divider"', default: '"status"', description: "A divider draws its rules outward from the word, as if the word pushed them apart." },
    { name: "dot", type: "boolean", default: "false", description: "A small dot before a status." },
    { name: "arriving", type: "boolean", default: "false", description: "Plays the arrival when it mounts." },
  ],
})
