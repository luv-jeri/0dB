import { defineComponent } from "./types"

export default defineComponent({
  name: "questionnaire",
  title: "Questionnaire",
  movement: "XI",
  contract: "db-quest",
  summary:
    "Questions one at a time, set large. The count rolls and a hairline fills; each question turns in from the side you're heading. At the end your answers are written into one sentence, in italic, arriving word by word.",
  underneath: "native",
  props: [
    { name: "questions", type: "{ id: string; question: ReactNode; options?: string[]; label?: string; placeholder?: string }[]", description: "In order. With options, the question is a Radio Group and needs a choice to go on. Without, it's an optional free-text line." },
    { name: "sentence", type: "(answers: Record<string, string | undefined>) => string", description: "Writes the answers into one sentence. Only questions that were answered are in answers." },
    { name: "onComplete", type: "(answers) => void", description: "Called once when the last question is sent, with the answers." },
    { name: "submitLabel", type: "string", default: "\"Send answers\"", description: "The last question's action." },
    { name: "error", type: "string", default: "\"Choose one to go on, or skip this question.\"", description: "Said when a choice is needed to go on." },
  ],
})
