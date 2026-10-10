import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { execFileSync } from "node:child_process"
import { rewriteImports, deriveDeps } from "../scripts/lib/items.mjs"

test("rewrites registry imports to consumer aliases", () => {
  const src = [
    `import { cn } from "@/registry/0nlytype/lib/utils"`,
    `import { Spinner } from "./spinner"`,
    `import { roll } from "@/registry/0nlytype/lib/roll"`,
    `import * as Popover from "@/registry/0nlytype/ui/popover"`,
    `import * as React from "react"`,
  ].join("\n")
  const out = rewriteImports(src)
  assert.match(out, /from "@\/lib\/utils"/)
  assert.match(out, /from "@\/components\/ui\/spinner"/)
  assert.match(out, /from "@\/lib\/0nlytype\/roll"/)
  assert.match(out, /from "@\/components\/ui\/popover"/)
  assert.match(out, /from "react"/)
  assert.doesNotMatch(out, /registry\/0nlytype/)
})

test("derives npm dependencies from bare imports and siblings from ./ and @/registry imports", () => {
  const src = [
    `"use client"`,
    `import * as React from "react"`,
    `import * as PopoverPrimitive from "@radix-ui/react-popover"`,
    `import { Command } from "cmdk"`,
    `import { cn } from "@/registry/0nlytype/lib/utils"`,
    `import { Button } from "./button"`,
    `import type { CalendarProps } from "@/registry/0nlytype/ui/calendar"`,
    `import Link from "next/link"`,
  ].join("\n")
  const { npm, siblings } = deriveDeps(src)
  assert.deepEqual(npm, ["@radix-ui/react-popover", "cmdk"])
  assert.deepEqual(siblings, ["button", "calendar"])
})

const registry = () => JSON.parse(readFileSync("registry.json", "utf8"))

test("every component item installs its sidecar through a css @import", () => {
  for (const item of registry().items.filter((i) => i.type === "registry:ui")) {
    const sidecar = item.files.find((f) => f.path.endsWith(".css"))
    if (!sidecar) continue
    assert.equal(sidecar.target, `styles/0nlytype/${item.name}.css`, item.name)
    assert.ok(item.css?.[`@import "../styles/0nlytype/${item.name}.css"`], `${item.name} css import`)
    assert.ok(item.registryDependencies[0].endsWith("/r/0nlytype.json"), `${item.name} depends on the base`)
  }
})

test("base item exposes theme variables for Tailwind", () => {
  const base = registry().items.find((i) => i.name === "0nlytype")
  assert.equal(base.type, "registry:base")
  assert.equal(base.cssVars.theme["color-paper"], "var(--db-paper)")
  assert.equal(base.css[":root, :root[data-mode]"]["--background"], "var(--db-paper)")
  assert.ok(base.css[`@import "../styles/0nlytype/base.css"`])
})

test("registry:check detects a stale payload", () => {
  const file = "public/r/0nlytype.json"
  assert.ok(existsSync(file), "build the registry first")
  const original = readFileSync(file, "utf8")
  try {
    writeFileSync(file, original.replace("0nlyType", "0dX"))
    assert.throws(() => execFileSync(process.execPath, ["--import", "tsx", "scripts/build-registry.mjs", "--check"], { stdio: "pipe" }))
  } finally {
    writeFileSync(file, original)
  }
})
