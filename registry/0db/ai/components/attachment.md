# 0dB: attachment

Extracted from DESIGN.md.

### db-attach (attachment)
- Underneath: native.
- Anatomy: `<ul class="db-attachments" data-variant="reverse | enclosure">` of `<li class="db-attach" data-state="idle | uploading | processing | done | error">` holding `.db-attach-ext` (`data-ext`), `.db-attach-body` (`.db-attach-name`, `.db-attach-meta`), and `svg.db-attach-ring` (`.db-attach-track`, `.db-attach-arc`, `.db-attach-fill`). Script sets `--p` (0–1). Enclosure sets `data-count`, `data-enclosure-label` from `enclosureLabel` (default `"Encl."`) and `aria-label="Enclosures"` (overridable through the native prop).
- A file's extension is its picture, set wide and thin. A ring counts it in and goes pencil while it's checked; when it's safe the ring closes and gives way to a full stop (`--db-dot`), which lands with spiccato: a ring round a dot would read as a chosen radio. Failed, the ring turns crimson and the line says what happened, with a bracket Remove. Narrow (below 30rem), Remove steps down under the name so the name keeps the width. `removeLabel` gives the button its word (default `"Remove"`); its accessible name is that word followed by the file name.
- Reverse, after "the uncreative", where part of a word is reversed out of an ink block. No ring: the extension is set heavy and tight, and a block (`.db-attach-ext::after`, the same letters in paper) prints across it as `--p` grows, so each letter turns from ink on paper to paper on ink as the file arrives. Checking, the block is pencil; safe, it is ink; failed, it stops in crimson where the connection dropped. Right to left it prints from the right. Forced colours: the block is `CanvasText` with the letters in `Canvas`.
- Enclosure, after the business letter's enclosure line (the Weingart letter). The list is one sentence: "Encl. (2)", then each file's name, yours in italic, its size or status in parentheses, a semicolon between and a full stop at the end. The extension and a safe file's ring are dropped; a small ring stays inline while a file is on its way. Meant for what has been sent, under a message. The name and parenthesised status wrap to the available measure, including long unbroken names; no content is hidden to fit.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Attachment (`attachment`) | Count in | The ring fills, closes, and gives way to a full stop that lands |
| Reverse attachment (`attachment`) | Print | The ink block runs across the extension as the file arrives |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Attachment (`attachment`) | "the uncreative" | The extension is the picture |
| Reverse attachment (`attachment`) | "the uncreative" | The extension reversed out of ink, printed across as it arrives |
| Enclosure attachment (`attachment`) | Weingart letter; the letter's enclosure line | "Encl. (2)", the files run on in one sentence |
