import type { Metadata } from "next"

import { signs } from "@/registry/0db/lib/sign-shapes"
import { Sign } from "@/registry/0db/ui/sign"
import "@/registry/0db/styles/sign.css"
import "./lab.css"

export const metadata: Metadata = { title: "Signs (preview)", robots: { index: false } }

const variants = [
  { variant: "line", face: "roman", name: "line", note: "The word runs along the strokes. Ours, so roman." },
  { variant: "line", face: "italic", name: "line, italic", note: "The same drawing in the expression italic: a sign for something that belongs to the person." },
  { variant: "fill", face: "roman", name: "fill", note: "The word fills the silhouette, row by row, as a calligram does." },
  { variant: "fill", face: "italic", name: "fill, italic", note: "The silhouette filled in the expression italic." },
] as const

const sizes = ["16px", "20px", "24px", "48px"]

/** A dev-only preview of the first five signs: every variant at four sizes and one large, at rest and said. */
export default function SignsLab() {
  return (
    <main id="content" className="lab-signs">
      <header className="lab-head">
        <h1 className="db-f">Signs</h1>
        <p className="lab-lead">Icons made of their own word. Pretext sets the word along the drawing or through it; point at one, or tab to it, and it says the word. Five signs, two ways of setting, two faces: twenty items.</p>
      </header>
      {variants.map((v) => (
        <section key={v.name} className="lab-set" data-set={v.name}>
          <h2 className="lab-name">{v.name}</h2>
          <p className="lab-note">{v.note}</p>
          <div className="lab-grid">
            <span className="lab-col" />
            {sizes.map((s) => <span key={s} className="lab-col">{s}</span>)}
            <span className="lab-col">120px</span>
            <span className="lab-col">24px, said</span>
            <span className="lab-col">120px, said</span>
            {Object.entries(signs).map(([key, shape]) => (
              <div key={key} className="lab-row" data-sign={key}>
                <span className="lab-key">{key}</span>
                {sizes.map((s) => (
                  <button key={s} type="button" className="lab-hit"><Sign shape={shape} variant={v.variant} face={v.face} size={s} /></button>
                ))}
                <button type="button" className="lab-hit" data-big><Sign shape={shape} variant={v.variant} face={v.face} size="120px" /></button>
                <span className="lab-hit" data-force="hover"><Sign shape={shape} variant={v.variant} face={v.face} size="24px" /></span>
                <span className="lab-hit" data-force="hover" data-big><Sign shape={shape} variant={v.variant} face={v.face} size="120px" /></span>
              </div>
            ))}
          </div>
        </section>
      ))}
      <section className="lab-set" data-set="in-use">
        <h2 className="lab-name">In use</h2>
        <p className="lab-note">Beside a label, with the sign hidden from readers because the label already says it; and alone, where the sign is the label.</p>
        <div className="lab-use">
          <button type="button" className="db-btn" data-variant="quiet"><Sign shape={signs.search} label="" size="20px" /> Search the library</button>
          <button type="button" className="lab-hit"><Sign shape={signs.mail} face="italic" size="24px" /></button>
          <button type="button" className="lab-hit"><Sign shape={signs.close} size="24px" /></button>
          <button type="button" className="lab-hit"><Sign shape={signs["arrow-right"]} size="24px" /></button>
          <button type="button" className="lab-hit"><Sign shape={signs.home} variant="fill" size="24px" /></button>
        </div>
      </section>
    </main>
  )
}
