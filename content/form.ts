import { defineComponent } from "./types"

export default defineComponent({
  name: "form",
  title: "Form",
  movement: "VI",
  contract: "db-form",
  summary: "Fields on the grid and one statement button. A failed send gives each field its callout and focuses the first; while sending, the button says so. Or write it as a letter with a postscript, or have it postmarked when it's sent.",
  underneath: "hook",
  props: [
    { name: "variant", type: '"grid" | "letter" | "postmark"', default: '"grid"', description: "grid: fields on the grid, each error hung from its own line. letter: write the form as a letter, with each Field a blank in the prose (use divs for its paragraphs: a Field is a div). The prose names the blanks, so their labels, hints and callouts are kept for screen readers; a failed send writes one postscript below the letter, each sentence taking you to its blank. postmark: once it's sent, a postmark with the day and the time comes down askew on the form's corner and is read out; changing anything lifts it." },
    { name: "onSubmit", type: "(data: FormData) => Promise<void> | void", description: "Runs once every control is valid. The submit button stays busy until the promise settles, and a second send is ignored meanwhile." },
    { name: "data-error", type: "string (on a control)", description: "Says what to fix in your own words. Without it, the browser's own validation message is used." },
    { name: "FormSubmit busy", type: "string", description: "What the button says while sending, keeping the action's name: Send becomes Sending. Without it the label stays and the periods breathe." },
    { name: "FormSubmit sent", type: "string", description: "What it says once sent, until something changes: Send becomes Sent. Without it the label stays." },
    { name: "FormPostscript, FormPostmark", type: "parts", description: "The letter's postscript and the postmark. The Form renders them itself; they're exported to pin a state in documentation." },
  ],
})
