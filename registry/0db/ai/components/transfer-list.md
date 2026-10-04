# 0dB: transfer-list

Extracted from DESIGN.md.

### db-transfer (transfer-list)
- Underneath: Two native sections with named headings, lists of checkbox labels, and Include/Remove buttons. Included names are italic; counts and actions are roman. A polite status reports the number moved.
- Creative move: Two oversized set counts hold open margins. Words travel from their measured source position into the destination setting, changing from roman to personal italic. Reference: Renaissance spread (17.jpg), scale contrast (1.jpg).
- Behavior: Distinct from Picks' mutually exclusive choice, Combobox's picked sentence and Swapy's ordering. The value is set membership. Item ids are unique and non-empty, source order stays stable, unavailable items cannot move, and vanished source ids are excluded. value controls the set or defaultValue initializes it; an uncontrolled form reset restores that membership; hidden fields repeat the supplied name. Transfer clears picks and focuses the destination heading. The one-column phone layout preserves both set names.
- Motion: crossing type. The actual word positions are sampled before transfer. Destination words travel that distance, briefly deform in width and overshoot before settling; neighbouring words close the vacancy. A rapid reversal samples the currently displayed position and cancels earlier flights. Hit areas stay in the destination layout. Reduced motion resolves directly; each action ends at rest. Native focus and hit areas remain stable.
- Access: native controls retain keyboard and touch activation, focus remains visible, long text wraps in flow, logical spacing follows local direction, reduced motion changes directly and forced colours retain semantic lines and system focus. `[hidden]` keeps its native meaning.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Transfer list (`transfer-list`) | Crossing type | The actual word positions are sampled before transfer. Destination words travel that distance, briefly deform in width and overshoot before settling; neighbouring words close the vacancy. A rapid reversal samples the currently displayed position and cancels earlier flights. Hit areas stay in the destination layout. |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Transfer list (`transfer-list`) | Renaissance spread (17.jpg), scale contrast (1.jpg) | Two oversized set counts hold open margins. Words travel from their measured source position into the destination setting, changing from roman to personal italic. |
