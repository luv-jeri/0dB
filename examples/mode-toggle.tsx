"use client"

import * as React from "react"

import { ModeToggle, type Mode } from "@/registry/0db/ui/mode-toggle"
import { State } from "@/components/site/state"

const variants = ["eclipse", "horizon", "words", "fermata", "sentence"] as const

// Held here, so the five agree; on your page, the same change goes to <html data-mode>.
export default function Example() {
  const [mode, setMode] = React.useState<Mode>("day")
  return (
    <div className="db-mp grid justify-items-start gap-x-10 gap-y-7 sm:grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] sm:self-stretch">
      {variants.map((variant) => (
        <div key={variant} className="grid justify-items-start gap-4">
          <span className="db-label">{variant}</span>
          <ModeToggle variant={variant} mode={mode} onModeChange={setMode} />
        </div>
      ))}
    </div>
  )
}

export function States() {
  return (
    <>
      {variants.flatMap((variant) => [
        <State key={`${variant}-d`} label={`${variant}, day`}><ModeToggle variant={variant} mode="day" /></State>,
        <State key={`${variant}-n`} label={`${variant}, night`}><ModeToggle variant={variant} mode="nocturne" /></State>,
      ])}
      <State label="Pointed at"><ModeToggle data-force="hover" mode="day" /></State>
      <State label="Focus"><ModeToggle data-force="focus" mode="day" /></State>
      <State label="Disabled"><ModeToggle disabled mode="day" /></State>
    </>
  )
}
