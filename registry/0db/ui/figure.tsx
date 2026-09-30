"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { AspectRatio } from "@/registry/0db/ui/aspect-ratio"
import { Meta } from "@/registry/0db/ui/meta"

type FigureProps = Omit<React.ComponentProps<"figure">, "children"> & {
  src: string
  /** What the picture shows. Read aloud, and set in the frame in its place if the picture can't be loaded. */
  alt: string
  srcSet?: string
  sizes?: string
  /** Width over height of the crop. 3 / 2 by default, the 35mm negative. Change it and the picture recrops as the frame eases. */
  ratio?: number
  /** Where the crop holds the picture, as CSS object-position. */
  position?: string
  /** The figure's number, set as data before the caption: 01. */
  number?: React.ReactNode
  caption?: React.ReactNode
  /** Who made it, spread to the far end of the caption row. */
  credit?: React.ReactNode
  /** plate: the caption under the picture. margin: the caption in the margin beside it, the number at its head. */
  variant?: "plate" | "margin"
  loading?: "lazy" | "eager"
}

/** A picture cropped to a ratio and marked like a printer's proof, with its number, caption and credit set as type. */
function Figure({ src, alt, srcSet, sizes, ratio = 3 / 2, position, number, caption, credit, variant = "plate", loading = "lazy", className, ...props }: FigureProps) {
  const img = React.useRef<HTMLImageElement>(null)
  // A picture that failed before hydration fires no error event we can hear: look once it's mounted.
  React.useEffect(() => {
    const el = img.current
    if (el) el.closest("figure")?.toggleAttribute("data-missing", el.complete && el.naturalWidth === 0)
  }, [src])
  const mark = (on: boolean) => (e: React.SyntheticEvent<HTMLImageElement>) => e.currentTarget.closest("figure")?.toggleAttribute("data-missing", on)

  return (
    <figure data-slot="figure" data-variant={variant} className={cn("db-figure", className)} {...props}>
      <AspectRatio ratio={ratio} className="db-figure-frame">
        {/* eslint-disable-next-line @next/next/no-img-element -- a registry item is framework-agnostic */}
        <img
          ref={img}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={loading}
          decoding="async"
          className="db-figure-img"
          style={position ? { objectPosition: position } : undefined}
          onLoad={mark(false)}
          onError={mark(true)}
        />
        {alt ? (
          <span className="db-figure-alt" aria-hidden="true">
            {alt}
          </span>
        ) : null}
      </AspectRatio>
      {number != null || caption || credit ? (
        <figcaption className="db-figure-caption">
          {number != null ? (
            <span className="db-figure-number">
              <span className="db-sr">Figure </span>
              {number}
            </span>
          ) : null}
          <Meta className="db-figure-lines">
            {caption ? <span className="db-figure-text">{caption}</span> : null}
            {credit ? <span className="db-figure-credit">{credit}</span> : null}
          </Meta>
        </figcaption>
      ) : null}
    </figure>
  )
}

export { Figure, type FigureProps }
