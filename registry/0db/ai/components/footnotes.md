# 0dB: footnotes

Extracted from DESIGN.md.

### db-footnotes (footnotes)
- Underneath: Native section, ordered list and fragment links. Footnotes holds a named ol; Footnote is a focusable li with id, number, body and optional Return; FootnoteReference is a raised anchor. Every native ref is forwarded to its own element.
- Creative move: A called citation expands into a large coordinate and opens the note margin; the reference and exact backlink stay native. Reference: SPECTRA scale collision (10.jpg), Weingart margin callouts (12.jpg).
- Behavior: This is a citation system, distinct from Note's transient gloss and Link's ornamental reference variant. IDs are caller-owned for stable backlinks. Fragment destinations are encoded; no JS, focus trap or autonomous scrolling is introduced. Repeated citations can author several return links within one note.
- Motion: citation magnification. Following a reference expands its coordinate and reconfigures the note margin; the body bends into its new measure. Returning releases it and restores the exact native anchor. Reduced motion resolves directly; each action ends at rest. Native focus and hit areas remain stable.
- Access: native controls retain keyboard and touch activation, focus remains visible, long text wraps in flow, logical spacing follows local direction, reduced motion changes directly and forced colours retain semantic lines and system focus. `[hidden]` keeps its native meaning.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Footnotes (`footnotes`) | Citation magnification | Following a reference expands its coordinate and reconfigures the note margin; the body bends into its new measure. Returning releases it and restores the exact native anchor. |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Footnotes (`footnotes`) | SPECTRA scale collision (10.jpg), Weingart margin callouts (12.jpg) | A called citation expands into a large coordinate and opens the note margin; the reference and exact backlink stay native. |
