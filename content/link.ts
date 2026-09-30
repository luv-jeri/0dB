import { defineComponent } from "./types"

export default defineComponent({
  name: "link",
  title: "Link",
  movement: "II",
  contract: "db-link",
  summary: "A hairline underline at rest; pointing at it, focusing it or holding its card open draws a highlighter stroke through the whole word, on from the left and off to the right.",
  underneath: "native",
  props: [
    { name: "asChild", type: "boolean", default: "false", description: "Render the child element, such as your router's link, with the link's look." },
    { name: "external", type: "boolean", default: "false", description: "Opens in a new tab and adds the arrow, the one place an arrow belongs." },
    { name: "href / …", type: "native", description: "A real anchor, so every native prop works." },
  ],
})
