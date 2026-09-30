import { defineComponent } from "./types"

export default defineComponent({
  name: "resizable",
  title: "Resizable",
  movement: "IX",
  contract: "db-resize",
  summary: "Panes and the rule between them. Take the rule and it inks; while you hold it, each pane's share is drawn as a dimension.",
  underneath: "hook",
  props: [
    { name: "ResizablePanelGroup direction", type: '"horizontal" | "vertical"', description: "Which way the panels sit. Panels and handles must be its direct children, a handle between each pair, in that order (panel, handle, panel). They are told apart by place, not type." },
    { name: "ResizablePanel defaultSize", type: "number", description: "Its share of the group in percent. Panels without one share what's left." },
    { name: "ResizablePanel minSize", type: "number", default: "10", description: "The least it can be, in percent." },
    { name: "ResizableHandle", type: "separator", description: "role=separator with aria-valuenow, min and max. Arrow keys move it in fives (Shift, tens); Home and End go to the limits. Give it an aria-label naming the panel it sizes." },
  ],
})
