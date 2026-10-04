# 0dB: time-range

Extracted from DESIGN.md.

### db-time-range (time-range)
- Underneath: Native fieldset and two labelled minute-precision time inputs. startProps and endProps forward native names, required, bounds, refs, form and handlers; root props and ref belong to the fieldset. Output describes both inputs.
- Creative move: Large native endpoint readings stand over a positioned caliper. The interval has a true start position and length, including a split measurement across midnight. Reference: Paul Rand A–B dimension ticks (11.jpg).
- Behavior: Distinct from DatePicker's date and Timer's running countdown. Civil HH:mm minutes, without a date, timezone or daylight-saving arithmetic. Empty endpoints are incomplete; a reversed interval sets custom validity on the end input. overnight explicitly permits next-day end; equal endpoints mean zero. Duration and action words are localizable. An uncontrolled form reset restores the default endpoints. A caller-prevented change is respected.
- Motion: day caliper. Editing moves the start and end of a positioned caliper across the day; focus raises its construction arms. Overnight intervals split at the day boundary. Reversals retarget the current CSS interpolation rather than queueing arrivals. Reduced motion resolves directly; each action ends at rest. Native focus and hit areas remain stable.
- Access: native controls retain keyboard and touch activation, focus remains visible, long text wraps in flow, logical spacing follows local direction, reduced motion changes directly and forced colours retain semantic lines and system focus. `[hidden]` keeps its native meaning.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Time range (`time-range`) | Day caliper | Editing moves the start and end of a positioned caliper across the day; focus raises its construction arms. Overnight intervals split at the day boundary. Reversals retarget the current CSS interpolation rather than queueing arrivals. |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Time range (`time-range`) | Paul Rand A–B dimension ticks (11.jpg) | Large native endpoint readings stand over a positioned caliper. The interval has a true start position and length, including a split measurement across midnight. |
