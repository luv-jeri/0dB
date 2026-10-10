# 0nlyType: switch

Extracted from DESIGN.md.

### ot-switch (switch)
- Underneath: native checkbox with `role="switch"`.
- Anatomy: `<label class="ot-switch" data-variant="sentence | either | question"><input type="checkbox" role="switch" aria-label="Name"> Sentence is …</label>`. Sentence ends `<span class="ot-switch-state" aria-hidden="true"><span>on</span><span>off</span></span><span class="ot-switch-stop" aria-hidden="true"></span>`; either ends `<span class="ot-switch-either" aria-hidden="true"><span>on</span><span class="ot-switch-or">/</span><span>off</span></span>`; question ends `<span class="ot-switch-ask" aria-hidden="true"><span>.</span><span>?</span></span>`.
- Sentence (the default). Yours: the state word, in italic, rolls vertically between on and off. Off is pencil. The full stop is the state too: `.ot-switch-stop` is a filled dot when on and a hairline ring when off (the calendar's done and to-come). Ink fills it from the rim inward, and drains back out (an inset `box-shadow` over `--ot-andante`; kept under forced colours).
- Either. A printed form's "delete as appropriate": both words stand in the italic, "on / off", and the one that doesn't apply is struck out in graphite and steps back to pencil. Pointing pencils a hairline through the one that holds, since that's the one you'd strike. Switching lifts the old strike off to the right and draws the new one from the left.
- Question. After "It has to be design.", where "the concept of passion?" is answered by "the voice of reason.": off, the sentence asks, in graphite, ending on an italic question mark in pencil. On, the hook is wiped away from the top down to its dot, which stays as the full stop, and the sentence inks. Switching off, the hook grows back up out of the dot. The full stop shares the question mark's grid cell, so the line never moves. Pass the sentence without its last mark.
- States: on, off, hover (sentence: the underline darkens; either: the pencil sketch; question: the mark inks), focus (accent outline round the state; round the whole sentence for question), disabled. Right to left, either's strikes run right to left.
- Keyboard: Space toggles.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Switch (`switch`) | Legato | The word rolls; ink fills the full stop from its rim |
| Either switch (`switch`) | Pass-through | The strike lifts off one word to the right and draws through the other from the left |
| Question switch (`switch`) | Answer | The hook wipes down to its dot, which stays as the full stop; the sentence inks |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Switch (`switch`) | "28 December" dots | The full stop is a dot or a ring |
| Either switch (`switch`) | A printed form's "delete as appropriate" | Both words stand; the one that doesn't apply is struck out |
| Question switch (`switch`) | "It has to be design." (passion? / reason.) | The question mark's hook lifts and leaves a full stop |
