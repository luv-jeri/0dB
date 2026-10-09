# 0dB: sign

Extracted from DESIGN.md.

### db-sign (sign)
- Underneath: hook. Pretext lays the word along the drawing's strokes.
- Anatomy: `<span class="db-sign" data-variant="dots | words" role="img" aria-label="word"><span class="db-sign-glyphs" aria-hidden="true"><span class="db-sign-glyph">…</span></span></span>`. An empty label hides it (`aria-hidden="true"`), for a control that already says the word.
- An icon made of its own word, after the ampersand (the word "et" worn down into a mark) and Apollinaire's calligrams. Line style only. Pretext sets the word letter by letter, kerning included, along the strokes of the drawing (`words`) or in middle-dot leaders (`dots`), so type stays the only ornament.
- Variants:
  - `dots`: each stroke is ruled in middle-dot leaders at every size; the letters wait unseen at the dots and rise out of them when said.
  - `words`: the word runs along each stroke in whole words, closed up or spread to reach both ends; where a stroke is too short it falls back to leaders.
- Yours: `data-face="italic"` sets the expression italic: a sign for something that belongs to the person (their mail, their home).
- Said: pointing at the sign, or at the control it sits in, or focusing that control makes the drawing say its word. The letters leave the drawing in reading order, one arpeggio apart, and stand up as the plain word; echoes sketch out in pencil and go quiet. Leaving winds them back.
- States: rest, hover, focus. Reduced motion: the word and the drawing change places without travel. Forced colours use CanvasText.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Sign (`sign`) | Said | The letters leave the drawing in reading order, one arpeggio apart, and stand up as the plain word; echoes sketch out in pencil |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Sign (`sign`) | The ampersand ("et" worn down into a mark); Apollinaire, *Calligrammes*, 1918 | An icon made of its own word; pointing says the word |
