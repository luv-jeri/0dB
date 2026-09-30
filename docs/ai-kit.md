# Build with the 0dB AI kit

Install the kit from the root of an initialized shadcn app:

```bash
npx shadcn@latest add https://0db.cojeev.com/r/ai.json
```

The kit gives your coding tool short instructions and complete references for creating components that follow 0dB. It installs guidance, rather than components or styles. Install the 0dB base and the components you want to use as precedents separately.

Every registry target starts with `~/`. In shadcn this means **your project root**, including when your app has a `src/` directory. It does not mean your home directory.

If your app already has an `AGENTS.md`, review the installer's overwrite prompt and preserve your existing instructions. The installer replaces files; it does not merge Markdown. The kit also includes `docs/0db/AGENTS.md`, so you can keep your root file and add a short pointer to the namespaced copy.

## What gets installed

| File in your project | Purpose and reader |
|---|---|
| `AGENTS.md` | Short rules, item anatomy, naming and completion checklist for tools that discover project instructions, including Codex. Existing project instructions should be merged deliberately. |
| `docs/0db/AGENTS.md` | The namespaced guidance for projects keeping their own root instructions. Point your root file or prompt here. |
| `docs/0db/INTENT.md` | The exact intent source: what 0dB is for and what it refuses. Read before implementation. |
| `docs/0db/DESIGN-core.md` | Principles, conventions, tokens, spacing and shape, general motion, shared moves, and registry anatomy. Load this before a task. |
| `docs/0db/DESIGN.md` | The exact complete design source. Load on demand rather than as automatic context. |
| `docs/0db/components/<item>.md` | Each item's contract, Motion rows and design-reference rows. Read the items you use or compose from. An absent source row is stated explicitly. |
| `docs/0db/manifest.json` | Kit version, SHA-256 source and generated-content hashes, and component coverage. Compare copies when refreshing. |
| `.cursor/rules/0db.mdc` | Cursor Agent's always-applied rules. Cursor Tab does not use these rules. |
| `.github/instructions/0db.instructions.md` | Copilot instructions scoped to `**/*.tsx,**/*.css`; loading depends on the Copilot feature. |
| `.claude/skills/0db-component/SKILL.md` | Claude Code's component workflow. Ask it to use `0db-component` when building with 0dB. |
| `.agents/skills/0db-component/SKILL.md` | The identical skill for Codex and other compatible tools. Invoke `$0db-component` in Codex. |
| `.devin/rules/0db.md` | An `always_on` rule for Devin desktop/Cascade. Older Windsurf installations may require copying it to `.windsurf/rules/0db.md`; verify discovery in your tool. |

Tools can skip instructions or references. Start by asking the tool to confirm which files it read. The full design and per-item contracts are reference material; they are not silently included in every prompt. Installing the kit does not prove a generated component follows it: use the completion checklist and inspect the working result.

## Downloads and browsing tools

Supply [llms.txt](https://0db.cojeev.com/llms.txt) to a browsing assistant for an index of docs and Markdown references. [llms-full.txt](https://0db.cojeev.com/llms-full.txt) includes intent, core design and every component contract. Neither URL guarantees automatic loading.

Download [AGENTS.md](https://0db.cojeev.com/ai/AGENTS.md), [INTENT.md](https://0db.cojeev.com/ai/INTENT.md), [DESIGN-core.md](https://0db.cojeev.com/ai/DESIGN-core.md), [DESIGN.md](https://0db.cojeev.com/ai/DESIGN.md), or [SKILL.md](https://0db.cojeev.com/ai/SKILL.md). Contracts are at `https://0db.cojeev.com/ai/components/<item>.md`; the discovery index links every one. The [manifest](https://0db.cojeev.com/ai/manifest.json) identifies the source snapshot. Cursor, Copilot and Devin adapters are also available as Markdown downloads through the index.

For v0 or a tool without local-file discovery, provide the URLs or attach these references explicitly. A registry shortcut alone is not evidence that the tool imported 0dB's styles or read its rules.

## Refresh the kit

Run the same install command again when 0dB changes. Review overwrite prompts, retain your app-specific instructions and edits, and refresh the namespaced references and tool adapters together. Avoid an unconditional overwrite of your root instructions. The kit is generated from the upstream sources; edit application guidance separately from these generated reference copies.

Compare `docs/0db/manifest.json` with the published manifest, then ask your tool to reload the new references and confirm their paths. Copies do not update automatically. Check existing custom components against the refreshed contracts before claiming they match the new version.

Upstream contributors run `npm run registry:build` to regenerate the kit and site downloads. `npm run check:registry` catches stale or obsolete outputs; `npm run check:drift` checks links, contracts, hashes and instruction budgets. The repo's contributor `AGENTS.md` remains separate from the generated consumer file.

## Copy-paste prompts

### Create a component

```text
Use the 0db-component skill if available. Read docs/0db/AGENTS.md,
docs/0db/INTENT.md and docs/0db/DESIGN-core.md. Confirm the loaded paths.
Build [component] for [behaviour]. Choose one installed 0dB item as a
precedent and read its TSX, CSS sidecar, example and matching contract in
docs/0db/components/. Explain its one creative move and one motion, then
implement the new component in this app's paths. Follow the item anatomy,
tokens and naming. Run the completion checklist, inspect the working
component, and report checks, results and anything unverified.
```

### Preserve existing instructions

```text
Read my existing project instructions and docs/0db/AGENTS.md. Preserve all
existing instructions. Add a short 0dB section to my root AGENTS.md pointing
to docs/0db/AGENTS.md, INTENT.md, DESIGN-core.md and relevant component
contracts. Show the merged diff. Do not paste the full DESIGN.md into the
automatic context or replace my instructions with the kit.
```

### Review or refresh a component

```text
Read the current docs/0db/manifest.json, AGENTS.md, INTENT.md, DESIGN-core.md
and the contracts for [items]. Confirm the paths and source hashes used.
Review [component/file] against those contracts and one installed precedent.
Check semantics, keyboard/focus, reduced motion, RTL, themes, forced colours
and responsive behaviour. Identify concrete mismatches and fix only those
within the existing behaviour. Run relevant checks and inspect the working
component. Report the changes, evidence and remaining limitations.
```
