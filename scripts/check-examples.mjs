// every example compiles with consumer aliases: lays out public/r payloads the way
// `shadcn add` would (components/ui, lib, lib/0db), rewrites each example's imports
// the same way, and type-checks the lot with tsc.
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, cpSync } from "node:fs"
import { execFileSync } from "node:child_process"
import path from "node:path"
import { rewriteImports } from "./lib/items.mjs"

const dir = ".tmp/examples-check"
rmSync(dir, { recursive: true, force: true })
const put = (file, text) => { mkdirSync(path.dirname(path.join(dir, file)), { recursive: true }); writeFileSync(path.join(dir, file), text) }

for (const payload of readdirSync("public/r").filter((f) => f.endsWith(".json") && f !== "registry.json")) {
  for (const f of JSON.parse(readFileSync(`public/r/${payload}`, "utf8")).files ?? []) {
    if (!/\.tsx?$/.test(f.path)) continue
    put(f.target || (f.type === "registry:ui" ? `components/ui/${path.basename(f.path)}` : f.path), f.content)
  }
}
for (const f of readdirSync("examples").filter((f) => f.endsWith(".tsx")))
  put(`examples/${f}`, rewriteImports(readFileSync(`examples/${f}`, "utf8")))
cpSync("components/site/state.tsx", path.join(dir, "components/site/state.tsx")) // the docs-only <State> wrapper, all examples import from the site

put("tsconfig.json", JSON.stringify({
  compilerOptions: {
    target: "ES2022", lib: ["dom", "dom.iterable", "esnext"], strict: true, noEmit: true, skipLibCheck: true,
    module: "esnext", moduleResolution: "bundler", jsx: "react-jsx", isolatedModules: true, esModuleInterop: true,
    types: [], paths: { "@/*": ["./*"] },
  },
  include: ["**/*.ts", "**/*.tsx"],
}, null, 2))

try {
  execFileSync(process.execPath, ["node_modules/typescript/bin/tsc", "-p", dir], { stdio: "inherit" })
} catch {
  console.error("An example does not compile once installed. Fix the item or the example.")
  process.exit(1)
}
rmSync(dir, { recursive: true, force: true })
console.log("Every example compiles with consumer aliases.")
