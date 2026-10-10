"use client"

import * as React from "react"

import { useAppearance } from "@/registry/0nlytype/ui/appearance"
import { ModeToggle, type Mode } from "@/registry/0nlytype/ui/mode-toggle"
import { State } from "@/components/site/state"

// The three switches, each with the scene change it asks the page for.
const scenes = [
  { variant: "stop", scene: "the page dissolves" },
  { variant: "dimmer", scene: "the light is lowered" },
  { variant: "noon", scene: "night falls from the top" },
] as const
const variants = ["eclipse", "horizon", "words", "fermata", "sentence", "knockout", "hour"] as const

// These change the page itself: the appearance hook writes <html data-mode> and draws each switch's scene change.
export default function Example() {
  const [theme, set] = useAppearance()
  const mode: Mode = theme.mode === "nocturne" ? "nocturne" : "day"
  const change = (m: Mode, e: React.MouseEvent<HTMLButtonElement>) => set({ mode: m }, e.currentTarget)
  return (
    <div className="ot-mp grid justify-items-start gap-x-10 gap-y-7 sm:grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] sm:self-stretch">
      {scenes.map(({ variant, scene }) => (
        <div key={variant} className="grid justify-items-start gap-4">
          <span className="ot-label">{variant}, {scene}</span>
          <ModeToggle variant={variant} mode={mode} onModeChange={change} />
        </div>
      ))}
      {variants.map((variant) => (
        <div key={variant} className="grid justify-items-start gap-4">
          <span className="ot-label">{variant}</span>
          <ModeToggle variant={variant} mode={mode} onModeChange={change} />
        </div>
      ))}
    </div>
  )
}

export function States() {
  return (
    <>
      {[...scenes.map((s) => s.variant), ...variants].flatMap((variant) => [
        <State key={`${variant}-d`} label={`${variant}, day`}><ModeToggle variant={variant} mode="day" /></State>,
        <State key={`${variant}-n`} label={`${variant}, night`}><ModeToggle variant={variant} mode="nocturne" /></State>,
      ])}
      <State label="Stop, pointed at"><ModeToggle variant="stop" data-force="hover" mode="day" /></State>
      <State label="Dimmer, pointed at"><ModeToggle variant="dimmer" data-force="hover" mode="day" /></State>
      <State label="Dimmer, pointed at by night"><ModeToggle variant="dimmer" data-force="hover" mode="nocturne" /></State>
      <State label="Stop, focus"><ModeToggle variant="stop" data-force="focus" mode="nocturne" /></State>
      <State label="Noon, disabled"><ModeToggle variant="noon" disabled mode="day" /></State>
      <State label="Stop, reduced motion"><ModeToggle variant="stop" data-force="reduced" mode="nocturne" /></State>
      <State label="Stop, right to left"><span dir="rtl"><ModeToggle variant="stop" mode="day" /></span></State>
      <State label="Pointed at"><ModeToggle data-force="hover" mode="day" /></State>
      <State label="Focus"><ModeToggle data-force="focus" mode="day" /></State>
      <State label="Disabled"><ModeToggle disabled mode="day" /></State>
      <State label="Knockout, pointed at"><ModeToggle variant="knockout" data-force="hover" mode="day" /></State>
      <State label="Hour, disabled"><ModeToggle variant="hour" disabled mode="nocturne" /></State>
    </>
  )
}
