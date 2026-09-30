"use client"

import * as React from "react"

import { Appearance, useAppearance, KEYS, PAIRS, SCHEMES, type AppearanceValue } from "@/registry/0db/ui/appearance"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/0db/ui/popover"
import { ModeToggle } from "@/registry/0db/ui/mode-toggle"
import { Button } from "@/registry/0db/ui/button"

// The site's names for the library's appearance, which the landing page's tuning sentence also uses.
export { KEYS, PAIRS, SCHEMES, useAppearance as useTheme, type AppearanceValue as Theme }

/** The day and night toggle, and Tune: the library's appearance in a popover. */
export function ThemeControls() {
  const [theme, set] = useAppearance()
  return (
    <div className="bar-controls">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="quiet">Tune</Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="tune">
          <Appearance />
        </PopoverContent>
      </Popover>
      {/* The toggle reports; the change opens the new page as a circle from the toggle itself. */}
      <ModeToggle variant="eclipse" mode={theme.mode === "nocturne" ? "nocturne" : "day"} onModeChange={(m, e) => set({ mode: m }, e.currentTarget)} className="bar-mode" />
    </div>
  )
}
