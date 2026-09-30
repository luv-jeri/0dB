// Holds DESIGN.md, the items and the tokens to each other.
//   every item has ui, content, example and a DESIGN.md contract
//   every --db- token used is defined
//   no f- names remain
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs"
import path from "node:path"
import { readItems, SOURCE } from "./lib/items.mjs"

const failures = []
const fail = (check, msg) => failures.push(`${check}: ${msg}`)

// every item has ui, content, example and a DESIGN.md contract
const design = readFileSync("DESIGN.md", "utf8")
const contracts = new Map() // "db-btn" -> Set of item names in its heading
for (const [, classes, names] of design.matchAll(/^### ((?:db-[a-z-]+, )*db-[a-z-]+) \(([^)]+)\)/gm))
  for (const cls of classes.split(", "))
    for (const n of names.split(",")) (contracts.get(cls) ?? contracts.set(cls, new Set()).get(cls)).add(n.trim())
const items = await readItems()
for (const item of items) {
  if (!existsSync(`examples/${item.name}.tsx`)) fail("every item has ui, content, example and a DESIGN.md contract", `${item.name}: no examples/${item.name}.tsx`)
  if (!contracts.get(item.contract)?.has(item.name))
    fail("every item has ui, content, example and a DESIGN.md contract", `${item.name}: DESIGN.md has no "### ${item.contract} (${item.name})" heading`)
}
const named = new Set(items.map((i) => i.name))
for (const f of readdirSync(`${SOURCE}/ui`)) if (!named.has(path.basename(f, ".tsx")))
  fail("every item has ui, content, example and a DESIGN.md contract", `${SOURCE}/ui/${f} has no content/${path.basename(f, ".tsx")}.ts`)

// every --db- token used is defined: in tokens.css, or declared as a knob in some sidecar,
// or read with a fallback (var(--db-x, …)), which makes it an optional knob.
const styles = readdirSync(`${SOURCE}/styles`).filter((f) => f.endsWith(".css")).map((f) => `${SOURCE}/styles/${f}`)
const sources = [...styles, ...readdirSync(`${SOURCE}/ui`).map((f) => `${SOURCE}/ui/${f}`), "app/globals.css", "app/site.css"].filter(existsSync)
const defined = new Set()
for (const f of styles) for (const [, t] of readFileSync(f, "utf8").matchAll(/(--db-[a-z0-9-]+)\s*:/g)) defined.add(t)
for (const f of sources) {
  const text = readFileSync(f, "utf8")
  for (const m of text.matchAll(/var\(\s*(--db-[a-z0-9-]+)\s*([,)])/g))
    if (m[2] === ")" && !defined.has(m[1])) fail("every --db- token used is defined", `${f}: ${m[1]}`)
}

// no f- names remain
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = path.join(dir, f)
  return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css|md|mjs)$/.test(f) ? [p] : []
})
const scanned = ["registry", "app", "components", "examples", "content"].filter(existsSync).flatMap(walk).concat("DESIGN.md", "INTENT.md")
for (const f of scanned) {
  readFileSync(f, "utf8").split("\n").forEach((line, i) => {
    if (/--f-[a-z]|(?<![A-Za-z0-9_@/.-])f-(?=[a-z]+[a-z-]*\b)/.test(line.replace(/https?:\S+/g, "")))
      fail("no f- names remain", `${f}:${i + 1}  ${line.trim().slice(0, 80)}`)
  })
}

if (failures.length) {
  console.error(failures.join("\n"))
  process.exit(1)
}
console.log(`Drift check holds: ${items.length} items, ${defined.size} tokens.`)
