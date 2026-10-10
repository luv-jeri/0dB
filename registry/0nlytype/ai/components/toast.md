# 0nlyType: toast

Extracted from DESIGN.md.

### ot-toast (toast)
- Underneath: hook: a tiny store and a `<Toaster />`.
- Anatomy: `.ot-toaster` (`aria-live="polite"`, fixed bottom left), holding `.ot-toast` elements. Each is a sentence, `svg.ot-toast-timer` (a fermata: arc `pathLength="1"` plus an accent dot) hung up against its full stop, the way the sign is written over the note it holds, and an optional bracket action.
- The fermata's arc empties over `--life`. Pointing at the toast or focusing it holds the pause, which is literally what a fermata means. At most three toasts show at once. The toast rises, then its sentence is written in from the left. It leaves with `data-leaving`: it sinks and fades, then its height closes so the toasts above settle down into the space.
- Yours: the item's name inside the sentence, e.g. "Archived *Spring notes*."
- `variant` sits on the Toaster (`data-variant`); each keeps the fermata as its clock, unseen, and pointing still holds the stay. `footnote`: the book's note at the foot of the page. A short ink rule draws in over the first note, and each note carries its number (`.ot-toast-n`) hung in the margin so the sentences keep one edge under the rule. Numbers count up while notes stand and start again at 1 on an empty page; only the newest takes the accent, the rest are pencil. One frame holds the whole foot, not one per note. `dateline`: the frame row of a poster, each toast in its frame holding a sentence, a hairline and the time it happened (`time.ot-toast-time`, the reader's own clock). The hairline (`.ot-toast-rule`) runs out toward the time while the toast stays. Right to left, the rule runs out the other way and the sentence writes in from the right. When a page mounts a second `<Toaster />`, the one mounted last shows the toasts and the others fall silent, so nothing is read out twice.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Toast (`toast`) | Written | It rises, the sentence writes in, and the stack closes over the gap when it leaves |
| Footnote toast (`toast`) | Spiccato | The rule draws in over the first note; each note rises and its number lands |
| Dateline toast (`toast`) | Held | The hairline runs out toward the time, and holds while pointed at |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Toast (`toast`) | The fermata sign | The arc over the last word empties; pointing holds it |
| Footnote toast (`toast`) | A book's footnotes | Numbered notes under a short rule |
| Dateline toast (`toast`) | SHAPES / GRADIENTS frame row | The sentence and its time on a hairline that runs out |
