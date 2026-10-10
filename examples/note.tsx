import { Note } from "@/registry/0nlytype/ui/note"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid justify-items-start" style={{ gap: "var(--db-space-6)" }}>
      <p className="db-mp" style={{ maxWidth: "36ch", paddingBottom: "9rem", margin: 0 }}>
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
      <p className="db-mp" style={{ maxWidth: "36ch", margin: 0 }}>
        The italic is <Note variant="ossia" note="Parma, 1798">Bodoni Moda</Note>, and it speaks for you; the upright is{" "}
        <Note variant="ossia" note="Omnibus-Type">Archivo</Note>, and it speaks for us.
      </p>
      <p className="db-mp" style={{ maxWidth: "36ch", margin: 0 }}>
        Every colour clears <Note variant="expand" note="Web Content Accessibility Guidelines">WCAG</Note> AA on its paper, and the
        specimen prints to <Note variant="expand" note="Portable Document Format">PDF</Note> as it stands.
      </p>
      <p className="db-mp" style={{ maxWidth: "36ch", margin: 0 }}>
        Every page needs <Note variant="revise" note="less">more</Note>. Space does the <Note variant="revise" note="layout">decoration</Note>.
      </p>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Note note="A variable grotesque.">Archivo</Note></State>
      <State label="Pointed at">
        <span style={{ display: "block", paddingBottom: "7rem" }}>
          <Note note="A variable grotesque." data-force="hover">Archivo</Note>
        </span>
      </State>
      <State label="Ossia"><span className="db-mp"><Note variant="ossia" note="Omnibus-Type">Archivo</Note></span></State>
      <State label="Ossia, pointed at"><span className="db-mp"><Note variant="ossia" note="Omnibus-Type" data-force="hover">Archivo</Note></span></State>
      <State label="Expand"><span className="db-mp"><Note variant="expand" note="Portable Document Format">PDF</Note></span></State>
      <State label="Expand, pointed at"><span className="db-mp"><Note variant="expand" note="Portable Document Format" data-force="hover">PDF</Note></span></State>
      <State label="Revise"><span className="db-mp"><Note variant="revise" note="less">more</Note></span></State>
      <State label="Revise, pointed at"><span className="db-mp"><Note variant="revise" note="less" data-force="hover">more</Note></span></State>
      <State label="Revise, pressed"><span className="db-mp"><Note variant="revise" note="less" data-force="open">more</Note></span></State>
      <State label="Revise, right to left"><span className="db-mp" dir="rtl" lang="ar"><Note variant="revise" note="أقل" data-force="open">أكثر</Note></span></State>
      <State label="Expand, open"><span className="db-mp"><Note variant="expand" note="Portable Document Format" data-force="open">PDF</Note></span></State>
    </>
  )
}
