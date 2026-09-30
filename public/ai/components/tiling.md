# 0dB: tiling

Extracted from DESIGN.md.

### db-tiling (tiling)
- Underneath: native CSS grid. `Tiling` and `Tile` keep their static server-rendered markup, responsive rules and crosses. `TilingEditor` is an opt-in interactive part in the same client entry; every part is server-renderable, with no browser work during render.
- Anatomy: `<div class="db-tiling" data-variant="rules | crosses">` (the container its narrow layouts are measured against) holding `.db-tiling-sheet`, the grid, of `.db-tile`s (`data-place="start-top | end-top | start-foot | end-foot"`, `--span` and `--rows` from `span` and `rows`). Each tile's lines are its `::before`.
- The type-led answer to 000h's bento-grid, after "Less is more.": tiles on the 12-column grid held apart by space (`--db-space-6`) and one ink hairline, never boxed, filled or rounded. Named for the tiling of a plane, which leaves no gaps and no overlaps: neighbours share an edge, so each tile draws only its start and top edge, halfway into the gap, and one line serves both sides (the top line whole, the start line under it, so no pixel is drawn twice). The edges that would fall on the tiling's own border lie half a gap outside it and are clipped, so nothing frames the whole; the lines that stay run a step (`--db-space-2`) past the edge, as a draughtsman's construction lines overrun, and focus rings keep that step of room.
- A tile's content keeps to one corner (`place`), as the poster keeps its notes; the end corners set it flush to the end. A child with `margin-block-start: auto` goes to the foot, so one tall tile can hold a note at its head and a paragraph at its foot. Type is the content: a headline a word to a tile, standing at the foot on its line; a large number in the last corner.
- Narrow (a tiling under 40rem, by container query), twelve columns' gaps alone would outgrow it, so the sheet falls to two columns: a tile of 6 columns or fewer takes one, a wider one both. Under 24rem it is one column, every tile the whole width and one row high.
- `variant` (`data-variant`; none for the default, `rules`): `crosses`.
- crosses: after "the uncreative", which marks the corners of its block with + signs. No lines: the space alone holds the tiles apart (Principle 1), and a registration cross in the pencil (`--db-space-3` arms) stands on every corner of every tile, where neighbours' crosses coincide; the outer ones stand half a gap outside the block, unclipped.
- Right to left the start edge, and so the vertical lines, are on the right. Forced colours keep the lines and crosses in CanvasText.

- Editor anatomy: `.db-tiling.db-tiling-editor` (`data-slot="tiling-editor"`, `data-variant="rules | crosses"`) holds a named toolbar, instructions, a keyboard-focusable scrolling region, numbered columns and the same sheet and tiles. The viewport keeps a twelve-column canvas at least 48rem wide; on a phone it scrolls instead of changing saved coordinates. Fixed rows (`--db-tiling-row`, space-9) keep pointer snapping independent of content height. Content can scroll inside a small tile; the handles stay outside that content.
- Its move is the drafting sheet: pencil construction rules behind the shared ink hairlines, or construction dots behind crosses. The held tile alone wears `db-corners` in the accent, after "the silence that heals", without a fill or a ghost. The tile itself changes place. Its label is the person's, in the expression italic; the handles are our words, "move" at the head and "size" at the foot. Add tile, Remove tile (the held tile) and optional Copy layout stand as words above the sheet.
- `TilingLayout` is a plain array of `{ id, label, column, row, span, rows }`, with exported `TilingItem` and `TilingEditorProps`. Coordinates are positive whole numbers starting at 1 from the inline start; spans stay within twelve columns and row spans are at least 1. Ids and labels are non-empty, ids unique, tiles non-overlapping. Invalid supplied layouts show a visible alert. Empty space is allowed. Occupied or out-of-bounds edits stay put and say why; no neighbour is silently rearranged.
- `value`, `defaultValue` and `onValueChange` offer controlled or uncontrolled data. Every accepted edit, including addition, removal and Escape restoration, sends a fresh array; mounting does not. `renderTile` supplies content separately from the data. `copyLayout` offers both JSON on the page and a clipboard action; if the clipboard refuses, the JSON opens and is selected for manual copying. `defaultHeld` starts a specimen with that id picked up. New tiles take the first free four-column space, one row high.
- Keyboard: Enter or Space on either handle picks up and puts down; arrows move one cell, Shift + arrows resize one span. Arrows on size also resize. Escape restores the picked-up rectangle, preserving other tiles' external changes; if its old space has since been occupied, it stays where it is and announces the conflict. Add focuses the new move handle; Remove focuses the next remaining handle or Add when empty. Drag either word with pointer capture; release puts down, cancellation restores. RTL mirrors horizontal keys and pointer deltas. Tab remains ordinary focus navigation.
- A visible polite, atomic live region says every edit, including its coordinates and size: "Tile 3 moved to column 5, row 2. 4 wide, 2 high." It also names pickup, put-down, cancellation, deletion, limits and clipboard results. Column numerals and JSON stay left to right and isolated; the English status stays left to right. Forced colours retain construction and separation marks and use Highlight for the held corners; focus on the held handle is underlined within its corner marks.
- Motion: Glide, only in answer to a keyboard edit or restoration, over moderato with breath. Pointer edits snap directly to the grid. Mounts and external value updates never glide. Reduced motion changes geometry without travel. States: static rules and crosses, editing, holding, RTL editing and empty.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Editable tiling (`tiling`) | Glide | The tile itself glides to a keyboard-chosen position; pointer and reduced-motion edits place it directly. Nothing moves on mount or an external update |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Tiling (`tiling`) | "Less is more."; Paul Rand's overrunning construction lines | Tiles held apart by one shared hairline, none round the outside; notes kept to the corners |
| Crosses tiling (`tiling`) | "the uncreative" + corner signs | No lines: a registration cross on every tile's corners |
| Editable tiling (`tiling`) | Paul Rand's construction sheet; "the silence that heals" corner marks | Pencil geometry stays visible while a held tile wears the one accent frame; words move and size it |
