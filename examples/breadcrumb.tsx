import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, type BreadcrumbProps } from "@/registry/0db/ui/breadcrumb"
import { State } from "@/components/site/state"

type Path = { steps: string[]; here: string; variant?: BreadcrumbProps["variant"]; force?: string; open?: boolean }

/** A path: each step a link, a hairline between each pair, and where you are last. */
function Path({ steps, here, variant, force, open }: Path) {
  return (
    <Breadcrumb variant={variant}>
      <BreadcrumbList data-force={open ? "hover" : undefined}>
        {steps.map((step, i) => [
          <BreadcrumbItem key={step}>
            <BreadcrumbLink href={`#${step.toLowerCase()}`} data-force={i === 0 ? force : undefined}>{step}</BreadcrumbLink>
          </BreadcrumbItem>,
          <BreadcrumbSeparator key={`${step}-/`} />,
        ])}
        <BreadcrumbItem><BreadcrumbPage>{here}</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

const long = ["Work", "Identity", "Nordic", "Halden"]

export default function Example() {
  return (
    <div className="grid w-full justify-items-start gap-12">
      <div className="grid justify-items-start gap-3">
        <span className="db-label">Slashes</span>
        <Path steps={["Work", "Identity"]} here="Halden" />
      </div>
      <div className="grid justify-items-start gap-3">
        <span className="db-label">Stack</span>
        <Path variant="stack" steps={["Work", "Identity"]} here="Halden" />
      </div>
      <div className="grid justify-items-start gap-3">
        <span className="db-label">Elide, a long path</span>
        <Path variant="elide" steps={long} here="Wordmark" />
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Path steps={["Work"]} here="Halden" /></State>
      <State label="Pointed at"><Path steps={["Work"]} here="Halden" force="hover" /></State>
      <State label="Stack, pointed at"><Path variant="stack" steps={["Work", "Identity"]} here="Halden" force="hover" /></State>
      <State label="Elided"><Path variant="elide" steps={long} here="Wordmark" /></State>
      <State label="Elide, opened"><Path variant="elide" steps={long} here="Wordmark" open /></State>
    </>
  )
}
