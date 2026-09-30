"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type NoteProps = Omit<React.ComponentProps<"button">, "children"> & {
  /** The word or phrase being annotated. For expand, the abbreviation itself, as a string. */
  children: React.ReactNode
  /** The note. Phrasing content only; a sentence or two. For ossia, a few words; for expand, the words the abbreviation stands for, as a string. */
  note: React.ReactNode
  /**
   * leader: a leader line draws out to the note. ossia: the note is always there,
   * set small in the line space above the term. expand: the abbreviation's letters
   * move apart and the words grow between them. revise: pressed, the term is struck
   * through and the note, its replacement, is written in after it.
   */
  variant?: "leader" | "ossia" | "expand" | "revise"
}

type Part = { text: string; keep: boolean }

/**
 * Splits `full` into the letters `term` keeps and the rest, which grows in between.
 * A kept letter is the start of a word or a capital inside one (HyperText); a word
 * that keeps none ("and") grows whole. Null if the term's letters aren't found in order.
 */
function initials(term: string, full: string): Part[][] | null {
  const letters = [...term].filter((c) => /[\p{L}\p{N}]/u.test(c))
  let k = 0
  const words = full.trim().split(/\s+/).map((word) => {
    const parts: Part[] = []
    ;[...word].forEach((c, i) => {
      const keep = k < letters.length && c.toLowerCase() === letters[k].toLowerCase() && (i === 0 || c !== c.toLowerCase())
      const text = keep ? letters[k++] : c
      const last = parts[parts.length - 1]
      if (last && last.keep === keep && !keep) last.text += text
      else parts.push({ text, keep })
    })
    return parts
  })
  return k === letters.length && letters.length > 0 ? words : null
}

/**
 * Marginalia: a dotted term. Point at it or focus it and a leader line draws
 * out to the note. Leaving plays it backwards; Escape puts it away.
 */
function Note({ children, note, variant = "leader", className, onKeyDown, onClick, ...props }: NoteProps) {
  const id = React.useId()
  const [open, setOpen] = React.useState(false)

  if (variant === "ossia") {
    return (
      <span data-slot="note" data-variant="ossia" className={cn("db-note", className)} {...(props as React.ComponentProps<"span">)}>
        {children}
        <span data-slot="note-text" className="db-note-text">
          <span className="db-sr"> (</span>
          {note}
          <span className="db-sr">)</span>
        </span>
      </span>
    )
  }

  if (variant === "revise") {
    // The editor's correction: the pen strikes the term, and the word that replaces it is written in after it.
    // A span, not a button, so a struck phrase can break across lines as the sentence does.
    const toggle = () => setOpen((o) => !o)
    return (
      <span
        role="button"
        tabIndex={0}
        aria-expanded={open}
        data-slot="note"
        data-variant="revise"
        className={cn("db-note", className)}
        {...(props as React.ComponentProps<"span">)}
        onClick={(e) => {
          onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>)
          toggle()
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e as unknown as React.KeyboardEvent<HTMLButtonElement>)
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            toggle()
          }
          if (e.key === "Escape") setOpen(false)
        }}
      >
        <span className="db-sr">{open ? <><del>{children}</del> <ins>{note}</ins></> : children}</span>
        <span className="db-note-was" aria-hidden="true">{children}</span>
        {/* A real space, so that where the correction wraps to the next line the space falls away at the break. */}
        {open || String((props as Record<string, unknown>)["data-force"] ?? "").includes("open") ? " " : null}
        <span className="db-note-now" aria-hidden="true">{note}</span>
      </span>
    )
  }

  const words = variant === "expand" && typeof children === "string" && typeof note === "string" ? initials(children, note) : null
  if (words) {
    // A span, not a button: a button can't break across lines, and the words it grows into must.
    const toggle = () => setOpen((o) => !o)
    return (
      <span
        role="button"
        tabIndex={0}
        dir="auto"
        aria-expanded={open}
        aria-describedby={id}
        data-slot="note"
        data-variant="expand"
        className={cn("db-note", className)}
        {...(props as React.ComponentProps<"span">)}
        onClick={(e) => {
          onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>)
          toggle()
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e as unknown as React.KeyboardEvent<HTMLButtonElement>)
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            toggle()
          }
          if (e.key === "Escape") setOpen(false)
        }}
      >
        <span className="db-sr">{children}</span>
        <span aria-hidden="true">
          {words.map((parts, w) => (
            <React.Fragment key={w}>
              {w > 0 ? <span className="db-note-grow">{" "}</span> : null}
              <span className="db-note-word">
                {parts.map((p, i) => (p.keep ? <span key={i} className="db-note-keep">{p.text}</span> : <span key={i} className="db-note-grow">{p.text}</span>))}
              </span>
            </React.Fragment>
          ))}
        </span>
        <span id={id} hidden>{note}</span>
      </span>
    )
  }

  return (
    <button
      type="button"
      data-slot="note"
      aria-describedby={id}
      className={cn("db-note", className)}
      onClick={onClick}
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
