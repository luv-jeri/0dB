import { defineComponent } from "./types"

export default defineComponent({
  name: "invitation",
  title: "Invitation",
  movement: "IX",
  contract: "db-invitation",
  summary: "A quiet call held in the margin. When the conversation itself comes into view, it gives the page back its room.",
  underneath: "native",
  props: [
    { name: "label", type: "string", description: "The call, such as Tell me what you need. The component adds the directional arrow." },
    { name: "hint", type: "string", description: "A quiet line under the call, before the visitor has written." },
    { name: "state", type: "string", description: "The visitor's progress in italic, replacing hint: Your brief · Edit." },
    { name: "native button props", type: "button", description: "Forwards ref, events and attributes; compose as <SheetTrigger asChild><Invitation label=… /></SheetTrigger>." },
    { name: "data-invitation-hide", type: "attribute on another element", description: "The call lifts away and becomes inert while any marked element is visible. Newly mounted markers are observed too." },
  ],
})
