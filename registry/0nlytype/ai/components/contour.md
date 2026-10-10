# 0nlyType: contour

Extracted from DESIGN.md.

### ot-contour (contour)
- Underneath: native, plus a hook that lays the lines out with pretext (`@chenglou/pretext`, loaded when it's needed).
- Anatomy: `<p class="ot-contour" data-shape data-variant="tale | cola">` holding the text for readers (`.ot-sr`) and `.ot-contour-lines`, one aria-hidden block per line, each carrying `--t`, how far through the text it starts, and `--i`, its index. In `cola` the lines are grouped by phrase in `.ot-contour-colon`, a turnover marked `data-turn`.
- edge (the default, no attribute): a paragraph set to a contour, the way a score draws a swell. Each line is laid to its own width: `diminuendo` narrows to the end, `crescendo` opens towards it, `hairpin` swells and closes, centred. Every line but the last is then spread to its width, mostly in the word gaps (at most 0.3em a gap) and a little in the letters, and takes one more word when the gaps can close by 0.06em to hold it, so the edge is the hairpin's straight line rather than a ragged stair. The browser never re-wraps them.
- tale: after the Mouse's Tale in *Alice* (1865), where the type shrinks as the tail thins. `shape` sets the size of the type instead of the width (`least` is the smallest share of the inherited size, never under 10px), and every line holds half the measure in its own size, so the tail narrows as the type does. The lines swing about the middle on a slow wave, one swing every seven lines. Moving a fine pointer across the paragraph moves the wave along (`--phase`, a full turn across its width) and the lines further down follow later (each line's glide is `--ot-andante` plus one `--ot-arpeggio` for each line above it), so the tail swishes after the hand; leaving lets it come to rest. Touch and reduced motion get the still tail. Right to left it swings from the other side.
- cola: *per cola et commata*, the way Jerome set scripture to be read aloud. A line to each phrase, broken after a comma, a colon, a full stop, a question or a dash, so the ragged edge is the rhythm of the speech. A phrase longer than the measure turns over, hung 1.5em in (at the inline start, so it mirrors right to left). Pointing at a phrase keeps it in ink while the others rest in pencil (moderato); the paragraph is one reading, so nothing is focusable.
- `data-fade` lets the colour follow the shape, ink where it's loud and pencil where it's quiet, so the quietest line still reads.
- It lays out again when its width changes or `<html>` changes face (it watches the pair, scheme, mode and key attributes, not `class`, which smooth scrolling toggles on every scroll). Before the fonts arrive, or without script, it's a plain paragraph. Forced colours: the text is system text and the pointing colours fall away.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Tale contour (`contour`) | Swish | The tail's wave moves with the hand across it; the lines further down follow later |
| Cola contour (`contour`) | Phrasing | The phrase you point at stays in ink; the others rest in pencil |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Contour (`contour`) | The score's hairpin | The lines taper along a straight edge |
| Tale contour (`contour`) | Carroll's Mouse's Tale (1865) | The type shrinks as the tail winds down the page |
| Cola contour (`contour`) | *Per cola et commata*, text set to be read aloud | A line to each phrase; the edge is the rhythm of speech |
