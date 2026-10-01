# 0dB: measure

Extracted from DESIGN.md.

### db-measure (measure)
- Underneath: native, plus a hook that lays the lines out with pretext; the handle is a `role="slider"`.
- Anatomy: `<div class="db-measure">` holding `.db-measure-read` (the count and the verdict, aria-hidden), `.db-measure-stage` with `.db-measure-track` (a hairline, the comfortable range in the accent), `.db-measure-handle` (the slider: a hairline down the paragraph's right edge, `.db-measure-ring` on the track) and `.db-measure-body` (the text once for readers in `.db-sr`, the lines aria-hidden).
- A paragraph whose measure you set by dragging its right edge; pressing the track moves the handle there. Pretext lays the lines again whenever the width changes, so they follow the hand. The count is in the expression italic ("62 characters a line", the average character of this text, so it is what the lines really hold); under it, in pencil, the verdict: under 45 "too short to read in", 45 to 75 "comfortable" (that range is the accent on the track), over 75 "the eye loses the next line". The handle stops at the edge of its container; on a narrow screen the paragraph sets a size down so the comfortable range is still there.
- Keyboard: the handle is focusable; left and right (or down and up) step one character, Page steps ten, Home and End go to the ends. `aria-valuenow` is characters a line and `aria-valuetext` says the verdict. Focus draws the accent ring around the handle's ring.
- The count's number stands at `mf` and its words a dynamic down beside it, on one baseline. The comfortable range's ends are marked over the track in small pencil figures (`.db-measure-at`, 45 and 75), where the page is wide enough to hold them. Right to left, the edge is the line's end on the left, and the drag and the arrows follow it. The readout is the library's English, each part its own left-to-right run, so a right-to-left page still reads "30 characters a line".
- `variant` (`data-variant`): `track` (the default), `alphabets` or `columns`.
- alphabets: after a type specimen's lowercase alphabet length. The track is a ruler of lowercase alphabets (`.db-measure-abc`, a span a letter) in the paragraph's own face and size, measured letter by letter with its kerning, so it is a true rule for this face. The letters inside the measure are graphite, those beyond a rule's grey, and the letter the edge cuts is the accent, with the handle's hairline running down through it; there is no ring. The count reads in alphabets to the quarter ("2½ alphabets a line"); the verdict still counts characters, and `aria-valuetext` says both. The comfortable range is a hairline under the ruler. Focus draws the handle's line in the accent at stroke weight. The ruler is Latin; a right-to-left page should use the track.
- columns: after the narrow ragged columns of "Healthy habits →". The paragraph takes as many columns of the measure as its space holds (`--cols`), two ems apart (`--gap`), balanced, never more than it has lines. The handle is the first column's edge, so narrowing the line brings another column in and widening takes one away; the verdict says how many ("too short to read in, in three columns").
- Forced colours: the hairlines in CanvasText, the comfortable range and the cut letter in Highlight.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Measure (`measure`) | Drag | The right edge follows the hand and the lines are laid again on every move |
| Alphabets measure (`measure`) | Drag | The edge cuts a new letter of the ruler, and that letter takes the accent |
| Columns measure (`measure`) | Drag | Columns come in and go as the line narrows and widens |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Measure (`measure`) | Paul Rand dimension lines; SPECTRA's small figures | The paragraph's edge on a track, the comfortable range marked 45 to 75 |
| Alphabets measure (`measure`) | A type specimen's lowercase alphabet length | The track is a ruler of alphabets; the edge cuts a letter in the accent |
| Columns measure (`measure`) | "Healthy habits →" narrow columns | Narrowing the line brings another column in |
