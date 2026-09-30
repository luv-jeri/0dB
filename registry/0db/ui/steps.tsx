import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

/** A real sequence, numbered. Only use it when the order matters. */
function Steps({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="steps" className={cn("db-steps", className)} {...props} />
}

type StepProps = React.ComponentProps<"li"> & {
  /** The step the person is on: its numeral is the view's one accent. */
  current?: boolean
  done?: boolean
}

function Step({ className, current, done, ...props }: StepProps) {
  return (
    <li
      data-slot="step"
      data-current={current || undefined}
      data-done={done || undefined}
      aria-current={current ? "step" : undefined}
      className={cn("db-step", className)}
      {...props}
    />
  )
}

function StepTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="step-title" className={cn("db-step-title", className)} {...props} />
}

export { Steps, Step, StepTitle, type StepProps }
