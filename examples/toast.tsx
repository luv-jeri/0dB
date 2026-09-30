"use client"

import { Button } from "@/registry/0db/ui/button"
import { Toaster, dismiss, toast } from "@/registry/0db/ui/toast"

export default function Example() {
  return (
    <>
      <div className="flex flex-wrap items-baseline gap-10">
        <Button onClick={() => toast("Changes saved.")}>Save changes</Button>
        <Button
          onClick={() =>
            toast("Halden archived.", {
              action: { label: "Undo", onClick: () => toast("Halden restored.") },
            })
          }
        >
          Archive project
        </Button>
        <Button variant="quiet" onClick={() => dismiss()}>Clear all</Button>
      </div>
      <Toaster />
    </>
  )
}
