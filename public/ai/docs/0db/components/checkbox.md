# 0dB: checkbox

Extracted from DESIGN.md.

### db-check (checkbox)
- Underneath: native checkbox; the tally is a `Fraction`.
- Anatomy: `<label class="db-check" data-variant="strike | stet | circled"><input type="checkbox"><span>Words</span></label>`; circled adds `<svg class="db-check-loop" aria-hidden="true">` holding one path. A group is `<fieldset class="db-checklist">` with a legend.
- Strike (the default), for things done. Hover sketches the strike as a pencil hairline (`--db-rule-strong`). Checked: an accent strike draws left to right at 60% height, running 0.18em past both ends of the words the way a pen does. Weight drops to 300 and the colour goes to pencil. Unchecking lifts the strike away to the right.
- Stet, for things kept, where a strike would read as "no". The proofreader's "let it stand": a row of dots under the words (a dotted underline, so it wraps with them). Pointing pencils the dots in; checking sets them down in the accent, a touch lower, with spiccato.
- Circled, for things chosen. One pen loop round the words, after the collage's accent rings: it comes in at the upper left, runs round clockwise and on past where it began, as a hand never quite closes a circle. Pointing draws it in pencil, checking inks it in the accent at `--db-stroke`. A loop has no heading to leave by, so it fades, then resets unseen.
- Stet and circled: checked words are yours, so they turn italic in ink, at the expression scale but on the list's own line (`line-height: 1lh`), so nothing below moves.
- The tally is the `Fraction` item: "*2* / 5 done", the yours part in italic. Each figure that changes turns over on its own wheel, up when the count grows and down when it shrinks, the carry a step behind. It mounts with its first count, so nothing turns over on load. The tally follows controlled values, child changes and native form resets as well as change events.
- States: rest, hover (ink), focus (outline on the words), checked, disabled. Right to left the strike runs right to left and the loop starts at the upper right. Forced colours: the loop is `CanvasText`, `Highlight` when checked; the stet dots take the forced text colour.
- Keyboard: Tab to focus, Space toggles.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Checkbox (`checkbox`) | Pencil, then ink | A hairline sketch on hover, then the accent strike; the tally's figures turn on their wheels |
| Stet checkbox (`checkbox`) | Pencil, then ink | Pointing pencils the dots in; checking sets them down in the accent with spiccato, and the words turn italic |
| Circled checkbox (`checkbox`) | Written | Pointing draws the loop in pencil; checking inks it; it fades when it goes |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Checkbox (`checkbox`) | Weingart letter | The pen overshoots; the tally is a fraction |
| Stet checkbox (`checkbox`) | The proofreader's stet | Dots under the words: let it stand |
| Circled checkbox (`checkbox`) | Collage accent rings | One pen loop round the words |
