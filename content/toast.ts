import { defineComponent } from "./types"

export default defineComponent({
  name: "toast",
  title: "Toast",
  movement: "VII",
  contract: "db-toast",
  summary: "One line rises from the bottom-left; a fermata arc beneath it empties while it stays.",
  underneath: "hook",
  uses: ["button"],
  props: [
    { name: "toast(message, opts?)", type: "(message: ReactNode, opts?: { action?: { label: string; onClick: () => void }; duration?: number }) => string", description: "Say one thing. Returns the toast's id. At most three stay on screen; an action keeps its name (Undo)." },
    { name: "opts.action", type: "{ label: string; onClick: () => void }", description: "One bracket button. Choosing it runs onClick and sends the toast away." },
    { name: "opts.duration", type: "number", default: "5000", description: "How long it stays, in milliseconds. Pointing at the toast, or focusing inside it, holds the pause." },
    { name: "dismiss(id?)", type: "(id?: string) => void", description: "Send one toast away, or every toast when no id is given." },
    { name: "<Toaster />", type: "component", description: "Render once, near the root. It is a polite live region, so each toast is announced when it arrives." },
  ],
})
