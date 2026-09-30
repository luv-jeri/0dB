// One-time porting tool: lifts a fence out of specimen/fermata.css, renames
// f- to db-, and writes it as a sidecar in @layer components.
//   node scripts/port-fence.mjs <item> <fence> [<fence>...]
//   node scripts/port-fence.mjs --rename < in > out   (rename only)
// ponytail: delete once every item is ported; the specimen stays the record.
import { readFileSync, writeFileSync } from "node:fs";

export const rename = (s) =>
  s.replace(/--f-/g, "--db-").replace(/(?<![A-Za-z0-9_-])f-(?=[a-z])/g, "db-").replace(/Fermata/g, "0dB");

export function fence(name) {
  const lines = readFileSync("specimen/fermata.css", "utf8").split("\n");
  const start = lines.findIndex((l) => l.startsWith(`/* ── ${name} ──`) || l.startsWith(`/* ── ${name} */`));
  if (start < 0) throw new Error(`no fence ${name}`);
  let end = lines.findIndex((l, i) => i > start && l.startsWith("/* ── "));
  if (end < 0) end = lines.length;
  return lines.slice(start, end).join("\n").trimEnd();
}

if (process.argv[2] === "--rename") {
  process.stdout.write(rename(readFileSync(0, "utf8")));
} else if (process.argv[1].endsWith("port-fence.mjs")) {
  const [item, ...fences] = process.argv.slice(2);
  const body = fences.map((f) => rename(fence(f))).join("\n\n");
  const indented = body.split("\n").map((l) => (l ? "  " + l : l)).join("\n");
  writeFileSync(`registry/0db/styles/${item}.css`, `@layer components {\n${indented}\n}\n`);
  console.log(`registry/0db/styles/${item}.css`, body.split("\n").length, "lines");
}
