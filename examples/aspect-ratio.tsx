"use client"

import * as React from "react"

import { AspectRatio } from "@/registry/0db/ui/aspect-ratio"
import { ToggleGroup, ToggleGroupItem } from "@/registry/0db/ui/toggle-group"

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
      <div className="max-w-md">
        <AspectRatio ratio={value} label />
      </div>
    </div>
  )
}
