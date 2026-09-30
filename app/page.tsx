import NextLink from "next/link"

import { Overture } from "@/components/site/overture"
import { Button } from "@/registry/0db/ui/button"
import { Link } from "@/registry/0db/ui/link"
import { principles } from "@/lib/site/principles"

export default function Home() {
  return (
    <main id="content" className="page">
      <Overture />
      <div className="overture-foot">
        <Button variant="statement" asChild><NextLink href="/docs/">Read the docs</NextLink></Button>
        <Link asChild><NextLink href="/docs/install/">Install it</NextLink></Link>
        <Link href="/specimen/">See the specimen</Link>
      </div>
      <section className="principles" aria-labelledby="principles">
        <h2 id="principles" className="db-sr">Principles</h2>
        {principles.map((p, i) => (
          <div className="principle" key={i}>
            <h3 className="principle-text stave">{p.text}</h3>
            <p className="principle-note margin">{p.note}</p>
          </div>
        ))}
      </section>
      <p className="fine" lang="it">Fine.</p>
    </main>
  )
}
