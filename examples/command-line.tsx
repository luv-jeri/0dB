import { CommandLine } from "@/registry/0db/ui/command-line"
import { State } from "@/components/site/state"

const ADD = "shadcn@latest add https://0db.cojeev.com/r/button.json"

export default function Example() {
  return (
    <div className="grid gap-y-16">
      <CommandLine runner command={ADD} emphasis="button" />
      <div className="grid gap-y-4">
        <span className="db-label">parsed</span>
        <CommandLine variant="parsed" command={ADD} emphasis="button" glosses={["the shadcn tool", "copies an item in", "where the item lives"]} />
      </div>
      <div className="grid gap-y-4">
        <span className="db-label">synopsis</span>
        <CommandLine variant="synopsis" runner command={ADD} emphasis="button" blank="Item name" />
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="parsed, pointed at"><CommandLine variant="parsed" command="git commit -m" glosses={["", "records the change", "with a message"]} className="w-72" data-force="hover" /></State>
      <State label="synopsis, rest"><CommandLine variant="synopsis" command="npm install name" emphasis="name" blank="Package name" className="w-72" /></State>
      <State label="synopsis, focused"><CommandLine variant="synopsis" command="npm install name" emphasis="name" blank="Package name" className="w-72" data-force="focus" /></State>
    </>
  )
}
