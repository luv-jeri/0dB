# 0dB: data-table

Extracted from DESIGN.md.

### db-data-table (data-table)
- Underneath: `table`, `pagination` and `select`, composed; native controls throughout.
- Anatomy: `<div class="db-data-table" data-variant="folio | tail">` holding `.db-data-table-filter` (a sentence, "Show [all] projects", its chosen word a `db-select`), the `db-table`, and `.db-data-table-foot`: `.db-data-table-count` (`role="status"`, "1 to 8 of 24 projects") and either the folio pager or, in a tail, `.db-data-table-more`. Rows that come into view carry `data-arriving` and `--k`, their place in the turn.
- The filter is a sentence, not a toolbar: the chosen word is italic, as yours, and the noun ends it. Narrowing returns to the first page and the rows that stay glide to their places, as the table's do on a re-sort; the sorted column is in ink (forte sets it loud). Pressing a heading sorts by it, a numeric column largest first; pressing again turns the order round.
- `variant`: folio (the default): a page at a time; the count stands at the start of the foot line in pencil, the book's folio (the page over the total, `pagination`'s folio) at its end. Turning a page keeps focus in the pager, and the new page's rows arrive in turn. tail: the table ends in the rest of itself, as the collapsible does: "and 16 more" is the control, straight under the last rule; the next rows arrive in turn under it, and once all are shown it says Show fewer.
- Empty: a filter that keeps nothing says so in a line ("No print projects.") and offers "Show all projects"; there is no picture.
- Keyboard: native buttons, links and the select. Reduced motion: the tempos fall to nothing, so rows simply appear.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Data table (`data-table`) | Glide, then arrive | Narrowed or sorted, the rows glide; a new page's rows arrive in turn |
| Tail data table (`data-table`) | Arrive | The next rows arrive in turn under the last |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Data table (`data-table`) | "Renaissance." two colours; the book's folio | The filter a sentence, the sorted column in ink, the count and the folio on the foot line |
| Tail data table (`data-table`) | The collapsible's tail; "the silence that heals" captions | The table ends in the rest of itself: "and 16 more" |
