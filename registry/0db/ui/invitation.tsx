"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type InvitationProps = Omit<React.ComponentProps<"button">, "children"> & {
  label: string
  hint?: string
  state?: string
}

/** The way into a conversation, held in the margin until the conversation itself comes into view. */
function Invitation({ label, hint, state, className, ...props }: InvitationProps) {
  const [away, setAway] = React.useState(false)
  React.useEffect(() => {
    const visible = new Set<Element>()
    const watched = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      setAway(visible.size > 0)
    })
    const scan = () => {
      for (const el of watched) {
        if (el.isConnected && el.hasAttribute("data-invitation-hide")) continue
        observer.unobserve(el)
        watched.delete(el)
        visible.delete(el)
      }
      document.querySelectorAll("[data-invitation-hide]").forEach((el) => {
        if (watched.has(el)) return
        watched.add(el)
        observer.observe(el)
      })
      setAway(visible.size > 0)
    }
    scan()
    const changed = new MutationObserver(scan)
    changed.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-invitation-hide"] })
    return () => { observer.disconnect(); changed.disconnect() }
  }, [])
  return (
    <button type="button" data-slot="invitation" className={cn("db-invitation", className)} {...props} data-away={away || undefined} inert={away} aria-hidden={away || undefined}>
      <span className="db-invitation-call"><span>{label}</span><span className="db-invitation-arrow" aria-hidden="true">→</span></span>
      {state ? <span className="db-invitation-state db-reading">{state}</span> : hint ? <span className="db-invitation-hint">{hint}</span> : null}
    </button>
  )
}

export { Invitation, type InvitationProps }
