import { CommandLine } from "@/registry/0db/ui/command-line"

export default function Example() {
  return <CommandLine runner command="shadcn@latest add https://0db.cojeev.com/r/button.json" emphasis="button" />
}
