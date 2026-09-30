# 0dB

A component library for type and silence: two typefaces, one accent and a great deal of space. Every control is a typographic idea standing on a native element or a Radix primitive. A checkbox is a sentence you strike through, and a switch is the last word of a sentence.

0 dB is the threshold of hearing, the quietest sound a person can hear. [INTENT.md](INTENT.md) says who it's for and what it refuses; [DESIGN.md](DESIGN.md) is the how.

**[Docs](https://0db.cojeev.com/docs/)** · [Specimen](https://0db.cojeev.com/specimen/) · MIT licensed, shadcn-compatible

## Install

You need React 19, TypeScript, Tailwind CSS v4 and a shadcn project with the `@/` alias.

```sh
npx shadcn@latest add https://0db.cojeev.com/r/0db.json
npx shadcn@latest add https://0db.cojeev.com/r/checkbox.json
```

```tsx
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox"

export function Brief() {
  return (
    <CheckboxGroup legend="Before we start" tally>
      <Checkbox defaultChecked>Share the brief</Checkbox>
      <Checkbox>Book a first call</Checkbox>
    </CheckboxGroup>
  )
}
```

Four optional switches on `<html>` set the look: `data-mode` (day, nocturne), `data-scheme` (cotton, blueprint, statue, silence, riso), `data-key` (ultramarine, viridian, ember, violet) and `data-pair` (parma, press, paris, salon). [Install](https://0db.cojeev.com/docs/install/) has the details.

## Develop

Node 22.12 or newer.

```sh
npm ci
npm run dev      # the docs on localhost:3000
npm run check    # types, lint, tests, registry, drift, examples, build, pages
npm run check:install   # a fresh Next app installs every item (slow, uses the network)
```

- Items live in `registry/0db/ui/<item>.tsx` with a sidecar `registry/0db/styles/<item>.css`, a demo in `examples/<item>.tsx` and docs meta in `content/<item>.ts`.
- `scripts/build-registry.mjs` writes `registry.json` and `public/r/`. Never edit those by hand.
- The docs site is built from 0dB's own items. `app/site.css` only places them.

## Deploy

CI deploys `out/` to Cloudflare Workers (`wrangler.jsonc`) on every push to `main`, once the `CLOUDFLARE_API_TOKEN` repository secret exists.

Fonts are self-hosted under the SIL Open Font License; see [FONT-NOTICES.md](FONT-NOTICES.md).
