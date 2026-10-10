# 0nlyType: accordion

Extracted from DESIGN.md.

### ot-disclose (accordion)
- Underneath: native `<details>`.
- Anatomy: `<div class="ot-accordion" data-variant="cross | run-in | gloss" data-orientation="horizontal">` holding `<details class="ot-disclose"><summary>Question</summary><div class="ot-disclose-body">…</div></details>` for each question.
- cross (the default): questions ruled off. The + winds 45° into × with spiccato, and the question exhales as it opens: it swells a fifth, from `mp` to `mf`, and goes wide and light (width 112%, weight 300), so the open question becomes the heading of its answer, as the big words of "Less is more." stand over their note. The + keeps its size. The content opens by animating block-size (`::details-content`) over `--ot-andante`, and the answer settles into the space.
- run-in: the book's run-in head. No rules; the questions are paragraphs held apart by space. Each question is set heavy (600) and floats at the start of its own line; closed, a pencil ellipsis trails after it (pointing inks it). Open, the ellipsis goes and the answer runs on from the question on the same line, light (300) in graphite, as one paragraph; it is written in line by line from the question, a steep soft-edged wipe that steps down a line as it crosses one (mirrored right to left). Held to the measure; `p` size below 40rem. Forced colours drop the wipe.
- gloss: the answer is hung beside its question in the outer column (3 : 2), flush to the outer edge and ragged toward the question, the way a sidenote glosses the line it stands by (the notes of "Less is more." and "the silence that heals"). Space holds the columns apart; no rule stands between. The question keeps its size and exhales only in width and weight. Open, the gloss arrives from the question's side (mirrored right to left). Below 40rem it drops under the question, indented a quarter.
- horizontal (`orientation="horizontal"`, `data-orientation`): after "Healthy habits", its notes stacked a word to a line in narrow ragged columns, and the hairline grid of "Less is more.". The questions stand side by side as columns of `space-9` between hairlines, each name stacked a word to a line; the open one widens (flex-grow over `--ot-andante`, exhale) and its name steps up from the stack onto one line as it exhales into the heading of its answer (`mf`, wide and light); the answer arrives once the column has made room. Closed columns keep their width, so the row ends in silence. It has its own form, so `data-variant` is not set and the + is set aside: the column says it opens. Below 40rem the columns stack under hairlines and the + returns.
- Keyboard: native (Enter or Space on the summary). Single opens one at a time through the native `name` attribute. Horizontal: Left and Right walk the columns (mirrored right to left), Home and End go to the ends.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Disclosure (`accordion`) | Spiccato | The cross winds past; the question swells; the answer settles |
| Disclosure, run-in (`accordion`) | Written | The ellipsis goes and the answer is written on from the question, line by line |
| Disclosure, gloss (`accordion`) | Aside | The gloss arrives from the question's side |
| Disclosure, horizontal (`accordion`) | Widen | The column widens and the name re-sets onto one line; the answer arrives once there's room |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Disclosure (`accordion`) | The overture; "Less is more." | The question exhales and swells into the heading of its answer |
| Disclosure, run-in (`accordion`) | The book's run-in head | The answer runs on from the question, in one paragraph |
| Disclosure, gloss (`accordion`) | The sidenote; "Less is more." notes | The answer hung beside its question in the outer column |
| Disclosure, horizontal (`accordion`) | "Healthy habits" narrow columns; "Less is more." hairline grid | The open column widens and its name steps up from a stack onto one line |
