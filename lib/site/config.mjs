// Owner default. Derive both deployment paths and public URLs from this value.
export const SITE_URL = "https://thedirectors.agency/ui"
export const SITE_ORIGIN = new URL(SITE_URL).origin
export const SITE_BASE_PATH = new URL(SITE_URL).pathname.replace(/\/$/, "")
export const sitePath = (pathname = "/") => `${SITE_BASE_PATH}${pathname}`
export const siteURL = (pathname = "/") => `${SITE_URL}${pathname}`
export const registryURL = (name) => siteURL(`/r/${name}.json`)
export const registryBaseURL = () => (process.env.DB_REGISTRY_URL ?? SITE_URL).replace(/\/$/, "")

/** Next's router strips the base path; raw browser pathname comparisons do not. */
export const siteRoute = (pathname) => pathname === SITE_BASE_PATH ? "/"
  : pathname.startsWith(`${SITE_BASE_PATH}/`) ? pathname.slice(SITE_BASE_PATH.length) : pathname
