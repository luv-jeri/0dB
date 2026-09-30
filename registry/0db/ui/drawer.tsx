"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { Dialog, DialogActions, DialogClose, DialogSurface, DialogTrigger, useDialog } from "@/registry/0db/ui/dialog"

/** A sheet from below. Same props and behaviour as Dialog. */
const Drawer = Dialog
const DrawerTrigger = DialogTrigger
const DrawerClose = DialogClose

/** The fermata's arc. Drag it down to put the drawer away; a tap or Enter does the same. */
function DrawerHandle({ label }: { label: string }) {
  const { open, setOpen } = useDialog()
  const button = React.useRef<HTMLButtonElement>(null)
  const from = React.useRef<number | null>(null)
  const pulled = React.useRef(0)
  // A drawer put away by a drag keeps its pull until it's opened again.
  React.useEffect(() => {
    if (open) button.current?.closest("dialog")?.style.removeProperty("--pull")
  }, [open])
  const surface = (e: React.SyntheticEvent) => e.currentTarget.closest("dialog") as HTMLDialogElement

  const letGo = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (from.current === null) return
    from.current = null
    const d = surface(e)
    d.removeAttribute("data-pulling")
    if (e.type === "pointerup" && (pulled.current > 90 || pulled.current < 4)) setOpen(false)
    else d.style.setProperty("--pull", "0px")
  }

  return (
    <button
      ref={button}
      type="button"
      data-slot="drawer-handle"
      aria-label={label}
      className="db-drawer-handle"
      onPointerDown={(e) => {
        from.current = e.clientY
        pulled.current = 0
        e.currentTarget.setPointerCapture(e.pointerId)
        surface(e).setAttribute("data-pulling", "")
      }}
      onPointerMove={(e) => {
        if (from.current === null) return
        pulled.current = Math.max(0, e.clientY - from.current)
        surface(e).style.setProperty("--pull", `${pulled.current}px`)
      }}
      onPointerUp={letGo}
      onPointerCancel={letGo}
      onClick={(e) => {
        if (e.detail === 0) setOpen(false) // the keyboard
      }}
    >
      <svg viewBox="0 0 40 22" aria-hidden="true">
        <path d="M3 20 A17 17 0 0 1 37 20" />
        <circle cx="20" cy="17" r="2.6" />
      </svg>
    </button>
  )
}

type DrawerContentProps = React.ComponentProps<"dialog"> & {
  /** The accessible name of the arc that puts the drawer away. */
  handleLabel?: string
}

function DrawerContent({ className, children, handleLabel = "Put this away", ...props }: DrawerContentProps) {
  return (
    <DialogSurface data-slot="drawer-content" className={cn("db-drawer", className)} {...props}>
      <DrawerHandle label={handleLabel} />
      <div data-slot="drawer-body" className="db-drawer-body">
        {children}
      </div>
    </DialogSurface>
  )
}

function DrawerTitle({ className, ...props }: React.ComponentProps<"h2">) {
  const { titleId } = useDialog()
  return <h2 data-slot="drawer-title" id={titleId} className={cn("db-drawer-title", className)} {...props} />
}

function DrawerDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { descriptionId } = useDialog()
  return <p data-slot="drawer-description" id={descriptionId} className={className} {...props} />
}

function DrawerActions(props: React.ComponentProps<"div">) {
  return <DialogActions data-slot="drawer-actions" {...props} />
}

export { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription, DrawerActions, DrawerActions as DrawerFooter, DrawerClose }
