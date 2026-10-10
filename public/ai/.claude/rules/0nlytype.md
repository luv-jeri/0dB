# 0nlyType project rules

Before building with 0nlyType, read [docs/0nlytype/AGENTS.md](../../docs/0nlytype/AGENTS.md) and [docs/0nlytype/DESIGN.md](../../docs/0nlytype/DESIGN.md) and the relevant component contracts. Preserve existing project instructions.

## Non-negotiable rules

1. **Silence is structure.** Space does the layout. A hairline appears only where space alone can't hold two things apart.
2. **Type is the only ornament.** Weight, width, size, tracking and order carry every level of hierarchy. No icons, fills or shadows.
3. **Ours in roman, yours in italic.** Interface text is the voice, upright. Anything the person chose, typed or set turns into the expression italic: a picked option, a typed value, a switch state, a slider value, a named item they own. Display uses `--ot-expression-scale`; text uses the same face in its reading grade, with more ink, a little air and a text-size optical cut where available. Musical and foreign terms are italic too (`.ot-term`), by book convention.
4. **One note of colour.** One accent marks where you are: the current page, the chosen option, focus. At most one accent mark in view. Crimson is only for errors. The highlighter is only for reading marks.
5. **Nothing moves unless you do.** Motion answers an action, then rests. Pointing sketches in pencil; choosing inks it in. The overture plays once per browser, on the home page's first visit, and can be skipped. A demonstration of a component waits for a Demonstrate press. The owner-approved exceptions (2026-10-01) are marquee, text-ribbon and word-relay autoplay: each is pausable and off under reduced motion.

- Shape vocabulary, complete: hairline, dot, ring, arc, cross, corner marks, parentheses, pill (tags only), and arrows only where there's a direction.

| Refused | Why |
|---|---|
| Icons | Allowed only as signs made of their own word (owner decision 2026-10-10); no icon drawn as a picture. Words say what an icon only suggests, and an icon set brings a second visual language. Arrows appear only where there's real direction (↗ external, ↓ sort, → opens). |
| Cards, fills and shadows | Space already separates things. A box around content says the space failed. |
| A second accent colour | The accent means "you are here". Two accents would mean two places. Crimson is kept for errors, and the highlighter for reading marks. |
| Motion that plays by itself | Nothing moves unless the person does, apart from the overture on the home page, which plays once, and the owner-approved marquee, text-ribbon and word-relay autoplay exceptions (2026-10-01). Each autoplay exception is pausable and off under reduced motion. |
| Decoration of what the person owns | Their choices and words are set in the italic expression face. That's the only way they're marked. |
| Effects that have no type-only version (53): adjuster, ambient-background, animated-icon, assembly-part, bento-builder, buy-me-coffee, click-spark, contour-field, contours-background, depth-background, dither-dissolve, dither-sculpture, dock, elastic-mesh, falling-text, float-layer, flow-sculpture, folds-background, ghost-cursor, glass-sculpture, glyph-sculpture, grain-dissolve, icon, image-trail, infinite-spiral, ink-sculpture, magic-rings, meta-balls, orbit-images, organism-assembly, organism-composition, particle-sculpture, particle-text, pebbles-background, pigment-field, pixel-swap, portal-field, ripple-distortion, scroll-organism, sculpture-orbit, semantic-bloom, shape, shape-artwork, shape-scene, sprouts-background, strands, sunwash-background, swarm-cursor, typography-vortex, warp-text, weave-background, writing-caret, zoom-words | Each one's job is only its effect: shapes, fills, particles or motion that plays by itself. With the effect taken away nothing is left for type to carry. A few jobs are still done elsewhere: a hairline scene change covers the dissolves, and a link covers buy-me-coffee. click-spark was weighed as a type mark left where you press, and dropped: every control already answers its own press, so a second mark would decorate the press, not say anything. The owner decided this on 2026-09-30 (click-spark on 2026-10-01); the reasons for each are in `docs/superpowers/specs/2026-09-30-000h-port-inventory.md`, Table C. |
| cva, a motion library, a docs framework | Data attributes, CSS and our own components already do the job. Each dependency is a second opinion about how things should look. |

1. Take something away before adding anything.
2. Ask what the person did. If they did nothing, nothing moves except the approved cases above.
3. Ask whose words these are. Ours are roman, theirs are italic.
4. Ask where the accent is. If there are two, remove one.
5. Use the native element. Use Radix or cmdk only when the platform can't do it (menus, floating layers, the combobox and command).
6. When DESIGN.md and the code disagree, fix one of them in the same change. `check:drift` will catch you if you don't.
