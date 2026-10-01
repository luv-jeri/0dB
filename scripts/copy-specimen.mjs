// Serves the original specimen, untouched, at /specimen/.
import { cpSync, rmSync } from "node:fs"
rmSync("public/specimen", { recursive: true, force: true })
cpSync("specimen", "public/specimen", { recursive: true })
