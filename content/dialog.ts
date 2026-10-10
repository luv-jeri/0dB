import { defineComponent } from "./types"

export default defineComponent({
  name: "dialog",
  title: "Dialog",
  movement: "VII",
  contract: "ot-dialog",
  summary: "The question, set large, with two plain answers. The page holds still behind it.",
  underneath: "hook",
  props: [
    { name: "open / defaultOpen / onOpenChange", type: "boolean, (open) => void", description: "Controlled or not, like any shadcn dialog." },
    { name: "alert", type: "boolean", default: "false", description: "A question that needs an answer: role alertdialog, and pointing outside doesn't close it. Escape still does." },
    { name: "variant", type: '"frame" | "reply" | "ruled"', default: '"frame"', description: "On DialogContent. frame: corner marks, a row of facts, the question set large. reply: the question heavy and narrow, the answers set large in the italic because the answer is yours; the one you point at, or that has focus, takes a full stop in the accent. Give it bare DialogClose buttons, not Buttons. ruled: a grid of hairlines to the dialog's edges, the facts in the top corners, the question large on ruled lines that draw across as it opens, the detail ragged on the far side and the answers in the cells below." },
    { name: "DialogMeta", type: "div", description: "The frame row over the question: what this is, a hairline, one fact." },
    { name: "data-autofocus", type: "attribute", description: "Put it on the answer that should take focus when the dialog opens." },
    { name: "DialogSurface", type: "dialog", description: "The bare native dialog. Sheet and drawer build on it." },
    { name: "DialogTrigger / DialogClose asChild", type: "boolean", default: "false", description: "Pass the open or close behaviour to one child control instead of rendering another button." },
  ],
})
