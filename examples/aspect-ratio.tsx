"use client"

import * as React from "react"

import { AspectRatio } from "@/registry/0nlytype/ui/aspect-ratio"
import { ToggleGroup, ToggleGroupItem } from "@/registry/0nlytype/ui/toggle-group"
import { State } from "@/components/site/state"

const ratios = [
  ["16:9", 16 / 9],
  ["4:3", 4 / 3],
  ["1:1", 1],
  ["4:5", 4 / 5],
] as const

export default function Example() {
  const [ratio, setRatio] = React.useState("16:9")
  const value = ratios.find(([name]) => name === ratio)?.[1] ?? 16 / 9
  return (
    <div className="grid gap-10">
      {/* Radix single groups clear on a second press; a ratio is always one of the four. */}
      <ToggleGroup type="single" value={ratio} onValueChange={(v) => v && setRatio(v)} aria-label="Ratio">
        {ratios.map(([name]) => (
          <ToggleGroupItem key={name} value={name}>
            {name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {/* One ratio, three frames: the crop, the diagonal and the square all follow the choice. */}
      <div className="grid items-start gap-x-16 gap-y-14 sm:grid-cols-3">
        <AspectRatio ratio={value} label />
        <AspectRatio ratio={value} label variant="diagonal" />
        <AspectRatio ratio={value} label variant="square" />
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      {(["crop", "diagonal", "square"] as const).flatMap((variant) =>
        ([["16 : 9", 16 / 9], ["4 : 5", 4 / 5]] as const).map(([name, r]) => (
          <State key={`${variant}-${name}`} label={`${variant}, ${name}`}>
            <div className="w-40">
              <AspectRatio ratio={r} label variant={variant} />
            </div>
          </State>
        )),
      )}
    </>
  )
}
