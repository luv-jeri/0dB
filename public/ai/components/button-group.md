# 0dB: button-group

Extracted from DESIGN.md.

### db-btn-group (button-group)
- Underneath: native.
- Anatomy: `<div class="db-btn-group" role="group" data-variant="parentheses | column | sentence" aria-label="Name">` of `db-btn` buttons (no variant). The sentence is a `<span>`, since it sits inside a paragraph, and writes `.db-btn-group-sep` (`aria-hidden`) between its buttons.
- Parentheses: one pair holds the set, after 20(25), and hairlines stand between the actions. Pointing draws a line under one; it passes through.
- Column: after "Less is more." and Healthy habits, the actions stacked as a narrow ragged column at tight leading, with no rules between. Pointing hangs the poster's short heavy dash in the margin beside the action; it grows out from the word and goes back into it, and a press lengthens it. It hangs into the inline-start margin, mirrored right to left.
- Sentence: the actions written into running text as a list, the way prose names choices: "copy the link, email it, or export a PDF". The group takes the text's size; each action is ink on a pencil hairline, and pointing passes an ink line through it. `conjunction` sets the last word between ("or" by default).
- Keyboard: Tab between buttons.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Button group (`button-group`) | Pass-through | The line under an action leaves the way it was heading |
| Column group (`button-group`) | Hang | The dash grows out of the word into the margin and goes back into it |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Button group (`button-group`) | 20(25) | Parentheses hold the set; hairlines stand between |
| Column group (`button-group`) | "Less is more." corner column; Healthy habits | A ragged column; a heavy dash hung in the margin |
| Sentence group (`button-group`) | Healthy habits → (one line of thought); the written list | The actions written into the sentence |
