# 0nlyType: typography

Extracted from DESIGN.md.

### ot-prose (typography)
- Underneath: native.
- Anatomy: `<article class="ot-prose">` wrapping plain HTML: headings, `p`, `.ot-prose-lead`, `blockquote`, lists, `code`.
- Text-size `em`, `i` and block quotations use the expression reading grade from base. Nested italics do not multiply the scale again. Italics inside display headings keep their display settings.
- swiss (the default, `data-variant="swiss"`): set for reading at `--ot-measure`. Headings step by the dynamics; quotes are in the expression; quote marks and list dashes hang in the margin so the edge stays true (`hanging-punctuation` where supported); numbered lists step in instead, a number being too wide to hang, so the numbers stand on the edge. A nested list steps in by its dash, so its dash hangs under its parent's words, and list items take half a paragraph's pause (0.5em) between them. Code is the voice, condensed.
- book: the page of a book, by the compositor's rule "indent or space, never both" (Tschichold's Penguin rules, Bringhurst). Paragraphs follow on with no space between them, each indented an em and a half, and the first after a heading or a break flush; they are justified and hyphenated, with old-style figures where the face has them. The opening line after a heading is set in spaced capitals (`::first-line`, so it re-sets itself at every width). A break (`hr`) is a dinkus of three spaced dots instead of a rule. Quotes are indented both sides at body size.
- run-on: the scribe's paragraph. A passage's paragraphs run on as one block, and where each begins a pilcrow (¶, the expression face, ink, decorative to screen readers) stands in the line: the silence between paragraphs is kept as one mark. The lead and anything that isn't a paragraph stay blocks. For short passages; long reading wants swiss or book.

## Motion

No item-specific row is defined in DESIGN.md. Read the general rules in DESIGN-core.md and the contract above.

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Prose (`typography`) | Swiss typesetting | Hanging punctuation keeps the edge true |
| Book prose (`typography`) | The book page: "indent or space, never both" | Paragraphs indented, not spaced; the opening line in capitals; a dinkus for a break |
| Run-on prose (`typography`) | The scribe's pilcrow | Paragraphs run on as one block, a ¶ where each begins |
