import { defineComponent } from "./types"

export default defineComponent({
  name: "segue",
  title: "Segue",
  movement: "IX",
  contract: "ot-segue",
  summary: "One scene at a time. When you change it, one hairline crosses the frame carrying the next scene's number and name, and the next scene is already behind it.",
  underneath: "hook",
  props: [
    { name: "SegueScene", type: "div", description: "A scene. Direct children of Segue only. `label` names it: the hairline carries the name as it crosses, and a labelled scene is a named group for readers." },
    { name: "value / defaultValue", type: "number", default: "0", description: "Which scene is showing, from 0. Change it from your own control (a button, a key, an answer) and the line crosses; to an earlier scene it crosses the other way. A second change mid-crossing arrives at once and crosses again from there." },
    { name: "onValueChange", type: "(value: number) => void", description: "Called with the new scene. With `scrub`, called as the scroll brings each scene past halfway." },
    { name: "variant", type: '"wipe" | "horizon"', default: '"wipe"', description: "wipe: an upright hairline crosses along the line, from the start (the end, going back; right to left, it mirrors). horizon: after Eclipse, a level hairline rises from the foot and the next scene comes up under it; going back, it sets." },
    { name: "scrub", type: "boolean", default: "false", description: "Tie the crossings to the scroll. As the frame's middle rises from four fifths of the way down the view to one fifth, it passes through every scene in turn; the line stands as far across as the scroll has gone, stops when the scroll stops and goes back when you scroll back. Read from the real layout, so it keeps step with smooth scrolling. Every scene stays with readers, in order." },
    { name: "SegueScene label", type: "string", description: "The name carried by the crossing hairline and the accessible name of the scene's group. Omit it for an unnamed scene." },
  ],
})
