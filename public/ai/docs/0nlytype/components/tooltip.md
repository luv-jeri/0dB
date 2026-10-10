# 0nlyType: tooltip

Extracted from DESIGN.md.

### ot-tip (tooltip)
- Underneath: Radix Tooltip.
- Anatomy: `<span class="ot-tip">` holding the control (with `aria-describedby`) and `.ot-tip-text`.
- A whisper in parentheses above the thing it names. The parentheses are thin (200) and taller than the words, in ink, as 20(25) sets them round its figures, so the whisper reads as an aside held apart. It waits for a still pointer; focus shows it at once. Escape sets `data-hush` until the pointer or focus leaves.
- Variants go on `data-variant` (`TooltipContent variant`): whisper (the default), initials, beside.
- Initials, after "the uncreative" reversing part of its word: for a key or an abbreviation. The letters the control shows are marked with `<b>` in the whisper's words and reversed out of the ink (paper on ink), so the whisper shows where G, or CMYK, comes from. Screen readers hear the words whole.
- Beside, after the small notes hung beside "It has to be design.": the whisper on the control's own line, after it, on a hairline that runs from the control, with no parentheses (the line holds it apart). It sits at the line's end: the right, or the left on a right-to-left page (read from the page as it opens; pass `side` on a mixed page). Whichever side Radix settles on, the line faces the control; flipped above or below, the line is dropped.
- Reduced motion: the initials and the line are simply there. Forced colours: the line is drawn in CanvasText and the initials are reversed in Canvas on CanvasText.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Tooltip (`tooltip`) | Wait | It appears only for a still pointer |
| Initials tooltip (`tooltip`) | Spiccato | The initials land, then the words are written in round them |
| Beside tooltip (`tooltip`) | Reach | The hairline draws out from the control; the words arrive at its end |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Tooltip (`tooltip`) | 20(25) | A whisper in thin, tall parentheses |
| Initials tooltip (`tooltip`) | "the uncreative" | The key's letters reversed out of ink in the words they come from |
| Beside tooltip (`tooltip`) | "It has to be design." notes | The whisper on the control's line, on a hairline from it |
