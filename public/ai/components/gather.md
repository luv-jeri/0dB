# 0nlyType: gather

Extracted from DESIGN.md.

### db-gather (gather)
- Underneath: native, plus a hook that measures every letter with pretext (`@chenglou/pretext`, loaded when it's needed) and an IntersectionObserver.
- Anatomy: `<h2 | h3 | p class="db-gather" data-variant="forme | coil" data-by="word | line">` holding the real text (`.db-gather-text`) and, while it runs, an aria-hidden `.db-gather-glyphs` with one span per piece (a letter, a word or a row), each carrying where it starts (`--dx`, `--dy`, and for the variants `--sx` or `--r`) and its place in the order (`--n`, and `--s` from 0 to 1). `data-phase` is `wait`, `dust`, `gather` or `scrub`, and is absent when it's plain.
- A line whose letters start as dust: scattered by a fixed hash of their index, at most 1.2em off their place, at pp opacity. They settle into place when the line scrolls into view (once) or, if it hasn't yet, when it's pointed at. Each letter travels for `--db-andante`, one `--db-arpeggio` after the last.
- Each letter's place is its x in the real line, kerning included, and its row, so the settled state is the real layout. When the last letter lands the real text is given back, so selecting and copying work; the text is in the DOM throughout for readers.
- forme: letterpress type stands in the chase mirrored and is read the right way round only once it's printed. Each row starts as its own mirror image, every letter flipped and at its mirrored place in the row, in pencil at full strength so the backwards line can be read; settling, each letter crosses to its place, turning over as it goes (it narrows to nothing halfway, like a sort turned in the fingers), and inks as it lands.
- coil: the text wound up like a ribbon. Every letter is set along one Archimedean spiral beside the first row's start (a little more than a letter's height between turns, the first letter on the outermost turn, each turned to the curve), at half strength; settling, the letters leave it in reading order, so it unwinds from its free end and lays itself along the line. Right to left the coil sits at the right and winds the other way.
- Pass a dynamic class (`db-f`, `db-mf`…) for the size; the line wraps and aligns as the text would (start and end follow the direction).
- The variants keep the one motion: the same travel, timing and hand-back as the dust; only where the letters start differs.
- by (`by`, `data-by`): what travels as one piece, after Split Text. letter (the default) is each letter. word sets each word down whole, as "Less / is / more." stands a word to a row and "Healthy habits" sets its notes a word to a line; each leaves `4 × --db-arpeggio` after the last. line casts each row whole, as a Linotype casts a slug, `8 × --db-arpeggio` apart. A piece is measured and placed as a letter is (its x in the real line, kerning included), so every variant works by any piece: a forme word or row is mirrored whole at its mirrored place, a coil word or row lies along the spiral turned to the curve.
- scrub (`scrub`, `data-phase="scrub"`): the settle follows the scroll instead of playing once, after scroll-reveal. `--p` runs from 0, as the line's top comes in at the foot of the view, to 1, once it's two fifths down from the top (or as far as the page can scroll; a line already in view when the page opens starts as dust and sets over the scroll left before that point). Each piece leaves as `--p` passes its place in the order (`--s × 0.6`) and lands 0.4 of the scroll later, travelling linearly with no transition, so it stops when the scroll stops and scatters back when you scroll back. At 1 the real text is given back and the pieces wait out of sight; below 1 they take over again. `--p` is read from the real layout in a frame asked for by the scroll event, which runs after a smooth scroller's own frame (Lenis moves the page itself), so the letters and the page move in the same frame. Pointing does nothing in a scrub: the scroll is the only hand. By word it is word-stream: words arriving one by one as you read down.
- In prose (article headings): put `Gather` in place of a heading inside `Prose` (`<Prose><Gather as="h2">…</Gather><p>…</p></Prose>`). The heading takes the prose's size, weight and spacing, and settles as you reach it; the paragraphs under it are already there. The gather always wraps greedily as pretext does (`text-wrap: wrap`, over the prose's balance), so its letters land where the heading's own lines fall.
- Under reduced motion, without script, or before pretext arrives, it's just the line. It measures again only when its width or face changes, so a scroll never cuts a settle short. Pending imports, font measurements and scroll frames stop when it is released; a failed font load restores the plain line.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Gather (`gather`) | Settle | The letters fly in from dust and land, one after another |
| Forme gather (`gather`) | Impression | Each letter turns over as it crosses from its mirror to its place, and inks |
| Coil gather (`gather`) | Unwind | The letters leave the spiral in reading order and lay themselves along the line |
| Scrub gather (`gather`) | Rubato (the reader's tempo) | The pieces travel only as far as the scroll has gone, forwards or back |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Gather (`gather`) | Dust | The letters settle from scatter to the real layout |
| Forme gather (`gather`) | The letterpress forme, type set mirrored in the chase | The line starts as its own mirror image and prints the right way round |
| Coil gather (`gather`) | A ribbon wound on itself; WOVE's figures along an arc | The text starts wound in a spiral and unwinds onto the line |
| Gather by word, by line (`gather`) | "Less is more." a word to a row; the Linotype slug | Whole words, or whole rows cast at once, settle instead of letters |
| Scrub gather (`gather`) | The reader's own pace; a score read at sight | The settle is the scroll: it stops with you and undoes itself backwards |
