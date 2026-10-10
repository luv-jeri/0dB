# 0nlyType: toggle

Extracted from DESIGN.md.

### db-toggle (toggle)
- Underneath: Radix Toggle.
- Anatomy: `<button class="db-toggle" data-variant="fermata | tenuto | aside | guides" type="button" aria-pressed="false">` holding `<span class="db-toggle-label" data-text="Word"><span>Word</span></span>` (aside adds an `aria-hidden` `<small class="db-toggle-note">` after the word). The label shares its grid cell with an italic copy of itself (`::after`, from `data-text`, hidden from screen readers), so the button is always as wide as its wider state and nothing beside it moves. A label that holds elements has no copy and turns italic in place.
- Held, the word is yours, so it turns italic. The marks are the button's own `::before` and `::after`, drawn from two registered numbers (`--db-toggle-draw` for the pencil sketch, `--db-toggle-ink` for the tenuto's pen), so the whole move is a transition. Every stroke passes through: it draws from the start and leaves toward the end, mirrored right to left.
- One box: both variants keep room for the arc above (0.8em) and the line below (`--y`, 0.3em), so a fermata and a tenuto side by side stand on one baseline, and the word stands at the start of its box, in line with its label.
- fermata (default): the sign for a note held longer than written. Pointing sketches the arc over the word in pencil from its start foot. Held, the arc inks at stroke width, the dot lands under it with spiccato, and the word leans into the italic: the roman shears forward as it fades, and the italic arrives upright and settles into its slant. Pressed, the sign comes down toward the word.
- The roman and its italic copy start at one edge but aren't one width, so script reads both (`--db-toggle-r`, `--db-toggle-i`) and fermata, aside and guides centre or end their marks on the face you see (`--w`); a mark centred on the button sat a few px off the word. Fonts arriving and resizes put the marks straight there (`data-still`); only a press moves them.
- tenuto: the line under a note held its full value. Pointing sketches it under the word in pencil. Held, a pen (a dot, seen only while it moves) runs along the line from the start, inking it, and behind the pen the word is rewritten in the italic. Released, the pen passes again: the ink leaves ahead of it and the roman comes back behind it. The line, the pen and both masks read one number, so they never part.
- aside: after "It has to be design.", whose tiny notes hang on hairline arrows beside the words. Pointing sketches a hairline beside the word in pencil. Held, it inks, an arrowhead lands on its end against the word, and a small note in our voice (`note`, "on" by default) is written at its tail on the word's baseline. The note and arrow take no room, so nothing beside the word moves; the arrow points back at the word, mirrored right to left.
- guides: after Paul Rand's "design", whose letters stand on a dotted construction grid. Pointing sketches the word's baseline in dots from the start. Held, the x-height line is drawn in dots from the end, the two pass through each other across the word, and it leans into the italic between them: the word shown standing on the lines it is set on.
- States: rest, hover (the pencil sketch), focus (the accent outline), held, disabled (pencil at 55%; nothing sketches), each for all four variants. Forced colours: the marks use `ButtonText`, the pencil sketch, the dots and the aside's arrow at rest `GrayText`.
- Keyboard: native button; Space and Enter hold and release. The aside's note is `aria-hidden`: aria-pressed already says the word is held.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Toggle (`toggle`) | Pencil, then ink | The arc sketches from its start foot on hover; held, it inks, the dot lands and the word leans into the italic |
| Tenuto toggle (`toggle`) | Written | The line sketches on hover; held, a pen inks it and rewrites the word in the italic behind it, and releasing writes it back |
| Aside toggle (`toggle`) | Pencil, then ink | The hairline sketches beside the word; held, it inks, the head lands against the word and the note is written in at its tail |
| Guides toggle (`toggle`) | Pass-through | The baseline sketches in dots from the start; held, the x-height line draws from the end, they pass through the word and it leans into the italic |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Toggle (`toggle`) | The fermata sign; the score's tenuto | Held, the word turns italic under the arc and dot, or behind a pen along the line |
| Aside toggle (`toggle`) | "It has to be design." | A tiny note hung beside the held word on a hairline arrow |
| Guides toggle (`toggle`) | Paul Rand, "design" | The held word shown on its dotted baseline and x-height |
