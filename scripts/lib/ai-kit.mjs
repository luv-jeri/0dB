import { registryBaseURL } from "../../lib/site/config.mjs"
// Consumer instructions and static references have one authority: INTENT.md and DESIGN.md.
import { createHash } from "node:crypto"
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync } from "node:fs"
import path from "node:path"

const SOURCE = "registry/0db/ai"
const ownedDirectories = [SOURCE, "public/ai"]
const standalone = ["public/llms.txt", "public/llms-full.txt"]
const hash = (text) => createHash("sha256").update(text).digest("hex")
const lines = (text) => text.trimEnd().split("\n").length
const read = (root, file) => readFileSync(path.join(root, file), "utf8")

// Parse headings once, ignoring fenced examples. A section owns its subsections.
function headings(text, source) {
  const found = []
  let offset = 0
  let fence = null
  for (const line of text.split(/(?<=\n)/)) {
    const mark = line.match(/^\s{0,3}(`{3,}|~{3,})/)
    if (mark) {
      if (!fence) fence = mark[1]
      else if (mark[1][0] === fence[0] && mark[1].length >= fence.length) fence = null
    } else if (!fence) {
      const m = line.match(/^(#{1,6}) (.+?)\s*\n?$/)
      if (m) found.push({ depth: m[1].length, title: m[2], start: offset, body: offset + line.length })
    }
    offset += line.length
  }
  for (let i = 0; i < found.length; i++) {
    const h = found[i]
    h.end = found.slice(i + 1).find((next) => next.depth <= h.depth)?.start ?? text.length
    h.text = text.slice(h.start, h.end).trimEnd()
    h.content = text.slice(h.body, h.end).trim()
  }
  const required = (title, depth) => {
    const matches = found.filter((h) => h.title === title && h.depth === depth)
    if (matches.length !== 1 || !matches[0].content)
      throw new Error(`AI kit: ${source} required section "${title}" is missing, empty or ambiguous`)
    return matches[0]
  }
  return { found, required }
}

function table(section) {
  const rows = section.content.split("\n").filter((line) => line.startsWith("|"))
  if (rows.length < 3 || !/^\|[- :|]+\|$/.test(rows[1]))
    throw new Error(`AI kit: required section "${section.title}" has no table`)
  return { header: rows.slice(0, 2).join("\n"), rows: rows.slice(2) }
}

const requiredLine = (section, prefix) => {
  const line = section.content.split("\n").find((line) => line.startsWith(prefix))
  if (!line) throw new Error(`AI kit: required section "${section.title}" has no "${prefix}" rule`)
  return line
}
const referenceTargets = [
  ["Intent", "docs/0db/INTENT.md"],
  ["Core design", "docs/0db/DESIGN-core.md"],
  ["Full design (on demand)", "docs/0db/DESIGN.md"],
  ["Kit version and hashes", "docs/0db/manifest.json"],
]
const references = (target) => referenceTargets.map(([title, dest]) =>
  `- [${title}](${path.posix.relative(path.posix.dirname(target), dest)})`).join("\n")

export function buildAiKit({ root = ".", items, baseURL = registryBaseURL(), intent = read(root, "INTENT.md"), design = read(root, "DESIGN.md") }) {
  baseURL = baseURL.replace(/\/$/, "")
  const i = headings(intent, "INTENT.md")
  const d = headings(design, "DESIGN.md")
  for (const title of ["Who it's for", "What success looks like", "What it refuses, and why", "Non-goals", "When in doubt"]) i.required(title, 2)
  const principles = d.required("Principles", 2)
  const conventions = d.required("Conventions", 2)
  const tokens = d.required("Tokens", 2)
  d.required("Colour", 3)
  d.required("Type", 3)
  const shape = d.required("Space, line, shape", 3)
  const tempo = d.required("Tempo", 3)
  const shared = d.required("Shared moves", 3)
  const motion = d.required("Motion", 2)
  const where = d.required("Where each move comes from", 2)
  const registry = d.required("Registry conventions", 2)
  const docs = d.required("Docs conventions", 2)
  d.required("Components", 2)
  const motionTable = table(motion)
  const whereTable = table(where)
  const generalMotion = motion.content.slice(0, motion.content.indexOf("\n| ")).trim()
  const refused = table(i.required("What it refuses, and why", 2))
  // The port inventory is reference material, rather than an automatic-context rule.
  const refusals = refused.rows.filter((row) => !row.startsWith("| Effects ported"))
  const shapeRule = requiredLine(shape, "- Shape vocabulary")
  const rules = `## Non-negotiable rules\n\n${principles.content}\n\n${shapeRule}\n\n${refused.header}\n${refusals.join("\n")}\n\n${i.required("When in doubt", 2).content}`
  const naming = `## Naming\n\n${conventions.content}\n\n${["- Item names", "- Sidecars", "- Direction", "- Variants", "- React 19"].map((prefix) => requiredLine(registry, prefix)).join("\n")}`
  const anatomy = `## Item anatomy\n\n${requiredLine(registry, "- One item")}\n${requiredLine(docs, "- \`examples/<item>.tsx\` default-exports")}\n\nUse your application's component, style and example paths. The paths above describe contributions to the 0nlyType registry. Pair each new item with a contract (anatomy, states, keyboard behaviour), a Motion row and a “Where each move comes from” row. Read one installed item's TSX, sidecar, example and contract end to end as a precedent.`
  const checklist = `## Completion checklist\n\n- Check the contract's semantics, roles and accessible names; keyboard and visible focus; announcements for state changes; disabled and busy states. Keep decorative copies hidden from assistive technology.\n- Check reduced motion in CSS and JavaScript: ${requiredLine(tempo, "Under \`prefers-reduced-motion")}\n- Check direction with logical properties and RTL where a stroke or reading order has direction. Isolate numbers inside RTL text.\n- Check the working component at desktop and phone widths, day and nocturne, and the relevant scheme, key and pair switches. Check forced colours.\n- Run the relevant tests, typecheck and lint in the consuming app. For upstream work, regenerate the registry and run its registry and drift checks.\n- Report which source paths you read, the precedent, the checks and their results, and anything unverified. Do not claim a check you did not run.`
  const intro = "# 0nlyType component kit\n\nRead intent, core design and the relevant `docs/0db/components/<item>.md` contracts before implementation. Load the full design only when needed. Preserve existing project instructions when merging this kit."
  const body = `${intro}\n\n${rules}\n\n${anatomy}\n\n${naming}\n\n${checklist}`
  const instructions = (target) => `${body}\n\n## References\n\n${references(target)}\n`
  const workflow = `## Workflow\n\n1. **Inspect.** Confirm the loaded paths: intent, core design and the relevant item contracts. Inspect the app's aliases, tokens, base styles and existing instructions. Establish the requested behaviour and who owns each word.\n2. **Choose a precedent.** Read an installed 0nlyType item's implementation, CSS sidecar, example and contract. Choose the native element first. Identify one creative move and one motion from its “Where” and Motion rows; read shared moves before composing items.\n3. **Implement.** Follow the item anatomy and naming below in the app's own paths. Use the existing tokens and minimal client boundary. Include the states and keyboard behaviour in the contract and show the states in an example. When contributing upstream, update the contract and its rows together with code, then regenerate.\n4. **Verify.** Run the completion checklist below. Compare the working component with the contract and precedent. Report evidence and limitations.\n`
  const files = new Map()
  const entries = []
  const siteEntries = new Map()
  const add = (local, target, content, site) => {
    const sourcePath = `${SOURCE}/${local}`
    files.set(sourcePath, content)
    entries.push({ path: sourcePath, type: "registry:file", target: `~/${target}` })
    if (site) {
      files.set(`public/ai/${site}`, content)
      siteEntries.set(`public/ai/${site}`, target)
    }
  }
  add("AGENTS.md", "AGENTS.md", instructions("AGENTS.md"))
  add("docs/AGENTS.md", "docs/0db/AGENTS.md", instructions("docs/0db/AGENTS.md"), "AGENTS.md")
  add("INTENT.md", "docs/0db/INTENT.md", intent, "INTENT.md")
  add("DESIGN.md", "docs/0db/DESIGN.md", design, "DESIGN.md")
  const core = `# 0nlyType core design\n\nExtracted from DESIGN.md. Read INTENT.md first. Item-specific contracts are in components/<item>.md.\n\n${[principles.text, conventions.text, tokens.text, `## Motion\n\n${generalMotion}`, shared.text, registry.text, docs.text].join("\n\n")}\n`
  add("DESIGN-core.md", "docs/0db/DESIGN-core.md", core, "DESIGN-core.md")
  const contracts = []
  for (const item of items) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.name)) throw new Error(`AI kit: invalid item name ${item.name}`)
    const found = d.found.filter((h) => {
      const match = h.title.match(/^((?:db-[a-z-]+, )*db-[a-z-]+) \(([^)]+)\)$/)
      return h.depth === 3 && match?.[1].split(", ").includes(item.contract) && match[2].split(",").map((s) => s.trim()).includes(item.name)
    })
    if (found.length !== 1 || !found[0].content) throw new Error(`AI kit: ${item.name} required contract ${item.contract} is missing, empty or ambiguous`)
    const rows = (title, t) => {
      const matches = t.rows.filter((row) => row.split("|")[1].includes(`\`${item.name}\``))
      return `## ${title}\n\n${matches.length ? `${t.header}\n${matches.join("\n")}` : "No item-specific row is defined in DESIGN.md. Read the general rules in DESIGN-core.md and the contract above."}`
    }
    const text = `# 0nlyType: ${item.name}\n\nExtracted from DESIGN.md.\n\n${found[0].text}\n\n${rows("Motion", motionTable)}\n\n${rows("Where each move comes from", whereTable)}\n`
    contracts.push(text)
    add(`components/${item.name}.md`, `docs/0db/components/${item.name}.md`, text, `components/${item.name}.md`)
  }
  const adapter = (frontmatter, target) => `---\n${frontmatter}\n---\n\n${instructions(target)}`
  const claudeTarget = ".claude/rules/0db.md"
  const claudeReferences = ["docs/0db/AGENTS.md", "docs/0db/DESIGN.md"].map((target) =>
    `[${target}](${path.posix.relative(path.posix.dirname(claudeTarget), target)})`).join(" and ")
  add("claude/0db.md", claudeTarget, `# 0nlyType project rules\n\nBefore building with 0nlyType, read ${claudeReferences} and the relevant component contracts. Preserve existing project instructions.\n\n${rules}\n`, "claude.md")
  add("cursor.mdc", ".cursor/rules/0db.mdc", adapter('description: "Create and extend type-led 0nlyType components"\nalwaysApply: true', ".cursor/rules/0db.mdc"), "cursor.md")
  add("copilot.instructions.md", ".github/instructions/0db.instructions.md", adapter('applyTo: "**/*.tsx,**/*.css"', ".github/instructions/0db.instructions.md"), "copilot.md")
  add("devin.md", ".devin/rules/0db.md", adapter("trigger: always_on", ".devin/rules/0db.md"), "devin.md")
  const skill = `---\nname: 0db-component\ndescription: "Create or extend a 0nlyType component using its intent, design tokens, item anatomy and contracts. Use when building components with 0nlyType."\n---\n\n${intro}\n\n${workflow}\n${rules}\n\n${anatomy}\n\n${naming}\n\n${checklist}\n\n## References\n\n${references(".agents/skills/0db-component/SKILL.md")}\n`
  add("claude/SKILL.md", ".claude/skills/0db-component/SKILL.md", skill)
  add("agents/SKILL.md", ".agents/skills/0db-component/SKILL.md", skill, "SKILL.md")
  if (lines(files.get(`${SOURCE}/AGENTS.md`)) >= 150) throw new Error("AI kit: AGENTS.md must stay under 150 lines")
  if (lines(skill) >= 500) throw new Error("AI kit: SKILL.md must stay under 500 lines")
  // Public downloads use their own relative links, not the adapter's installed directory.
  const siteForTarget = new Map([...siteEntries].map(([site, target]) => [target, site]))
  siteForTarget.set("docs/0db/manifest.json", "public/ai/manifest.json")
  for (const [file, installedTarget] of siteEntries) {
    const text = files.get(file)
    files.set(file, text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, href) => {
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(installedTarget), href))
      const site = siteForTarget.get(target)
      return site ? `[${label}](${path.posix.relative(path.posix.dirname(file), site)})` : match
    }))
  }
  // Publish the source filenames too (older consumers tried these URLs). Rebase
  // their links to the installed-layout copies, which preserve the payload bytes.
  const siteForInstalledTarget = new Map(entries.map((entry) => [entry.target.slice(2), `public/ai/${entry.target.slice(2)}`]))
  siteForInstalledTarget.set("docs/0db/manifest.json", "public/ai/docs/0db/manifest.json")
  for (const entry of entries) {
    const file = `public/ai/${entry.path.slice(SOURCE.length + 1)}`
    if (files.has(file)) continue
    const installedTarget = entry.target.slice(2)
    files.set(file, files.get(entry.path).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, href) => {
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(installedTarget), href))
      const site = siteForInstalledTarget.get(target)
      return site ? `[${label}](${path.posix.relative(path.posix.dirname(file), site)})` : match
    }))
  }
  // Every installed file also has an exact public copy. Keeping the same directory
  // layout makes its relative references work both in the consumer and over HTTP.
  for (const entry of entries) files.set(`public/ai/${entry.target.slice(2)}`, files.get(entry.path))
  const version = JSON.parse(read(root, "package.json")).version
  const manifest = {
    version,
    sources: { "INTENT.md": hash(intent), "DESIGN.md": hash(design) },
    files: Object.fromEntries(entries.map((e) => [e.path.slice(SOURCE.length + 1), hash(files.get(e.path))])),
    components: items.map((item) => item.name).sort(),
  }
  add("manifest.json", "docs/0db/manifest.json", JSON.stringify(manifest, null, 2) + "\n", "manifest.json")
  files.set("public/ai/docs/0db/manifest.json", files.get(`${SOURCE}/manifest.json`))
  const link = (label, href, description) => `- [${label}](${baseURL}${href}): ${description}`
  const downloads = [...files.keys()].filter((f) => f.startsWith("public/ai/") && /\.(md|mdc|json)$/.test(f))
  files.set("public/llms.txt", `# 0nlyType\n\n> ${principles.content.split("\n").filter(Boolean).map((line) => line.replace(/^\d+\. /, "")).join(" ")}\n\nA type-led component registry. Read intent, core design and relevant contracts before creating a component.\n\n## Documentation\n\n${[
    link("Install", "/docs/install/", "Install the library and its base"),
    link("Principles", "/docs/principles/", "The system's design principles"),
    link("Tokens", "/docs/tokens/", "Colour, type, space and motion tokens"),
    ...items.map((item) => link(item.title, `/docs/${item.name}/`, `${item.name} usage and examples`)),
  ].join("\n")}\n\n## AI references\n\n${downloads.map((f) => link(f.slice("public/ai/".length), f.slice("public".length), "Downloadable 0nlyType instructions or reference")).join("\n")}\n\n## Optional\n\n${link("Full context", "/llms-full.txt", "Intent, core design and every item contract; load on demand")}\n${link("Install the AI kit", "/r/ai.json", "shadcn registry item with project-root destinations")}\n`)
  files.set("public/llms-full.txt", `# 0nlyType complete AI reference\n\n${intent}\n\n${core}\n\n${contracts.join("\n\n")}`)
  return {
    files, manifest, baseURL, items,
    item: { name: "ai", type: "registry:item", title: "0nlyType AI kit", description: "Source-generated instructions and component contracts for building with 0nlyType.", files: entries },
  }
}

function walk(root, dir) {
  const absolute = path.join(root, dir)
  if (!existsSync(absolute)) return []
  return readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const file = `${dir}/${entry.name}`
    return entry.isDirectory() ? walk(root, file) : [file]
  })
}

export function writeAiKit(kit, root = ".") {
  for (const dir of ownedDirectories) rmSync(path.join(root, dir), { recursive: true, force: true })
  for (const [file, text] of kit.files) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    writeFileSync(path.join(root, file), text)
  }
}

export function checkAiKit(kit, root = ".") {
  const stale = []
  for (const [file, text] of kit.files) {
    try { if (read(root, file) !== text) stale.push(file) } catch { stale.push(file) }
  }
  for (const file of [...ownedDirectories.flatMap((dir) => walk(root, dir)), ...standalone])
    if (!kit.files.has(file)) stale.push(`${file} (obsolete)`)
  return stale
}

export function validateAiKit(kit, root = ".") {
  const failures = []
  const contents = new Map()
  for (const file of kit.files.keys()) {
    try { contents.set(file, read(root, file)) } catch { failures.push(`missing ${file}`) }
  }
  for (const item of kit.items) if (!contents.has(`${SOURCE}/components/${item.name}.md`)) failures.push(`contract coverage: ${item.name}`)
  for (const [file, text] of contents) {
    if (file.endsWith("AGENTS.md") && lines(text) >= 150) failures.push(`${file}: must be under 150 lines`)
    if (file.endsWith("SKILL.md") && lines(text) >= 500) failures.push(`${file}: must be under 500 lines`)
  }
  if (contents.get(`${SOURCE}/claude/SKILL.md`) !== contents.get(`${SOURCE}/agents/SKILL.md`)) failures.push("SKILL.md adapters differ")
  for (const file of [`${SOURCE}/manifest.json`, "public/ai/manifest.json"]) {
    try {
      const manifest = JSON.parse(contents.get(file))
      if (manifest.version !== kit.manifest.version) failures.push(`${file}: version differs`)
      for (const [source, expected] of Object.entries(kit.manifest.sources))
        if (manifest.sources?.[source] !== expected) failures.push(`${file}: source hash ${source}`)
      for (const [local, expected] of Object.entries(kit.manifest.files))
        if (manifest.files?.[local] !== expected || hash(contents.get(`${SOURCE}/${local}`) ?? "") !== expected) failures.push(`${file}: content hash ${local}`)
      if (JSON.stringify(manifest.components) !== JSON.stringify(kit.manifest.components)) failures.push(`${file}: contract coverage differs`)
    } catch { failures.push(`${file}: invalid manifest`) }
  }
  const targetToFile = new Map(kit.item.files.map((f) => [f.target.slice(2), f.path]))
  for (const entry of kit.item.files) {
    const site = `public/ai/${entry.target.slice(2)}`
    if (contents.get(site) !== contents.get(entry.path)) failures.push(`${site}: installed copy differs`)
  }
  const docs = new Set(["install", "principles", "tokens", ...kit.items.map((i) => i.name)])
  for (const [file, text] of contents) {
    if (file.endsWith(".json")) continue
    const entry = kit.item.files.find((e) => e.path === file)
    for (const [, href] of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      let destination
      if (/^https?:/.test(href)) {
        const url = new URL(href)
        if (url.origin !== new URL(kit.baseURL).origin) continue
        const basePath = new URL(kit.baseURL).pathname.replace(/\/$/, "")
        if (!url.pathname.startsWith(`${basePath}/`)) { failures.push(`${file}: link outside site ${href}`); continue }
        const pathname = url.pathname.slice(basePath.length)
        const doc = pathname.match(/^\/docs\/([^/]+)\/$/)
        if (doc && docs.has(doc[1])) continue
        if (pathname === "/r/ai.json") continue // built after the kit
        destination = `public${pathname}`
      } else if (entry) {
        const target = path.posix.normalize(path.posix.join(path.posix.dirname(entry.target.slice(2)), href))
        destination = targetToFile.get(target)
      } else {
        destination = path.posix.normalize(path.posix.join(path.posix.dirname(file), href))
      }
      if (!destination || !contents.has(destination)) failures.push(`${file}: broken link ${href}`)
    }
  }
  return failures
}
