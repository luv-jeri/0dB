import { defineComponent } from "./types"

export default defineComponent({
  name: "agent-state",
  title: "Agent state",
  movement: "XI",
  contract: "ot-agent",
  summary: "Where an agent is, in one quiet line: a ring, a breath, a round, the accent disc or an ink disc, and the word for it.",
  underneath: "native",
  props: [
    {
      name: "state",
      type: '"ready" | "thinking" | "working" | "input" | "done"',
      description:
        "Where the agent is, which the caller drives from the agent's real state. ready: a hairline ring, graphite. thinking: the ring breathes (the breath spinner). working: three voices go round it (the round spinner). input: the one accent disc, the word in ink: it's your turn. done: the disc filled in ink, the word stepped back to pencil. Only thinking and working move. It is a polite status, so each change is heard once.",
    },
    { name: "variant", type: '"dot" | "word"', default: '"dot"', description: "dot: the mark before the word, after the calendar's discs (to come a ring, now the accent, gone ink). word: no mark; the word carries the state, inked letter by letter while busy (the word spinner) and set in the accent when it's your turn." },
    { name: "children", type: "string", description: 'Other words for the state ("Reading the brief"). Left out, each state says its own: Ready, Thinking, Working, Needs your input, Done.' },
    { name: "agentStateWords", type: "Record<AgentStateValue, string>", description: "The default words, exported so an agent chat can say the same thing elsewhere." },
  ],
})
