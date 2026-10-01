# 0dB: aspect-ratio

Extracted from DESIGN.md.

### db-ratio (aspect-ratio)
- Underneath: native `aspect-ratio`.
- Anatomy: `<div class="db-ratio" data-variant="crop | diagonal | square" data-orient="landscape | portrait | square" style="--ratio: 1.7778">`, with a `db-fraction` naming it (aria-hidden; a `.db-sr` says "16 by 9"), and for the square `.db-ratio-rest` holding the remainder's fraction. `--ratio` is a registered number, so it eases; registered, it doesn't inherit, so `--r` carries it to the parts and pseudo-elements. The fraction keeps to the frame (`min(--db-f, 17cqi)`).
- A frame kept to a ratio and marked like a printer's crop: short lines outside each corner and nothing between them, no border. Change `--ratio` and the frame eases to it while the fraction rolls.
- Diagonal: the paste-up artist's scaling line, a hairline from the foot of the start edge to the head of the end edge. Any frame whose corner lies on it has the same ratio, which is how a picture was scaled before software. The ratio is written along the line, standing on it (`rotate(-atan2(1, --r))`), so as the frame eases the line and the words swing together. Mirrored in right-to-left.
- Square: the largest square is ruled off from the start edge, or from the head when the frame stands tall, the way a book designer finds the square in a page and the rectangle it leaves. The ratio sits in the square; what's left is named by its own ratio in the pencil (16 : 9 leaves 7 : 9, 4 : 5 leaves 4 : 1). The rule is a background placed at `100% / --r`, so it glides as the frame eases, and its length is clamped to nothing at 1 : 1, where there is nothing left. The remainder's name fades back in once the rule has arrived.
- Forced colours keep the marks and lines (they are background images) in CanvasText.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Aspect ratio (`aspect-ratio`) | Breath | The frame eases to the ratio; the fraction rolls |
| Diagonal aspect ratio (`aspect-ratio`) | Swing | The line and the ratio written on it swing to the new diagonal with the frame |
| Square aspect ratio (`aspect-ratio`) | Glide | The square's rule glides to its new place; the remainder's name comes back once it lands |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Resizable, aspect ratio (`resizable`, `aspect-ratio`) | Paul Rand dimension lines | Shares measured; a printer's crop marks |
| Diagonal aspect ratio (`aspect-ratio`) | The paste-up artist's scaling diagonal | The ratio written along the line that keeps it |
| Square aspect ratio (`aspect-ratio`) | The book designer's square in the page | The square ruled off, the rest named by its own ratio |
