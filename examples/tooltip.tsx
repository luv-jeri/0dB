import { Button } from "@/registry/0db/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/0db/ui/tooltip"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-10">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="bracket">Duplicate</Button>
        </TooltipTrigger>
        <TooltipContent>Makes a copy beside it</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <kbd className="db-kbd" tabIndex={0}>G</kbd>
        </TooltipTrigger>
        <TooltipContent>Lays the grid over the page</TooltipContent>
      </Tooltip>
    </div>
  )
}
