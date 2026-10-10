# 0nlyType: sheet

Extracted from DESIGN.md.

### db-sheet, db-drawer (sheet, drawer)
- Underneath: native `<dialog>`, through the dialog item.
- Anatomy: `<dialog class="db-sheet" closedby="any">` with `.db-sheet-spine` (the title again, aria-hidden). `<dialog class="db-drawer" closedby="any">` with `<button class="db-drawer-handle">`. Both share the dialog backdrop.
- A sheet is a page slid in from the end edge, its title running up the spine like a book's (`db-spine`), in its own column: the sheet's start padding, on the left, or the right in right-to-left. A drawer rises from below and lands with spiccato; its handle is the fermata's arc. Dragging the handle down sets `--pull` and `data-pulling`, and past a threshold it closes.
- Keyboard: Escape closes; the handle closes on Enter. Smooth scrolling pauses while open.
- Sheet variants go on `data-variant` (`SheetContent variant`): spine (the default), shelf, rag, fold.
- Shelf, after books standing on a shelf: a sheet opened from inside a shelf sheet stands in front of it, one spine column narrower, so the spine behind stays in view, set back to pencil, and is the way back: pointing at it (the bare backdrop) or Escape puts the front sheet away and focus returns to the control that opened it. Only the front sheet blurs the page. Below 40rem the column is space-7 and the spine mf.
- Rag, after "Healthy habits" cut from its paper and "Less is more." set flush right: the words stand flush to the window's edge and rag toward the page, and the paper is cut to that rag, a step for every line, with a hairline along the cut. The script reads the line boxes (after the fonts), draws `<svg class="db-sheet-rag" aria-hidden="true">` behind them and sets `data-laid`; until then it is plain paper with its edge. The box hangs from the top only as tall as its words, and a click on its bare part is a click outside. Start and end sides only. It re-cuts on resize and when `<html>` changes its face. Forced colours: Canvas paper, CanvasText cut.
- Fold, after the index entry that opens to its page and "Less is more." set between its hairlines: the row that opened it unfolds into the page. Before it opens (and again before it closes) the sheet writes the opener's box to `--fold-t/r/b/l`; the page is clipped to that band and opens out to the window, the row's two hairlines (ink, `::before` and `::after`) riding the clip's edges to the top and the foot, while the row's name (its `rows-title`, or the trigger's own words) grows into the title, set at `--db-ff` (`--db-f` below 40rem), by a transform measured from one to the other so their first lines meet. The rest arrives once there is room. A reversed row opens from its ink (`data-from-ink`: the page starts ink and washes to paper). Put away, it folds back into the row and the title flies back to the name. The whole window, no spine; `side` is ignored. The trigger remembers itself (`SheetTrigger`), so open it from `<Row asChild><SheetTrigger>` with one Sheet round the Rows; opened by state alone, a line across the middle parts. Reduced motion: it opens at once. Forced colours: the lines in CanvasText.
- Panels (`SheetPanels`, `.db-sheet-panels` holding `nav.db-sheet-spine.db-sheet-trail` and `section.db-sheet-panel` pages): pages inside one sheet, the chapters of the book on its spine, and the scale contrast of "It has to be design.". The spine becomes the trail, read up from the foot (right to left as well): the names you came through small (`mp`) in the pencil, the one you are in large (`f`, 200) in ink, `aria-current="page"`. Stepping in (`SheetPanelLink to`), the name you left shrinks into the trail and the new one writes up the spine; the new page slides in from the sheet's own edge while the old one leaves the other way, the two crossing in one grid cell (`hidden` and `inert` on the pages you are not in, the exit kept by `display` allow-discrete). The small names are buttons and the way back. Focus goes to the new page's heading, and going back returns it to the link that stepped in; the sheet scrolls to the top. Each opening starts at the root, whose title names the dialog. Below 40rem the trail is `mf` over `p`. It belongs to the sheet, not the drawer: a sheet is already a page with a spine to carry the path, where a drawer is a tray whose height the thirds decide.
- Drawer variants go on `data-variant` (`DrawerContent variant`): arc (the default), thirds, solid.
- Thirds, after SPECTRA's "1/3": the drawer stops at a third, two thirds or the whole height, and the share stands at the top end corner as a Fraction (aria-hidden), thin and large. The handle is then `role="slider"` (vertical, 1 to 3, "2 of 3"): drag it to the nearest third, or lower than half a third to put it away; a tap or Enter raises it a third, round to one; the arrow keys, Home and End step it. Each opening starts at a third.
- Solid, after the compositor's leads: pulling the arc first takes the silence out between the drawer's parts (`--solid` from 0 to 1 closes the gaps and the padding), as type is set solid when the leads come out; only once it is set solid does the drawer itself move, and letting go past that closes it. Its give is the height it loses, measured on pointerdown. Keyboard as arc.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Sheet (`sheet`) | Spine | The page slides in; the title runs up the spine |
| Shelf sheet (`sheet`) | Spine | The front sheet slides in over the one behind; that spine sets back to pencil |
| Rag sheet (`sheet`) | Reach | The cut is drawn down its steps as the sheet arrives |
| Fold sheet (`sheet`) | Unfold | The row's hairlines part to the window's edges as its name grows into the title; put away, it folds back |
| Sheet panels (`sheet`) | Spine | The name you left shrinks into the trail and the new one writes up the spine; the pages cross |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Sheet (`sheet`) | Book spines | The title runs up the spine |
| Shelf sheet (`sheet`) | Books on a shelf | The sheet behind shows its spine, and is the way back |
| Rag sheet (`sheet`) | "Healthy habits" silhouette; "Less is more." flush right | The paper is cut to the rag of its lines |
| Fold sheet (`sheet`) | The index entry that opens to its page; "Less is more." hairlines | The row's hairlines part into the page; its name grows into the title |
| Sheet panels (`sheet`) | Book spines; "It has to be design." scale contrast | The spine is the trail: the page you are in large, the way back small below it |
