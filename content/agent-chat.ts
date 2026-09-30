import { defineComponent } from "./types"

export default defineComponent({
  name: "agent-chat",
  title: "Agent chat",
  movement: "XI",
  contract: "db-agent-chat",
  summary: "Talk to an agent. Its words are roman and yours arrive in italic; it asks before it acts, in a question you must answer, and it tells you what it is doing as a sentence that inks in.",
  underneath: "native",
  props: [
    { name: "AgentChat variant", type: '"default" | "callout"', default: '"default"', description: "default: the agent's work and your receipts run in the conversation as quiet lines, after \"It has to be design.\" callout: after Weingart's letter, they leave the column and hang at the far side, reversed out of pills, each on a leader line that ends in a dot." },
    { name: "AgentChatHeader", type: "{ title: ReactNode; state: AgentStateValue; status?: string }", description: "The agent's name, and where it is, as an AgentState: ready, thinking, working, input (your turn, the one accent) or done. status gives other words for it: \"Reading the brief\"." },
    { name: "AgentChatThread", type: "ThreadProps", description: "The conversation: a Thread that takes the room the header and composer leave. Messages, notes, the work, a permission and a choice are its direct children; keep a MessageTyping mounted last and drive writing, and when the reply comes set writing false and add the Message with arriving before it." },
    { name: "AgentChatComposer", type: "{ label: string; onSend(value): void; value?; defaultValue?; onValueChange?; busy?; onStop?; attachments?; onAttach?(files: File[]); onRemoveAttachment?(id); accept?; error?; maxLength?; placeholder?; disabled?; sendLabel?; stopLabel?; attachLabel?; sendsLabel?; dropLabel?(count) }", description: "Where you write: a ruled box your words arrive on in italic. Enter starts a new line; ⌘ Enter (Ctrl Enter) sends. Files, chosen with Attach or dropped on it, are enclosed under it as a letter's \"Encl. (2)\", which counts dragged files in before you let go. While busy, Send gives way to Stop and the box stays open. error hangs from the box as a callout. The words are yours to translate: sendLabel (\"Send\"), stopLabel (\"Stop\"), attachLabel (\"Attach\"), sendsLabel (the word after the keys, \"sends\") and dropLabel (what the enclosure line says while files are over it, \"Let go to enclose all 2.\")." },
    { name: "AgentChatPermission", type: '{ title: string; decision: "pending" | "allowed" | "denied"; onDecision(d): void; description?; scope?; allowLabel?; denyLabel?; allowedLabel?; deniedLabel?; metaLabel?; pendingLabel? }', description: "The agent asks before it acts. Pending, it is an alert dialog: the question heavy and narrow, the answers large in italic. Deny has the focus and Escape denies, so nothing is allowed by default. Answered, a receipt stays in the thread: \"Read last season's timetable? Allowed once.\" Every word can be given: allowLabel (\"Allow once\"), denyLabel (\"Deny\"), allowedLabel (\"Allowed once\"), deniedLabel (\"Denied\"), metaLabel (\"Permission\", over the question) and pendingLabel (\"Waiting for your answer.\")." },
    { name: "AgentChatChoice", type: "{ question: ReactNode; options: { value; label }[]; onConfirm(value): void; value?; defaultValue?; onValueChange?; confirmLabel?; answer? }", description: "The agent needs you to pick one: the words are native radios, Continue answers. Given answer, the choice closes and keeps your word in italic." },
    { name: "AgentChatWork", type: 'Omit<ProgressProps, "variant">', description: "What the agent is doing, as a Progress sentence that inks in as it goes and ends in a full stop." },
    { name: "AgentChatNote", type: "MarkerProps", description: "A quiet line from the agent's side: \"Read timetable-2025.pdf, 14 pages.\"" },
  ],
})
