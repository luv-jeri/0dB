import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { deriveDeps } from "../scripts/lib/items.mjs"

test("dependency scan ignores import-like line, block and documentation comments", () => {
  const source = `
    // import "line-package"; from "./line-sibling"
    /* import("block-package"); export * from "./block-sibling" */
    /** "image files" from "image/*". */
    import { real } from "real-package"
  `
  assert.deepEqual(deriveDeps(source), { npm: ["real-package"], siblings: [] })
})

test("dependency scan ignores strings, template text, regexes and JSX prose", () => {
  const source = `
    const text = 'import "string-package"; from "./string-sibling"'
    const template = \`import("template-package"); from "./template-sibling"\`
    const pattern = /from "regex-package"/
    const view = <p title='import "attribute-package"'>
      import "jsx-package"; from "./jsx-sibling"; import("jsx-dynamic")
      {"from 'expression-package'"}
      {/* import "jsx-comment" */}
    </p>
  `
  assert.deepEqual(deriveDeps(source), { npm: [], siblings: [] })
})

test("dependency scan preserves real imports, package roots and sibling filtering", () => {
  const source = `
    import "side-effects/setup"
    import value from "package/subpath"
    import { another } from "package/other"
    import * as scoped from "@scope/package/subpath"
    import { Button } from "./button"
    import { Button as Again } from "@/registry/0db/ui/button"
    import { Field } from "@/registry/0db/ui/field"
    import React from "react"
    import "react-dom/client"
    import "next/navigation"
    import "@/registry/0db/lib/utils"
    import "../helper"
  `
  assert.deepEqual(deriveDeps(source), {
    npm: ["@scope/package", "package", "side-effects"],
    siblings: ["button", "field"],
  })
})

test("dependency scan includes type-only import declarations", () => {
  const source = `
    import type { Options } from "@scope/types/options"
    import { type Value } from "types-package"
    import type { ButtonProps } from "./button"
  `
  assert.deepEqual(deriveDeps(source), {
    npm: ["@scope/types", "types-package"], siblings: ["button"],
  })
})

test("dependency scan includes named, star, namespace and type-only re-exports", () => {
  const source = `
    export { value } from "named-package/subpath"
    export * from "star-package"
    export * as namespace from "@scope/namespace/subpath"
    export type { Options } from "type-package"
    export { Button } from "./button"
    export * from "@/registry/0db/ui/field"
    export { local }
  `
  assert.deepEqual(deriveDeps(source), {
    npm: ["@scope/namespace", "named-package", "star-package", "type-package"],
    siblings: ["button", "field"],
  })
})

test("dependency scan finds literal dynamic calls within expressions, with comments and options", () => {
  const source = `
    async function load() {
      await import /* loader */ ( /* module */ "dynamic-package/subpath")
      return import('@scope/dynamic/subpath', { with: { type: "json" } })
    }
    const template = \`loaded: \${import("template-expression")}\`
    const view = <p>{import("./button")}</p>
    const literal = import(\`template-module\`)
    const computed = import("computed-package/" + name)
    const interpolated = import(\`interpolated-package/\${name}\`)
    const variable = import(moduleName)
    const method = loader.import("method-package")
    type Options = import("type-expression").Options
  `
  assert.deepEqual(deriveDeps(source), {
    npm: ["@scope/dynamic", "dynamic-package", "template-expression", "template-module"],
    siblings: ["button"],
  })
})

test("Dropzone's actual source does not depend on the image package", () => {
  const source = readFileSync(new URL("../registry/0db/ui/dropzone.tsx", import.meta.url), "utf8")
  assert.deepEqual(deriveDeps(source), { npm: [], siblings: ["attachment"] })
})
