import type { Metadata } from "next"

import { Measure } from "@/registry/0db/ui/measure"
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
      <section className="doc-section" aria-labelledby="measure-h">
        <h2 id="measure-h">The measure</h2>
        <p className="doc-lead">Silence starts at the line. Drag its edge, or focus it and use the arrow keys: body text reads best between forty-five and seventy-five characters.</p>
        <Measure>
          A line that runs too long loses the eye on its way back to the next one, and a line that runs too short breaks the sentence before it can breathe. Somewhere between them the
          reading goes quiet: you stop noticing the lines and only hear what they say. 0dB sets its body text there, at sixty-two characters, and leaves the rest of the page to space.
        </Measure>
      </section>
      <section className="doc-section" aria-labelledby="conv-h">
        <h2 id="conv-h">Conventions</h2>
        <Prose dangerouslySetInnerHTML={{ __html: sectionHTML("Conventions") }} />
      </section>
    </>
  )
}
