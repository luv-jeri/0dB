# 0dB: masked-value

Extracted from DESIGN.md.

### db-masked (masked-value)
- Underneath: Native button in an inline span. label names the reading, value is a string, and a fixed mask replaces it while closed. aria-expanded and aria-controls connect the trigger to the reading.
- Creative move: Oversized parentheses hold a private reading; Reveal opens their vertical tension as the words unfold between them. Reference: 20(25) (7.jpg), scale contrast (1.jpg).
- Behavior: A screen-privacy disclosure, distinct from Collapsible's folded list and Field's editing. Closed readings are absent from rendered markup, but remain in application data; this is not a security or storage boundary. Controlled revealed and uncontrolled defaultRevealed share one action. Prevented native clicks cancel the built-in change.
- Motion: parenthetical aperture. Reveal stretches the parentheses and unfolds the reading from its centre with a small perspective correction; Hide removes the words immediately and the parentheses relax. Initial open or closed readings are still. Reduced motion resolves directly; each action ends at rest. Native focus and hit areas remain stable.
- Access: native controls retain keyboard and touch activation, focus remains visible, long text wraps in flow, logical spacing follows local direction, reduced motion changes directly and forced colours retain semantic lines and system focus. `[hidden]` keeps its native meaning.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Masked value (`masked-value`) | Parenthetical aperture | Reveal stretches the parentheses and unfolds the reading from its centre with a small perspective correction; Hide removes the words immediately and the parentheses relax. Initial open or closed readings are still. |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Masked value (`masked-value`) | 20(25) (7.jpg), scale contrast (1.jpg) | Oversized parentheses hold a private reading; Reveal opens their vertical tension as the words unfold between them. |
