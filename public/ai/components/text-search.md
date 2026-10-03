# 0dB: text-search

Extracted from DESIGN.md.

### db-text-search (text-search)
- Underneath: Native search Input, result status, Previous and Next buttons, and a plain-text passage with native mark elements. Input supplies its own baseline articulation through the existing Field item.
- Creative move: A large italic query sets the head; a margin coordinate travels to the actual current line while a pair of reading marks clasps the chosen occurrence. Reference: Weingart leader callouts (12.jpg), SPECTRA coordinates (10.jpg).
- Behavior: Distinct from Combobox and Command: no suggestions or filtering away the document. Literal, Unicode case-insensitive non-overlapping matching escapes regular-expression syntax and preserves UTF-16 offsets. Empty queries yield no marks. Changing text or query resets to the first hit. Enter advances; Shift+Enter reverses; IME Enter is ignored. No matches disable navigation. Typing never scrolls; explicit navigation uses nearest instant scrolling and keeps focus on its control.
- Motion: travelling coordinate. Explicit navigation sends the margin coordinate to the measured line of the next occurrence and closes reading parentheses around that hit. Typing changes the marks in place; there is no initial entrance or forced typing scroll. Reduced motion resolves directly; each action ends at rest. Native focus and hit areas remain stable.
- Access: native controls retain keyboard and touch activation, focus remains visible, long text wraps in flow, logical spacing follows local direction, reduced motion changes directly and forced colours retain semantic lines and system focus. `[hidden]` keeps its native meaning.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Text search (`text-search`) | Travelling coordinate | Explicit navigation sends the margin coordinate to the measured line of the next occurrence and closes reading parentheses around that hit. Typing changes the marks in place; there is no initial entrance or forced typing scroll. |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Text search (`text-search`) | Weingart leader callouts (12.jpg), SPECTRA coordinates (10.jpg) | A large italic query sets the head; a margin coordinate travels to the actual current line while a pair of reading marks clasps the chosen occurrence. |
