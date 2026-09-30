import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type ProgressProps = Omit<React.ComponentProps<"div">, "children"> & {
  value: number
  max?: number
  /** What is being done, in words ("Uploading 12 files"). It also names the bar. */
  label?: string
}

/** A hairline that fills, and the percentage set as an italic numeral. Native <progress> underneath. */
function Progress({ value, max = 100, label, className, ...props }: ProgressProps) {
  const percent = max > 0 ? Math.round((Math.min(Math.max(value, 0), max) / max) * 100) : 0
  return (
    <div data-slot="progress" className={cn("db-progress", className)} {...props}>
      {label ? (
        <p data-slot="progress-label" className="db-progress-label">
          {label}
        </p>
      ) : null}
      <p data-slot="progress-value" className="db-progress-value" aria-hidden="true">
        <span>{percent}</span>
        <small>%</small>
      </p>
      <progress value={value} max={max} aria-label={label ?? "Progress"} />
    </div>
  )
}

export { Progress, type ProgressProps }
