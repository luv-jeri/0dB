import { defineComponent } from "./types"

export default defineComponent({
  name: "thread",
  title: "Thread",
  movement: "XI",
  contract: "ot-thread",
  summary: "A message scroller that keeps to the latest while you are at the end. Scrolled back, it stays put and counts what is new in an ink pill.",
  underneath: "native",
  uses: ["scroll-area"],
  props: [
    { name: "Thread label", type: "string", description: "Names the log region, such as Halden thread. It is a role=\"log\" that takes focus, so the keyboard can scroll it and screen readers hear each new message." },
    { name: "Thread variant", type: '"default" | "rests" | "running"', default: '"default"', description: "rests: the space before each message grows with the minutes since the one before, read from its MessageHeader dateTime; a pause of an hour or more is said in that silence as the marker's lapse says it (\"3 hours later\"), in pencil, its letters spread by how long it went quiet. A ThreadDay starts the count again. running: scrolled back past a day's divider, the top edge carries a running head, the day and the time of the first message in view on a hairline between them; the day rolls as you cross into another. It is aria-hidden, since the log says it already." },
    { name: "Thread newLabel", type: "string", default: '"new"', description: "The word after the count in the pill: 2 new." },
    { name: "Thread children", type: "ReactNode", description: "Messages and day dividers as direct children. Only messages that aren't yours are counted; sending one of your own takes you down." },
    { name: "Height", type: "className", default: "26rem", description: "Give the thread a height with className; the scroller fills it, and short threads sit at the bottom." },
    { name: "ThreadDay", type: "Marker props", description: "Where a day begins: a word with a rule drawn out to each side." },
  ],
})
