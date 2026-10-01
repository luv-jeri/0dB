# 0dB: radio-group

Extracted from DESIGN.md.

### db-choice (radio-group)
- Underneath: native radios, plus a hook that places the marks.
- Anatomy: `<fieldset class="db-choice" data-variant="legato | glissando | ballot | sforzando" data-orientation="horizontal | vertical">`, a legend, then `<label><input type="radio"><span class="db-choice-word">Words</span><span class="db-choice-yours" aria-hidden="true">Words</span></label>` for each option; the roman names the radio, and the italic copy shares its grid cell. Legato adds `<svg class="db-choice-slur">` and `<span class="db-choice-dot">`; ballot adds `<svg class="db-choice-ballot" aria-hidden="true">` to each label.
- Yours: the chosen word cross-fades into the italic (the roman leaves at allegro, the italic arrives at moderato, so the two are never printed over each other), and the unchosen words step back to pencil. Script adds `data-ready` once the marks are placed, so the first render never moves.
- Legato (default). One accent dot sits under the chosen word (`--db-choice-drop`, 0.66em below it, so small words keep it as close); in a column it hangs in the margin before the word. Script sets `--db-choice-x` and `--db-choice-y`, measured from the slur's own corner so a legend doesn't shift it. Choosing, the dot glides along a slur, a curve that bows away from the words (out into the margin, in a column) and stays shallow however far it goes; it is drawn out along the curve like a drop of ink (longest at mid-flight) and lands round, and a longer glide takes a little longer, never past `--db-andante`. Pointing at an unchosen word sketches that slur in pencil from the dot to a hairline ring where the dot would land (`label::before`); leaving, the line passes through the way it was drawn, and choosing uses it up as the dot runs along it.
- Glissando. No dot. Script lays the words end to end on one line of reading (`--db-choice-s` for each word's start), and the italic shows only inside a lens on that line (`--db-choice-a` to `-b`, with a 0.2em seam). Choosing moves the lens leading edge first, so the italic wipes through every word between, then gathers itself into the chosen word, whichever row the words wrap onto. Then an accent full stop lands with spiccato just after the italic's last letter. Its room is always kept, so nothing moves its neighbours. Pointing sketches the stop as a pencil ring there.
- Ballot. The cross a hand sets in the box after a name on a ballot paper. Every word keeps a margin after it (1.2em, inside the label, so the pointer and focus include it, nothing moves, and the words still line up under the legend), and there the chosen word gets a pen cross in the accent (`.db-choice-ballot`, one path with `pathLength=1`): two strokes as tall as a capital and never quite square, a short one down to the right and then a longer one, set off higher, that bows and runs past it. The dash runs on from the first stroke into the second, so the pen writes one, lifts and writes the other. Choosing writes the new cross (breath) while the one it leaves passes through, its tail following its head off the page. Pointing sketches the cross in pencil; leaving, the pencil passes through the same way, and choosing inks the sketch where it stands. Right to left, the margin and the cross mirror, so the short stroke still comes first.
- Sforzando. The poster's scale contrast. The words stand in a column, set heavy (780) and narrow (72%) in the voice and packed close at `--db-mf`; the chosen one's roman steps out and its italic, in the accent, swells to 1.75× from its baseline with spiccato, the sudden accent the mark is named for. It runs up under the word above, which stays on top and reads, the way "has" crosses "It" on the poster. Nothing reflows: the swell is a scale. Focus rings the swell itself. It sets its own column, so `orientation` doesn't apply.
- States: rest, hover, focus (accent outline around the word), chosen, disabled (pencil at 55%). Right to left, the dot hangs on the inline start, the lens runs right to left, the cross mirrors and the swell grows from the right. Forced colours: the dot, the stop, the chosen cross and focus use `Highlight`, the slur, rings and pencil crosses `CanvasText`.
- Keyboard: native radio group (arrow keys move the choice). Under reduced motion the marks move straight to their places, and a cross is simply there.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Radio (`radio-group`) | Legato | The dot glides along a slur, drawn out like a drop of ink; pointing sketches the slur in pencil to a ring |
| Radio, glissando (`radio-group`) | Glissando | The italic wipes through the words between, leading edge first; the full stop lands |
| Radio, ballot (`radio-group`) | Written | The pen writes the cross, one stroke then the other; the old cross passes through; pointing sketches it in pencil |
| Radio, sforzando (`radio-group`) | Sforzando | The chosen italic swells sharply from its baseline; the one it leaves falls back at once |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Radio (`radio-group`) | "It has to be design."; the score's slur | Chosen word turns italic; the rest step back. The dot rides a slur, or the italic slides to the word and sets a full stop |
| Radio, ballot (`radio-group`) | A ballot paper's cross; the collages' pen marks | A hand cross written after the chosen word |
| Radio, sforzando (`radio-group`) | "It has to be design." scale contrast; the score's sfz | Heavy narrow words in a column; the chosen italic swells under the word above |
