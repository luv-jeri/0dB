# 0nlyType: note

Extracted from DESIGN.md.

### ot-note (note)
- Underneath: native, on hover and focus.
- Anatomy: `<button class="ot-note" aria-describedby="id">Term<span class="ot-note-text" id="id" aria-hidden="true">Note</span></button>`.
- A dotted underline. On hover or focus, the highlighter marks the term, a dot anchors the leader line, the line draws down, and the ink pill holding the note spreads from the line's tip (`clip-path: circle()`). Leaving plays the same four steps in reverse order.
- Keyboard: focus shows it, and Escape dismisses it.
- `variant` (`data-variant`, none for leader): `leader`, `ossia`, `expand` or `revise`.
- ossia: the score's ossia, a small bar printed over the staff, and the interlinear gloss. The note is always there: a few words at `pp` in pencil in the line space above the term, starting where the term starts and free to run past its end. The term's line opens to hold it (the term is an inline block with the note's height above it), and the term is in ink so the two read as a pair. Pointing inks the note. It is plain text in the page, read as "term (note)" (the parentheses are for screen readers only). Nothing to focus.
- expand: an abbreviation that opens into its words. The term's letters are found in the note in order (the start of a word, or a capital inside one: *H*yper*T*ext), and pressing it moves them apart while each word grows out of its initial (inline size to auto, moderato, exhale); a word with no initial ("and") grows whole. The initials stay in ink and the rest arrives in graphite, so the abbreviation stays readable inside its long form; the dotted line goes. It is a span with `role="button"`, `aria-expanded` and `dir="auto"`, because a native button can't break across lines and the words must; the visible letters are aria-hidden, the name is the abbreviation and the description the note. Enter or Space toggles, Escape closes. If the letters can't be found, it falls back to leader.
- revise: the editor's correction, after the Basquiat sheet's struck headline and the typed corrections of the Weingart letter (a caret swap, done by hand). `children` is the word in the text and `note` the word that replaces it (a word or a short phrase; it doesn't break). At rest the word is dotted like the others. Pointing sketches a hairline strike in pencil, as the checkbox does. Pressing strikes it in ink at `--ot-stroke`, the pen running a little past the word (0.1em, short of the word before), and the struck word steps back to pencil; then the replacement is written in after it in the italic, its box opening from the start (inline size to auto, moderato, exhale) so the sentence makes room as a pen moves. Pressing again, or Escape, lifts both. It is a span with `role="button"` and `aria-expanded`, so a struck phrase can wrap; the drawn words are aria-hidden and a `.ot-sr` reads the term, or once pressed `<del>` the term and `<ins>` the replacement. The space before the replacement is a real one, so where it wraps the space falls away at the break. Right to left the strike draws from the right. Forced colours: a plain line-through.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Marginalia (`note`) | Ink spread | Mark, anchor, line, note; reversed on leaving |
| Ossia note (`note`) | Ink | Pointing inks the note, allegro |
| Expand note (`note`) | Unfurl | Pressed, the words grow out of their initials, moderato, exhale; pressed again, they close |
| Revise note (`note`) | Pencil, then ink, then written | Pointing sketches the strike in pencil; pressed, the pen strikes it in ink and the replacement is written in from the start; pressed again, both lift |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Marginalia (`note`) | Weingart letter | Highlighter, anchor dot, leader line |
| Ossia note (`note`) | The score's ossia; the interlinear gloss | The note set small over the word, always there |
| Expand note (`note`) | The abbreviation and its long form | The letters move apart and the words grow out of them |
| Revise note (`note`) | Basquiat's struck headline; the Weingart letter's typed page | The word struck through in ink, and the right one written in after it in the italic |
