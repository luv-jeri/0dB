/** The five rules, as the home page sets them: the sentence on the stave, the note in the margin. */
export const principles: { text: React.ReactNode; note: React.ReactNode }[] = [
  { text: "Silence is structure.", note: "Space does the layout. A hairline appears only where space alone can't hold two things apart." },
  { text: "Type is the only ornament.", note: "Weight, width, size, tracking and order carry every level of hierarchy. There are no icons, fills or shadows to fall back on." },
  {
    text: <>Ours in roman, <span className="ot-yours">yours in italic.</span></>,
    note: <>The interface speaks upright, in the voice. Whatever you choose or type answers in the expression italic, the way a score sets <i className="ot-term" lang="it">dolce</i> apart from its notes.</>,
  },
  {
    text: <>One note of colour<span className="stop"><span className="ot-sr">.</span></span></>,
    note: "A single accent marks where you are: the current page, the chosen option, the focused field. The rest is ink and paper.",
  },
  { text: "Nothing moves unless you do.", note: "Motion answers a hand and then rests. Pointing sketches in pencil; choosing inks it in. The overture at the top is the one thing that plays by itself, once." },
]
