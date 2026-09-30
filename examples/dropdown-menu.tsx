"use client"

import * as React from "react"

import { Button } from "@/registry/0db/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/0db/ui/dropdown-menu"

export default function Example() {
  const [notes, setNotes] = React.useState(true)
  const [view, setView] = React.useState("list")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="bracket">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent aria-label="Options for Halden">
        <DropdownMenuGroup>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem>
            Duplicate <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Show</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={notes} onCheckedChange={setNotes}>
          Show margin notes <DropdownMenuShortcut>N</DropdownMenuShortcut>
        </DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value={view} onValueChange={setView}>
          <DropdownMenuRadioItem value="list">As a list</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="grid">As a grid</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Northlight</DropdownMenuItem>
            <DropdownMenuItem>Oda Studio</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem variant="destructive">Delete Halden for good</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
