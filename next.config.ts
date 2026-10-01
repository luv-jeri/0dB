import { SITE_BASE_PATH } from "./lib/site/config.mjs"
import type { NextConfig } from "next"

const config: NextConfig = {
  output: "export",
  basePath: SITE_BASE_PATH,
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { inlineCss: true },
}

export default config
