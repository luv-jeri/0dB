import { Source } from "@/registry/0db/ui/source"

const code = `import { Button } from "@/components/ui/button"

// One statement per view; everything else is a bracket or a line.
export function Actions() {
  return <Button variant="statement">Start a project</Button>
}`

export default function Example() {
  return <Source title="actions.tsx" code={code} />
}
