# 0dB: calligram

Extracted from DESIGN.md.

### db-calligram (calligram)
- Underneath: native, plus a hook that lays the lines out with pretext.
- Anatomy: `<p class="db-calligram" data-shape | data-variant="rain | mirror">` holding the text for readers (`.db-sr`), `.db-calligram-lines` (aria-hidden, one block per line, each carrying `--t`, how far it is from the shape's widest part) and, for `fermata`, `.db-calligram-dot`. Rain fills the lines with `.db-calligram-streak`s of one span per letter (`--j`, its place down the streak); mirror with one `.db-calligram-side` per side (`--x`, `--a` its turn), then `.db-calligram-centre`, which is read.
- fill (the default): the paragraph fills `shape`.
- A paragraph that fills a shape, as Apollinaire's calligrams did. Each line is as wide as the shape's chord at its height and is centred in it, spread to both sides by its gaps and a little by its letters, so the outline is only implied: nothing is drawn. `circle` is the 0 of 0dB, `fermata` a half-disc of text over one accent dot, `wave` widths that swell and narrow like a sound wave (eleven rows a swell).
- The circle and the half-disc are filled exactly: the size of the type is found (it never exceeds twice the inherited size) so the last word lands in the last row, and the box has its own aspect ratio, so nothing moves when the lines arrive. `size` is the shape's width (default 34rem, never wider than its space). The wave takes the inherited size and its height follows its rows.
- rain: after Apollinaire's "Il pleut" (1916), where the words run down the page in slanting streaks. The words fall in streaks, a letter to a drop (0.8em apart, upright, centred on the streak), each letter a sixth of an em further over than the one above, so every streak leans the same way, as rain does in wind. A word is never split unless it's longer than a streak; a space is an empty drop. The streaks stand 2.2em apart, as long as they need to be for all of them to fit the width, and each starts a few drops late by a fixed hash, so the tops are ragged and the feet fall where they fall. Read left to right, each top to bottom; right to left the streaks run from the right and lean the other way. With `data-fade` each streak darkens as it falls, the drop at its foot in ink. Its height follows its streaks.
- mirror: after his "Cœur couronne et miroir" (1918), where the words make a mirror frame around his name. The paragraph is the frame of a square: a line to each side, clockwise from the top, each turned to face out (the right side reads downward, the foot upside down, the left side upward), each spread to its side's length by its gaps; when a ring is full the next begins a line inside it, so a long text spirals in until the words run out. The last line stays unspread, so the frame closes on a pause. What is left in the middle holds `centre` in the expression italic, as large as that room allows (at most six times the inherited size), because it is yours; it is real text, read after the paragraph. Right to left the frame runs counter-clockwise from the top right. The square's box has its own aspect ratio, so nothing moves when it's laid.
- `data-fade` lets the colour follow the shape, ink at the widest and pencil at the narrowest. It is a still ornament in every variant: pointing shows nothing. It lays out again when its width changes or `<html>` changes face (it watches the pair, scheme, mode and key attributes, not `class`, which smooth scrolling toggles on every scroll). Before that it is a plain paragraph. Forced colours: the text is system text and the fermata's dot is CanvasText.

## Motion

No item-specific row is defined in DESIGN.md. Read the general rules in DESIGN-core.md and the contract above.

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Calligram (`calligram`) | Apollinaire's calligrams | The paragraph fills the shape; the outline is only implied |
| Rain calligram (`calligram`) | Apollinaire, "Il pleut" (1916) | The words fall in leaning streaks of letters |
| Mirror calligram (`calligram`) | Apollinaire, "Cœur couronne et miroir" (1918); "Healthy habits →" corner notes | The paragraph is the frame; one italic word in the middle |
