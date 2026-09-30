"use client"

import * as React from "react"
import { highlight } from "sugar-high"

import { cn } from "@/registry/0db/lib/utils"
import { roll } from "@/registry/0db/lib/roll"
import { Button } from "@/registry/0db/ui/button"

type SourceProps = Omit<React.ComponentProps<"figure">, "children"> & {
  code: string
  /** Shown in the frame row, e.g. a file name. */
  title?: React.ReactNode
  /** Hide the Copy action. */
  noCopy?: boolean
}

/** Code, set as type. Strings are yours, in italic; keywords are ink; nothing else takes colour. */
function Source({ code, title, noCopy = false, className, ...props }: SourceProps) {
  const html = React.useMemo(() => highlight(code.replace(/\n$/, "")), [code])
  return (
    <figure data-slot="source" className={cn("db-source", className)} {...props}>
      {title || !noCopy ? (
        <figcaption data-slot="source-meta" className="db-meta db-source-meta">
          <span>{title}</span>
          <hr />
          {noCopy ? null : <CopyButton text={code} />}
        </figcaption>
      ) : null}
      <pre className="db-source-code" tabIndex={0}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  )
}

/** Copy keeps its name through the flow: Copy, then Copied. */
function CopyButton({ text, className, ...props }: React.ComponentProps<typeof Button> & { text: string }) {
  const label = React.useRef<HTMLSpanElement>(null)
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const show = (next: boolean) => {
    if (label.current) roll(label.current, () => setCopied(next), "0.5em", next ? 1 : -1)
    else setCopied(next)
  }

  return (
    <Button
      variant="bracket"
      data-slot="source-copy"
      className={cn("db-source-copy", className)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
        } catch {
          return // the browser refused; the label stays "Copy", which is true
        }
        show(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => show(false), 1800)
      }}
      {...props}
    >
      <span ref={label} aria-live="polite">
        {copied ? "Copied" : "Copy"}
      </span>
    </Button>
  )
}

export { Source, CopyButton, type SourceProps }
