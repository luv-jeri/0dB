"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { cn } from "@/registry/0db/lib/utils"
import { Dialog, DialogSurface, DialogTrigger, useDialog } from "@/registry/0db/ui/dialog"

const subscribe = () => () => {}
const onClient = () => true
const onServer = () => false

function Curtain(props: React.ComponentProps<typeof Dialog>) { return <Dialog {...props} /> }
const CurtainTrigger = DialogTrigger

type CurtainContentProps = React.ComponentProps<"dialog"> & { label?: string }

/** The page becomes the distant plane; the destinations come to the reading plane. */
function CurtainContent({ label = "Menu", className, children, ref: forwardedRef, ...props }: CurtainContentProps) {
  const { open, setOpen, titleId } = useDialog()
  const client = React.useSyncExternalStore(subscribe, onClient, onServer)
  const root = React.useRef<HTMLDialogElement>(null)
  const ref = useComposedRefs(root, forwardedRef)

  React.useEffect(() => {
    if (!client) return
    const dialog = root.current
    if (!dialog) return
    const marked = [...document.querySelectorAll<HTMLElement>("[data-curtain-page]")]
    const pages = (marked.length ? marked : [...document.body.children]).filter((el): el is HTMLElement => el instanceof HTMLElement && el !== dialog && !el.contains(dialog) && !el.matches("dialog, script, style, link"))
    const owned = pages.filter((el) => !el.hasAttribute("data-curtain-plane"))
    owned.forEach((el) => el.setAttribute("data-curtain-plane", ""))
    return () => owned.forEach((el) => { el.removeAttribute("data-curtain-plane"); el.removeAttribute("data-curtain-far") })
  }, [client])

  React.useEffect(() => {
    if (!client || !open) return
    const pages = [...document.querySelectorAll<HTMLElement>("[data-curtain-plane]")]
    const overflow = document.documentElement.style.overflow
    const bodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    pages.forEach((el) => el.setAttribute("data-curtain-far", ""))
    root.current?.querySelectorAll<HTMLElement>(".db-curtain-link").forEach((el, index) => el.style.setProperty("--db-curtain-order", String(index)))
    return () => {
      pages.forEach((el) => el.removeAttribute("data-curtain-far"))
      document.documentElement.style.overflow = overflow
      document.body.style.overflow = bodyOverflow
    }
  }, [open, client])

  if (!client) return null
  return createPortal(
    <DialogSurface ref={ref} data-slot="curtain" className={cn("db-curtain", className)} aria-describedby={undefined} {...props}>
      <div className="db-curtain-head">
        <h2 id={titleId} className="db-curtain-caption">{label}</h2>
        <button type="button" className="db-curtain-close" onClick={() => setOpen(false)} data-autofocus>Close</button>
      </div>
      <nav className="db-curtain-links" aria-label={label}>{children}</nav>
    </DialogSurface>, document.body,
  )
}

type CurtainLinkProps = React.ComponentProps<"a"> & { number?: string; description?: string }

function CurtainLink({ number, description, className, children, onClick, ...props }: CurtainLinkProps) {
  const { setOpen } = useDialog()
  return (
    <a data-slot="curtain-link" className={cn("db-curtain-link", className)} {...props} onClick={(event) => {
      onClick?.(event)
      if (!event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) setOpen(false)
    }}>
      {number && <span className="db-curtain-number">{number}</span>}
      <span className="db-curtain-name">{children}</span>
      {description && <span className="db-curtain-description db-reading">{description}</span>}
    </a>
  )
}

export { Curtain, CurtainTrigger, CurtainContent, CurtainLink, type CurtainContentProps, type CurtainLinkProps }
