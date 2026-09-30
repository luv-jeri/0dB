# 0dB: kbd

Extracted from DESIGN.md.

### db-kbd (kbd)
- Underneath: native `<kbd>`. Its CSS lives in base.css, so every item may use it.
- A key, drawn as the corners of its cap (the corner marks the statement button and the dialog wear), with room inside for its name, on the text's baseline. `data-pressed` presses it: the corners run together into the whole cap and ink in, and the key goes down a little (the specimen presses the G key along with your keyboard).
- A key is its own left-to-right run (`direction: ltr; unicode-bidi: isolate`), so ⌘K reads ⌘K on a right-to-left page too.
- `data-variant="typewriter"`: after the round keys of the machine Weingart's letter was typed on, and the dot calendar's discs. The key is a hairline ring (an ellipse for a word such as Esc). Pressed, it inks into a disc with the letter reversed out of it in paper, goes down and lands with one small rebound. Forced colours draw it in CanvasText and reverse it to Canvas.
- `data-variant="chord"`: after the figured bass, where the notes to play with the bass are stacked small beside it. Given a combination as a string (`⌘⇧S`, or `Ctrl+Shift+S`), the key stands a little larger and its modifiers stack small before it, in graphite, in one cap: keys held together, read as one. The text keeps its order, so it is read as written. Pressed, the cap closes and the figures ink.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Key (`kbd`) | Press | The corners close and the cap goes down with your key |
| Typewriter key (`kbd`) | Spiccato | Pressed, the ring inks into a disc, goes down and lands with one small rebound |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Key (`kbd`) | "the silence that heals" corners | A key drawn as the corners of its cap |
| Typewriter key (`kbd`) | Weingart's typed letter; "28 December" dots | A ring that inks into a disc, the letter reversed out |
| Chord key (`kbd`) | The figured bass | Modifiers stacked small beside the key, in one cap |
