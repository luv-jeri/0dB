# 0dB: skeleton

Extracted from DESIGN.md.

### db-skeleton (skeleton)
- Underneath: native.
- Anatomy: `<div class="db-skeleton" data-variant="baseline | metrics | words" aria-hidden="true">` of empty lines, with an optional `.db-skeleton-ring` for an avatar. Set `aria-busy="true"` on the region it stands in for; nothing moves until it is true, and nothing moves under reduced motion.
- `baseline` (default): baselines where the words will be, at the length they'll run. A pencil stroke reads along each line in turn (`db-read`), the way an eye would.
- `metrics`: from Paul Rand's construction grid. Before a letter is drawn, the letterer rules its guides: the baseline in a hairline and, one real x-height of the voice above it (`1ex`, so it changes with the pair), a dotted line. Each line takes the font size its height implies (a body line is 1.7em of leading), so a headline's guides are a headline's. While loading, the dotted line is ruled out from the start of each line in turn and passes off the far end (from the right, right to left).
- `words`: a layout dummy's greeking. Each line is broken at word spaces by two runs of gaps (every 5em and every 7em) that intersect into words of one to five ems and repeat only after 35; each line starts the pattern elsewhere, so no two lines share a rhythm. The reading stroke now reads word by word.
- Forced colours: the skeleton keeps drawing its own lines, in GrayText, so it doesn't vanish.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Skeleton (`skeleton`) | Reading | A pencil stroke reads along each line in turn |
| Metrics skeleton (`skeleton`) | Ruling | The dotted x-height is ruled out along each line in turn and passes off the end |
| Words skeleton (`skeleton`) | Reading | The pencil stroke reads along each line word by word |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Skeleton (`skeleton`) | "Less is more." rules | Baselines where the words will be |
| Metrics skeleton (`skeleton`) | Paul Rand construction grid | The letterer's guides: baseline and a dotted x-height |
| Words skeleton (`skeleton`) | A layout dummy's greeking | Lines broken at word spaces |
