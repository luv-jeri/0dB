import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

/**
 * Baselines where the words will be. Still by default; a pencil stroke reads
 * along each line only while an ancestor has aria-busy="true" (and motion is welcome).
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" aria-hidden="true" className={cn("db-skeleton", className)} {...props} />
}

type SkeletonLineProps = React.ComponentProps<"i"> & {
  /** Any CSS width; the default is the full line. */
  width?: string
  /** Any CSS height; the default is one line of text. */
  height?: string
  /** Position in the stack, so the stroke reads down the lines in turn. */
  index?: number
}

function SkeletonLine({ width, height, index = 0, className, style, ...props }: SkeletonLineProps) {
  return (
    <i
      data-slot="skeleton-line"
      className={className}
      style={{ "--w": width, "--lh": height, "--i": index, ...style } as React.CSSProperties}
      {...props}
    />
  )
}

/** Where an avatar or a mark will be. */
function SkeletonRing({ size, className, style, ...props }: React.ComponentProps<"span"> & { size?: string }) {
  return (
    <span
      data-slot="skeleton-ring"
      className={cn("db-skeleton-ring", className)}
      style={{ "--s": size, ...style } as React.CSSProperties}
      {...props}
    />
  )
}

export { Skeleton, SkeletonLine, SkeletonRing, type SkeletonLineProps }
