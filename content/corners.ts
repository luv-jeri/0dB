import { defineComponent } from "./types"

export default defineComponent({
  name: "corners",
  title: "Corners",
  movement: "IV",
  contract: "db-corners",
  summary: "Four corner marks: a frame that doesn't close.",
  underneath: "native",
  props: [
    { name: "asChild", type: "boolean", default: "false", description: "Put the corners on the child element instead of a new div." },
    { name: "variant", type: '"viewfinder" | "kagi" | "glide"', description: "viewfinder frames the whole at rest, and glides onto the part (a direct child) you point at or focus, locking with one small rebound. kagi sets only the opening and closing corners round a phrase in running text, as the Japanese corner brackets 「 」 quote it, across line breaks; put it on a <q> with asChild. glide keeps no frame at rest: point at or focus any control inside, at any depth, and one frame appears round it, glides from control to control as the pointer or focus moves, and fades where it was when both leave. Disabled controls are passed over." },
    { name: "--db-corner", type: "CSS length", default: "8px", description: "The length of each mark." },
    { name: "--db-corner-inset", type: "CSS length", default: "0", description: "How far the marks sit inside the edge." },
    { name: "--db-corner-colour", type: "CSS colour", default: "var(--db-ink)", description: "The marks' colour." },
  ],
})
