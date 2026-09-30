import { Button } from "@/registry/0db/ui/button"
import { Meta } from "@/registry/0db/ui/meta"
import {
  Sheet,
  SheetActions,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetSpine,
  SheetTitle,
  SheetTrigger,
} from "@/registry/0db/ui/sheet"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-10">
      {(["end", "start"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="bracket">{side === "end" ? "Read the brief" : "Read it from the start"}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetSpine>The brief</SheetSpine>
            <Meta>
              <span>Halden</span>
              <span>Edited today</span>
            </Meta>
            <SheetTitle>
              The <span className="db-yours">Halden</span> brief
            </SheetTitle>
            <SheetDescription>A new identity for a ferry line that has run between the islands since 1911. Keep the flag, lose the anchor. The timetable is the real product.</SheetDescription>
            <SheetActions>
              <SheetClose asChild>
                <Button variant="bracket" data-autofocus>Close</Button>
              </SheetClose>
            </SheetActions>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
