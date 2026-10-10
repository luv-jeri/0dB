import { readFileSync } from "node:fs"
import { marked, type Tokens } from "marked"

// DESIGN.md is read at build time; every docs page quotes it rather than restating it.
// ponytail: read per call so the dev server follows edits; a static build reads it a few hundred times, cheaply.
const read = () => readFileSync("DESIGN.md", "utf8")

/** The body of `### <contract> (… name …)`, rendered, without its heading. Null if DESIGN.md has none. */
export function contractFor(contract: string, name: string): string | null {
  const section = read().split(/^(?=### |## )/m).find((s) => {
    const m = s.match(/^### ((?:ot-[a-z-]+, )*ot-[a-z-]+) \(([^)]+)\)/)
    return m && m[1].split(", ").includes(contract) && m[2].split(",").some((n) => n.trim() === name)
  })
  return section ? (marked.parse(section.replace(/^### .*\n/, ""), { async: false }) as string) : null
}

export type TableRow = string[]

function tableAfter(title: string): Tokens.Table | undefined {
  const tokens = marked.lexer(read())
  const at = tokens.findIndex((t) => t.type === "heading" && (t as Tokens.Heading).text === title)
  return tokens.slice(at + 1).find((t) => t.type === "table") as Tokens.Table | undefined
}

/** Rows of a DESIGN.md table whose first cell names the item as `name`, cells rendered inline. */
function rowsFor(title: string, name: string): { header: string[]; rows: TableRow[] } {
  const table = tableAfter(title)
  if (!table) return { header: [], rows: [] }
  const inline = (s: string) => marked.parseInline(s, { async: false }) as string
  return {
    header: table.header.map((c) => c.text),
    rows: table.rows
      .filter((r) => r[0].text.includes(`\`${name}\``))
      .map((r) => [inline(r[0].text.replace(/\s*\(`[^)]*`\)/, "")), ...r.slice(1).map((c) => inline(c.text))]),
  }
}

export const moveRows = (name: string) => rowsFor("Where each move comes from", name)
export const motionRows = (name: string) => rowsFor("Motion", name)

/** A whole `## section` of DESIGN.md, rendered (for the principles and tokens pages). */
export function sectionHTML(title: string): string {
  const section = read().split(/^(?=## )/m).find((s) => s.startsWith(`## ${title}\n`))
  return section ? (marked.parse(section.replace(/^## .*\n/, ""), { async: false }) as string) : ""
}
