import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type AlertProps = React.ComponentProps<"div"> & {
  /** error is for something that failed and needs fixing; it takes role="alert" and the signal colour. */
  variant?: "default" | "error"
  /** Draw the bar and bring the lines in one by one. Set it when the alert appears because of something the person did. */
  arriving?: boolean
}

/** A double bar: in a score, the sign that something changes here. */
function Alert({ className, variant = "default", arriving, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      data-variant={variant === "error" ? "error" : undefined}
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

function AlertActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-actions" className={cn("db-alert-actions", className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription, AlertActions, type AlertProps }
