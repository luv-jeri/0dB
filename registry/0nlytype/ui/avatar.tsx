"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"

type AvatarProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** Who this is. It names the avatar, so say the person's name. */
  alt: string
  src?: string
  /** What shows without an image. Defaults to the first letter of alt (the given name, for fit), in italic. */
  fallback?: string
  size?: "s" | "m" | "l"
  /**
   * ring: a ring and the initial. monogram: the given initial in italic printed over the family
   * initial in a heavy narrow roman, as the poster's "has" crosses "It". fit: the given name alone,
   * set to fill one width, so a short name stands large and a long one small.
   */
  variant?: "ring" | "monogram" | "fit"
  /** This person is here now: the accent dot; in a monogram the italic takes the accent; fit hangs an accent full stop. */
  here?: boolean
  /** The overflow count at the end of a group ("+3"): set in the voice, not the italic. */
  count?: boolean
}

const words = (name: string) => name.trim().split(/\s+/)

/** Fit: measure the name at 100px in its own face and set the size that fills the box. Re-measures when the pair changes. */
function useFit(ref: React.RefObject<HTMLSpanElement | null>, text: string, on: boolean) {
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!on || !el) return
    let live = true
    const ctx = document.createElement("canvas").getContext("2d")
    const fit = async () => {
      if (!live || !ctx) return
      const cs = getComputedStyle(el)
      const font = `${cs.fontStyle} ${cs.fontWeight} 100px ${cs.fontFamily}`
      try {
        await document.fonts.load(font, text)
      } catch {
        return // keep the fallback size if the face cannot load
      }
      if (!live) return
      ctx.font = font
      const w = ctx.measureText(text).width
      if (w) el.style.setProperty("--fit", `${(100 * el.clientWidth) / w}px`)
    }
    fit()
    // ponytail: the box is set in rem, so only the pair (on <html>) changes the fit; add a ResizeObserver if the box ever follows its container.
    const mo = new MutationObserver(fit)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-pair", "data-scheme", "data-mode", "data-key"] })
    return () => { live = false; mo.disconnect() }
  }, [ref, text, on])
}

/** A person is a ring and their initial, in italic, since a name is theirs. */
function Avatar({ alt, src, fallback, size = "m", variant = "ring", here, count, className, ref, ...props }: AvatarProps) {
  const own = React.useRef<HTMLSpanElement>(null)
  const [given, ...rest] = words(alt)
  const fitted = variant === "fit" && !src && !count
  const label = fallback ?? (variant === "fit" ? given : alt.charAt(0).toUpperCase())
  useFit(own, label, fitted)

  let face: React.ReactNode = label
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- a registry item is framework-agnostic
    face = <img src={src} alt="" />
  } else if (variant === "monogram" && !count) {
    const family = rest.at(-1)
    face = (
      <>
        <span className="ot-avatar-given">{(fallback ?? given).charAt(0).toUpperCase()}</span>
        {family && <span className="ot-avatar-family">{family.charAt(0).toUpperCase()}</span>}
      </>
    )
  }

  const composedRef = useComposedRefs(own, ref)
  return (
    <span
      ref={composedRef}
      data-slot="avatar"
      role="img"
      aria-label={here ? `${alt}, here now` : alt}
      data-size={size === "m" ? undefined : size}
      data-variant={variant === "ring" ? undefined : variant}
      dir={variant === "ring" ? undefined : "auto"} // the letters follow the name's own script, not the page's
      data-here={here || undefined}
      data-count={count || undefined}
      className={cn("ot-avatar", className)}
      {...props}
    >
      {face}
    </span>
  )
}

/** Avatars overlap, and step apart when pointed at; monograms stand side by side, and fitted names stack between hairlines. Its label says who the group is. */
function AvatarGroup({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="avatar-group" role="group" className={cn("ot-avatars", className)} {...props} />
}

export { Avatar, AvatarGroup, type AvatarProps }
