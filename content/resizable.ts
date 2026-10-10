import { defineComponent } from "./types"

export default defineComponent({
  name: "resizable",
  title: "Resizable",
  movement: "IX",
  contract: "ot-resize",
  summary: "Panes and the rule between them. Take the rule and it inks; while you hold it, each pane's share is drawn as a dimension.",
  underneath: "hook",
  props: [
    { name: "ResizablePanelGroup direction", type: '"horizontal" | "vertical"', description: "Which way the panels sit. Panels and handles must be its direct children, a handle between each pair, in that order (panel, handle, panel). They are told apart by place, not type." },
    { name: "ResizablePanelGroup variant", type: '"rule" | "fit" | "flow"', default: '"rule"', description: "rule: panes and the rules between them. fit: each pane's ResizableTitle is set heavy to the pane's measure, as wood type is locked up: it condenses as the pane narrows and extends as it widens, and changes size only past the ends of the width axis. flow: the group's text runs through the panes as continued columns; the first holds as many lines as its height allows, the rest carry on in the next, and moving the rule moves the break. Flow sets the group's height." },
    { name: "ResizablePanelGroup text", type: "string", description: "In flow, the one paragraph that runs through the panes. Plain text: pretext measures it. A reader of the page gets it whole, once, in the first pane." },
    { name: "ResizableTitle", type: "h3", description: "A pane's title. In fit it fills its pane edge to edge; keep it to a word or two. Elsewhere it is a plain heading." },
    { name: "ResizablePanel defaultSize", type: "number", description: "Its share of the group in percent. Panels without one share what's left." },
    { name: "ResizablePanel minSize", type: "number", default: "10", description: "The least it can be, in percent." },
    { name: "ResizableHandle", type: "separator", description: "role=separator with aria-valuenow, min and max. Arrow keys move it in fives (Shift, tens); Home and End go to the limits. Give it an aria-label naming the panel it sizes." },
  ],
})
