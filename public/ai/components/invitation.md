# 0dB: invitation

Extracted from DESIGN.md.

### db-invitation (invitation)
- Underneath: a native button, forwarding ref and button events for `<SheetTrigger asChild><Invitation ... /></SheetTrigger>`.
- Anatomy: `.db-invitation` holds `.db-invitation-call` (label plus directional arrow), then a hint or `.db-invitation-state`. API: required label, optional hint and state, and native button props.
- The portfolio's conversation stays within reach: a quiet call docked at the bottom inline-end margin, after “Watch this space” (1.jpg). Below 40rem it occupies a hairline bottom bar and respects safe-area-inset-bottom. State, such as “Your brief · Edit”, replaces the hint in the reading-grade italic because it is the visitor's progress.
- Any visible `[data-invitation-hide]` makes the call lift away, invisible and inert; leaving brings it back. Added and removed markers are tracked. Mark the contact form so the persistent call yields to the conversation itself.
- Keyboard: native button, visible accent focus outline. Touch opens directly. RTL mirrors only the directional arrow and docking. Reduced motion removes travel. Forced colours use ButtonText and Highlight.
- **Why it is type-only:** Owner decision 2026-10-02 approves 2.5D depth, type-made images, shapes made of words and opt-in sound because type is the material and carries meaning. This item carries the portfolio story, never an effect-only depth-background, particle-text, typography-vortex or warp-text: no blur, shadows, gradients, fills or particles; distance is scale, ink to pencil and plane angle only, with one accent in view.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Invitation (`invitation`) | Yield | The margin call lifts away when the conversation is in view |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Invitation (`invitation`) | It has to be design, Watch this space (1.jpg) | The conversation waits as one call in the margin, and yields to the form |
