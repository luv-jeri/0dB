# 0nlyType: waterfall

Extracted from DESIGN.md.

### db-waterfall (waterfall)
- Underneath: native, plus a hook that lays the lines out with pretext.
- Anatomy: `<div class="db-waterfall">` holding the text for readers once (`.db-sr`) and, per dynamic, an aria-hidden `.db-waterfall-row`: `.db-waterfall-mark` (the dynamic, in the expression italic, pencil), `.db-waterfall-text` (the line) and `.db-waterfall-px` (its size).
- A type specimen waterfall: the same words at every dynamic from `from` (ffff) to `to` (pp), loudest first. Each line takes as many whole words as the measure holds at its size (pretext counts them) and never wraps or ellipsises (`white-space: nowrap; overflow-x: clip` is only a safety). Its tracking then opens by up to a twentieth of an em to reach the edge, unless the line already holds all the words. A first word wider than the line sets that line smaller instead of breaking; a quieter line is never set louder than the one above it.
- Pointing at a line shows its size in pixels in pencil at its end; on a narrow container the size takes the mark's place. `italic` sets the specimen in the expression face. It lays out again when its width changes or `<html>` changes face; before that each line is the plain text, clipped.
- `variant` (`data-variant`; none for the default, `specimen`): `decay` or `solo`.
- decay: a note after its attack. The sentence is read once instead of repeated: each line takes up where the one above stopped, a dynamic quieter, filled and tracked to the measure the same way; the quietest line says the rest and wraps as a paragraph does. A line with nothing left to say is hidden. It is still: the fall is in the sizes, not in time.
- solo: the mixing desk's solo button. Pointing at a line keeps it in ink and sends every other line back to a rule (`--db-rule-strong`), its dynamic's mark inked and its size shown, so you hear one size alone; the colour eases (`--db-andante`). Leaving brings every line back. A pointer aid only: the rows are aria-hidden and the text is read once.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Solo waterfall (`waterfall`) | Mute | The lines you are not pointing at ease back to a rule |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Waterfall (`waterfall`) | The foundry's specimen waterfall; the score's dynamics | One sentence at every dynamic, each line filled to the measure |
| Decay waterfall (`waterfall`) | A note's decay after its attack; "It has to be design." scale contrast | The sentence read once, falling a dynamic every line |
| Solo waterfall (`waterfall`) | The mixing desk's solo button | Point at one size and the others fall back to a rule |
