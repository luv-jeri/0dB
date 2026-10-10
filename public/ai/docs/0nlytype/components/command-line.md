# 0nlyType: command-line

Extracted from DESIGN.md.

### db-command-line (command-line)
- Underneath: native, plus a hook that shares the runner pick between every command line and remembers it (`localStorage` key `0db-runner`).
- Anatomy: `<figure class="db-command-line">` holding an optional `.db-command-line-runners` radio group (npm, pnpm, yarn, bun), then `.db-command-line-row`: `<code class="db-command-line-text">` and Copy.
- One line to type, set on a baseline like a field already filled in. The runner and the address recede to pencil; the command is ink; `emphasis`, the part of an address that's the reader's, is the expression italic. A long line breaks after a slash or a dot and its turnover hangs; the emphasised name moves to a new line whole with what follows it, and breaks after a hyphen only when it's wider than the line.
- The runner words are a radio group: the chosen one turns italic with the dot beneath it, and every command line on the page follows.
- Copying draws the baseline in the accent, left to right, then lets it go; the label rolls from Copy to Copied.
- parsed (`data-variant="parsed"`, `glosses`): the interlinear gloss, a linguist's word-by-word reading, and the dictionary entry of "the uncreative", the part of speech set small under the word. Each glossed word (`.db-command-line-word`) stands over a short rule the width of the word, its gloss (`.db-command-line-gloss`) hung beneath in small pencil type; the words keep one baseline and each column is as wide as its word or its gloss. Pointing at a word inks its rule and its gloss. The glosses are hidden from screen readers and read once after the command instead, word by word.
- synopsis (`data-variant="synopsis"`, `blank`): a manual page's synopsis, where the words you replace are set in italic. The `emphasis` becomes a blank you write in (`input.db-command-line-blank`, labelled by `blank`), in your italic on a hairline of its own; it grows with what you write (`field-sizing: content`, with `size` as the fallback), spaces are refused, an empty blank shows the original in pencil, and Copy copies your line. Focus draws the accent under your part only.
- The command reads left to right on any page (`dir="ltr"` on the `<code>`); a long address breaks after a slash, never inside `//`.
- Keyboard: arrows move between runners; the synopsis blank is a text field; Copy is a button.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Command line (`command-line`) | Drawn | Copying draws the baseline in the accent, left to right, and lets it go |
| Parsed command line (`command-line`) | Ink | Pointing at a word inks its rule and its gloss |
| Synopsis command line (`command-line`) | Fill in | The blank grows with what you write; focus draws the accent under it |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Command line (`command-line`) | A printed form's filled-in line | One line on a baseline; your part in italic |
| Parsed command line (`command-line`) | The interlinear gloss; "the uncreative" definition | Each word over a short rule, its gloss beneath |
| Synopsis command line (`command-line`) | A manual page's synopsis | Your part is a blank you write in; Copy copies your line |
