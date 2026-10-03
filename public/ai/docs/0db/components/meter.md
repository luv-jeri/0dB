# 0dB: meter

Extracted from DESIGN.md.

### db-meter (meter)
- Underneath: native `<meter>`, named by a native `<label>`. A known reading within limits, such as storage used or a budget balance; use progress for completion and slider for input.
- Anatomy: `.db-meter` holding `.db-meter-label`, `.db-meter-scale` (the visual reading, rule, index and two limits, all `aria-hidden`), a visually hidden native meter, and optional `.db-meter-note`. Every part carries `data-slot`.
- Creative move: Paul Rand's dimension lines. A large italic figure stands above a hairline between two end ticks; one accent index marks the exact reading. The empty measure stays empty. The space on either side of the figure shares the remaining width in proportion to the reading, keeping it inside both limits without measuring in script. Longer readings step down from ff toward mf to fit their measure, using the formatted length and container width; exceptionally long text still wraps in flow above the line rather than covering it. Labels and notes wrap too. Units and limits are roman; the reading is yours, in italic.
- `value` is clamped to finite `min` and `max`, shared by the visible reading and native meter. Negative ranges work; non-finite values, an overflowing span and max not greater than min throw a RangeError. `format` sets all three figures and `unit` follows them as supplied. `low`, `high` and `optimum` retain the native semantics without introducing another colour.
- The formatted reading names the value through `aria-valuetext`; callers can override it. The note joins any supplied `aria-describedby`. `id`, `ref` and other native meter props reach the meter; `className`, `style`, `hidden`, `dir` and `lang` apply to the root. It is a reading, with no tab stop or keyboard interaction.
- Motion: legato. When the reading changes, one eased number drives the space around the figure and the index at moderato, so they glide together and an interrupted update continues from the current position; there is no entrance or autonomous loop. Reduced motion changes directly. Flex and logical positioning mirror the scale in right to left, including a locally overridden direction. Readings and limits use left-to-right `bdi`, so even a signed number without a lettered unit keeps its sign before the number; localized text retains its own bidi marks. Forced colours keeps the index in Highlight.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Meter (`meter`) | Legato | A changed figure and its index glide to their new places, then rest |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Meter (`meter`) | Paul Rand dimension lines | An italic reading above an empty measure, one index between its limits |
