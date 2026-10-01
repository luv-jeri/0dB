"use client"

import * as React from "react"

import { Figure } from "@/registry/0db/ui/figure"
import { ToggleGroup, ToggleGroupItem } from "@/registry/0db/ui/toggle-group"
import { State } from "@/components/site/state"

// Two studies drawn in SVG, so the specimen needs no image files: a sea at first light and a window's light on a wall.
const svg = (s: string) => `data:image/svg+xml,${encodeURIComponent(s)}`
const sea = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1000" viewBox="0 0 1500 1000"><defs><linearGradient id="s" x2="0" y2="1"><stop offset="0" stop-color="#77787b"/><stop offset="1" stop-color="#d4d5d6"/></linearGradient><linearGradient id="w" x2="0" y2="1"><stop offset="0" stop-color="#4b4c50"/><stop offset="1" stop-color="#141518"/></linearGradient><radialGradient id="h" cx=".5" cy=".53" r=".5" gradientTransform="matrix(1 0 0 .22 0 .41)"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .35 0"/><feBlend in2="SourceGraphic" mode="overlay"/></filter></defs><g filter="url(#g)"><rect width="1500" height="530" fill="url(#s)"/><rect y="530" width="1500" height="470" fill="url(#w)"/><rect width="1500" height="1000" fill="url(#h)"/></g></svg>`)
const wall = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a2b2e"/><stop offset="1" stop-color="#0e0f11"/></linearGradient><filter id="s"><feGaussianBlur stdDeviation="14"/></filter><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .4 0"/><feBlend in2="SourceGraphic" mode="overlay"/></filter></defs><g filter="url(#g)"><rect width="1200" height="1500" fill="url(#b)"/><g filter="url(#s)" fill="#e6e6e3"><path d="M430 250 L780 330 L780 1010 L430 1150 Z" opacity=".92"/><path d="M430 1150 L780 1010 L1160 1500 L520 1500 Z" opacity=".22"/></g></g></svg>`)

const ratios = [
  ["3:2", 3 / 2],
  ["16:9", 16 / 9],
  ["1:1", 1],
  ["4:5", 4 / 5],
] as const

export default function Example() {
  const [ratio, setRatio] = React.useState("3:2")
  const value = ratios.find(([name]) => name === ratio)?.[1] ?? 3 / 2
  return (
    <div className="grid w-full gap-(--db-space-8)">
      <div className="grid gap-(--db-space-7)">
        {/* Radix single groups clear on a second press; a crop is always one of the four. */}
        <ToggleGroup type="single" value={ratio} onValueChange={(v) => v && setRatio(v)} aria-label="Crop">
          {ratios.map(([name]) => (
            <ToggleGroupItem key={name} value={name}>
              {name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Figure
          src={sea}
          alt="A calm sea under a pale sky, the horizon across the middle of the frame."
          ratio={value}
          position="50% 53%"
          number="01"
          caption="Sea at first light. The crop keeps the horizon on the middle line."
          credit="Study, drawn in SVG"
        />
      </div>
      <Figure
        variant="margin"
        src={wall}
        alt="Light from a tall window falling across a dark wall and floor."
        ratio={4 / 5}
        number="02"
        caption="A window's light on the wall at four in the afternoon."
        credit="Study, drawn in SVG"
      />
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Plate, 3 : 2">
        <Figure className="w-64" src={sea} alt="A calm sea under a pale sky." number="01" caption="Sea at first light." credit="Study" />
      </State>
      <State label="Picture only">
        <Figure className="w-64" src={wall} alt="Light from a window on a dark wall." ratio={1} />
      </State>
      <State label="Missing picture">
        <Figure className="w-64" src="data:," alt="A calm sea under a pale sky, the horizon across the middle." number="03" caption="The description stands in its place." />
      </State>
      <State label="Right to left">
        <Figure dir="rtl" lang="ar" className="w-64" src={sea} alt="بحر هادئ تحت سماء شاحبة." number="04" caption="البحر عند أول الضوء." credit="دراسة" />
      </State>
    </>
  )
}
