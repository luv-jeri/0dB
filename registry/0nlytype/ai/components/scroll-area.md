# 0nlyType: scroll-area

Extracted from DESIGN.md.

### ot-scroll (scroll-area)
- Underneath: native overflow, with the scrollbar.
- Anatomy: `<div class="ot-scroll" data-slot="scroll-area" data-variant="ruled | catchword | wheel" tabindex="0" role="region" aria-label>` holding two rails last (catchword puts `<div class="ot-scroll-foot" aria-hidden="true"><span class="ot-scroll-catchword"></span></div>` before them): a `.ot-scrollbar` down the side and a `.ot-scrollbar[data-axis="x"]` along the bottom, each hidden until there's something to scroll its way. The rail also sets `data-lenis-prevent` on it while there is something to scroll down, so smooth scrolling leaves it alone.
- It wears the page's rail, not a lighter one: 1.5rem wide with the hairline 0.5rem in (`--line`), an ink thumb as long as the view. `sections` (`{ id, num, name }[]`, one per element inside with that id) put a tick on both rails: pointing at the rail brings their numbers down it in turn, pointing at a tick names it, pressing one scrolls there (at once with reduced motion), and the section in the middle of the view is ink. A section too near the end to reach the top keeps its own place inside the thumb's last stretch, so the last ticks never pile up. The box is short, so each number leans into it as its tick nears an end (by `--at`); sideways, the ticks rise from the rail with their numbers above. With no sections it is the bare rail.
- A rule appears at an edge only while there's more beyond it. Pure CSS: paper backgrounds that scroll (`background-attachment: local`) cover rules that don't.
- Catchword, after the printer's catchword (the first word of the next page set alone at the foot of this one, so the reader goes on): while there's more below, a foot line of paper (`.ot-scroll-foot`, sticky, 1.625rem, the rule on its lower edge) rides the bottom of the box and the text passes under it; on it, at the far end and clear of the rail, waits the first word whose line runs under the foot, in pencil at `--ot-pp`. Script (`useCatchword`) finds it by walking the box's text on scroll, resize, change and font load, skipping anything aria-hidden, and sets `data-idle` when there is none (at the end the word and the rule go). Each new word turns in (`data-turn`: rises 0.6em and fades up, allegro, exhale). Pointing inks it; pressing it turns the box so that line stands at the top (smooth, at once with reduced motion) without moving focus. It is a pointer aid, hidden from assistive technology: the word is in the box.
- Wheel, after WOVE, where numbers ride an arc, shrinking and fading by their distance from the chosen one: the children of the box's first child (the rows of one list) turn on an arc as the box scrolls. The row in the middle stands at the start edge, full size, in ink; toward the top and bottom the rows fall back along the curve toward the rail by up to `--ot-scroll-arc` (`--ot-space-7`, offset by the square of the distance), shrink to 0.84 and step back through graphite and pencil to the strong rule. Each row runs on its own view timeline (`animation-timeline: view()`), so the wheel keeps time with the scroll, smooth scrolling included, and nothing moves at rest. The box keeps `--ot-scroll-arc` clear at its end so no row is cut, and hides sideways overflow. Right-to-left bows the other way. With reduced motion only the ink changes.
- Every scroller in the library carries the rail: the command list (so the combobox too), the dialog, sheet and drawer, the thread and the sidebar. Nothing on the site scrolls on the browser's own bar. Code and text areas don't scroll at all (they wrap and grow); the native select's picker and the carousel's track hide the bar.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Scroll area (`scroll-area`) | Arpeggio, then ink | The page rail's: its sections' numbers arrive down the rail (along it, sideways); held, the thumb takes the accent |
| Catchword scroll area (`scroll-area`) | Turn | Each new catchword rises onto the foot line |
| Wheel scroll area (`scroll-area`) | Wheel | The rows ride the arc as you scroll, inking as they pass the middle |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Scroll area (`scroll-area`) | "Less is more." rules; Paul Rand dimension lines | A rule only where there's more; the box as a ruler, ticked at each section |
| Catchword scroll area (`scroll-area`) | The printer's catchword | The first word below waits alone on the foot line |
| Wheel scroll area (`scroll-area`) | WOVE | The rows turn on an arc, the middle one in ink |
