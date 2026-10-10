# 0dB: sign

Extracted from DESIGN.md.

### db-sign (sign)
- Underneath: hook. Pretext measures the word, kerning included, and the sign is laid out from those widths.
- Anatomy: `<span class="db-sign" data-variant="dots | words | fill" role="img" aria-label="word"><span class="db-sign-glyph">…</span>…</span>`: one element per letter or leader, placed by `--x`, `--y`, `--r` and `--k`, since each one travels on its own when the word is said. An empty label hides it (`aria-hidden="true"`), for a control that already says the word.
- An icon made of its own word, after the ampersand (the word "et" worn down into a mark) and Apollinaire's calligrams. Each sign is published three times, one registry item per variant (`sign-<name>-dots`, `-words`, `-fill`), all built on this primitive. The drawings come from Lucide (ISC) converted to strokes a word can read along, or are drawn for 0dB; a sign that can't be read in all three variants is left out rather than shipped.
- Variants:
  - `dots`: each stroke ruled in middle-dot leaders, at every size; the leaders grow more slowly than the sign, so a large one is drawn finer. The letters wait unseen at the dots and rise out of them when said.
  - `words`: from 40px up the word is set once, whole, where it reads best: along the drawing's longest straight run (an arrow's word runs toward its head; a ring's word sits on its arc), never upside down, never kinking more than 20° between letters, tracked no wider than 0.08em and never split across strokes. Every other stroke is ruled in pencil leaders, so the drawing stays quiet and the word is the one thing in ink. Where no stroke holds the word at a size a person reads (a chevron's two short arms, a star, a user), the drawing is drawn a little smaller and the word stands straight beneath it, as a legend under a picture. Stroke words are at least 10px, legends at least 9px. Below 40px no letter can hold a stroke: the sign is drawn as `dots`, and the docs size control says so.
  - `fill`: the word set in rows that fill the drawing's silhouette, running on from one row to the next as a paragraph runs round a picture; each run is spread to its ends so the edge of the type is the outline.
- Laid out on the server from a table of advances, so the first paint already shows the sign; Pretext then sets it again with the face's real kerning. The smaller the sign, the heavier its letters (800 at 16px to 500 at 128px), as a punchcutter cuts optical sizes.
- Yours: `face="italic"` (`data-face="italic"`) sets it in the expression: a sign for something that belongs to the person (their mail, their home).
- Said: pointing at the sign, or at the control it sits in, or focusing that control makes the drawing say its word. The letters leave the drawing in reading order, one arpeggio apart, and stand up as the plain word across the middle, no wider than half again the sign (a caption's 11px floor aside); the rest sketch out in pencil and go quiet. Leaving winds them back, last letter first.
- Right to left: a sign that points the way the reader goes (`mirror` in its shape: arrows, chevrons, send, undo) turns round, its strokes still read forwards.
- States: rest, hover, focus. Reduced motion: the word and the drawing change places without travel. Forced colours use CanvasText.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Sign (`sign`) | Said | The letters leave the drawing in reading order, one arpeggio apart, and stand up as the plain word; echoes sketch out in pencil |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Sign (`sign`) | The ampersand ("et" worn down into a mark); Apollinaire, *Calligrammes*, 1918 | An icon made of its own word; pointing says the word |
