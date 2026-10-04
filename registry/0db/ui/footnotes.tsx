import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type FootnotesProps = React.ComponentProps<"section"> & { label?: React.ReactNode }

/** A reference goes to its numbered note; the note can take you back to the exact reading place. */
function Footnotes({ label = "Notes", className, children, "aria-labelledby": labelledBy, ...props }: FootnotesProps) {
  const id = React.useId()
  return <section {...props} data-slot="footnotes" className={cn("db-footnotes", className)} aria-labelledby={labelledBy ?? id}>
    <h3 data-slot="footnotes-label" id={id} className="db-footnotes-label">{label}</h3>
    <ol data-slot="footnotes-list">{children}</ol>
  </section>
}

type FootnoteReferenceProps = Omit<React.ComponentProps<"a">, "href" | "children"> & { noteId: string; number: string | number; label?: string }
function FootnoteReference({ noteId, number, label = `Read note ${number}`, className, ...props }: FootnoteReferenceProps) {
  return <sup data-slot="footnote-reference"><a {...props} className={cn("db-footnote-ref", className)} href={`#${encodeURIComponent(noteId)}`} aria-label={props["aria-label"] ?? label}>{number}</a></sup>
}

type FootnoteProps = React.ComponentProps<"li"> & { id: string; number: string | number; referenceId?: string; returnLabel?: string }
function Footnote({ number, referenceId, returnLabel = `Return to reference ${number}`, className, children, ...props }: FootnoteProps) {
  return <li tabIndex={-1} {...props} data-slot="footnote" className={cn("db-footnote", className)}>
    <span data-slot="footnote-number" className="db-footnote-number" aria-hidden="true">{number}</span>
    <div data-slot="footnote-body">{children}{referenceId ? <a data-slot="footnote-return" className="db-footnote-return" href={`#${encodeURIComponent(referenceId)}`} aria-label={returnLabel}>Return</a> : null}</div>
  </li>
}

export { Footnotes, Footnote, FootnoteReference, type FootnotesProps, type FootnoteProps, type FootnoteReferenceProps }
