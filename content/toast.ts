import { defineComponent } from "./types"

export default defineComponent({
  name: "toast",
  title: "Toast",
  movement: "VII",
  contract: "ot-toast",
  summary: "One line rises from the bottom-left; a fermata held over its last word empties while it stays.",
  underneath: "hook",
  uses: ["button"],
  props: [
    { name: "toast(message, opts?)", type: "(message: ReactNode, opts?: { action?: { label: string; onClick: () => void }; duration?: number }) => string", description: "Say one thing. Returns the toast's id. At most three stay on screen; an action keeps its name (Undo)." },
    { name: "opts.action", type: "{ label: string; onClick: () => void }", description: "One bracket button. Choosing it runs onClick and sends the toast away." },
    { name: "opts.duration", type: "number", default: "5000", description: "How long it stays, in milliseconds. Pointing at the toast, or focusing inside it, holds the pause." },
    { name: "dismiss(id?)", type: "(id?: string) => void", description: "Send one toast away, or every toast when no id is given." },
    { name: "<Toaster />", type: "component", description: "Render once, near the root. It is a polite live region, so each toast is announced when it arrives. If more than one is mounted, the latest one shows the toasts and the rest stay quiet." },
    { name: "<Toaster variant>", type: '"fermata" | "footnote" | "dateline"', default: '"fermata"', description: "fermata: each toast is framed, and a fermata hangs over its last word; the arc empties while it stays. footnote: the notes sit at the foot of the page under a short rule, numbered as they come, the number hung in the margin, the newest in the accent; an empty page starts again at 1. dateline: the sentence and the time it happened on one hairline, which runs out toward the time. In all three, pointing at a toast or focusing inside it holds its stay." },
    { name: "<Toast />", type: "component", description: "One toast, as the Toaster draws it. Render it yourself only to show one still, inside a .ot-toaster, as the docs do." },
  ],
})
