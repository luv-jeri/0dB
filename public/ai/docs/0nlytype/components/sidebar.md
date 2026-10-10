# 0nlyType: sidebar

Extracted from DESIGN.md.

### ot-sidebar (sidebar)
- Underneath: native, plus a hook; a sheet on narrow screens.
- Anatomy: `<nav class="ot-sidebar ot-scroll">` holding `.ot-sidebar-list` (with `.ot-sidebar-head`, groups, and a `.ot-scrollbar` as the nav's last child). A group is `.ot-sidebar-label` (`.ot-sidebar-i` the numeral or initial, `.ot-sidebar-rest` the remainder) over `.ot-sidebar-links`; a link is `.ot-sidebar-link` holding `.ot-sidebar-text`. `aria-current="page"` on the current one. `data-folded` folds the list; `data-compact` sets it a size down with the links closed up, for a long index. While folded, one `.ot-sidebar-callout` (aria-hidden, `position: fixed`, `pointer-events: none`) is placed beside whatever is pointed at or focused.
- Unfolded: words, with a dot before the current page and a ring before the one pointed at. Folded: a ruler about 3rem wide (`--ot-sidebar-rail`) on the column's own hairline. Each group keeps its roman numeral ("VI Controls" keeps VI) or else its initial, in pencil (ink for the group you are in); each link is a short tick off the hairline that stretches when pointed at; the current page's tick is the longest, with the accent dot at its far end. Both modes say the same thing: where you are, and what each thing is called.
- Pointing at a tick, or focusing it, names it in the margin: a leader line is drawn from the tick to its full name, the group's name beneath, and any `preview` (a sentence) after a beat. Pointing at a numeral names the whole group. It stays inside the window, never takes the pointer, and Escape puts it away. The words stay in the page as the link's accessible name, folded or not; the callout is a pointer aid and is hidden from assistive technology.
- The words fold away in turn (`--ot-arpeggio`) while the ticks grow; with reduced motion it is instant.
- Scrolling: the nav is the scroller and takes the scrollbar's rail, which rides the column's own hairline (`--line: 0`). Folded ticks are 1.5rem tall so each is a target.
- `variant` on the list (`data-variant`): `words` (the default), `chapter` or `numerals`. Both apply unfolded, in the column and the sheet; folded, every variant is the same ruler.
- chapter: a book's running contents, open only at the chapter you are reading. The group holding the current page stands open, its label in ink; every other group keeps only its label. A still pointer (a 240ms wait) opens one under its name, and focus opens it at once, so Tab still reaches every link; leaving closes it. The links stay in the page for assistive technology.
- numerals: "14 Where my feet stand, 08 there i take a photo". Each group's place (01, 02, a CSS counter, drawn and not read) stands large in the margin (`f` 300, tabular), in pencil, ink for the group you are in or point into. The label, a leading roman numeral and all, and the links sit small beside it (`pp` over `p`), from the numeral's cap height; the numerals share one column (subgrid), so they align. A roman numeral isn't set large: at display size a grotesque's I is a bar.
- Keyboard: links (Tab moves tick to tick and shows each name), plus the fold button you give it (`aria-expanded`, `aria-controls` naming the nav). Below 860px the same words open in a sheet and never fold.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Sidebar (`sidebar`) | Fold | The words fold to their initials in turn |
| Chapter sidebar (`sidebar`) | Open | A still pointer opens a closed group under its name; leaving closes it |
| Numerals sidebar (`sidebar`) | Ink | Pointing into a group inks its number |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Sidebar (`sidebar`) | "It has to be design." | Folded, each word keeps its initial |
| Chapter sidebar (`sidebar`) | A book's running contents | Only the chapter you are in stands open |
| Numerals sidebar (`sidebar`) | "the silence that heals" (14 / 08) | Each group's number large, its links small beside it |
