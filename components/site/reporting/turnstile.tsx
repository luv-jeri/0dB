"use client"

import * as React from "react"
import { Button } from "@/registry/0nlytype/ui/button"

type TurnstileAPI = { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void }
declare global { interface Window { turnstile?: TurnstileAPI } }
let scriptPromise: Promise<void> | null = null

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve()
  if (!scriptPromise) scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    script.async = true
    const fail = () => {
      clearTimeout(timer)
      script.remove()
      scriptPromise = null
      reject(new Error("Verification could not load. Check your connection and try again."))
    }
    const timer = setTimeout(fail, 15000)
    script.onload = () => { clearTimeout(timer); if (window.turnstile) resolve(); else fail() }
    script.onerror = fail
    document.head.appendChild(script)
  })
  return scriptPromise
}

export function Turnstile({ siteKey, attempt, onToken }: { siteKey: string; attempt: number; onToken: (token: string) => void }) {
  const container = React.useRef<HTMLDivElement>(null)
  const callback = React.useRef(onToken)
  const [error, setError] = React.useState("")
  const [retry, setRetry] = React.useState(0)
  React.useEffect(() => { callback.current = onToken }, [onToken])
  React.useEffect(() => {
    let active = true
    let id: string | undefined
    callback.current("")
    loadTurnstile().then(() => {
      if (!active || !container.current) return
      id = window.turnstile?.render(container.current, {
        sitekey: siteKey, action: "reporting", theme: "auto", size: "flexible",
        callback: (token: string) => { callback.current(token); setError("") },
        "expired-callback": () => callback.current(""),
        "error-callback": () => { callback.current(""); setError("Verification did not finish. Try again below.") },
      })
    }).catch((cause: Error) => { if (active) setError(cause.message) })
    return () => { active = false; if (id) window.turnstile?.remove(id) }
  }, [siteKey, attempt, retry])
  return (
    <div className="ot-report-verification">
      <div ref={container} />
      {error ? <p role="alert">{error}</p> : null}
      <Button variant="quiet" onClick={() => { setError(""); setRetry((n) => n + 1) }}>Retry verification</Button>
    </div>
  )
}
