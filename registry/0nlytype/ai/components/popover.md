# 0nlyType: popover

Extracted from DESIGN.md.

### ot-pop (popover)
- Underneath: Radix Popover.
- Anatomy: `<div class="ot-pop" popover>` opened by a button with `popovertarget`. Anchor positioning places it under the opener (`position-area`), using the implicit anchor.
- Hung from what opened it on a leader line, after Weingart: the dot lands on the opener's edge, the line drops, and the panel settles below.
- Keyboard: Escape or a click elsewhere puts it away (native popover light dismiss).
- Variants go on `data-variant` of the panel (`PopoverContent variant`): leader (the default), brace, cut. Both new ones hang above or below the trigger and drop the leader.
- Brace, after the brace that joins a score's staves and the underbrace that sums a span: the panel loses its box and a hairline brace over its words gathers their whole width to one point at the trigger's middle. The ends curl at the words' edges; the arms and the point are Radix's arrow (`.ot-pop-brace-point` inside `.ot-pop-brace-arms`), so the point stays over the trigger when the panel shifts to stay on screen and the brace goes lopsided rather than point at nothing. Centred by default. Beside the trigger there's no width to gather, so the brace isn't drawn.
- Cut, after SPECTRA's title cut by a line: the panel's top edge, in ink, falls through the trigger's words at half their height (`--radix-popover-trigger-height`), and the panel rides over their lower half. There is no leader: the join is the cut. Flipped above, it cuts from the top and leaves the lower half.
- Keyboard and screen readers: Radix's popover in all three; the brace is `aria-hidden`. Reduced motion: the panel appears and the brace is whole. Right to left: the leader measures from the start edge, the brace is symmetric, the cut has no direction. Forced colours: the panel keeps a border in CanvasText (its hairline is a box-shadow, which forced colours drop; a border because Radix's menus set an inline `outline: none` on the panel), the brace panel stays boxless, the leader is drawn in CanvasText, and the brace is a border, which follows the text colour.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Popover (`popover`) | Arpeggio | Dot, leader, panel |
| Brace popover (`popover`) | Gather | The arms open out from the middle to the ends of the words, then the ends curl in |
| Cut popover (`popover`) | Cut | The panel's edge rises from the foot of the words to their middle |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Date picker, popover (`date-picker`, `popover`) | Weingart callouts | Hung from the opener on a leader line |
| Brace popover (`popover`) | The score's brace; the underbrace | The panel's width gathered to one point at the opener |
| Cut popover (`popover`) | SPECTRA | The panel's edge cuts through the opener's words |
