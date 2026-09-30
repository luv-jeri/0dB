import { Link } from "@/registry/0db/ui/link"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <p className="db-mp max-w-[36rem]">
      The work is led by <Link href="#">Ada Lindqvist</Link>, and the reading list sits with{" "}
      <Link href="https://example.com" external>
        the Halden archive
      </Link>
      .
    </p>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Link href="#">Ada Lindqvist</Link></State>
      <State label="Pointed at"><Link href="#" data-force="hover">Ada Lindqvist</Link></State>
      <State label="Focus"><Link href="#" data-force="focus">Ada Lindqvist</Link></State>
    </>
  )
}
