---
name: 0db-component
description: "Create or extend a 0dB component using its intent, design tokens, item anatomy and contracts. Use when building components with 0dB."
---

# 0dB component kit

Read intent, core design and the relevant `docs/0db/components/<item>.md` contracts before implementation. Load the full design only when needed. Preserve existing project instructions when merging this kit.

## Workflow

1. **Inspect.** Confirm the loaded paths: intent, core design and the relevant item contracts. Inspect the app's aliases, tokens, base styles and existing instructions. Establish the requested behaviour and who owns each word.
2. **Choose a precedent.** Read an installed 0dB item's implementation, CSS sidecar, example and contract. Choose the native element first. Identify one creative move and one motion from its “Where” and Motion rows; read shared moves before composing items.
3. **Implement.** Follow the item anatomy and naming below in the app's own paths. Use the existing tokens and minimal client boundary. Include the states and keyboard behaviour in the contract and show the states in an example. When contributing upstream, update the contract and its rows together with code, then regenerate.
4. **Verify.** Run the completion checklist below. Compare the working component with the contract and precedent. Report evidence and limitations.

## Non-negotiable rules

1. **Silence is structure.** Space does the layout. A hairline appears only where space alone can't hold two things apart.
2. **Type is the only ornament.** Weight, width, size, tracking and order carry every level of hierarchy. No icons, fills or shadows.
3. **Ours in roman, yours in italic.** Interface text is the voice, upright. Anything the person chose, typed or set turns into the expression italic at `--db-expression-scale`: a picked option, a typed value, a switch state, a slider value, a named item they own. Musical and foreign terms are italic too (`.db-term`), by book convention.
4. **One note of colour.** One accent marks where you are: the current page, the chosen option, focus. At most one accent mark in view. Crimson is only for errors. The highlighter is only for reading marks.
5. **Nothing moves unless you do.** Motion answers an action, then rests. Pointing sketches in pencil; choosing inks it in. The overture plays once. The owner-approved exceptions (2026-10-01) are marquee, text-ribbon and word-relay autoplay: each is pausable and off under reduced motion.

- Shape vocabulary, complete: hairline, dot, ring, arc, cross, corner marks, parentheses, pill (tags only), and arrows only where there's a direction.

| Refused | Why |
|---|---|
| Icons | Words say what an icon only suggests, and an icon set brings a second visual language. Arrows appear only where there's real direction (↗ external, ↓ sort, → opens). |
| Cards, fills and shadows | Space already separates things. A box around content says the space failed. |
| A second accent colour | The accent means "you are here". Two accents would mean two places. Crimson is kept for errors, and the highlighter for reading marks. |
| Motion that plays by itself | Nothing moves unless the person does, apart from the overture on the home page, which plays once, and the owner-approved marquee, text-ribbon and word-relay autoplay exceptions (2026-10-01). Each autoplay exception is pausable and off under reduced motion. |
| Decoration of what the person owns | Their choices and words are set in the italic expression face. That's the only way they're marked. |
| cva, a motion library, a docs framework | Data attributes, CSS and our own components already do the job. Each dependency is a second opinion about how things should look. |

1. Take something away before adding anything.
2. Ask what the person did. If they did nothing, nothing moves except the approved cases above.
3. Ask whose words these are. Ours are roman, theirs are italic.
4. Ask where the accent is. If there are two, remove one.
5. Use the native element. Use Radix or cmdk only when the platform can't do it (menus, floating layers, the combobox and command).
6. When DESIGN.md and the code disagree, fix one of them in the same change. `check:drift` will catch you if you don't.

## Item anatomy

- One item is four files: `registry/0db/ui/<item>.tsx`, its sidecar `registry/0db/styles/<item>.css`, the docs meta `content/<item>.ts` and the live example `examples/<item>.tsx`. The base pieces (link, kbd, fraction, meta, corners) have no sidecar; their CSS is in base.css.
- `examples/<item>.tsx` default-exports `Example`, the specimen's demo with real copy. An optional `States` export pins each state with `data-force` on the item's root, inside `<State label>`.

Use your application's component, style and example paths. The paths above describe contributions to the 0dB registry. Pair each new item with a contract (anatomy, states, keyboard behaviour), a Motion row and a “Where each move comes from” row. Read one installed item's TSX, sidecar, example and contract end to end as a precedent.

## Naming

- Tokens are `--db-*`. Component classes are `db-<name>`.
- States live on native attributes (`:checked`, `:disabled`, `[aria-selected]`, `[aria-invalid]`, `[aria-current]`, `[aria-pressed]`, `[aria-busy]`). Variants live on `data-variant`, and size on `data-size`.
- `[data-force~="hover"]` and `[data-force~="focus"]` pin a state for documentation rows.
- Every control is built on the right native element, so the React port can use native elements or Radix without changing the look.
- Four switches on `<html>`, all optional:
  - `data-mode="day | nocturne"`
  - `data-scheme="blueprint | statue | silence | riso"` (no attribute means cotton)
  - `data-key="ultramarine | viridian | ember | violet"`, which overrides the scheme's accent and is declared last so it always wins
  - `data-pair="press | paris | salon"` (no attribute means parma)
- One creative move per component, and only one, drawn from the poster references (see "Where each move comes from"). Likewise one motion per component, named as an articulation (see "Motion").
- `[hidden]` always wins over a component's `display`.
- Copy: sentence case, active verbs. An action keeps its name through the flow (Upload, Uploading, Uploaded). Errors say what to fix and never apologise.

- Item names follow shadcn where shadcn has the component; the class keeps the poster's word. `slider` renders `.db-ruler`.
- Sidecars are wrapped in `@layer components`; base.css is in `@layer base`, so a consumer's Tailwind utilities still win. `!important` appears only on `[hidden]` and `.db-sr`.
- Direction: logical properties, and `:is([dir="rtl"], [dir="rtl"] *)` where a stroke has a direction. Never `:dir()`: Lightning CSS, which Next and Tailwind run, lowers it to a list of `:lang()` that misses a page that only sets `dir`.
- Variants are `data-variant` and `data-size`, never classes. There's no cva.
- React 19: `ref` is a plain prop. `"use client"` appears only in files that need state, effects, handlers or Radix, so every other item works in a Server Component. Each root and part carries `data-slot`; `className` merges through `cn`.

## Completion checklist

- Check the contract's semantics, roles and accessible names; keyboard and visible focus; announcements for state changes; disabled and busy states. Keep decorative copies hidden from assistive technology.
- Check reduced motion in CSS and JavaScript: Under `prefers-reduced-motion: reduce`, every tempo is 1ms and the arpeggio is 0: things still change but don't travel. Script-driven motion (rolls, the radio's stretch, tag removal, dusk and dawn) checks the same query and applies the change directly.
- Check direction with logical properties and RTL where a stroke or reading order has direction. Isolate numbers inside RTL text.
- Check the working component at desktop and phone widths, day and nocturne, and the relevant scheme, key and pair switches. Check forced colours.
- Run the relevant tests, typecheck and lint in the consuming app. For upstream work, regenerate the registry and run its registry and drift checks.
- Report which source paths you read, the precedent, the checks and their results, and anything unverified. Do not claim a check you did not run.

## References

- [Intent](../../../docs/0db/INTENT.md)
- [Core design](../../../docs/0db/DESIGN-core.md)
- [Full design (on demand)](../../../docs/0db/DESIGN.md)
- [Kit version and hashes](../../../docs/0db/manifest.json)
