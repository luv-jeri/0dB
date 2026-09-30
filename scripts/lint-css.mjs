// Fails on any !important in the registry CSS, except the two base.css rules
// that must beat a component's own display and position: [hidden] and .db-sr.
import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"

const dir = "registry/0db/styles"
const allowed = { "base.css": ["[hidden]", ".db-sr"] }
const bad = []

for (const file of readdirSync(dir).filter((f) => f.endsWith(".css"))) {
  const css = readFileSync(path.join(dir, file), "utf8").replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "))
  for (const m of css.matchAll(/!important/g)) {
    const open = css.lastIndexOf("{", m.index)
    const from = Math.max(css.lastIndexOf("}", open), css.lastIndexOf("{", open - 1), css.lastIndexOf(";", open))
    const selector = css.slice(from + 1, open).trim()
    if ((allowed[file] ?? []).includes(selector)) continue
    const line = css.slice(0, m.index).split("\n").length
    bad.push(`${dir}/${file}:${line}  !important in "${selector}"`)
  }
}

if (bad.length) {
  console.error(`!important is only allowed on [hidden] and .db-sr in base.css:\n  ${bad.join("\n  ")}`)
  process.exit(1)
}
