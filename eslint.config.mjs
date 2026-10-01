import next from "eslint-config-next/core-web-vitals"
import ts from "eslint-config-next/typescript"

const config = [
  { ignores: ["node_modules/", ".next/", "out/", "dist/", ".wrangler/", "public/", "specimen/", ".tmp/", "next-env.d.ts"] },
  ...next,
  ...ts,
]

export default config
