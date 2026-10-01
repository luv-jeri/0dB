# 0dB: spinner

Extracted from DESIGN.md.

### db-dots (spinner)
- Underneath: native.
- Anatomy: `<span class="db-dots" data-variant="…" aria-hidden="true"><span class="db-dots-art" aria-hidden="true"><i></i>…</span></span>`. The default, `dots`, is what a busy button holds, beside its present-tense word ("Saving"). Given a `label`, the root is instead `role="status"` (polite) with the label in a `.db-sr`. Optional `data-size="l"` stands it alone at the `f` step; otherwise everything is in em and it takes the size of its line.
- Shown only while something the person started is running: the one thing that moves by itself, so every loop is slow and eased like breathing. The art stands on the baseline in a box a capital tall, so it reads as one more glyph; strokes stay hairlines at any size.
- The family, each a way a score or a page writes a wait:
  - dots (default): three periods on the baseline, each lifting as it brightens, in turn.
  - round: three voices on one hairline ring, each entering a beat after the last, as a round's voices do; they gather at the top and the foot and spread between.
  - metronome: a stroke rod on a hairline foot, a dot for its weight, swinging a slow beat.
  - fermata: the hold. The arc draws in the reading direction (mirrored right to left), the dot lands under it with spiccato, the pause is held, then the arc lifts away the way it was drawn.
  - breath: a dot breathes in and opens into a hairline ring, holds, and closes into a dot again.
  - arpeggio: four notes of a chord rising (a third, a third, a fourth), struck in turn with spiccato and let ring.
  - word: the label itself in the voice, pencilled; the ink runs through it letter by letter and leaves in the same order. It is always read.
- Reduced motion: nothing travels. Each stops on a frame that still reads as unfinished (the periods trail off, the voices stand apart, the sign of the hold, a small ring, the chord rising in strength, the first letters inked) and the whole mark dims and returns, 2800ms each way, so it still reads as busy. `data-force="reduced"` pins that in the docs.
- Forced colours: the marks keep the forced colour of the words around them (ButtonText in a button); the word pencils in GrayText.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Loading (`spinner`) | Breath | The periods lift as they brighten |
| Round (`spinner`) | Canon | Three voices chase round the ring, gathering and spreading |
| Metronome (`spinner`) | Breath | The rod swings a slow beat |
| Fermata (`spinner`) | Held | The arc draws, the dot lands, the hold, the arc lifts |
| Breath (`spinner`) | Breath | The dot opens into a ring and closes |
| Arpeggio (`spinner`) | Arpeggio | The notes rise, struck in turn, and ring |
| Word (`spinner`) | Written | The ink runs through the word and leaves |

## Where each move comes from

No item-specific row is defined in DESIGN.md. Read the general rules in DESIGN-core.md and the contract above.
