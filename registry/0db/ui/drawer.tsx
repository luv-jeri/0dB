"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { Dialog, DialogActions, DialogClose, DialogSurface, DialogTrigger, useDialog } from "@/registry/0db/ui/dialog"
import { Fraction } from "@/registry/0db/ui/fraction"

/** A sheet from below. Same props and behaviour as Dialog. */
const Drawer = Dialog
const DrawerTrigger = DialogTrigger
const DrawerClose = DialogClose

/** How far the arc is pulled before a let-go puts the drawer away. Solid's is its own silence, measured. */
const AWAY = 90
const KNOBS = ["--pull", "--solid", "--sink"]

type Thirds = { third: number; setThird: (n: number) => void }

/** The fermata's arc. Drag it down to put the drawer away; a tap or Enter does the same. */
function DrawerHandle({ label, thirds }: { label: string; thirds?: Thirds }) {
  const { open, setOpen } = useDialog()
  const button = React.useRef<HTMLButtonElement>(null)
  const from = React.useRef<number | null>(null)
  const pulled = React.useRef(0)
  const give = React.useRef(AWAY)
  // A drawer put away by a drag keeps its pull until it's opened again.
  React.useEffect(() => {
    const d = button.current?.closest("dialog")
    if (open) KNOBS.forEach((p) => d?.style.removeProperty(p))
  }, [open])
  const surface = (e: React.SyntheticEvent) => e.currentTarget.closest("dialog") as HTMLDialogElement
  const step = (n: number) => thirds?.setThird(Math.min(3, Math.max(1, n)))

  const letGo = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (from.current === null) return
    from.current = null
    const d = surface(e)
    const moved = Math.abs(pulled.current) >= 4
    if (thirds && e.type === "pointerup") {
      // Land on the nearest third; lower than half a third, it goes away. A tap raises it a third, round to one.
      const third = parseFloat(getComputedStyle(d).maxHeight) / 3
      const at = d.getBoundingClientRect().height / third
      d.removeAttribute("data-pulling")
      d.style.removeProperty("--pull")
      if (!moved) return step((thirds.third % 3) + 1)
      if (at < 0.5) return setOpen(false)
      return step(Math.round(at))
    }
    d.removeAttribute("data-pulling")
    if (e.type === "pointerup" && (pulled.current >= give.current || !moved)) setOpen(false)
    else KNOBS.forEach((p) => d.style.setProperty(p, p === "--solid" ? "0" : "0px"))
  }

  return (
    <button
      ref={button}
      type="button"
      data-slot="drawer-handle"
      aria-label={label}
      className="db-drawer-handle"
      {...(thirds && {
        role: "slider",
        "aria-orientation": "vertical" as const,
        "aria-valuemin": 1,
        "aria-valuemax": 3,
        "aria-valuenow": thirds.third,
        "aria-valuetext": `${thirds.third} of 3`,
      })}
      onPointerDown={(e) => {
        from.current = e.clientY
        pulled.current = 0
        e.currentTarget.setPointerCapture(e.pointerId)
        const d = surface(e)
        d.setAttribute("data-pulling", "")
        give.current = AWAY
        if (d.dataset.variant === "solid") {
          // Its give is the silence it holds: the height it loses once set solid. Measured unseen, in one frame.
          const at = d.getBoundingClientRect().height
          d.style.setProperty("--solid", "1")
          give.current = Math.max(24, at - d.getBoundingClientRect().height)
          d.style.setProperty("--solid", "0")
        }
      }}
      onPointerMove={(e) => {
        if (from.current === null) return
        const d = surface(e)
        // Thirds follows the hand both ways; the others only down.
        pulled.current = thirds ? e.clientY - from.current : Math.max(0, e.clientY - from.current)
        d.style.setProperty("--pull", `${pulled.current}px`)
        d.style.setProperty("--solid", String(Math.min(1, pulled.current / give.current)))
        d.style.setProperty("--sink", `${Math.max(0, pulled.current - give.current)}px`)
      }}
      onPointerUp={letGo}
      onPointerCancel={letGo}
      onKeyDown={(e) => {
        if (!thirds) return
        const to = { ArrowUp: thirds.third + 1, ArrowRight: thirds.third + 1, ArrowDown: thirds.third - 1, ArrowLeft: thirds.third - 1, Home: 1, End: 3 }[e.key]
        if (to === undefined) return
        e.preventDefault()
        step(to)
      }}
      onClick={(e) => {
        if (e.detail !== 0) return
        // The keyboard: Enter puts it away; in thirds it raises it a third, round to one.
        if (thirds) step((thirds.third % 3) + 1)
        else setOpen(false)
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
  /** The accessible name of the arc that puts the drawer away (in thirds, that sets its height). */
  handleLabel?: string
  /**
   * arc: it rises and you drag the arc down to put it away. thirds: it stops at a third, two thirds or the
   * whole height, and the share stands in the corner as a fraction. solid: pulling the arc first takes out
   * the silence between its parts, as a compositor sets type solid; only then does it go.
   */
  variant?: "arc" | "thirds" | "solid"
}

function DrawerContent({ className, children, handleLabel, variant = "arc", style, ...props }: DrawerContentProps) {
  const { open } = useDialog()
  const [third, setThird] = React.useState(1)
  // Every opening starts at a third: reset while rendering the change, not in an effect after it.
  const [was, setWas] = React.useState(open)
  if (open !== was) {
    setWas(open)
    if (open) setThird(1)
  }
  const thirds = variant === "thirds" ? { third, setThird } : undefined
  return (
    <DialogSurface
      data-slot="drawer-content"
      data-variant={variant === "arc" ? undefined : variant}
      className={cn("db-drawer", className)}
      style={thirds ? ({ "--third": third, ...style } as React.CSSProperties) : style}
      {...props}
    >
      <DrawerHandle label={handleLabel ?? (thirds ? "Height of the drawer" : "Put this away")} thirds={thirds} />
      {thirds && (
        <span className="db-drawer-share" aria-hidden="true">
          <Fraction count={third} total={3} />
        </span>
      )}
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

export { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription, DrawerActions, DrawerActions as DrawerFooter, DrawerClose, type DrawerContentProps }
