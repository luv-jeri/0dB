"use client"

import { State } from "@/components/site/state"
import { Questionnaire, type Answers, type Question } from "@/registry/0db/ui/questionnaire"

const says: Record<string, Record<string, string>> = {
  make: { "An identity": "an identity", "A website": "a website", "A film": "a film" },
  team: { "Just me": "on your own", "Two to ten": "with a team of two to ten", "More than ten": "with a team of more than ten" },
  when: { "This season": "this season", "Next season": "next season", "When it’s right": "when it’s right" },
}

const questions: Question[] = [
  { id: "make", question: "What are you making?", options: Object.keys(says.make) },
  { id: "team", question: "How big is your team?", options: Object.keys(says.team) },
  { id: "when", question: "When should it launch?", options: Object.keys(says.when) },
  { id: "more", question: "Anything else we should know?", placeholder: "A sentence is plenty" },
]

const sentence = ({ make, team, when, more }: Answers) =>
  [
    `You’re making ${make ? says.make[make] : "something"}${team ? ` ${says.team[team]}` : ""}${when ? `, to launch ${says.when[when]}` : ""}.`,
    more ? `You added “${more.trim()}”.` : "",
    "We’ll reply within two days.",
  ]
    .filter(Boolean)
    .join(" ")

// The definition's sense, and its usage in quotation marks, as a dictionary gives one.
const sense = ({ team, when, more }: Answers) =>
  [`the one you’re making${team ? ` ${says.team[team]}` : ""}${when ? `, to launch ${says.when[when]}` : ""}.`, more ? `“${more.trim()}”` : ""]
    .filter(Boolean)
    .join(" ")

const entry = ({ make }: Answers) => (make ? { word: says.make[make].replace(/^an? /, ""), kind: "noun" } : { word: "something", kind: "pronoun" })

const partway: Answers = { make: "A website", team: "Two to ten" }
const all: Answers = { ...partway, when: "Next season" }

function Caption({ children }: { children: string }) {
  return <p className="db-label" style={{ margin: 0 }}>{children}</p>
}

export default function Example() {
  return (
    <div className="grid max-w-[44rem]" style={{ gap: "var(--db-space-9)" }}>
      <div className="grid gap-(--db-space-5)">
        <Caption>Sentence</Caption>
        <Questionnaire questions={questions} sentence={sentence} />
      </div>
      <div className="grid gap-(--db-space-5)">
        <Caption>Interview</Caption>
        <Questionnaire variant="interview" questions={questions} sentence={sentence} />
      </div>
      <div className="grid gap-(--db-space-5)">
        <Caption>Definition</Caption>
        <Questionnaire variant="definition" questions={questions} sentence={sense} entry={entry} />
      </div>
    </div>
  )
}

const wide = { width: "30rem", maxWidth: "100%" }

export function States() {
  return (
    <>
      <State label="Sentence, the end">
        <div style={wide}><Questionnaire questions={questions} sentence={sentence} defaultAnswers={all} defaultStep={4} /></div>
      </State>
      <State label="Interview, two asked">
        <div style={wide}><Questionnaire variant="interview" questions={questions} sentence={sentence} defaultAnswers={partway} defaultStep={2} /></div>
      </State>
      <State label="Interview, one skipped, the last pointed at">
        <div style={wide}><Questionnaire variant="interview" questions={questions} sentence={sentence} defaultAnswers={{ team: "Just me" }} defaultStep={2} data-force="hover" /></div>
      </State>
      <State label="Definition, the end">
        <div style={wide}><Questionnaire variant="definition" questions={questions} sentence={sense} entry={entry} defaultAnswers={all} defaultStep={4} /></div>
      </State>
      <State label="Definition, right to left">
        <div style={wide} dir="rtl">
          <Questionnaire
            variant="definition"
            questions={[{ id: "make", question: "ماذا تصنع؟", options: ["موقع"] }]}
            sentence={() => "الذي تصنعه مع فريق صغير، ليُطلق في الموسم القادم."}
            entry={() => ({ word: "موقع", kind: "اسم" })}
            defaultAnswers={{ make: "موقع" }}
            defaultStep={1}
          />
        </div>
      </State>
    </>
  )
}
