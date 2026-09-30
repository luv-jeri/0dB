"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type NoteProps = Omit<React.ComponentProps<"button">, "children"> & {
  /** The word or phrase being annotated. */
  children: React.ReactNode
  /** The marginal note. Phrasing content only; a sentence or two. */
  note: React.ReactNode
}

/**
 * Marginalia: a dotted term. Point at it or focus it and a leader line draws
 * out to the note. Leaving plays it backwards; Escape puts it away.
 */
function Note({ children, note, className, onKeyDown, ...props }: NoteProps) {
  const id = React.useId()
  return (
    <button
      type="button"
      data-slot="note"
      aria-describedby={id}
      className={cn("db-note", className)}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (e.key === "Escape") e.currentTarget.blur()
      }}
      {...props}
    >
      {children}
      <span data-slot="note-text" id={id} aria-hidden="true" className="db-note-text">
        {note}
      </span>
    </button>
  )
}

export { Note, type NoteProps }
