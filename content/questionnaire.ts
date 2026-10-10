import { defineComponent } from "./types"

export default defineComponent({
  name: "questionnaire",
  title: "Questionnaire",
  movement: "XI",
  contract: "ot-quest",
  summary:
    "Questions one at a time, set large. The count rolls and a hairline fills; each question turns in from the side you're heading. At the end your answers are written into one sentence, in italic, arriving word by word.",
  underneath: "native",
  props: [
    { name: "variant", type: '"sentence" | "interview" | "definition"', default: '"sentence"', description: "interview: every question asked stays above the next, small, with your answer under it, like a printed interview's Q and A; press an answer to go back to it. definition: the end is a dictionary entry, your headword in italic reversed out of an ink block, then the sentence as its sense." },
    { name: "questions", type: "{ id: string; question: ReactNode; options?: string[]; label?: string; placeholder?: string }[]", description: "In order. With options, the question is a Radio Group and needs a choice to go on. Without, it's an optional free-text line." },
    { name: "sentence", type: "(answers: Record<string, string | undefined>) => string", description: "Writes the answers into one sentence. Only questions that were answered are in answers." },
    { name: "onComplete", type: "(answers) => void", description: "Called once when the last question is sent, with the answers." },
    { name: "submitLabel", type: "string", default: "\"Send answers\"", description: "The last question's action." },
    { name: "entry", type: "(answers) => { word: string; kind: string }", description: "Definition only: the headword and its part of speech." },
    { name: "defaultAnswers", type: "Record<string, string | undefined>", description: "Answers to start from, to resume a questionnaire." },
    { name: "defaultStep", type: "number", default: "0", description: "The question to start at; the number of questions is the end." },
    { name: "error", type: "string", default: "\"Choose one to go on, or skip this question.\"", description: "Said when a choice is needed to go on." },
  ],
})
