import { defineComponent } from "./types"

export default defineComponent({
  name: "button-group",
  title: "Button group",
  movement: "VI",
  contract: "db-btn-group",
  summary: "One pair of parentheses holds a set of actions, and hairlines stand between them.",
  underneath: "native",
  uses: ["button"],
  props: [
    { name: "aria-label", type: "string", description: "Names the set for a screen reader, such as Share Halden. The group is role=group." },
    { name: "children", type: "Button[]", description: "The actions. Each Button gives up its own brackets inside the group." },
  ],
})
