"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { cn } from "@/registry/0db/lib/utils"
import { Scrollbar } from "@/registry/0db/ui/scrollbar"

type DialogContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  alert: boolean
  titleId: string
  descriptionId: string
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function useDialog() {
  const ctx = React.useContext(DialogContext)
  if (!ctx) throw new Error("Dialog parts must sit inside <Dialog>.")
  return ctx
}

type DialogProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** A question that needs an answer: role alertdialog, and pointing outside doesn't close it. */
  alert?: boolean
  children: React.ReactNode
}

/** The question, set large. Built on the native <dialog>, so focus, Escape and the top layer are the browser's. */
function Dialog({ open: controlled, defaultOpen = false, onOpenChange, alert = false, children }: DialogProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen)
  const open = controlled ?? uncontrolled
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (controlled === undefined) setUncontrolled(next)
      onOpenChange?.(next)
    },
    [controlled, onOpenChange],
  )
  const id = React.useId()
  const value = React.useMemo(
    () => ({ open, setOpen, alert, titleId: `${id}-title`, descriptionId: `${id}-description` }),
    [open, setOpen, alert, id],
  )
  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
}

function DialogTrigger({ asChild = false, onClick, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { open, setOpen } = useDialog()
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="dialog-trigger"
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)
        if (!e.defaultPrevented) setOpen(true)
      }}
      {...(asChild ? {} : { type: "button" as const })}
      {...props}
    />
  )
}

/**
 * The bare <dialog>, opened as a modal while the Dialog is open. The sheet and
 * the drawer are surfaces too; they bring their own class.
 * Focus goes to the element marked data-autofocus, or the browser's first choice.
 * Taller than the window, it scrolls, on the scrollbar's rail.
 */
function DialogSurface({ className, children, onClick, ref: forwardedRef, ...props }: React.ComponentProps<"dialog">) {
  const { open, setOpen, alert, titleId, descriptionId } = useDialog()
  const ref = React.useRef<HTMLDialogElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)

  React.useEffect(() => {
    const d = ref.current
    if (!d) return
    d.setAttribute("closedby", alert ? "closerequest" : "any")
    if (open && !d.open) {
      d.showModal()
      d.querySelector<HTMLElement>("[data-autofocus]")?.focus()
    } else if (!open && d.open) d.close()
  }, [open, alert])

  React.useEffect(() => {
    const d = ref.current
    if (!d) return
    const closed = () => setOpen(false)
    d.addEventListener("close", closed)
    return () => d.removeEventListener("close", closed)
  }, [setOpen])

  return (
    <dialog
      ref={composedRef}
      role={alert ? "alertdialog" : undefined}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={className}
      onClick={(e) => {
        onClick?.(e)
        // Pointing outside puts it away (where the browser lacks closedby="any").
        const d = ref.current
        if (alert || !d || e.target !== d) return
        const r = d.getBoundingClientRect()
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close()
      }}
      {...props}
    >
      {children}
      <Scrollbar />
    </dialog>
  )
}

type DialogContentProps = React.ComponentProps<"dialog"> & {
  /**
   * frame: corner marks and a row of facts over the question. reply: the question heavy and narrow, the answers
   * set large in the italic, because the answer is yours; use bare DialogClose buttons for them. ruled: a poster's
   * grid of hairlines, the question large on ruled lines, the detail on the far side, the answers in the cells below.
   */
  variant?: "frame" | "reply" | "ruled"
}

function DialogContent({ className, variant = "frame", ...props }: DialogContentProps) {
  return (
    <DialogSurface
      data-slot="dialog-content"
      data-variant={variant === "frame" ? undefined : variant}
      className={cn("db-dialog", className)}
      {...props}
    />
  )
}

/** A frame row over the question: what this is, a hairline, and one fact. */
function DialogMeta({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-meta" className={cn("db-meta db-dialog-meta", className)} {...props} />
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  const { titleId } = useDialog()
  return <h2 data-slot="dialog-title" id={titleId} className={cn("db-dialog-title", className)} {...props} />
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { descriptionId } = useDialog()
  return <p data-slot="dialog-description" id={descriptionId} className={cn("db-dialog-body", className)} {...props} />
}

function DialogActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-actions" className={cn("db-dialog-actions", className)} {...props} />
}

function DialogClose({ asChild = false, onClick, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { setOpen } = useDialog()
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="dialog-close"
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)
        if (!e.defaultPrevented) setOpen(false)
      }}
      {...(asChild ? {} : { type: "button" as const })}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogContent,
  DialogMeta,
  DialogTitle,
  DialogDescription,
  DialogActions,
  DialogActions as DialogFooter,
  DialogClose,
  useDialog,
  type DialogContentProps,
}
