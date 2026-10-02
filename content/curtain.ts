import { defineComponent } from "./types"

export default defineComponent({
  name: "curtain",
  title: "Curtain",
  movement: "IX",
  contract: "db-curtain",
  summary: "The page steps back into pencil. The destinations come forward, large and clear, one after another.",
  underneath: "native",
  props: [
    { name: "Curtain", type: "Dialog props", description: "open, defaultOpen and onOpenChange, as in Sheet. Native modal focus, Escape and focus return." },
    { name: "CurtainTrigger asChild", type: "boolean", default: "false", description: "Lend the opening behavior to a button of your own." },
    { name: "CurtainContent label", type: "string", default: '"Menu"', description: "Names the dialog and its navigation. Includes a visible Close button." },
    { name: "CurtainLink number / description", type: "string", description: "Optional small folio and italic line below the destination. All native anchor props are accepted." },
    { name: "data-curtain-page", type: "attribute", description: "Mark the page to recede. With no marker, direct body children except dialogs and nonvisual elements recede. Content is portalled to the body." },
  ],
})
