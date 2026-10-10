# 0nlyType: agent-state

Extracted from DESIGN.md.

### db-agent (agent-state)
- Underneath: native, composed from `marker` (its status line) and `spinner`.
- Anatomy: `<p class="db-marker db-agent" data-state="ready | thinking | working | input | done" data-variant="word" role="status" aria-live="polite">` holding `.db-agent-mark` (aria-hidden) and `.db-agent-word`. `aria-busy` while thinking or working. `data-turned` once the state has changed.
- Where an agent is, as the words say it: Ready, Thinking, Working, Needs your input, Done (`agentStateWords`; `children` gives other words, "Reading the brief"). The mark lives the life of a day on the "28 December" calendar: ready is a hairline ring (to come), thinking is the ring breathing (the breath spinner), working is three voices going round it (the round spinner), input is the one accent disc (now: it's your turn), done is the disc filled in ink (gone by) with the word stepped back to pencil. The word is graphite at rest and ink while the agent is busy or waiting on you.
- It moves only while `state` is thinking or working, which the caller drives from the agent's real state, so it is not motion that plays by itself; the loops are the spinner's, slow and eased. When the state changes the new ring or disc lands with spiccato (never on first paint).
- word (`variant="word"`): no mark. The word carries the state: inked letter by letter while busy (the word spinner, its copy for readers in a `.db-sr`), set in the accent when it's your turn, pencil when done.
- A polite status, so each change is heard once. Reduced motion: the spinners' own still frames. Right to left the mark leads from the right. Forced colours: the ring and the ink disc in CanvasText, the accent in Highlight.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Agent state (`agent-state`) | Breath, then canon | Only while thinking (the ring breathes) or working (three voices round it); a new ring or disc lands with spiccato |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Agent state (`agent-state`) | "28 December" discs; the busy button's present-tense word | A ring to come, the accent disc for your turn, an ink disc when done; the ring breathes or goes round while it works |
| Word agent state (`agent-state`) | The word spinner | No mark: the word is inked letter by letter while busy, and takes the accent when it's your turn |
