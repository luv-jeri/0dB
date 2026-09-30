"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

import { cn } from "@/registry/0db/lib/utils"

/** Words held apart by standing hairlines. type="single" allows one held at a time; "multiple" allows any. */
function ToggleGroup({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return <ToggleGroupPrimitive.Root data-slot="toggle-group" className={cn("db-toggles", className)} {...props} />
}

/** One word in the group. Wears the same fermata as a Toggle. */
function ToggleGroupItem({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return <ToggleGroupPrimitive.Item data-slot="toggle-group-item" className={cn("db-toggle", className)} {...props} />
}

export { ToggleGroup, ToggleGroupItem }
