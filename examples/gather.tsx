import { Gather } from "@/registry/0db/ui/gather"
import { Prose } from "@/registry/0db/ui/typography"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid gap-12">
      <Gather as="h2" className="db-f">
        Everything settles in the end.
      </Gather>
      <Gather as="h3" variant="forme" className="db-mf">
        Set backwards, printed forwards.
      </Gather>
      <Gather as="h3" variant="coil" className="db-mf">
        A line wound up, let out.
      </Gather>
      <Gather as="h3" by="word" scrub className="db-mf">
        Word by word, only as fast as you read.
      </Gather>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Heading">
        <Gather as="h3" className="db-mf" style={{ width: "16rem", maxWidth: "100%" }}>
          Nothing is lost, only set down.
        </Gather>
      </State>
      <State label="Paragraph">
        <Gather className="db-mp" style={{ width: "16rem", maxWidth: "100%" }}>
          Point at it before it has arrived and it comes to you.
        </Gather>
      </State>
      <State label="Forme">
        <Gather variant="forme" className="db-mp" style={{ width: "16rem", maxWidth: "100%" }}>
          The type reads backwards until it is printed.
        </Gather>
      </State>
      <State label="Coil">
        <Gather variant="coil" className="db-mp" style={{ width: "16rem", maxWidth: "100%" }}>
          Each row unwinds from where it starts.
        </Gather>
      </State>
      <State label="By word">
        <Gather by="word" className="db-mp" style={{ width: "16rem", maxWidth: "100%" }}>
          Less noise, and every word in its place.
        </Gather>
      </State>
      <State label="By line">
        <Gather by="line" variant="forme" className="db-mp" style={{ width: "16rem", maxWidth: "100%" }}>
          Each line is cast whole, a slug of type, and turned to be read.
        </Gather>
      </State>
      <State label="Scrub">
        <Gather scrub className="db-mp" style={{ width: "16rem", maxWidth: "100%" }}>
          Stop scrolling and the letters stop with you.
        </Gather>
      </State>
      <State label="Scrub, by word">
        <Gather by="word" scrub className="db-mp" style={{ width: "16rem", maxWidth: "100%" }}>
          Scroll back and the words let go, one by one, the way they came.
        </Gather>
      </State>
      <State label="Prose headings">
        <Prose style={{ width: "20rem", maxWidth: "100%" }}>
          <Gather as="h3">The quiet between notes</Gather>
          <p>A heading in an article settles as you reach it; the paragraph under it is already there to be read.</p>
        </Prose>
      </State>
    </>
  )
}
