**Recommend a generated 0dB AI kit: short instructions that tools discover automatically, complete reference files, and task-specific component contracts.** Research checked on 2026-10-01; later changes are **unverified**. No repo files were changed.

**Current context-file conventions**

Limits below distinguish documented caps from recommendations.

| Convention | Location and readers | Format, size and nesting |
|---|---|---|
| `AGENTS.md` | Project root and subdirectories; supported by Codex, Cursor, Copilot agents and others. Use uppercase plural—not `agent.md`. | Plain Markdown, no required fields or standard-wide size cap. Nested instructions take precedence; exact loading depends on the tool. [Standard](https://agents.md/) |
| Codex discovery | `~/.codex/`, then project root → current working directory. | One file per directory: `AGENTS.override.md`, then `AGENTS.md`, then configured fallbacks. Combined project guidance defaults to **32 KiB**. A file under `docs/0db/` alone will not govern application components. [Discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md) |
| `CLAUDE.md` | Root, `.claude/CLAUDE.md`, home directory and nested directories; Claude Code. | Markdown; **under 200 lines recommended**. `@path` imports expand recursively, up to four hops. Current Claude Code can load `AGENTS.md`, but an existing ancestor `CLAUDE.md` normally takes precedence. [Claude memory](https://code.claude.com/docs/en/memory) |
| `.cursor/rules/*.mdc` | Cursor Agent. | Markdown plus `description`, `globs`, `alwaysApply` frontmatter. **Under 500 lines recommended**. Rules can be organized into subfolders and scoped with globs; nested `AGENTS.md` is supported. Nested rule-directory inheritance is **unverified**. Cursor Tab ignores these rules. [Cursor rules](https://cursor.com/docs/rules) |
| `.github/copilot-instructions.md` | Copilot; support varies by feature. | Repository-wide Markdown. Scoped files use `.github/instructions/**/*.instructions.md` with `applyTo` frontmatter; nested `AGENTS.md` is also supported. Current guidance recommends roughly **1,000 lines maximum**; a current universal hard cap is **unverified**. [Instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions), [Sizing](https://docs.github.com/en/copilot/tutorials/customize-code-review) |
| Windsurf rules | Current Cascade documentation prefers `.devin/rules/*.md`; `.windsurf/rules/*.md` remains a fallback. | Markdown with `trigger` frontmatter: always-on, model decision, glob or manual. **12,000 characters/file**; global rules **6,000**. Rules are discovered in subdirectories and parents up to the Git root. [Rules](https://docs.devin.ai/desktop/cascade/memories) |
| `llms.txt`, `llms-full.txt` | Website URLs supplied to browsing assistants and documentation integrations. | `llms.txt`: Markdown H1, summary and grouped links; root or subpath, with the most specific path applying. No numeric cap specified. `llms-full.txt` is a full-documentation delivery convention, not guaranteed automatic loading. [Proposal](https://llmstxt.org/), [Mantine example](https://mantine.dev/guides/llms/) |
| `SKILL.md` | Claude: `.claude/skills/<name>/`; Codex: `.agents/skills/<name>/`; personal and nested locations also supported. | YAML `name`/`description` plus Markdown. Name ≤64 characters; description ≤1,024. **Under 500 lines/5,000 tokens recommended**; references load on demand. [Specification](https://agentskills.io/specification), [Claude discovery](https://code.claude.com/docs/en/skills), [Codex discovery](https://learn.chatgpt.com/docs/build-skills) |

**What libraries actually ship**

| Library | Delivery and contents |
|---|---|
| shadcn/ui | `/llms.txt`; `npx skills add shadcn/ui` installs configuration-aware CLI, composition, theming and registry guidance. MCP browses, searches and installs configured registries; custom registries need `/r/registry.json`. [Skills](https://ui.shadcn.com/docs/skills), [MCP](https://ui.shadcn.com/docs/registry/mcp) |
| Mantine | Source-generated index, full text and per-page Markdown, refreshed each release. CLI-installed skills cover custom components, forms and comboboxes; experimental MCP supplies documentation and APIs. [AI guide](https://mantine.dev/guides/llms/) |
| Chakra | Index, full text and component/styling/theming subsets; CLI-installed builder, migration and refactor skills; MCP exposes APIs, examples and tokens. [LLM files](https://chakra-ui.com/docs/get-started/ai/llms), [Skills](https://chakra-ui.com/docs/get-started/ai/skills), [MCP](https://chakra-ui.com/docs/get-started/ai/mcp-server) |
| v0 | Design Systems 2.0 builds attachable skills from repositories, documentation, Figma and attachments, including instructions, references, starter app and `v0.json`. [Design systems](https://v0.app/docs/design-systems-2) |
| Base UI | `/llms.txt` and “View as Markdown” documentation; introduced during its July 2025 beta. [Quick start](https://base-ui.com/react/overview/quick-start), [Releases](https://base-ui.com/react/overview/releases) |
| Radix, Tailwind, Geist | Dedicated official consumer AI-rule kits are **unverified**; this does not establish their absence. [Radix](https://www.radix-ui.com/primitives/docs/overview/introduction), [Tailwind](https://tailwindcss.com/docs/editor-setup), [Geist](https://vercel.com/geist/typography) |

**Registry Markdown delivery: yes**

`registry:file` requires `path`, `type` and `target`; Markdown is permitted. The schema accepts a string target without a path-pattern restriction. [Schema](https://ui.shadcn.com/schema/registry-item.json)

Supported documented targets include:

- `~/AGENTS.md`: **project root**, not the user’s home.
- `~/docs/0db/DESIGN.md`: reliably project-root-relative.
- `docs/0db/DESIGN.md`: supported, but the CLI can place it under `src/` in a source-directory project.
- Leading `@components/`, `@ui/`, `@lib/`, `@hooks/`: resolve configured aliases.

Use `~/` for every kit destination. Absolute paths and traversal should not be part of the kit; comprehensive rejection across CLI versions is **unverified**. [Target documentation](https://ui.shadcn.com/docs/registry/registry-item-json#target), [CLI resolver](https://raw.githubusercontent.com/shadcn-ui/ui/main/packages/shadcn/src/utils/updaters/update-files.ts)

**000h**

[`/llms.txt`](https://000h.cojeev.com/llms.txt) returned **404**. [`/docs/reference-guide/`](https://000h.cojeev.com/docs/reference-guide/) is live HTML containing motion references and composition guidance. No AI-kit or llms link appeared on that page; a kit elsewhere is **unverified**.

**Proposed 0dB files**

All destinations below use registry targets prefixed with `~/`.

| Consumer path | Generated contents |
|---|---|
| `AGENTS.md` | Short user-facing rules, reference pointers and completion checklist; target under 150 lines. |
| `docs/0db/INTENT.md`, `DESIGN.md` | Exact source copies. |
| `docs/0db/DESIGN-core.md` | Extracted principles, conventions, tokens and general motion rules. |
| `docs/0db/components/<item>.md` | Each contract plus its matching Motion and design-reference rows. |
| `docs/0db/manifest.json` | Kit version and source/content hashes. |
| `.cursor/rules/0db.mdc` | Short rules with `description` and `alwaysApply: true`. |
| `.claude/rules/0db.md` | Short Claude entry point; references rather than importing the entire design file. |
| `.github/instructions/0db.instructions.md` | Same core rules, with `applyTo: "**/*.tsx,**/*.css"`. |
| `.devin/rules/0db.md` | Same core rules with `trigger: always_on`; document the legacy Windsurf path. |
| `.agents/skills/0db-component/SKILL.md`, `.claude/skills/0db-component/SKILL.md` | Identical generated workflow: inspect, choose precedent, implement, verify. |
| Site: `/llms.txt`, `/llms-full.txt`, `/ai/*.md` | Small discovery index, complete reference and downloadable kit files. |

**Generation and drift prevention**

Add a proposed `scripts/lib/ai-kit.mjs` generator to [`build-registry.mjs`](/Users/sanjaykumar/Developer/sa/scripts/build-registry.mjs). Parse stable Markdown headings once; derive every adapter from the same extracted rules. Preserve full copies exactly and record hashes separately. Fail generation when required sections disappear.

Extend its existing `--check` comparison to cover **all** kit and site outputs, including obsolete files. Extend [`check-drift.mjs`](/Users/sanjaykumar/Developer/sa/scripts/check-drift.mjs) to validate reference links, contract coverage, source hashes and instruction-size budgets. Its current checks cover contracts, token definitions and obsolete names—not AI-copy freshness.

The local [`DESIGN.md`](/Users/sanjaykumar/Developer/sa/DESIGN.md) is 339,764 bytes: ship it as reference, never automatic context.

**Required user-facing AGENTS content**

Generate these rules from [`INTENT.md`](/Users/sanjaykumar/Developer/sa/INTENT.md) and [`DESIGN.md`](/Users/sanjaykumar/Developer/sa/DESIGN.md):

- Read intent, core design and relevant contracts before implementation.
- Space structures the interface; type provides hierarchy. No decorative icons, fills, shadows, second accent or unsolicited motion.
- Interface words are roman; user-owned words are expression italic. Accent marks location/choice; signal marks errors; highlighter marks reading.
- Use `db-*` classes, `--db-*` tokens, native/ARIA states, `data-variant`, `data-size`, `data-slot`, `cn`, React 19 ref props and minimal client boundaries.
- Native elements first; Radix/cmdk only where needed. No cva or motion-library replacement.
- Explain item anatomy: TSX, CSS sidecar, documentation metadata, example and contract. Consumers follow their app’s paths; those registry paths apply when contributing upstream.
- Before completion: check semantics, keyboard/focus, reduced motion, RTL, themes, responsive layout, relevant tests and the working component. Report checks and limitations.

**Installation and prompts**

Proposed command, **after publication**, from an initialized shadcn app:

```bash
npx shadcn@latest add https://0db.cojeev.com/r/ai.json
```

Publish `/docs/build-with-ai/` with downloads, refresh instructions and these prompts:

> Read `docs/0db/AGENTS.md` [also include this downloadable copy], `INTENT.md`, `DESIGN-core.md` and the relevant component contracts. Build [component] for [behavior]. Use an installed 0dB component as precedent. Run the completion checklist and report evidence.

> Preserve my existing project instructions. Add a short 0dB section pointing to `docs/0db/AGENTS.md`.

Include that namespaced AGENTS copy in the item. Fresh projects can accept root `AGENTS.md`; existing projects should merge the pointer, since shadcn prompts before replacing files rather than merging Markdown. [Installer behavior](https://raw.githubusercontent.com/shadcn-ui/ui/main/packages/shadcn/src/utils/updaters/update-files.ts)

Stale consumer copies require explicit refresh. Tools may ignore files or omit references: make the first prompt confirm loaded paths. For v0, supply URLs/attachments or a design-system skill; “Open in v0” does not support registry `css`/`cssVars`, so 0dB compatibility needs separate verification. [v0 limitations](https://ui.shadcn.com/docs/registry/open-in-v0)