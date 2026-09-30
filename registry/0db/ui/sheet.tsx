"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { Dialog, DialogActions, DialogClose, DialogSurface, DialogTrigger, useDialog } from "@/registry/0db/ui/dialog"

/** A page slid in from the edge. Same props and behaviour as Dialog: the native <dialog> keeps focus, Escape and the top layer. */
const Sheet = Dialog
const SheetTrigger = DialogTrigger
const SheetClose = DialogClose

type SheetContentProps = React.ComponentProps<"dialog"> & {
  /** Which edge it slides from. Logical, so start is the right edge in right-to-left. */
  side?: "start" | "end" | "top" | "bottom"
}

function SheetContent({ className, side = "end", ...props }: SheetContentProps) {
  return <DialogSurface data-slot="sheet-content" data-side={side} className={cn("db-sheet", className)} {...props} />
}

/** The sheet's name, running up its spine like a book's. Decorative: the visible title is SheetTitle. */
function SheetSpine({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="sheet-spine" aria-hidden="true" className={cn("db-sheet-spine", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.ComponentProps<"h2">) {
  const { titleId } = useDialog()
  return <h2 data-slot="sheet-title" id={titleId} className={cn("db-sheet-title", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { descriptionId } = useDialog()
  return <p data-slot="sheet-description" id={descriptionId} className={cn("db-sheet-body", className)} {...props} />
}

function SheetActions(props: React.ComponentProps<"div">) {
  return <DialogActions data-slot="sheet-actions" {...props} />
}

export { Sheet, SheetTrigger, SheetContent, SheetSpine, SheetTitle, SheetDescription, SheetActions, SheetActions as SheetFooter, SheetClose }
