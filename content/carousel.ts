import { defineComponent } from "./types"

export default defineComponent({
  name: "carousel",
  title: "Carousel",
  movement: "IX",
  contract: "db-carousel",
  summary: "One poster at a time, each name set so large the frame crops it. The count between the arrows rolls the way you travel.",
  underneath: "hook",
  props: [
    { name: "variant", type: '"poster" | "line" | "shelf"', default: '"poster"', description: "poster: one slide at a time, the name sinking under a hairline that cuts off its feet. line: every name runs on as one line of display type, each closed by a full stop; the name at the start is the one you're on, inked, its full stop in the accent and its facts shown under it, while the next waits in pencil, cropped by the frame. shelf: the slides stand as spines with a hairline between them, each name running up its spine; the one you take out widens and turns to face you, and the name is cropped by the next spine. Click a spine to take it out." },
    { name: "CarouselItem", type: "div", description: "A slide. Direct children of Carousel only: each is labelled \"n of m\" and announced as a slide." },
    { name: "trackLabel", type: "string", default: '"Slides"', description: "The track takes focus so the arrow keys (and Home and End) can move it, so it needs a name. Say what the slides are." },
    { name: "previousLabel / nextLabel", type: "string", default: '"Previous" / "Next"', description: "Names for the arrow buttons. They disable at the ends." },
    { name: "CarouselTitle", type: "p", description: "A name set so large the slide's edge crops it." },
  ],
})
