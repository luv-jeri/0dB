// Shared by the registry build, the checks and the docs: what an item is made
// of, what it depends on, and how its imports read once installed.
import { readdirSync, readFileSync, existsSync } from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

export const SOURCE = "registry/0db"
export const MOVEMENTS = ["II", "IV", "VI", "VII", "VIII", "IX", "X", "XI"]
const specifiers = /(?:from\s+|import\s+|import\s*\(\s*)["']([^"']+)["']/g
const platform = /^(react|react-dom|next)(\/|$)/

export function rewriteImports(source) {
  return source.replace(/((?:from\s+|import\s+|import\s*\(\s*)["'])([^"']+)(["'])/g, (_m, start, value, end) => {
    const to = value
      .replace(/^@\/registry\/0db\/lib\/utils$/, "@/lib/utils")
      .replace(/^@\/registry\/0db\/ui\//, "@/components/ui/")
      .replace(/^\.\/(?=[a-z])/, "@/components/ui/")
    return `${start}${to}${end}`
  })
}

export function deriveDeps(source) {
  const npm = new Set()
  const siblings = new Set()
  for (const [, spec] of source.matchAll(specifiers)) {
    if (spec.startsWith("./")) siblings.add(spec.slice(2))
    else if (spec.startsWith("@/registry/0db/ui/")) siblings.add(spec.slice("@/registry/0db/ui/".length))
    else if (spec.startsWith("@/") || spec.startsWith(".") || platform.test(spec)) continue
    else npm.add(spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0])
  }
  return { npm: [...npm].sort(), siblings: [...siblings].sort() }
}

/** Every item's meta, in fence order within its movement (the specimen's cascade order). */
export async function readItems(root = ".") {
  const fenceOrder = fenceLines(root)
  const metas = []
  for (const file of readdirSync(path.join(root, "content")).filter((f) => f.endsWith(".ts") && f !== "types.ts")) {
    const meta = (await import(pathToFileURL(path.resolve(root, "content", file)).href)).default
    if (meta.name !== path.basename(file, ".ts")) throw new Error(`content/${file}: name is ${meta.name}`)
    const ui = path.join(root, SOURCE, "ui", `${meta.name}.tsx`)
    const css = path.join(root, SOURCE, "styles", `${meta.name}.css`)
    if (!existsSync(ui)) throw new Error(`${meta.name}: missing ${ui}`)
    const deps = deriveDeps(readFileSync(ui, "utf8"))
    metas.push({
      ...meta,
      ui,
      css: existsSync(css) ? css : null,
      npm: deps.npm,
      siblings: [...new Set([...deps.siblings, ...(meta.uses ?? [])])].sort(),
      order: fenceOrder.get(meta.contract) ?? Infinity,
    })
  }
  return metas.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
}

/** db-<name> to the line its f-<name> fence starts on in the specimen. */
function fenceLines(root) {
  const map = new Map()
  readFileSync(path.join(root, "specimen/fermata.css"), "utf8").split("\n").forEach((line, i) => {
    const m = line.match(/^\/\* ── f-([a-z-]+)/)
    if (m && !map.has(`db-${m[1]}`)) map.set(`db-${m[1]}`, i)
  })
  return map
}
