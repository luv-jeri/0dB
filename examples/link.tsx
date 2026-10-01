import { Link } from "@/registry/0db/ui/link"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid gap-10">
      <p className="db-mp max-w-[36rem]">
        The work is led by <Link href="#">Ada Lindqvist</Link>, and the reading list sits with{" "}
        <Link href="https://example.com" external>
          the Halden archive
        </Link>
        .
      </p>
      <p className="db-p max-w-[36rem]">
        The grid follows the <Link href="#" variant="reference">Swiss school</Link>, the pairs follow a type{" "}
        <Link href="#" variant="reference">specimen</Link> of 1923, and the pauses follow the <Link href="#" variant="reference">score</Link>.
      </p>
      <ul className="db-p grid gap-2">
        <li><Link href="mailto:studio@example.com" variant="address">Write to the studio</Link></li>
        <li><Link href="https://example.com/halden/" variant="address" external>Read the archive</Link></li>
      </ul>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Link href="#">Ada Lindqvist</Link></State>
      <State label="Pointed at"><Link href="#" data-force="hover">Ada Lindqvist</Link></State>
      <State label="Focus"><Link href="#" data-force="focus">Ada Lindqvist</Link></State>
      <State label="Pressed"><Link href="#" data-force="hover press">Ada Lindqvist</Link></State>
      <State label="Read"><Link href="#" data-force="visited">Ada Lindqvist</Link></State>
      <State label="External"><Link href="https://example.com" external>Halden archive</Link></State>
      <State label="Quiet"><Link href="#" variant="quiet">Ada Lindqvist</Link></State>
      <State label="Reference"><Link href="#" variant="reference">Swiss school</Link></State>
      <State label="Reference, pointed at"><Link href="#" variant="reference" data-force="hover">Swiss school</Link></State>
      <State label="Address"><Link href="mailto:studio@example.com" variant="address">Write to us</Link></State>
      <State label="Address, pointed at"><Link href="mailto:studio@example.com" variant="address" data-force="hover">Write to us</Link></State>
    </>
  )
}
