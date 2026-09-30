import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type AvatarProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** Who this is. It names the avatar, so say the person's name. */
  alt: string
  src?: string
  /** What shows without an image. Defaults to the first letter of alt, in italic. */
  fallback?: string
  size?: "s" | "m" | "l"
  /** The accent dot: this person is here now. */
  here?: boolean
  /** The overflow count at the end of a group ("+3"): set in the voice, not the italic. */
  count?: boolean
}

/** A person is a ring and their initial, in italic, since a name is theirs. */
function Avatar({ alt, src, fallback, size = "m", here, count, className, ...props }: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      role="img"
      aria-label={here ? `${alt}, here now` : alt}
      data-size={size === "m" ? undefined : size}
      data-here={here || undefined}
      data-count={count || undefined}
      className={cn("db-avatar", className)}
      {...props}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a registry item is framework-agnostic */}
      {src ? <img src={src} alt="" /> : (fallback ?? alt.charAt(0).toUpperCase())}
    </span>
  )
}

/** Avatars overlap, and step apart when pointed at. Its label says who the group is. */
function AvatarGroup({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="avatar-group" role="group" className={cn("db-avatars", className)} {...props} />
}

export { Avatar, AvatarGroup, type AvatarProps }
