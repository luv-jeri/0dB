import { Note } from "@/registry/0db/ui/note"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <p className="db-mp" style={{ maxWidth: "36ch", paddingBottom: "9rem" }}>
      The voice is{" "}
      <Note note="A grotesque from Omnibus-Type, variable in width and weight. It says everything the interface says.">
        Archivo
      </Note>
      , and the expression is{" "}
      <Note note="Owen Earl's revival of the types Giambattista Bodoni cut in Parma around 1798. Optical sizes keep its hairlines alive from 6 to 96 points.">
        Bodoni Moda
      </Note>
      .
    </p>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Note note="A grotesque from Omnibus-Type.">Archivo</Note></State>
      <State label="Pointed at">
        <span style={{ display: "block", paddingBottom: "7rem" }}>
          <Note note="A grotesque from Omnibus-Type." data-force="hover">Archivo</Note>
        </span>
      </State>
    </>
  )
}
