import { defineComponent } from "./types"

export default defineComponent({
  name: "dialog",
  title: "Dialog",
  movement: "VII",
  contract: "db-dialog",
  summary: "The question, set large, with two plain answers. The page holds still behind it.",
  underneath: "hook",
  props: [
    { name: "open / defaultOpen / onOpenChange", type: "boolean, (open) => void", description: "Controlled or not, like any shadcn dialog." },
    { name: "alert", type: "boolean", default: "false", description: "A question that needs an answer: role alertdialog, and pointing outside doesn't close it. Escape still does." },
    { name: "DialogMeta", type: "div", description: "The frame row over the question: what this is, a hairline, one fact." },
    { name: "data-autofocus", type: "attribute", description: "Put it on the answer that should take focus when the dialog opens." },
    { name: "DialogSurface", type: "dialog", description: "The bare native dialog. Sheet and drawer build on it." },
  ],
})
