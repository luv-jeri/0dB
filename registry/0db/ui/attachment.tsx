"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { Button } from "@/registry/0db/ui/button"

/** The list the files sit in. */
function AttachmentList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="attachment-list" className={cn("db-attachments", className)} {...props} />
}

type AttachmentProps = Omit<React.ComponentProps<"li">, "children"> & {
  name: string
  /** The size, as it should read: "2.4 MB". Set in tabular figures. */
  size?: string
  /** Says what is happening or what went wrong, in place of the size: "Checking", "The connection dropped." */
  status?: string
  state?: "idle" | "uploading" | "processing" | "done" | "error"
  /** How far an upload has got, 0 to 1. The ring counts it in. */
  progress?: number
  /** Shows a Remove button, labelled with the file's name. */
  onRemove?: () => void
}

/** A file: its extension is its picture, a ring counts it in and fills to a dot when it's safe. */
function Attachment({ name, size, status, state = "done", progress, onRemove, className, style, ...props }: AttachmentProps) {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".") + 1) : ""
  return (
    <li
      data-slot="attachment"
      data-state={state}
      className={cn("db-attach", className)}
      style={progress === undefined ? style : ({ "--p": progress, ...style } as React.CSSProperties)}
      {...props}
    >
      <span className="db-attach-ext" aria-hidden="true">{ext}</span>
      <span className="db-attach-body">
        <span className="db-attach-name">{name}</span>
        <span className="db-attach-meta">{status ?? size}</span>
      </span>
      <svg className="db-attach-ring" viewBox="0 0 22 22" aria-hidden="true">
        <circle className="db-attach-track" cx="11" cy="11" r="9.5" />
        <circle className="db-attach-arc" cx="11" cy="11" r="9.5" pathLength="1" />
        <circle className="db-attach-fill" cx="11" cy="11" />
      </svg>
      {onRemove ? (
        <Button variant="bracket" aria-label={`Remove ${name}`} onClick={onRemove}>
          Remove
        </Button>
      ) : null}
    </li>
  )
}

export { Attachment, AttachmentList, type AttachmentProps }
