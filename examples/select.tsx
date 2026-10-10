import { Select } from "@/registry/0nlytype/ui/select"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid gap-12">
      <div className="grid gap-6">
        <span className="ot-label">underline</span>
        <Select label="Sort by" defaultValue="newest">
          <option>newest</option>
          <option>oldest</option>
          <option>name</option>
        </Select>
        <p className="ot-mp text-[color:var(--ot-graphite)]">
          <Select label="Show" aria-label="Which projects">
            <option>all</option>
            <option>identity</option>
            <option>web</option>
            <option>motion</option>
          </Select>{" "}
          work from{" "}
          <Select aria-label="Year">
            <option>2026</option>
            <option>2025</option>
            <option>2024</option>
          </Select>
        </p>
      </div>
      <div className="grid gap-6">
        <span className="ot-label">compose</span>
        <Select label="Sort by" variant="compose" defaultValue="newest">
          <option>newest</option>
          <option>oldest</option>
          <option>latest</option>
          <option>name</option>
        </Select>
        <p className="ot-mp text-[color:var(--ot-graphite)]">
          Send it{" "}
          <Select aria-label="When to send" variant="compose" defaultValue="tonight">
            <option>now</option>
            <option>tonight</option>
            <option>tomorrow</option>
            <option>on Monday</option>
          </Select>
        </p>
      </div>
      <div className="grid gap-6">
        <span className="ot-label">ruby</span>
        <Select label="Set in" variant="ruby" defaultValue="Bodoni">
          <option>Bodoni</option>
          <option>Garamond</option>
          <option>Caslon</option>
        </Select>
        <p className="ot-mp text-[color:var(--ot-graphite)]">
          Reply{" "}
          <Select aria-label="How to reply" variant="ruby" defaultValue="by email">
            <option>by email</option>
            <option>by phone</option>
            <option>in person</option>
          </Select>{" "}
          this week
        </p>
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      {(["underline", "compose", "ruby"] as const).flatMap((variant) => [
        <State key={`${variant}-rest`} label={`${variant}, rest`}>
          <Select label="Sort by" variant={variant}><option>newest</option><option>oldest</option><option>name</option></Select>
        </State>,
        <State key={`${variant}-hover`} label={`${variant}, pointed at`}>
          <Select label="Sort by" variant={variant} data-force="hover"><option>newest</option><option>oldest</option><option>name</option></Select>
        </State>,
        <State key={`${variant}-off`} label={`${variant}, disabled`}>
          <Select label="Sort by" variant={variant} disabled><option>newest</option><option>oldest</option><option>name</option></Select>
        </State>,
      ])}
    </>
  )
}
