import { Button } from "@/registry/0nlytype/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/0nlytype/ui/tooltip"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid justify-items-start gap-x-10 gap-y-12 sm:grid-cols-3">
      <div className="grid justify-items-start gap-14">
        <span className="ot-label">whisper</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="bracket">Duplicate</Button>
          </TooltipTrigger>
          <TooltipContent>Makes a copy beside it</TooltipContent>
        </Tooltip>
      </div>
      <div className="grid justify-items-start gap-14">
        <span className="ot-label">initials</span>
        <div className="flex items-center gap-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <kbd className="ot-kbd" tabIndex={0}>G</kbd>
            </TooltipTrigger>
            <TooltipContent variant="initials">Lays the <b>g</b>rid over the page</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <abbr className="ot-label" tabIndex={0}>CMYK</abbr>
            </TooltipTrigger>
            <TooltipContent variant="initials"><b>C</b>yan, <b>m</b>agenta, <b>y</b>ellow, <b>k</b>ey</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="grid justify-items-start gap-14">
        <span className="ot-label">beside</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="quiet">Archive</Button>
          </TooltipTrigger>
          <TooltipContent variant="beside">Kept, out of the way</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

// Pinned: each whisper beside or above a copy of its control, with the attributes Radix would give it.
export function States() {
  return (
    <>
      <State label="whisper, shown">
        <div className="grid justify-items-center gap-2">
          <span className="ot-tip-text" data-state="instant-open" data-side="top">Makes a copy beside it</span>
          <Button variant="bracket" tabIndex={-1} aria-hidden="true">Duplicate</Button>
        </div>
      </State>
      <State label="initials, shown">
        <div className="grid justify-items-center gap-2">
          <span className="ot-tip-text" data-variant="initials" data-state="instant-open" data-side="top">Lays the <b>g</b>rid over the page</span>
          <kbd className="ot-kbd">G</kbd>
        </div>
      </State>
      <State label="beside, shown">
        <div className="flex items-center gap-1">
          <Button variant="quiet" tabIndex={-1} aria-hidden="true">Archive</Button>
          <span className="ot-tip-text" data-variant="beside" data-state="instant-open" data-side="right">Kept, out of the way</span>
        </div>
      </State>
    </>
  )
}
