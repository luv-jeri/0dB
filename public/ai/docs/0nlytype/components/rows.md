# 0nlyType: rows

Extracted from DESIGN.md.

### ot-rows (rows)
- Underneath: native list.
- Anatomy: `<ul class="ot-rows" data-variant="ditto | trail">` with `<li><a class="ot-rows-link">`, holding `.ot-rows-title`, `.ot-rows-kind`, `.ot-rows-meta`, and the → drawn after them (empty alt text).
- reverse (the default, no attribute). On hover or focus, the row reverses: an ink block rolls on and the text turns to paper. The title steps 8px forward and the arrow comes in. Script sets `data-edge="top | bottom"` on pointer enter and leave, so the ink comes in from the side your hand entered and leaves toward the side it goes. Moving down the list, one block of ink seems to travel with you.
- ditto: the ledger's and the typed list's ditto mark. A kind or a meta (a year) that repeats the row above is set as a ditto mark (″, pencil, centred over the word it stands for), so only what changes is written out and the marks make a rhythm down the columns, the barcode rhythm of SPECTRA. Rows works the repeats out after every render (`data-ditto` on the cell) and the words stay in the page, so a screen reader hears every row in full. Pointing at or focusing a row spells its dittos back into words (allegro); no ink block, the title steps and the arrow comes in. Sort the rows so the repeats fall together.
- trail: after "28 December", the index keeps count of where you've been. A ring hangs in the margin before each row (space-3, stepping in below 40rem): a hairline ring in rule-strong for a row not yet opened, filled with ink once the browser has visited the link (`:visited`, which only allows colours, so the ring's paper fill is opaque and nothing is stored), the accent for the row with `aria-current` (where you are, the one accent). Pointing inks the ring's line and it grows a quarter with spiccato. No ink block. Forced colours draw it in CanvasText, VisitedText and Highlight.
- Narrow (below 40rem) the title takes its own line and the kind and meta sit under it, a space-1 below, so a long title never runs into its kind.
- Keyboard: Tab through the links; focus shows what pointing shows.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Index rows (`rows`) | Roller | The ink follows the pointer in and out |
| Ditto rows (`rows`) | Spell out | The ditto marks turn back into words, allegro |
| Trail rows (`rows`) | Spiccato | Pointing inks the ring and it grows a quarter, landing with one rebound |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Index rows (`rows`) | "the uncreative" | The row reverses out of ink |
| Ditto rows (`rows`) | The ledger's ditto mark; SPECTRA's barcode rhythm | What repeats the row above is a ditto mark; pointing spells it out |
| Trail rows (`rows`) | "28 December" dots | A ring per row fills with ink once you've been there; where you are is the accent |
