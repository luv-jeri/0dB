"use client"

import { Questionnaire } from "@/registry/0db/ui/questionnaire"

const says: Record<string, Record<string, string>> = {
  make: { "An identity": "an identity", "A website": "a website", "A film": "a film" },
  team: { "Just me": "on your own", "Two to ten": "with a team of two to ten", "More than ten": "with a team of more than ten" },
  when: { "This season": "this season", "Next season": "next season", "When it's right": "when it's right" },
}

export default function Example() {
  return (
    <Questionnaire
      className="max-w-[44rem]"
      questions={[
        { id: "make", question: "What are you making?", options: Object.keys(says.make) },
        { id: "team", question: "How big is your team?", options: Object.keys(says.team) },
        { id: "when", question: "When should it launch?", options: Object.keys(says.when) },
        { id: "more", question: "Anything else we should know?", placeholder: "A sentence is plenty" },
      ]}
      sentence={({ make, team, when, more }) =>
        [
          `You're making ${make ? says.make[make] : "something"}${team ? ` ${says.team[team]}` : ""}${when ? `, to launch ${says.when[when]}` : ""}.`,
          more ? `You added “${more.trim()}”.` : "",
          "We'll reply within two days.",
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
