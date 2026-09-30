# 0dB: reading-trail

Extracted from DESIGN.md.

### db-trail (reading-trail)
- Underneath: hook (reads the window's scroll), composed of `item` and, for the rail, `scrollbar`.
- Anatomy: `<nav class="db-trail" data-variant="contents | rail" aria-label="On this page">` holding `ul.db-items.db-trail-list` of `li.db-item.db-trail-step` (`data-state="read | now | ahead"`), each a link `a.db-trail-link` (`aria-current="location"` on the one you are in) with `.db-trail-num` and `.db-trail-name`, the item's leader, and its folio at the end (aria-hidden). Script sets `--db-trail-read` (0 to 1, how much of the section you are in is read) on the root. The rail adds `p.db-trail-head` (aria-hidden) and a `db-scrollbar` with `data-variant="page"`. `pinned` fixes the place for documentation. With no sections the root is a plain `div`, not an empty landmark.
- A contents page that reads along with you: each section's number and name, a dotted leader, and where on the page it is reached (00 to 100), as a book's contents give the page. What you've read keeps its leader in ink and its name in pencil; the section you are in has its number in the accent, its name and folio in ink, and its leader inks as far as you've read it; what's ahead waits on the dots. A section counts as reached when its top meets the middle of the window, as the scrollbar marks it; those too near the end to reach it share the last stretch.
- Contents (the default), after contents pages and SPECTRA's numbers-as-data: the list above, for a side column or the head of a page.
- Rail, after the title on a book's spine and the page scrollbar (Paul Rand's dimension lines): the scrollbar already marks where each section begins; the trail adds which one you are in. Its number (accent) and name run down beside the rail, set vertically like a spine, and turn in when you reach the next section. The head steps aside while you point at the rail, where the scrollbar's own numbers arrive. For the keyboard and screen readers, who can't use the rail, the contents stay in the page and come out beside the rail when focus reaches them. `--db-trail-top` keeps both clear of a fixed bar. The head shows only where the rail does (a fine pointer and scroll timelines).
- Keyboard: the links are the page's own anchors. Right to left the leader inks from the right and the rail's head moves to the left edge. Forced colours: the current number is Highlight.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Reading trail (`reading-trail`) | Ink | The current section's leader inks as far as you have read, following the scroll |
| Rail reading trail (`reading-trail`) | Turn | The spine's head rises in when you reach the next section, never on arrival |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Reading trail (`reading-trail`) | Contents pages; SPECTRA's numbers | The section you are in carries the accent and its leader inks as you read it; folios say where each is reached |
| Rail reading trail (`reading-trail`) | A book's spine; Paul Rand's dimension lines | The section you are in runs down beside the page's rail like the title on a spine |
