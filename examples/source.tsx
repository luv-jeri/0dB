import { registryURL } from "@/lib/site/config.mjs"
import { Source } from "@/registry/0nlytype/ui/source"
import { State } from "@/components/site/state"

const code = `import { Button } from "@/components/ui/button"

// One statement per view; everything else is a bracket or a line.
export function Actions() {
  return <Button variant="statement">Start a project</Button>
}`

const glossed = `import { Prose } from "@/components/ui/typography"

// Styled by element, so markdown needs no classes.
export function Post({ html }: { html: string }) {
  // Sanitised by the CMS.
  return <Prose dangerouslySetInnerHTML={{ __html: html }} />
}`

const theme = `export function Theme({ children }) {
  const [mode, setMode] = useState("day")
  useEffect(() => {
    document.documentElement.dataset.mode = mode
  }, [mode])
  return <Mode value={mode} onChange={setMode}>{children}</Mode>
}`

const install = `const items = await fetch("${registryURL("registry")}").then((r) => r.json()).then((r) => r.items)
export const ui = items.filter((item) => item.type === "registry:ui").map((item) => item.name).sort()`

export default function Example() {
  return (
    <div className="grid gap-y-16">
      <Source title="actions.tsx" code={code} />
      <div className="grid gap-y-4">
        <span className="ot-label">gloss</span>
        <Source variant="gloss" title="post.tsx" code={glossed} />
      </div>
      <div className="grid gap-y-4">
        <span className="ot-label">passage</span>
        <Source variant="passage" passage={[3, 5]} title="theme.tsx" code={theme} />
      </div>
      <div className="grid gap-y-4">
        <span className="ot-label">unwrapped, with its language</span>
        <Source wrap={false} language="ts" code={install} />
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="gloss, narrow"><Source variant="gloss" code={`// Set once, at the root.\n<html data-mode="nocturne">`} noCopy className="w-72" /></State>
      <State label="unwrapped, passage, narrow"><Source wrap={false} variant="passage" passage={[2, 2]} language="tsx" code={`<Prose>\n  <h2>Why two faces, and why the second is always the italic</h2>\n</Prose>`} noCopy className="w-72" /></State>
      <State label="passage, narrow"><Source variant="passage" passage={[2, 2]} code={`<Prose>\n  <h2>Why two faces</h2>\n</Prose>`} noCopy className="w-72" /></State>
    </>
  )
}
