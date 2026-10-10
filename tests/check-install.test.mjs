import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, symlinkSync, realpathSync, existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { readRegistry, closureFor, npmClosure, selectItems, checkPlan, createConsumer, installedTarget, verifyInstall, copyTemplate } from "../scripts/check-install.mjs"

const here = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const fixture = new Map([
  ["base", { name: "base", dependencies: ["clsx"], files: [] }],
  ["sibling", { name: "sibling", registryDependencies: ["https://example.test/r/base.json"], dependencies: ["clsx", "npm-sibling"], files: [] }],
  ["item", { name: "item", registryDependencies: ["base", "@0nlytype/sibling"], devDependencies: ["npm-dev"], files: [] }],
  ["unrelated", { name: "unrelated", dependencies: ["must-not-install"], files: [] }],
])
const temporary = (fn) => {
  const root = mkdtempSync(path.join(tmpdir(), "0nlytype-install-test-"))
  try { fn(root) } finally { rmSync(root, { recursive: true, force: true }) }
}
const put = (root, file, text = "") => {
  mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
  writeFileSync(path.join(root, file), text)
}

test("dependency closures exclude unrelated items/npm deps and reject missing local payloads", () => {
  const items = closureFor("item", fixture)
  assert.deepEqual(items.map((item) => item.name), ["item", "base", "sibling"])
  assert.deepEqual(npmClosure(items), { dependencies: ["clsx", "npm-sibling"], devDependencies: ["npm-dev"] })
  const broken = new Map(fixture)
  broken.set("broken", { name: "broken", registryDependencies: ["https://example.test/r/missing.json"] })
  assert.throws(() => closureFor("broken", broken), /Missing local registry dependency/)
  const cyclic = new Map(fixture)
  cyclic.set("base", { name: "base", registryDependencies: ["item"] })
  assert.equal(closureFor("item", cyclic).length, 3)
})

test("--only validates names; full plans check every built item and five src items with CSS", () => {
  assert.deepEqual(selectItems(["--only", "item, sibling,item"], fixture), ["item", "sibling"])
  assert.throws(() => selectItems(["--only", "missing"], fixture), /Unknown registry item/)
  assert.throws(() => selectItems(["--only"], fixture), /Usage/)
  const registry = readRegistry(here)
  const all = selectItems([], registry)
  const plan = checkPlan(all, registry)
  assert.deepEqual(plan.filter((entry) => entry.layout === "root").flatMap((entry) => entry.names ?? [entry.name]).sort(), [...all].sort())
  // Signs install in batches; every other item has a consumer of its own.
  assert.ok(plan.filter((entry) => entry.names).every((entry) => entry.names.every((name) => /^sign-.+-(?:dots|words|fill)$/.test(name))))
  assert.ok(plan.filter((entry) => !entry.names && entry.layout === "root").every((entry) => !/^sign-.+-(?:dots|words|fill)$/.test(entry.name)))
  assert.equal(plan.filter((entry) => entry.layout === "src").length, 5)
  assert.ok(plan.some((entry) => entry.layout === "src" && closureFor(entry.name, registry).some((item) => Object.keys(item.css ?? {}).some((key) => key.startsWith("@import")))))
  assert.deepEqual(checkPlan(["item"], fixture, true), [{ name: "item", layout: "root" }, { name: "item", layout: "src" }])
})

for (const layout of ["root", "src"]) test(`${layout} layout checks complete installed closure and real CSS paths`, () => temporary((root) => {
  createConsumer(root, layout)
  const prefix = layout === "src" ? "src/" : ""
  const tsconfig = JSON.parse(readFileSync(path.join(root, "tsconfig.json"), "utf8"))
  assert.deepEqual(tsconfig.compilerOptions.paths, { "@/*": [`./${prefix}*`] })
  const globals = `${prefix}app/globals.css`
  const items = [{ name: "item", files: [
    { type: "registry:ui", path: "registry/0nlytype/ui/item.tsx" },
    { type: "registry:file", path: "registry/0nlytype/styles/item.css", target: "styles/0nlytype/item.css" },
  ], css: { '@import "../styles/0nlytype/item.css"': {} } }]
  assert.throws(() => verifyInstall(root, layout, items), /Missing installed file/)
  for (const file of items[0].files) put(root, installedTarget(file, layout))
  assert.throws(() => verifyInstall(root, layout, items), /Missing CSS import/)
  put(root, globals, '@import "../styles/0nlytype/item.css";\n@import "../../styles/0nlytype/item.css";\n')
  assert.throws(() => verifyInstall(root, layout, items), /Unresolved CSS import/)
  put(root, globals, '@import "../styles/0nlytype/item.css";\n')
  verifyInstall(root, layout, items)
  put(root, `${prefix}styles/0nlytype/item.css`, '@import "./missing.css";\n')
  assert.throws(() => verifyInstall(root, layout, items), /Unresolved CSS import/)
  assert.equal(installedTarget({ target: "~/docs/0nlytype/INTENT.md" }, layout), "docs/0nlytype/INTENT.md")
}))

test("a consumer outside the repo cannot typecheck against repository npm dependencies", () => temporary((root) => {
  put(root, "item.ts", 'import { clsx } from "clsx"\nexport const value = clsx("test")\n')
  put(root, "tsconfig.json", JSON.stringify({ compilerOptions: { noEmit: true, strict: true, module: "esnext", moduleResolution: "bundler", skipLibCheck: true, types: [] }, include: ["item.ts"] }))
  const result = spawnSync(process.execPath, [path.join(here, "node_modules/typescript/bin/tsc"), "--noEmit", "-p", root], { cwd: root, encoding: "utf8", timeout: 15000 })
  assert.equal(result.status, 2)
  assert.match(result.stdout, /TS2307: Cannot find module 'clsx'/)
}))

test("template copies keep npm bin links inside the consumer and do not carry another item's files", () => temporary((root) => {
  const template = path.join(root, "template")
  const first = path.join(root, "first")
  const second = path.join(root, "second")
  put(template, "node_modules/compiler/bin/tsc", "original")
  mkdirSync(path.join(template, "node_modules/.bin"))
  symlinkSync("../compiler/bin/tsc", path.join(template, "node_modules/.bin/tsc"))
  copyTemplate(template, first)
  assert.equal(realpathSync(path.join(first, "node_modules/.bin/tsc")), realpathSync(path.join(first, "node_modules/compiler/bin/tsc")))
  put(first, "components/ui/unrelated.tsx")
  put(first, "node_modules/compiler/bin/tsc", "changed")
  copyTemplate(template, second)
  assert.equal(readFileSync(path.join(second, "node_modules/compiler/bin/tsc"), "utf8"), "original")
  assert.ok(!existsSync(path.join(second, "components/ui/unrelated.tsx")))
}))
