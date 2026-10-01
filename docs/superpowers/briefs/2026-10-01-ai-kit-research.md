# Research brief: the 0dB AI kit (for GPT Sol 6.1)

Owner, 2026-10-01: "put the intent.md and the agent.md and the design.md as well so that user can create their own component using the AI and these files. please first do research about these files and then create it. please also give user a way to use these as well."

0dB is a type-led React 19 component library. It's published as a shadcn registry at https://0db.cojeev.com/r/<name>.json, and its docs site is a Next 16 static export. The repo is the current directory. Its design rules live in three files:
- `INTENT.md`: what 0dB is and what it refuses.
- `DESIGN.md`: principles, conventions, tokens, the Motion table, and every component contract.
- `AGENTS.md`: at present only a Next.js note for contributors, not for users.

The goal: someone using 0dB in their own app can point an AI coding tool (Claude Code, Cursor, Codex, Copilot, Windsurf, v0 and others) at these rules, and get new components that look and behave like 0dB.

You are read-only on the repo. Research, then write your findings as Markdown to stdout.

## Research (use web search; cite a URL for every claim)
1. **Current conventions for AI context files, as of late 2026:**
   - AGENTS.md (agents.md);
   - CLAUDE.md;
   - `.cursor/rules/*.mdc`;
   - `.github/copilot-instructions.md`;
   - Codex AGENTS.md discovery;
   - Windsurf rules;
   - llms.txt and llms-full.txt (llmstxt.org);
   - Claude Agent Skills (SKILL.md);
   - the shadcn MCP server and the registry's own AI features.

   For each, cover: where the file lives, which tools read it, the format and size limits, and whether it nests.
2. **How other design systems and component libraries ship AI rules to their users.** Examples: shadcn/ui, Vercel's v0 or Geist, Radix, Tailwind, Mantine, Chakra, and anything notable from 2025–2026. Cover:
   - the files they publish;
   - how users install them (copy, CLI, registry item, MCP, URL);
   - what goes in them.
3. **Whether a shadcn registry item can ship Markdown files into a user's project root.** This means `registry:file` with a `target` such as `~/AGENTS.md` or a `docs/0db/` path. Check the current shadcn schema (https://ui.shadcn.com/schema/registry-item.json) and the docs, and say what `target` paths are allowed.
4. **How 000h (the owner's other library, https://000h.cojeev.com) exposes docs for AI, if at all.** Look at `/llms.txt` and `/docs/reference-guide/`.

## Then recommend a concrete kit for 0dB
- **The exact files and paths.** For example:
  - a user-facing `AGENTS.md` that points to the rules;
  - `DESIGN.md` and `INTENT.md` copies;
  - `.cursor/rules/0db.mdc`;
  - a `SKILL.md` for building a new 0dB component;
  - `/llms.txt` and `/llms-full.txt` on the site.
- **How each file is generated** from the repo's real INTENT.md and DESIGN.md, so it never drifts. The build is `scripts/build-registry.mjs`; read it, and `scripts/check-drift.mjs`.
- **How a user gets the files:** one command (for example `npx shadcn add https://0db.cojeev.com/r/ai.json`), plus a "Build with AI" docs page with copy-paste prompts.
- **What the user-facing AGENTS.md must say:** the non-negotiable rules, the anatomy of an item, the naming (`db-`, `data-variant`), and a checklist the AI runs before it says it's done.
- **Risks:** size limits, stale copies, and tools that ignore a file.

Keep it under 1500 words. Use tables where they help. Mark anything you couldn't verify as "unverified".
