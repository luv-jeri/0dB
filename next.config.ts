import type { NextConfig } from "next"

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { inlineCss: true },
}

export default config
