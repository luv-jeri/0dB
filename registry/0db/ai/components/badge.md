# 0nlyType: badge

Extracted from DESIGN.md.

### db-tag (badge)
- Underneath: native.
- Anatomy: `<span class="db-tag" data-variant="ink | accent">`, or a removable `<button class="db-tag" data-removable aria-label="Remove X">`.
- The label sits in a `<span>`. Pointing at or focusing a removable tag strikes the word, as the checkbox does.
- The one rounded shape. A removed tag, already struck, closes up (its width goes to 0) while its neighbours slide into the space, and focus moves to the next.
- The word is set as Weingart set his callouts: small, a little heavy and narrow (500, width 92%, in ink), so it holds as type inside its hairline; the ink pill knocks it out heavier and narrower still (650, 88%). Forced colours draw the pill as a CanvasText outline and the strike as a line-through.
- series: the written list. No pill: sibling tags are one sentence ("Showing work in *Identity*, *Web* and *Motion*."), the tags in the expression italic because they are yours, the commas and the "and" ours, in the voice and graphite. The punctuation is worked out in CSS from each tag's place among its siblings (`:nth-last-child(… of …)`), and a leaving tag stops counting at once, so as a tag closes up the list re-sets itself around the gap ("Identity and Motion"). `--and` on the tags changes the conjunction. Removable series tags keep the strike and the close-up.
- seal: a coin. `legend` is set round the rim between two hairline rings (SVG `textPath`, `textLength` spread to the whole circle so the letters stand evenly, closing on a dot), the face in the middle at `mf` 250. It's space-8 across and named as an image ("01, First edition · 2026"). Pointing turns the legend 30° (andante, breath), as a coin turns in the fingers; it turns back when you leave.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Tag (`badge`) | Close-up | Struck, then closed; neighbours slide in |
| Series tags (`badge`) | Close-up | As the tag, and the punctuation re-sets round the gap |
| Seal (`badge`) | Turn | Pointing turns the legend 30°, andante; leaving turns it back |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Tag (`badge`) | The checkbox; Weingart callouts | Removing strikes the word |
| Series tags (`badge`) | The written list (serial punctuation); "Healthy habits → for creatives" | Tags written as one sentence; the commas and "and" re-set as one leaves |
| Seal (`badge`) | A coin's legend; WOVE's numbers on an arc | The legend set round a ring, the face in the middle |
