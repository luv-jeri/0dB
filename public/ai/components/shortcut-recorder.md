# 0dB: shortcut-recorder

Extracted from DESIGN.md.

### db-shortcut (shortcut-recorder)
- Underneath: Native fieldset and legend, a stable Record button, optional Clear and a hidden JSON field. Key names are personal italic readings; plus signs and interface words stay roman. Native root ref, form, disabled and direction pass through; form association reaches the hidden submitted value. An uncontrolled form reset restores the default chord and ends capture.
- Creative move: The terminal key stands large against its modifiers. Record tensions the joins, cants the keys and raises the construction ticks; commit or cancel releases them. Reference: Paul Rand construction dimensions (11.jpg).
- Behavior: Distinct from Kbd's passive key legend and Command's action search: this assigns a shortcut. Capture is local to the focused Record button. Tab, Escape and blur end capture without commitment; bare modifiers, repeats, dead keys and composition do not commit. By default require Control, Alt or Meta; Shift alone is not sufficient. Captured chords stop propagation so host shortcuts cannot run; Escape is local to recording, and Clear returns focus to Record. Disabling ends capture. No global listener or shortcut registration. Operating-system reserved combinations can remain unavailable.
- Motion: chord tension. Record cants modifiers and the large terminal key in opposite directions, rotates the joins and raises the baseline ticks. Capture, Escape, Tab or blur releases the tension directly from the current setting. Reduced motion resolves directly; each action ends at rest. Native focus and hit areas remain stable.
- Access: native controls retain keyboard and touch activation, focus remains visible, long text wraps in flow, logical spacing follows local direction, reduced motion changes directly and forced colours retain semantic lines and system focus. `[hidden]` keeps its native meaning.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Shortcut recorder (`shortcut-recorder`) | Chord tension | Record cants modifiers and the large terminal key in opposite directions, rotates the joins and raises the baseline ticks. Capture, Escape, Tab or blur releases the tension directly from the current setting. |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Shortcut recorder (`shortcut-recorder`) | Paul Rand construction dimensions (11.jpg) | The terminal key stands large against its modifiers. Record tensions the joins, cants the keys and raises the construction ticks; commit or cancel releases them. |
