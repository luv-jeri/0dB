# 0nlyType: corners

Extracted from DESIGN.md.

### ot-corners (corners)
- Underneath: native. Its CSS lives in base.css, so every item may use it.
- Four corner marks as one `::after`. It frames without closing. Tune it with `--ot-corner` (length), `--ot-corner-inset` and `--ot-corner-colour`. Forced colours draw them in CanvasText.
- `data-variant="viewfinder"`: after the camera's framing marks ("the silence that heals" names the phone it was shot on). At rest the marks frame the whole. Point at or focus a part (a direct child) and they glide onto it, a step outside it, and lock with one small rebound; leaving, they open back out to the whole. For the keyboard the marks are the focus ring: in the accent, and the part draws no outline of its own. A tap leaves the frame where the finger put it. The component sets `--ot-aim-x/y/w/h`.
- `data-variant="glide"`: the viewfinder's marks lent to a group of controls, at any depth (a toolbar, a row of links, a form's actions); the job of a target cursor, done with the one frame the page already owns instead of a cursor of its own. At rest there is no frame. Point at or focus a control and one frame fades in round it, `--ot-space-2` outside, then glides from control to control over moderato with breath, and moves only when the pointer or focus moves. Leaving, it goes back to the focused control if there is one, or fades where it was. Disabled controls are passed over; a touch shows nothing. For the keyboard the frame is the focus ring, in the accent, and the controls draw no outline of their own; forced colours draw it in CanvasText, and Highlight on focus. Arriving from rest it only fades, so it never flies in from a corner; under reduced motion it is simply there, on the control you are at. Positions are measured from the box, so right to left needs nothing of its own.
- `data-variant="kagi"`: after the Japanese corner brackets 「 」, where the corner mark is the quotation mark. Only two corners at `--ot-stroke`, the opening one before the first word and the closing one after the last (`box-decoration-break: slice`), however many lines the words cross; right to left they mirror. A word joiner keeps the opening mark with its first word. Put it on a `<q>` with `asChild`; its own quotation marks are dropped.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Viewfinder corners (`corners`) | Spiccato | The marks glide onto what you point at and lock with one small rebound, then open back out to the whole |
| Glide corners (`corners`) | Glide | Over moderato with breath, the frame glides from control to control and lands without a rebound; from rest it only fades in, and it fades out where it was |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Corners (`corners`) | "the silence that heals" corners | A frame that doesn't close |
| Viewfinder corners (`corners`) | A camera's framing marks; "the silence that heals" | The frame glides onto what you point at and locks |
| Glide corners (`corners`) | The viewfinder's marks, following focus from control to control; the job of a target cursor | One frame carries across a group, and appears only while you are in it |
| Kagi corners (`corners`) | The Japanese corner brackets 「 」 | Two corners quote a phrase across its lines |
