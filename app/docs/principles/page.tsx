import type { Metadata } from "next"

import { Prose } from "@/registry/0db/ui/typography"
import { sectionHTML } from "@/lib/site/design-md"

export const metadata: Metadata = {
  title: "Principles",
  description: "The five rules every 0dB item follows.",
}

export default function Principles() {
  return (
    <>
      <header className="doc-head">
        <h1 className="doc-title">Principles</h1>
        <p className="doc-summary">Five rules. When an item is in doubt, it asks these, in this order.</p>
      </header>
      <section className="doc-section" aria-label="The rules">
        <Prose dangerouslySetInnerHTML={{ __html: sectionHTML("Principles") }} />
      </section>
      <section className="doc-section" aria-labelledby="conv-h">
        <h2 id="conv-h">Conventions</h2>
        <Prose dangerouslySetInnerHTML={{ __html: sectionHTML("Conventions") }} />
      </section>
    </>
  )
}
