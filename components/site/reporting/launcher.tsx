"use client"

import { siteRoute } from "@/lib/site/config.mjs"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReportingPanelProps } from "./panel"

/** Only this link/listener ships initially. Forms, entries, sheet and capture load on demand. */
export function FeedbackLink() {
  const path = usePathname()
  const [Panel, setPanel] = React.useState<React.ComponentType<ReportingPanelProps> | null>(null)
  const [href, setHref] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const opener = React.useRef<HTMLElement | null>(null)
  const [openedPath, setOpenedPath] = React.useState(path)
  if (openedPath !== path) { setOpenedPath(path); setHref(null) }

  React.useEffect(() => {
    let active = true
    let pending = false
    const open = async (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || path.replace(/\/$/, "") === "/feedback" || path.includes("feedback-admin")) return
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
      if (!link || link.target || link.hasAttribute("download")) return
      const url = new URL(link.href)
      if (url.origin !== location.origin || siteRoute(url.pathname).replace(/\/$/, "") !== "/feedback") return
      event.preventDefault()
      event.stopPropagation()
      if (pending) return
      pending = true
      opener.current = link
      setLoading(true)
      try {
        const loaded = await import("./panel")
        if (active) { setPanel(() => loaded.ReportingPanel); setHref(url.pathname + url.search) }
      } catch {
        // The link remains the fallback if an on-demand chunk cannot load.
        if (active) location.assign(url.href)
      } finally { pending = false; if (active) setLoading(false) }
    }
    document.addEventListener("click", open, true)
    return () => { active = false; document.removeEventListener("click", open, true) }
  }, [path])

  return <>
    <Link className="db-link db-report-entry" href="/feedback/" prefetch={false} aria-haspopup="dialog" aria-busy={loading || undefined}>Feedback</Link>
    {loading ? <span className="db-sr" role="status">Opening feedback…</span> : null}
    {Panel && href ? <Panel key={path + href} href={href} onClose={() => {
      setHref(null)
      requestAnimationFrame(() => opener.current?.isConnected && opener.current.focus({ preventScroll: true }))
    }} /> : null}
  </>
}
