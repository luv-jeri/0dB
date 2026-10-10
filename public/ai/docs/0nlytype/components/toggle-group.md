# 0nlyType: toggle-group

Extracted from DESIGN.md.

### ot-toggles (toggle-group)
- Underneath: Radix ToggleGroup: `type="multiple"` is a toolbar of `aria-pressed` buttons, `type="single"` a radio group. Needs no other item's classes.
- Anatomy: `<div class="ot-toggles" data-variant="slur | bracket | fingering | margin" aria-label="Name">` of `<button class="ot-toggles-item" data-value="…">`, each word in a `ot-toggles-word` cell that also holds its italic copy (from `data-text`), so a word is always as wide as its wider state and nothing beside it moves when it turns. Last, an `aria-hidden` `ot-toggles-marks` layer where script draws one `ot-toggles-mark` per run of held neighbours from `--l`, `--r`, `--t`, `--h`.
- Held, a word is yours: the roman sinks away as the italic rises into its place. Its mark stretches over the held words beside it; when two runs join, one mark stretches and the other fades where it stands. Held one at a time, the mark glides to the new word, leading edge first.
- Marks are measured from the face you see: the held italic, or the roman at rest (which carries its own pencil sketch), never the shared cell, so a slur, a pair or a number sits even on the word.
- slur (default): hairlines stand between the words, and the held run is tied under one engraved slur (a border on a half-ellipse, so it swells in the middle and tapers to points; it bows deeper the further it reaches). The hairline between two held words lies down under the slur, and none stands at the start of a wrapped line. Pointing sketches a pencil slur from the middle out.
- bracket: no hairlines; the held run is set in italic parentheses, after 20(25), and neighbours share one pair. Pointing sketches a pencil pair standing a little apart; holding closes the ink pair in. The room for the parentheses hangs into the margin, so words at rest line up with the label.
- fingering: after the score's fingering, the small numbers over the notes that say which finger plays each, and the "01" of "Less is more.". No hairlines. Each held word carries a small italic numeral over its middle: the order you held them in (`--n`, the value's order). Pointing at a free word pencils the number it would get (`--next`); holding inks it and it lands with spiccato; letting one go counts the later ones down. Meant for `type="multiple"`.
- margin: after the book's side head, set in the margin beside the column it heads. The words stand in a column, flush against one hairline, with an empty margin as wide as the column on its other side (two equal tracks). Held, a word crosses the hairline into the margin and turns italic, flush against the hairline's other side, so what you hold reads down the margin and the rest down the column. Pointing leans the word toward the hairline. Mirrored right to left.
- The focus ring rings the button, so it holds the word with its mark, and closes in from 12px with spiccato. The first word of each line starts at its cell's start edge; the rest are centred in theirs.
- States: rest, hover (pencil mark), focus, held, held together, disabled (the mark in pencil); fingering pointed at, held in turn and disabled; margin pointed at, held and focus.
- Keyboard: Tab into the group, arrows rove (all four arrows, so the margin's column reads with Up and Down) (following the direction), Home and End, Space or Enter holds. Left without `dir`, the group takes the page's direction.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Fingering group (`toggle-group`) | Spiccato | The number lands on the held word; pointing pencils the next one; letting one go counts the later ones down |
| Margin group (`toggle-group`) | Crossing | The held word crosses the hairline into the margin as it turns italic; pointing leans it toward the line |
| Toggle group (`toggle-group`) | Legato | The slur or the pair stretches over a held neighbour and glides to a new choice, leading edge first; the word turns italic as it rises |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Toggle group (`toggle-group`) | The score's slur; 20(25) | Held neighbours are tied under one slur, or share one pair of parentheses |
| Fingering group (`toggle-group`) | The score's fingering; "Less is more." 01 | Each held word numbered in the order you held it |
| Margin group (`toggle-group`) | The book's side head | A held word crosses the hairline into the margin |
