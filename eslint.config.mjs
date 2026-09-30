import next from "eslint-config-next/core-web-vitals"
import ts from "eslint-config-next/typescript"

export default [
  { ignores: ["node_modules/", ".next/", "out/", "public/", "specimen/", ".tmp/", "next-env.d.ts"] },
  ...next,
  ...ts,
]
