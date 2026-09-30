import { readFileSync } from "node:fs"
import { rewriteImports } from "@/scripts/lib/items.mjs"

/** The example as a consumer would write it: imports as installed, without the docs-only States. */
export function exampleSource(name: string): string {
  const source = readFileSync(`examples/${name}.tsx`, "utf8")
  return rewriteImports(source.split(/\n(?=export function States)/)[0])
    .replace(/^import \{ State \} from .*\n/m, "")
    .trimEnd() + "\n"
}

/** The one-line install command for an item. */
export const installCommand = (name: string) => `npx shadcn@latest add https://0db.cojeev.com/r/${name}.json`
