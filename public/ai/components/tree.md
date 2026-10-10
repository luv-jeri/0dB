# 0nlyType: tree

Extracted from DESIGN.md.

### ot-tree (tree)
- Underneath: native `<details>` and `<summary>` for folders; `item` rows for leaves (a `<button>`, or a link with `href`); `collapsible` for a long folder's rest.
- Anatomy: `<div class="ot-tree" data-variant="outline">` of `ul.ot-tree-list`; each `li.ot-tree-node` (`data-kind="leaf | folder"`) is a leaf `.ot-item.ot-tree-row` holding `.ot-tree-name`, or a `details.ot-tree-folder` whose `summary.ot-tree-row` holds the name, its count as a raised `sup.ot-tree-count` (read as ", 3 items") and an optional value after the item's leader. A folder longer than `limit` ends in `li.ot-tree-tail`.
- branch (the default): contents pages and Paul Rand's dimension lines. A hairline branch hangs from under each open folder's first letter and every name sits on it at a dot; the last one stops the branch at its dot. A leaf is a small graphite dot, a closed folder a hairline ring, an open one a filled dot; the chosen leaf's dot is the one accent (it lands with spiccato) and its name turns italic, as yours. No icons, no boxes: the depth is read off the lines.
- outline: a book's decimal contents and the numbers-as-data of "the silence that heals": each name numbered by its place (1, 1.2, 1.2.3) in a pencil column, flush at every depth and without lines; top-level names set firm. An open folder's number inks, the chosen leaf's is the accent.
- Opening a folder you touched draws its branch down (`ot-draw-y`) and its names arrive in turn; folders open from the start are simply there. The contents slide open (`::details-content`).
- Keyboard: Tab and Enter or Space work natively. The arrows walk it as a tree: Up and Down through what shows, Right to open a folder or step into it, Left to close it or step out to its folder, Home and End to the ends; Left and Right follow the page right to left.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Tree (`tree`) | Grow | Opening a folder draws its branch down and its names arrive in turn; the chosen dot lands |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Tree (`tree`) | Contents pages; Paul Rand's dimension lines | Names on hairline branches, each hanging from its folder's first letter; ring, dot and accent |
| Outline tree (`tree`) | The book's decimal contents; "the silence that heals" numbers as data | The depth is in the numbers: 1, 1.2, 1.2.3 |
