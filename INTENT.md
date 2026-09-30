# 0dB: intent

**0dB** is zero decibels: the quietest sound a person can hear. The library sits at that threshold. It gives an interface two typefaces, one accent, a great deal of space, and nothing else to lean on.

## Who it's for

- Its owner first: the agency landing page and the personal portfolio are built on it next.
- Anyone who installs a component with `npx shadcn add https://0db.cojeev.com/r/<name>.json` and wants an interface where type carries the design.
- Builders (people and agents) extending it. They read this page, then DESIGN.md, before writing anything.

## What success looks like

1. One command installs a component into a fresh Next app. The app builds, and the component looks and behaves like the specimen.
2. The docs site is made from 0dB's own components. If the docs need something the library doesn't have, it's built and added to the library, never borrowed.
3. A stranger can tell from any one screen what the system believes: space does the layout, and type is the only ornament.
4. `npm run check` passes, and it holds this page, DESIGN.md and the code to each other.

## What it refuses, and why

| Refused | Why |
|---|---|
| Icons | Words say what an icon only suggests, and an icon set brings a second visual language. Arrows appear only where there's real direction (↗ external, ↓ sort, → opens). |
| Cards, fills and shadows | Space already separates things. A box around content says the space failed. |
| A second accent colour | The accent means "you are here". Two accents would mean two places. Crimson is kept for errors, and the highlighter for reading marks. |
| Motion that plays by itself | Nothing moves unless the person does. The overture on the home page is the single exception, and it plays once. |
| Decoration of what the person owns | Their choices and words are set in the italic expression face. That's the only way they're marked. |
| Effects ported from 000h that have no type-only version (53): adjuster, ambient-background, animated-icon, assembly-part, bento-builder, buy-me-coffee, click-spark, contour-field, contours-background, depth-background, dither-dissolve, dither-sculpture, dock, elastic-mesh, falling-text, float-layer, flow-sculpture, folds-background, ghost-cursor, glass-sculpture, glyph-sculpture, grain-dissolve, icon, image-trail, infinite-spiral, ink-sculpture, magic-rings, meta-balls, orbit-images, organism-assembly, organism-composition, particle-sculpture, particle-text, pebbles-background, pigment-field, pixel-swap, portal-field, ripple-distortion, scroll-organism, sculpture-orbit, semantic-bloom, shape, shape-artwork, shape-scene, sprouts-background, strands, sunwash-background, swarm-cursor, typography-vortex, warp-text, weave-background, writing-caret, zoom-words | Each one's job is only its effect: shapes, fills, particles or motion that plays by itself. With the effect taken away nothing is left for type to carry. A few jobs are still done elsewhere: a hairline scene change covers the dissolves, and a link covers buy-me-coffee. click-spark was weighed as a type mark left where you press, and dropped: every control already answers its own press, so a second mark would decorate the press, not say anything. The owner decided this on 2026-09-30 (click-spark on 2026-10-01); the reasons for each are in `docs/superpowers/specs/2026-09-30-000h-port-inventory.md`, Table C. |
| cva, a motion library, a docs framework | Data attributes, CSS and our own components already do the job. Each dependency is a second opinion about how things should look. |

## Non-goals

- Being a general-purpose kit that looks like anything. 0dB looks like 0dB.
- Matching every shadcn component. An item exists only where the idea can be carried by type and a line.
- Supporting browsers without `:has()`, `color-mix()` and native `<dialog>`.
- A theming engine. There are four switches on `<html>` (mode, scheme, key, pair), and that's all.

## When in doubt

1. Take something away before adding anything.
2. Ask what the person did. If they did nothing, nothing moves.
3. Ask whose words these are. Ours are roman, theirs are italic.
4. Ask where the accent is. If there are two, remove one.
5. Use the native element. Use Radix or cmdk only when the platform can't do it (menus, floating layers, the combobox and command).
6. When DESIGN.md and the code disagree, fix one of them in the same change. `check:drift` will catch you if you don't.
