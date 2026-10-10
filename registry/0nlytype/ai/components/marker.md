# 0nlyType: marker

Extracted from DESIGN.md.

### db-marker (marker)
- Underneath: native.
- Anatomy: `<p class="db-marker">` for a status (with `.db-marker-dot`), or `data-variant="divider | ribbon | lapse"`. A lapse carries `--lapse` (0–1, from `minutes`). A divider may carry `data-orientation="vertical"`. `data-arriving` plays it.
- A quiet line in the flow. A divider draws its rules outward from the word, as if the word pushed them apart; the word stands on them, as "Less is more." sets its rules on the baselines.
- Rule: a divider with no word is a plain rule (`role="separator"`): the two rules meet, one unbroken hairline, and arriving it still draws outward from its middle. Vertical (`orientation="vertical"`, divider only): the rule stands up between two things in a row, as tall as the row, as "Less is more." rules its columns. The marker turns on its side (`writing-mode: vertical-rl`), so a word reads down it like a book's spine, the rules running above and below it and drawing outward from it.
- Ribbon: where you left off, after the ribbon sewn into a book to keep your place. One accent line (`--db-stroke`) runs from the inline start to the word at the end ("New"), in the accent, because it marks where you are. Arriving, it draws from where you started reading. It is the one accent in a thread; forced colours draw it in Highlight.
- Lapse: a pause in the conversation, given as silence (Principle 1, literally). No rule at all: the room above and below the words and the space between their letters both grow with how long it went quiet, on a log scale from a minute (a breath) to a week (the widest). The words stay centred however far they're tracked. A joined script (Arabic, Persian, Urdu, by `lang`) is never tracked apart; its word spaces widen instead. Arriving, the silence opens and the letters spread.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Marker (`marker`) | Spread | The rules draw outward from the word, or from the middle of a wordless rule (up and down when it stands) |
| Ribbon marker (`marker`) | Drawn | The accent line draws from the start to the word |
| Lapse marker (`marker`) | Opening | The silence opens around the words and their letters spread |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Marker (`marker`) | "Less is more." rules | Rules pushed apart by the word, which stands on them |
| Ribbon marker (`marker`) | The ribbon in a book; one accent for where you are | One accent line across the page where you left off |
| Lapse marker (`marker`) | Principle 1; "Renaissance." spread labels | The pause given as room and tracking, longer silence, more of both |
| Rule marker (`marker`) | "Less is more." rules its rows and columns | A wordless rule, lying or standing; a word stood up reads down it like a spine |
