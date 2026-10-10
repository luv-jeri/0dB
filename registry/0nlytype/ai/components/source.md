# 0nlyType: source

Extracted from DESIGN.md.

### db-source (source)
- Underneath: build-time highlighting with sugar-high, plus a Copy hook.
- Anatomy: `<figure class="db-source">` (an inline-size container) holding `.db-source-frame`: a `figcaption.db-source-meta` (the file name, its extension in pencil, and Copy), then `<pre class="db-source-code" tabindex="0"><code>` with one `.sh__line` per line, each carrying its depth as `--i`.
- Code is type, set in the voice at 88% width. Weight is the only highlighting: keywords are ink at 500, signs recede to pencil, and what someone wrote (strings, JSX text, comments) is the expression italic. There's no second colour.
- Indentation is space you can see: a proportional face makes two spaces nearly nothing, so each leading space becomes half an em. Lines wrap rather than scroll sideways, and a turnover hangs a step further in, like verse.
- A bracket joins the lines like a system in a score, and the line numbers stand before it like bar numbers (none for a single line). When the frame is 34rem or wider, the file's name and Copy stand in the margin, the way a score names its instrument; narrower, they sit above the lines.
- Copy is a quiet button. It keeps its name through the flow: the label rolls from Copy to Copied, then back, and the accent runs down the bracket once.
- gloss (`data-variant="gloss"`): the glossed manuscript, and Knuth's literate programming. A line that is only a `//` comment is what someone wrote about the code, so it becomes a note (`.sh__line[data-gloss]`; neighbouring notes travel together in one `.db-source-gloss`). When the frame is 46rem or wider the note leaves the lines for the outer margin, drops its slashes and stands in small italic level with the line it explains (an absolutely placed block keeps its place in the flow), while the code closes up and keeps its true line numbers. Notes on neighbouring lines queue, the later one stepping down just clear of the one above, as a book's sidenotes do. Pointing at a note inks the line it explains, and pointing at the line inks its note. Narrower, the notes stay in the lines.
- passage (`data-variant="passage"`, `passage={[from, to]}`): the reader's pencil line down the margin beside the lines that matter. The bracket that joined the system gathers to the passage (`.sh__line[data-passage]`, drawn per line with hooks at its ends) and inks; the passage is ink and every other line recedes to pencil at weight 400. Copying runs the accent down the passage line by line, then it settles back to ink.
- Unwrapped (`wrap={false}`, `data-wrap="off"`): SPECTRA's word cropped by the frame. Each line is kept whole and runs on past the frame's end, and the lines scroll sideways inside `<code>` (which then takes the focus, so the arrow keys scroll it). The lines stop being positioned, so the numbers and the passage's line are placed from the `<pre>`, outside the scroller: they keep their place while the code slides under the bracket.
- `language`: the language named in the margin under the file's name (`.db-source-lang`), in the pencil's small capitals, as a score marks its key. Only when given.
- Code reads left to right on any page: the `<pre>` carries `dir="ltr"`, so a right-to-left page doesn't reorder it; the margin and the meta still follow the page.
- Keyboard: the code block takes focus so a screen reader can land on it; Copy is a button.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Source (`source`) | Run | Copying runs the accent down the bracket once; the label rolls to Copied |
| Gloss source (`source`) | Answer | Pointing at a note inks its line, and pointing at a line inks its note |
| Passage source (`source`) | Run | Copying runs the accent down the passage, line by line, and it settles back to ink |
| Unwrapped source (`source`) | Slide | Only your scroll moves the lines; the numbers and the bracket stay |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Source (`source`) | The score's system bracket and bar numbers | A bracket joins the lines; the file's name stands in the margin |
| Gloss source (`source`) | The glossed manuscript; Knuth's literate programming | Comments leave the code for the outer margin, level with their line |
| Passage source (`source`) | The reader's pencil line in the margin | The bracket gathers to the lines that matter; the rest recede |
| Unwrapped source (`source`) | SPECTRA crop; the score's key signature | Lines run whole past the frame and slide under the fixed bracket; the language in small capitals |
