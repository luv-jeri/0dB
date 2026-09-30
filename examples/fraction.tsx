import { Fraction } from "@/registry/0db/ui/fraction"

export default function Example() {
  return (
    <p className="flex items-baseline gap-3">
      <Fraction count={2} total={5} />
      <span className="db-p">done</span>
    </p>
  )
}
