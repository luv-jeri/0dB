import { defineComponent } from "./types"

export default defineComponent({
  name: "carousel",
  title: "Carousel",
  movement: "IX",
  contract: "db-carousel",
  summary: "One poster at a time, each name set so large the frame crops it. The count between the arrows rolls the way you travel.",
  underneath: "hook",
  props: [
    { name: "CarouselItem", type: "div", description: "A slide. Direct children of Carousel only: each is labelled \"n of m\" and announced as a slide." },
    { name: "trackLabel", type: "string", default: '"Slides"', description: "The track takes focus so the arrow keys can move it, so it needs a name. Say what the slides are." },
    { name: "previousLabel / nextLabel", type: "string", default: '"Previous" / "Next"', description: "Names for the arrow buttons. They disable at the ends." },
    { name: "CarouselTitle", type: "p", description: "A name set so large the slide's edge crops it." },
  ],
})
