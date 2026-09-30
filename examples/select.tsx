import { Select } from "@/registry/0db/ui/select"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid gap-6">
      <Select label="Sort by" defaultValue="newest">
        <option>newest</option>
        <option>oldest</option>
        <option>name</option>
      </Select>
      <p className="db-mp text-[color:var(--db-graphite)]">
        <Select label="Show" aria-label="Which projects">
          <option>all</option>
          <option>identity</option>
          <option>web</option>
          <option>motion</option>
        </Select>{" "}
        projects from{" "}
        <Select aria-label="Year">
          <option>2026</option>
          <option>2025</option>
          <option>2024</option>
        </Select>
      </p>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest">
        <Select label="Sort by"><option>newest</option><option>oldest</option></Select>
      </State>
      <State label="Pointed at">
        <Select label="Sort by" data-force="hover"><option>newest</option><option>oldest</option></Select>
      </State>
      <State label="Disabled">
        <Select label="Sort by" disabled><option>newest</option><option>oldest</option></Select>
      </State>
    </>
  )
}
