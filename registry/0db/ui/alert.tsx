import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type AlertProps = React.ComponentProps<"div"> & {
  /**
   * default: the double bar down the margin. error: the final bar, in the signal colour, with role="alert"; for what
   * failed, saying what to fix. cue: one hairline arrow runs in from the margin to the words, for a notice across the page.
   * errata: a correction, set with AlertCorrection as the printer's "for … read …".
   */
  variant?: "default" | "error" | "cue" | "errata"
  /** Draw the sign and bring the lines in one by one. Set it when the alert appears because of something the person did. */
  arriving?: boolean
}

/** A double bar: in a score, the sign that something changes here. */
function Alert({ className, variant = "default", arriving, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      data-variant={variant === "default" ? undefined : variant}
      data-arriving={arriving || undefined}
      role={variant === "error" ? "alert" : "status"}
      className={cn("db-alert", className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="alert-title" className={cn("db-alert-title", className)} {...props} />
}

function AlertDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="alert-description" className={cn("db-alert-description", className)} {...props} />
}

/** The errata slip's formula: for what was printed, read what is true. The words are marked del and ins, so they're heard as a change. */
function AlertCorrection({ was, now, className, ...props }: React.ComponentProps<"p"> & { was: React.ReactNode; now: React.ReactNode }) {
  return (
    <p data-slot="alert-correction" className={cn("db-alert-correction", className)} {...props}>
      <span>
        <span>for</span>&nbsp;<del>{was}</del>
      </span>{" "}
      <span>
        <span>read</span>&nbsp;<ins>{now}</ins>
      </span>
    </p>
  )
}

function AlertActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-actions" className={cn("db-alert-actions", className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription, AlertCorrection, AlertActions, type AlertProps }
