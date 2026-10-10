# 0nlyType: menubar

Extracted from DESIGN.md.

### ot-menu, ot-menubar (dropdown-menu, context-menu, menubar)
- Underneath: Radix DropdownMenu, ContextMenu and Menubar.
- Anatomy: `<div class="ot-pop ot-menu" popover role="menu">` holding `.ot-menu-label` headings and `<button class="ot-menu-item" role="menuitem">` (or `menuitemcheckbox` with `aria-checked`), each with optional `.ot-menu-keys`. `data-variant="danger"` for a destructive item. A menubar is `<div class="ot-menubar" role="menubar">` of `.ot-menubar-trigger` buttons on a hairline; each menu is a `ot-menu` hung in that hairline. A context menu is an `ot-menu` with `data-at="point"`, placed where the person pressed.
- The item you point at is marked with the highlighter. Items arrive in turn. A menubar opens its hairline into a pocket under the open word: the menu rises over the rule, its paper hides the rule there, and its sides and foot carry the same line on, down, along and back up. The word and its menu are one shape, with no leader and no stroke. The menu unrolls down out of the line and rolls back up into it. Its words stand under the word, and the bar's words sit in from the rule's ends by a menu's own inset, so the first menu folds from the rule too. With no room below, it turns above the words in a whole frame. Focus on a word is the accent stroke laid on the rule under it. A context menu spreads from the point like ink (`ot-spread`); it opens toward the line's end and down from the point, back from it without room, and on a phone slides in to fit. A submenu opens beside its item; on a narrow screen, with room on neither side, it drops open under the item, in by the words' inset, the next level of an outline, and hangs from the item on the popover's leader (`data-drop`): the dot on the marked item's foot, the line dropping over a strip of paper. The item's arrow turns down while it is open. Shortcut keys (`dir="ltr"`) read ⌘Z in either direction. Without a `dir`, each menu takes the direction of the page around its trigger or bar, so on a right-to-left page it hangs from the right end, submenus open to the left, and the arrow keys mirror.
- `variant` on the list (`DropdownMenuContent`, `ContextMenuContent`; `data-variant`): `list` (the default) or `leaders`, and also `marginalia` on a dropdown menu or `orbit` on a context menu. On the `Menubar` root: `pocket` (the default), `leaders` or `caption`. Under every variant a context menu's point is pinned by a cross, the register mark of "the uncreative", over the menu's corner, and the menu spreads from it.
- leaders: a book's contents page. Each word is joined to its keys (or a submenu's arrow) by a row of leader dots in `rule-strong`; a word with neither has none, and the words don't wrap. The highlighter stands down: the word you point at inks, and its dots ink from the word to its keys, passing through as the highlighter does. Submenus keep the leaders. A menubar set to `leaders` sets every menu so, in its pocket.
- marginalia (dropdown menu): the small notes on hairline arrows of "It has to be design.". Each item's `hint` is a note (`pp`, graphite, at most 13em) hung beside the list at the height of the word you point at, on a hairline arrow pointing back at it; it glides from word to word, and a word without a hint leaves the margin empty. The list keeps its highlighter. With no room beside the list (under 220px) the note stands under it as its caption, without the arrow. The note is aria-hidden: each item carries its hint as its `aria-description`.
- orbit (context menu): after WOVE. The words stand on an arc bowed away from the point, one dot on the arc for each; the one you point at inks and its dot lands as the accent. The arc is the panel's edge: the paper lies only outside it, and the panel's hairline and shadow stand down. Every row is one step high, and the words swing out to the arc as they arrive. Put items straight in the list (a group counts as one step); a separator is a step of silence with a short rule in it. In forced colours the arc gives way to a framed panel and the dots stay.
- caption (menubar): the label at the far end of the SHAPES / GRADIENTS frame, and an editor's status line. The bar's far end keeps a small line of where you are, the path from the open word to the item you point at, parted by slashes (File / Export / As PDF); its last step inks and arrives as you move. At rest it shows the bar's `aria-label` in pencil. Below 40rem only the last step shows. It is aria-hidden, since the menus already name the path.
- Forced colours: the highlighter gives way to the system's `Highlight`; leaders' dots and the marginalia arrow are `CanvasText`; orbit's pointed dot is `Highlight`. Reduced motion: the dots, the note and the caption move straight to their places.
- Keyboard: Down and Up move, Home and End go to the ends, Enter runs, Escape closes, Tab closes and moves on. Right opens a submenu and Left closes it (mirrored right to left). In a menubar, Down opens, and Left and Right move between menus, open or closed. The context menu opens with the ContextMenu key or Shift+F10.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Menubar (`menubar`) | Pocket | The rule folds down around the open menu and back up; the menu unrolls out of it and rolls back in |
| Leaders menu (`dropdown-menu`, `context-menu`, `menubar`) | Pass-through | The dots of the word you point at ink from the word to its keys and leave the same way |
| Caption menubar (`menubar`) | Arrive | The path's last step arrives as you move |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Menubar (`menubar`) | SHAPES / GRADIENTS frame; the folder tab | A frame row of words on a hairline that opens into a pocket under the word |
| Leaders menu (`dropdown-menu`, `context-menu`, `menubar`) | A book's contents page | Leader dots join each word to its keys |
| Caption menubar (`menubar`) | SHAPES / GRADIENTS frame label; an editor's status line | The path to where you are, at the bar's far end |
