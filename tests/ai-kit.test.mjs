import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { registryItemSchema } from "shadcn/schema"
import { readItems } from "../scripts/lib/items.mjs"
import { buildAiKit, writeAiKit, checkAiKit, validateAiKit } from "../scripts/lib/ai-kit.mjs"

const items = await readItems()
const read = (root, file) => readFileSync(path.join(root, file), "utf8")

test("AI kit builds complete consumer instructions and static downloads from the real sources", () => {
  const root = mkdtempSync(path.join(tmpdir(), "0nlytype-ai-kit-"))
  const ownAgents = read(".", "AGENTS.md")
  try {
    const kit = buildAiKit({ items })
    writeAiKit(kit, root)
    const payload = { ...kit.item, files: kit.item.files.map((f) => ({ ...f, content: read(root, f.path) })) }
    assert.ok(registryItemSchema.safeParse(payload).success)
    assert.equal(payload.type, "registry:item")
    const targets = new Set(payload.files.map((f) => f.target))
    for (const target of ["AGENTS.md", "docs/0nlytype/AGENTS.md", "docs/0nlytype/INTENT.md", "docs/0nlytype/DESIGN.md", "docs/0nlytype/DESIGN-core.md", "docs/0nlytype/manifest.json", ".cursor/rules/0nlytype.mdc", ".github/instructions/0nlytype.instructions.md", ".claude/skills/0nlytype-component/SKILL.md", ".agents/skills/0nlytype-component/SKILL.md", ".devin/rules/0nlytype.md"])
      assert.ok(targets.has(`~/${target}`), target)
    assert.ok(payload.files.every((f) => f.type === "registry:file" && f.target.startsWith("~/") && !f.target.includes("..")))
    const agents = read(root, "registry/0nlytype/ai/AGENTS.md")
    for (const heading of ["Non-negotiable rules", "Item anatomy", "Naming", "Completion checklist"]) assert.ok(agents.includes(`## ${heading}`), heading)
    assert.ok(agents.trimEnd().split("\n").length < 150)
    assert.equal(read(root, "registry/0nlytype/ai/INTENT.md"), read(".", "INTENT.md"))
    assert.equal(read(root, "registry/0nlytype/ai/DESIGN.md"), read(".", "DESIGN.md"))
    const core = read(root, "registry/0nlytype/ai/DESIGN-core.md")
    for (const heading of ["Principles", "Conventions", "Tokens", "Space, line, shape", "Motion", "Shared moves"]) assert.ok(core.includes(heading), heading)
    assert.ok(!core.includes("### db-btn (button)"))
    for (const item of items) {
      assert.ok(targets.has(`~/docs/0nlytype/components/${item.name}.md`), item.name)
      const contract = read(root, `registry/0nlytype/ai/components/${item.name}.md`)
      assert.ok(contract.includes(item.contract), item.name)
      assert.ok(contract.includes("## Motion"), item.name)
      assert.ok(contract.includes("## Where each move comes from"), item.name)
      assert.equal(read(root, `public/ai/components/${item.name}.md`), contract)
    }
    assert.match(read(root, "registry/0nlytype/ai/cursor.mdc"), /alwaysApply: true/)
    assert.match(read(root, "registry/0nlytype/ai/copilot.instructions.md"), /applyTo: "\*\*\/\*\.tsx,\*\*\/\*\.css"/)
    assert.match(read(root, "registry/0nlytype/ai/devin.md"), /trigger: always_on/)
    const skill = read(root, "registry/0nlytype/ai/claude/SKILL.md")
    assert.equal(skill, read(root, "registry/0nlytype/ai/agents/SKILL.md"))
    assert.ok(skill.trimEnd().split("\n").length < 500)
    for (const step of ["Inspect", "Choose a precedent", "Implement", "Verify"]) assert.ok(skill.includes(step), step)
    assert.match(read(root, "public/llms.txt"), /^# 0nlyType\n\n> /)
    assert.ok(read(root, "public/llms-full.txt").includes("### db-btn (button)"))
    assert.deepEqual(checkAiKit(kit, root), [])
    assert.deepEqual(validateAiKit(kit, root), [])
    assert.equal(read(".", "AGENTS.md"), ownAgents)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test("AI kit fails loudly on missing headings and contracts, and follows changed source rules", () => {
  const intent = read(".", "INTENT.md")
  const design = read(".", "DESIGN.md")
  for (const heading of ["Principles", "Conventions", "Tokens", "Colour", "Type", "Space, line, shape", "Motion", "Shared moves", "Registry conventions", "Docs conventions"])
    assert.throws(() => buildAiKit({ items, intent, design: design.replace(new RegExp(`^(#+ )${heading}$`, "m"), `$1Removed ${heading}`) }), /AI kit:.*required section/)
  assert.throws(() => buildAiKit({ items, intent: intent.replace("## When in doubt", "## Removed"), design }), /AI kit:.*required section/)
  assert.throws(() => buildAiKit({ items, intent, design: design.replace("### db-btn (button)", "### Removed") }), /AI kit:.*button.*contract/)
  assert.throws(() => buildAiKit({ items, intent, design: design.replace("- React 19:", "- Removed:") }), /AI kit:.*required section.*React 19/)
  const reordered = buildAiKit({ items, intent, design: design.replace("- React 19:", "- An unrelated new convention.\n- React 19:") })
  assert.ok(reordered.files.get("registry/0nlytype/ai/AGENTS.md").includes("React 19: `ref` is a plain prop"))
  const kit = buildAiKit({ items, intent, design: design.replace("Silence is structure.", "Silence changed.") })
  for (const file of ["AGENTS.md", "cursor.mdc", "copilot.instructions.md", "devin.md", "claude/SKILL.md"])
    assert.ok(kit.files.get(`registry/0nlytype/ai/${file}`).includes("Silence changed."), file)
})

test("AI kit detects stale and obsolete outputs, broken links, hashes and size budgets", () => {
  const root = mkdtempSync(path.join(tmpdir(), "0nlytype-ai-drift-"))
  try {
    const kit = buildAiKit({ items })
    writeAiKit(kit, root)
    writeFileSync(path.join(root, "public/ai/obsolete.md"), "old")
    writeFileSync(path.join(root, "registry/0nlytype/ai/components/obsolete.md"), "old")
    assert.ok(checkAiKit(kit, root).includes("public/ai/obsolete.md (obsolete)"))
    assert.ok(checkAiKit(kit, root).includes("registry/0nlytype/ai/components/obsolete.md (obsolete)"))
    writeAiKit(kit, root)
    assert.deepEqual(checkAiKit(kit, root), [])
    writeFileSync(path.join(root, "registry/0nlytype/ai/AGENTS.md"), "[Broken](docs/0nlytype/missing.md)\n" + "line\n".repeat(150))
    writeFileSync(path.join(root, "registry/0nlytype/ai/agents/SKILL.md"), "line\n".repeat(500))
    const manifestPath = "registry/0nlytype/ai/manifest.json"
    const manifest = JSON.parse(read(root, manifestPath))
    manifest.sources["INTENT.md"] = "wrong"
    writeFileSync(path.join(root, manifestPath), JSON.stringify(manifest))
    rmSync(path.join(root, `registry/0nlytype/ai/components/${items[0].name}.md`))
    const failures = validateAiKit(kit, root).join("\n")
    for (const reason of ["broken link", "150 lines", "500 lines", "source hash", "contract coverage"]) assert.ok(failures.includes(reason), reason)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
