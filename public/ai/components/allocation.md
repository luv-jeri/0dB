# 0dB: allocation

Extracted from DESIGN.md.

### db-allocation (allocation)
- Underneath: Native fieldset and legend, labelled native number inputs, a described balance output and one empty hairline measure per share. Native root ref, form, visibility and per-item disabled semantics are retained; form association reaches each submitted input.
- Creative move: The large unassigned figure answers three numbered, independent dimension arms. Editing raises only the focused arm and the balance flexes once. Reference: Paul Rand independent dimensions (11.jpg), scale contrast (1.jpg).
- Behavior: Distinct from Slider's one scalar, Chart's read-only series and Meter's bounded reading: this edits several shares constrained by one total. Finite non-negative shares and total, unique non-empty ids, positive step. Missing shares are zero. Editing clamps only that share to the allowance left by others. The live balance includes its meaning as well as its figure. An externally reduced total shows and announces excess instead of redistributing silently; native max and aria-invalid expose the invalid state. Named inputs submit name[id]; an uncontrolled form reset restores the default shares. Decimal remainders are rounded to twelve significant digits to avoid floating-point dust.
- Motion: counterweight. A changed share stretches its independent dimension; focus raises that arm. The immediately updated balance flexes as a counterweight and settles once. Rapid edits replace that flex, and other shares retain their amounts. Reduced motion resolves directly; each action ends at rest. Native focus and hit areas remain stable.
- Access: native controls retain keyboard and touch activation, focus remains visible, long text wraps in flow, logical spacing follows local direction, reduced motion changes directly and forced colours retain semantic lines and system focus. `[hidden]` keeps its native meaning.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Allocation (`allocation`) | Counterweight | A changed share stretches its independent dimension; focus raises that arm. The immediately updated balance flexes as a counterweight and settles once. Rapid edits replace that flex, and other shares retain their amounts. |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Allocation (`allocation`) | Paul Rand independent dimensions (11.jpg), scale contrast (1.jpg) | The large unassigned figure answers three numbered, independent dimension arms. Editing raises only the focused arm and the balance flexes once. |
