import { defineComponent } from "./types"

export default defineComponent({
  name: "form",
  title: "Form",
  movement: "VI",
  contract: "db-form",
  summary: "Fields on the grid and one statement button. A failed send gives each field its callout and focuses the first; while sending, the button says so.",
  underneath: "hook",
  props: [
    { name: "onSubmit", type: "(data: FormData) => Promise<void> | void", description: "Runs once every control is valid. The submit button stays busy until the promise settles, and a second send is ignored meanwhile." },
    { name: "data-error", type: "string (on a control)", description: "Says what to fix in your own words. Without it, the browser's own validation message is used." },
    { name: "FormSubmit busy", type: "string", description: "What the button says while sending, keeping the action's name: Send becomes Sending. Without it the label stays and the periods breathe." },
  ],
})
