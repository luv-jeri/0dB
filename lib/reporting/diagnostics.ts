import { LIMITS, redact, safeRoute, type DiagnosticEvent, type Diagnostics } from "./contracts"

/** Same shape check as the analytics payload, so a malformed release identifier never reaches a report body. */
export const releaseIdentifier = (sha?: string): string => /^[a-f0-9]{40}$/.test(sha ?? "") ? sha! : "development"

const buffers: Required<Pick<Diagnostics, "console" | "network" | "actions">> = { console: [], network: [], actions: [] }
const excluded = () => typeof location === "undefined" || location.pathname.includes("feedback-admin")
export function structuralPath(element: Element): string {
  const parts: string[] = []
  for (let node: Element | null = element; node && parts.length < 14; node = node.parentElement) {
    const tag = node.tagName.toLowerCase()
    if (!/^[a-z][a-z0-9]*$/.test(tag)) continue
    const siblings = node.parentElement ? Array.from(node.parentElement.children).filter(child => child.tagName === node!.tagName) : [node]
    parts.unshift(`${tag}:nth-of-type(${siblings.indexOf(node) + 1})`)
  }
  return parts.join(" > ").slice(-600)
}
function push(group: keyof typeof buffers, kind: string, message: string) {
  if (excluded()) { clearDiagnostics(); return; }
  const event: DiagnosticEvent = { at: new Date().toISOString(), kind, message: redact(message) }
  buffers[group].push(event)
  if (buffers[group].length > LIMITS.events) buffers[group].shift()
}
export function clearDiagnostics() { for (const group of Object.values(buffers)) group.length = 0; }
function logText(args: unknown[]): string {
  return args.map(value => typeof value === "string" ? value : value instanceof Error ? `${value.name}: ${value.message}` : typeof value === "number" || typeof value === "boolean" ? String(value) : "[object omitted]").join(" ").slice(0, 1000)
}
/** Starts a bounded in-memory buffer. Never reads input values, storage, bodies or headers. */
export function startDiagnostics(): () => void {
  if (excluded()) return () => {}
  const originals = { warn: console.warn, error: console.error, fetch: window.fetch }
  const warn: typeof console.warn = (...args) => { push("console", "warning", logText(args)); originals.warn.apply(console, args); }
  const error: typeof console.error = (...args) => { push("console", "error", logText(args)); originals.error.apply(console, args); }
  console.warn = warn; console.error = error
  const fetchWrapper: typeof window.fetch = async (...args) => {
    const raw = args[0] instanceof Request ? args[0].url : String(args[0])
    const route = safeRoute(raw)
    const ignore = raw.includes("/v1/") || raw.includes("feedback-admin")
    try {
      const result = await originals.fetch.apply(window, args)
      if (!result.ok && !ignore) push("network", "http", `${result.status} ${route}`)
      return result
    } catch (failure) { if (!ignore) push("network", "failed", route); throw failure; }
  }
  window.fetch = fetchWrapper
  const xhrOpen = XMLHttpRequest.prototype.open, xhrSend = XMLHttpRequest.prototype.send
  const xhrRoutes = new WeakMap<XMLHttpRequest, string | null>()
  const openWrapper: typeof xhrOpen = function (this: XMLHttpRequest, method: string, url: string | URL, async: boolean = true, username?: string | null, password?: string | null) {
    const raw = String(url); xhrRoutes.set(this, raw.includes("/v1/") || raw.includes("feedback-admin") ? null : safeRoute(raw))
    return xhrOpen.call(this, method, url, async, username, password)
  }
  const sendWrapper: typeof xhrSend = function (this: XMLHttpRequest, body) {
    this.addEventListener("loadend", () => { const route = xhrRoutes.get(this); if (route && (this.status === 0 || this.status >= 400)) push("network", this.status ? "http" : "failed", `${this.status || "failed"} ${route}`); }, { once: true })
    return xhrSend.call(this, body)
  }
  XMLHttpRequest.prototype.open = openWrapper; XMLHttpRequest.prototype.send = sendWrapper
  const onError = (event: ErrorEvent) => push("console", "unhandled", event.message)
  const onRejection = (event: PromiseRejectionEvent) => push("console", "rejection", logText([event.reason]))
  const onClick = (event: MouseEvent) => {
    if (document.documentElement.dataset.reportingPicking || !(event.target instanceof Element) || event.target.closest("[data-reporting-chrome],[data-private],input,textarea,select,[contenteditable]")) return
    push("actions", "click", `${safeRoute(location.href)} ${structuralPath(event.target)} theme=${document.documentElement.dataset.mode === "nocturne" ? "nocturne" : "day"}`)
  }
  window.addEventListener("error", onError); window.addEventListener("unhandledrejection", onRejection); document.addEventListener("click", onClick, true)
  return () => {
    if (console.warn === warn) console.warn = originals.warn
    if (console.error === error) console.error = originals.error
    if (window.fetch === fetchWrapper) window.fetch = originals.fetch
    if (XMLHttpRequest.prototype.open === openWrapper) XMLHttpRequest.prototype.open = xhrOpen
    if (XMLHttpRequest.prototype.send === sendWrapper) XMLHttpRequest.prototype.send = xhrSend
    window.removeEventListener("error", onError); window.removeEventListener("unhandledrejection", onRejection); document.removeEventListener("click", onClick, true)
    clearDiagnostics()
  }
}
export function snapshotDiagnostics(): Diagnostics {
  if (excluded()) return {}
  return {
    environment: {
      appVersion: releaseIdentifier(process.env.NEXT_PUBLIC_RELEASE_SHA), userAgent: redact(navigator.userAgent), platform: navigator.platform,
      language: navigator.language, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, viewport: `${innerWidth}×${innerHeight}`,
      screen: `${screen.width}×${screen.height}`, pixelRatio: devicePixelRatio, online: navigator.onLine,
      theme: document.documentElement.dataset.mode === "nocturne" ? "nocturne" : "day", reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      touchPoints: navigator.maxTouchPoints, page: safeRoute(location.href), capturedAt: new Date().toISOString(),
    },
    console: [...buffers.console], network: [...buffers.network], actions: [...buffers.actions],
  }
}
