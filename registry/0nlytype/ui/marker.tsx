import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"

type MarkerProps = React.ComponentProps<"p"> & {
  /**
   * status (the default): a quiet line. divider: where a day begins, the word standing on the rule it
   * pushed apart. ribbon: where you left off, the one accent line across the page. lapse: a pause in
   * the conversation, given as silence: the longer it was, the more room and the looser the words.
   */
  variant?: "status" | "divider" | "ribbon" | "lapse"
  /** A small dot before a status. */
  dot?: boolean
  /** Lapse only: how long the pause was, in minutes. A minute is a breath; a week is the widest. */
  minutes?: number
  /** Plays the arrival when it mounts. */
  arriving?: boolean
  /** Divider only. vertical stands it up between two things in a row, as tall as the row; a word reads down it. */
  orientation?: "horizontal" | "vertical"
}

// ponytail: log scale, clamped at a week; a longer silence looks like a week's.
const WEEK = 7 * 24 * 60
const lapseOf = (minutes = 0) => Math.min(1, Math.log1p(Math.max(0, minutes)) / Math.log1p(WEEK))

/** A quiet line in a conversation: a status, where a day begins, where you left off, or a pause. A divider with no word is a plain rule. */
function Marker({ variant = "status", dot, minutes, arriving, orientation = "horizontal", className, style, children, ...props }: MarkerProps) {
  const upright = variant === "divider" && orientation === "vertical"
  // A divider with no word is a rule and nothing else: say so, and which way it stands.
  const bare = variant === "divider" && (children == null || children === false || children === "")
  return (
    <p
      data-slot="marker"
      data-variant={variant === "status" ? undefined : variant}
      data-orientation={upright ? "vertical" : undefined}
      data-arriving={arriving || undefined}
      role={bare ? "separator" : undefined}
      aria-orientation={bare && upright ? "vertical" : undefined}
      className={cn("ot-marker", className)}
      style={variant === "lapse" ? ({ "--lapse": lapseOf(minutes).toFixed(3), ...style } as React.CSSProperties) : style}
      {...props}
    >
      {dot ? <span className="ot-marker-dot" aria-hidden="true" /> : null}
      {children}
    </p>
  )
}

export { Marker, type MarkerProps }
