import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0db/lib/utils"
import { Spinner } from "@/registry/0db/ui/spinner"

type ButtonProps = React.ComponentProps<"button"> & {
  /**
   * statement: reversed type in an ink block, one per view.
   * bracket: a secondary action held in ( ).
   * quiet: only a line, and the line redraws.
   */
  variant?: "statement" | "bracket" | "quiet"
  size?: "m" | "l"
  /** Render the child element (a link, say) with the button's look. */
  asChild?: boolean
  /**
   * The button says what it's doing. A string replaces the label while busy
   * ("Save" becomes "Saving"); true keeps the label. Either way the periods breathe.
   */
  busy?: boolean | string
}

function Button({ className, variant = "bracket", size = "m", asChild = false, busy = false, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size === "m" ? undefined : size}
      aria-busy={busy ? true : undefined}
      className={cn("db-btn", className)}
      {...(asChild ? {} : { type: "button" as const })}
      {...props}
    >
      {busy && !asChild ? (
        <>
          {typeof busy === "string" ? busy : children} <Spinner />
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, type ButtonProps }
