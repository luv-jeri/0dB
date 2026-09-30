"use client"

import * as React from "react"

import { AspectRatio } from "@/registry/0db/ui/aspect-ratio"
import { Button } from "@/registry/0db/ui/button"

const ratios = [
  ["16:9", 16 / 9],
  ["4:3", 4 / 3],
  ["1:1", 1],
  ["4:5", 4 / 5],
] as const

export default function Example() {
  const [ratio, setRatio] = React.useState<number>(16 / 9)
  return (
    <div className="grid gap-8">
      <div role="group" aria-label="Ratio" className="flex gap-6">
        {ratios.map(([name, value]) => (
          <Button key={name} variant={ratio === value ? "statement" : "bracket"} aria-pressed={ratio === value} onClick={() => setRatio(value)}>
            {name}
          </Button>
        ))}
      </div>
      <div className="max-w-md">
        <AspectRatio ratio={ratio} label />
      </div>
    </div>
  )
}
