# 0nlyType: wake

Extracted from DESIGN.md.

### ot-wake (wake)
- Underneath: native, plus a hook that lays the lines out with pretext (`@chenglou/pretext`, loaded when it's needed).
- Anatomy: `<p class="ot-wake">` holding `.ot-wake-plain` (the text, always in the flow), `.ot-wake-lines` (aria-hidden runs, one span per run, shown only while the wake is open) and, with `mark`, `.ot-wake-ring`.
- A paragraph that parts around your hand like water. A fine pointer (not touch, not reduced motion) opens a circle of `radius` em (3.2) under it; each row the circle crosses is set as two runs, one either side, sharing one cursor through the text, so the words are pushed on rather than hidden. A run too short to read stays empty.
- The circle's radius eases in as the pointer arrives and out as it leaves, and it follows the pointer a little behind. The frame loop runs only while something is still moving. `data-live` is set on the paragraph while the wake is drawn; the plain text goes transparent then and stays in the flow, so nothing below it moves. Two lines of room under the paragraph (`--ot-wake-room`) hold what the circle pushes on.
- No shape is drawn by default; `mark` draws a hairline ring inside the hole. Touch, keyboard and reduced motion get the plain paragraph, which is also what a screen reader reads. It measures again when its width changes or `<html>` changes face.
- `variant` (`data-variant`; none for the default, `circle`): `river`, `caesura` or `weight`. All keep the plain paragraph for readers, touch, keyboard and reduced motion, and river and caesura are set right to left in a right-to-left paragraph (each run hangs from its end, the first run on the right); weight takes its places from the laid-out text, so it follows any direction.
- river: the typesetter's river of white, the fault a compositor spends a career closing, made on purpose. A gutter half the radius wide runs the paragraph's whole height at the hand's x; every row is set as two runs either side of it, sharing one cursor, so the paragraph reads as two columns that follow you from edge to edge. `mark` draws a hairline down the middle of the river, the length of the text.
- weight: the letterpress's impression, and the heavy condensed roman of "It has to be design.". Nothing parts: the letters within the radius press heavier on the face's weight axis (to 800, cosine falloff, `--t` from 0 to 1 per letter) and, where the face has a width axis, narrower by as much as the weight widened them (the script finds that width once, per face), so each keeps its set width. The letters are a layer (`.ot-wake-lines`) placed from the plain text itself, each measured by a range and centred on its own place, so no line reflows; the room under the paragraph is not needed. It rests under a still hand and eases back as the hand leaves. `mark` draws a hairline ring round the reach. Without a width axis (press) the pressed letters simply crowd.
- caesura: the pause in the middle of a verse, a breath where the line allows it. The paragraph opens at the line you point at: the rows above stay, the rows below drop by the breath (the radius, at most the two lines of room), and the line under the hand sits between them, held apart, the share above and below following where on the line the hand is. `mark` sets a rule in each breath, the held line between two hairlines, as the "Less is more." poster sets its lines.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Wake (`wake`) | Wake | The text parts around the pointer; the circle swells as you arrive and closes as you leave |
| River wake (`wake`) | Wake | The gutter opens at your hand, follows it across and closes as you leave |
| Caesura wake (`wake`) | Breath | The paragraph opens at your line and follows you down it, closing as you leave |
| Weight wake (`wake`) | Press | The weight swells under your hand and follows it, rests when you are still, eases back as you leave |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Wake (`wake`) | Water parting round a hand; Eclipse's one soft side | The paragraph parts round the pointer and the words move on |
| River wake (`wake`) | The typesetter's river of white; "Less is more." hairline columns | A gutter down the whole paragraph that follows your hand |
| Caesura wake (`wake`) | The caesura in verse and song; "Less is more." lines between hairlines | The line you point at is held apart, a breath above and below |
| Weight wake (`wake`) | The letterpress impression; "It has to be design." heavy condensed roman | Letters under the hand press heavier and narrower, keeping their places |
