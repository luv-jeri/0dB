# 0nlyType: intent

**0nlyType** is a component library made of type and nothing else. Every control, every sign and every ornament is set in words. It gives an interface two typefaces, one accent, a great deal of space, and nothing else to lean on.

## Who it's for

- Its makers first. 0nlyType is the library of The Directors, the product studio of Sanjay Kumar and Abhay Rohit. The studio's landing page at thedirectors.agency is built on it next, then the founders' portfolios.
- Anyone who installs a component with `npx shadcn add https://thedirectors.agency/ui/r/<name>.json` and wants an interface where type carries the design.
- Builders (people and agents) extending it. They read this page, then DESIGN.md, before writing anything.

## What success looks like

1. One command installs a component into a fresh Next app. The app builds, and the component looks and behaves like the specimen.
2. The docs site is made from 0nlyType's own components. If the docs need something the library doesn't have, it's built and added to the library, never borrowed.
3. A stranger can tell from any one screen what the system believes: space does the layout, and type is the only ornament.
4. `npm run check` passes, and it holds this page, DESIGN.md and the code to each other.
5. The registry stays healthy by the shadcn directory's own measures, on every check:
   - the index and every item validate;
   - each item installs on its own with `shadcn add --dry-run`;
   - the registry's `name` matches its namespace;
   - every endpoint answers over HTTPS with JSON.

   The catalog grows only through items that each do a job of their own, never through aliases or splits; each sign variant (dots, words, fill) is its own item by owner decision 2026-10-10.

## What it refuses, and why

| Refused | Why |
|---|---|
| Icons | Allowed only as signs made of their own word (owner decision 2026-10-10); no icon drawn as a picture. Words say what an icon only suggests, and an icon set brings a second visual language. Arrows appear only where there's real direction (↗ external, ↓ sort, → opens). |
| Cards, fills and shadows | Space already separates things. A box around content says the space failed. |
| A second accent colour | The accent means "you are here". Two accents would mean two places. Crimson is kept for errors, and the highlighter for reading marks. |
| Motion that plays by itself | Nothing moves unless the person does, apart from the overture on the home page, which plays once, and the owner-approved marquee, text-ribbon and word-relay autoplay exceptions (2026-10-01). Each autoplay exception is pausable and off under reduced motion. |
| Decoration of what the person owns | Their choices and words are set in the italic expression face. That's the only way they're marked. |
| Effects that have no type-only version (53): adjuster, ambient-background, animated-icon, assembly-part, bento-builder, buy-me-coffee, click-spark, contour-field, contours-background, depth-background, dither-dissolve, dither-sculpture, dock, elastic-mesh, falling-text, float-layer, flow-sculpture, folds-background, ghost-cursor, glass-sculpture, glyph-sculpture, grain-dissolve, icon, image-trail, infinite-spiral, ink-sculpture, magic-rings, meta-balls, orbit-images, organism-assembly, organism-composition, particle-sculpture, particle-text, pebbles-background, pigment-field, pixel-swap, portal-field, ripple-distortion, scroll-organism, sculpture-orbit, semantic-bloom, shape, shape-artwork, shape-scene, sprouts-background, strands, sunwash-background, swarm-cursor, typography-vortex, warp-text, weave-background, writing-caret, zoom-words | Each one's job is only its effect: shapes, fills, particles or motion that plays by itself. With the effect taken away nothing is left for type to carry. A few jobs are still done elsewhere: a hairline scene change covers the dissolves, and a link covers buy-me-coffee. click-spark was weighed as a type mark left where you press, and dropped: every control already answers its own press, so a second mark would decorate the press, not say anything. The owner decided this on 2026-09-30 (click-spark on 2026-10-01); the reasons for each are in `docs/superpowers/specs/2026-09-30-000h-port-inventory.md`, Table C. |
| cva, a motion library, a docs framework | Data attributes, CSS and our own components already do the job. Each dependency is a second opinion about how things should look. |

## Non-goals

- Being a general-purpose kit that looks like anything. 0nlyType looks like 0nlyType.
- Being part of another product. 0nlyType stands on its own.
- Matching every shadcn component. An item exists only where the idea can be carried by type and a line.
- Supporting browsers without `:has()`, `color-mix()` and native `<dialog>`.
- A theming engine. There are four switches on `<html>` (mode, scheme, key, pair), and that's all.

## When in doubt

1. Take something away before adding anything.
2. Ask what the person did. If they did nothing, nothing moves except the approved cases above.
3. Ask whose words these are. Ours are roman, theirs are italic.
4. Ask where the accent is. If there are two, remove one.
5. Use the native element. Use Radix or cmdk only when the platform can't do it (menus, floating layers, the combobox and command).
6. When DESIGN.md and the code disagree, fix one of them in the same change. `check:drift` will catch you if you don't.
