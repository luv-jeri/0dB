import { defineComponent } from "./types"

export default defineComponent({
  name: "timer",
  title: "Timer",
  movement: "VII",
  contract: "db-timer",
  summary: "A countdown the person starts: the time set large inside a hairline ring that empties clockwise behind the accent dot, the figures turning over like a counter's wheels. Done, a full stop lands.",
  underneath: "hook",
  props: [
    { name: "duration", type: "number", default: "1500", description: "How long a session lasts, in seconds (25 minutes by default). An hour or more reads h:mm:ss. Changing it resets the timer." },
    { name: "defaultElapsed", type: "number", default: "0", description: "Seconds already spent when it first shows, for a session picked up again. It opens paused, never running." },
    { name: "label", type: "ReactNode", description: "What the time is for, such as Writing. It sits under the time; as a string it also names the timer for assistive tech (Writing timer). Set a name the person chose in `db-yours`." },
    { name: "variant", type: '"ring" | "horizon"', default: '"ring"', description: "ring: a full ring round the time, emptying clockwise from the top behind the accent dot, like a clock's hand. horizon: a half ring standing on a horizon, as in the Eclipse poster; the dot crosses it like the sun from the start of the line to its end, the time stands on the line and its words sit under it." },
    { name: "onComplete", type: "() => void", description: "Called once when the time runs out." },
  ],
})
