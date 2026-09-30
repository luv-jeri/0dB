"use client"

import { Button } from "@/registry/0db/ui/button"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/registry/0db/ui/popover"

export default function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="bracket">Share Halden</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Share Halden" className="grid gap-3">
        <p className="db-label">Anyone with the link can view</p>
        <p className="db-yours">studio.com/halden</p>
        <PopoverClose asChild>
          <Button variant="quiet" className="justify-self-start" onClick={() => navigator.clipboard?.writeText("studio.com/halden")}>Copy the link</Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
