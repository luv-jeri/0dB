# 0nlyType: figure

Extracted from DESIGN.md.

### ot-figure (figure)
- Underneath: native `<figure>` and `<img>`, plus a hook that notices a picture that couldn't load.
- Anatomy: `<figure class="ot-figure" data-variant="plate | margin">` holding a `ot-ratio` frame (`.ot-figure-frame`, the aspect ratio's crop) with the `<img class="ot-figure-img">` and `.ot-figure-alt` (the alt text again, aria-hidden), then `<figcaption class="ot-figure-caption">` with `.ot-figure-number` (a `.ot-sr` "Figure " before it) and a `ot-meta` row (`.ot-figure-lines`) of `.ot-figure-text` and `.ot-figure-credit`. `data-missing` marks a picture that failed.
- The type-led answer to image masking: the job of framing a picture, without its silhouettes. The picture is cropped to a ratio (3 : 2 by default, the 35mm negative; `position` holds the subject) and marked like a printer's proof, the aspect ratio's trim marks outside its corners and no border. Then it is named in type, as "the silence that heals" sets its camera and its archive under its picture: the number as data (`--ot-mp`, light, tabular), the caption in the voice, and the credit in the pencil at the far end of the row, held apart by the meta row's flexing hairline. No filter, no mask, no hover zoom: the picture is shown as it is. Change `ratio` and the frame eases to it, the picture recropping inside.
- A picture that can't load leaves its frame: the marks stay and the alt text is set inside them in the pencil, the way a layout holds a place for a picture to come. The `<img>` stays for readers.
- `variant` (`data-variant`; none for the default, `plate`): `margin`.
- margin: a side caption, as a book sets one in the columns kept for notes (3 of 12, a `--ot-space-6` gap clear of the marks). The number stands at the head, larger and lighter (`--ot-mf`, weight 200), level with the picture's top; the caption and the credit stand at the foot, level with its foot, one under the other. Where the two can't stand side by side (the picture under 20rem, the caption under 9rem) the caption falls under the picture. Right to left the margin is on the right.
- Nothing to focus: a figure is read, not used.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Figure (`figure`) | Breath | The frame eases to a new ratio and the picture recrops inside it |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Figure (`figure`) | "the silence that heals" (camera and archive under the picture); a printer's crop marks | A picture cropped to a ratio, named in type: number, caption, credit spread to the far end |
| Margin figure (`figure`) | A book's side caption in the note columns | The number at the head of the margin, the caption at its foot, level with the picture |
