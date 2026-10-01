# 0dB: item

Extracted from DESIGN.md.

### db-item (item)
- Underneath: native.
- Anatomy: `<ul class="db-items">` of `<li class="db-item">` holding `.db-item-body` (`.db-item-title`, `.db-item-desc`), `.db-item-leader` (aria-hidden), then `.db-item-end` (a value or an action).
- A ledger line: what it is, a dotted leader, what you can do. As on a contents page, the title, the dots and the value share one baseline (the picture at the start centres on the line). Pointing at the line inks the leader from one end to the other.
- `variant` on the group (`data-variant`): `leader` (the default), `lineation` or `words`.
- lineation: a critical edition's line numbers. Every fifth line carries its number (a CSS counter, `pp`, pencil) hung in the margin on the line's baseline; the line you point at or focus shows its own, in ink. The numbers are drawn (`content: counter() / ""`), since the list already says where you are. Below 40rem the margin is too narrow, so the numbers step in and every line makes room for them.
- words: SPECTRA's small print run along a contents line. The description runs in after the title (`pp`, pencil, one line) where the dots would be; a long one runs out in an ellipsis just before the value, and a short one leaves the dots to finish the line. Pointing inks the words to graphite with their leader. The whole sentence stays in the page for screen readers.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Item (`item`) | Ink | The leader inks from one end to the other |
| Lineation items (`item`) | Ink | The pointed line's number inks in the margin |
| Words items (`item`) | Ink | The words ink to graphite with their leader |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Item (`item`) | Contents pages | A dotted leader joins name and value |
| Lineation items (`item`) | A critical edition's line numbers | Every fifth line numbered in the margin; the line you point at shows its own |
| Words items (`item`) | SPECTRA's small print; contents pages | The description runs along the leader and runs out before the value |
