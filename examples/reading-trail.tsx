import { State } from "@/components/site/state"
import { ReadingTrail, type TrailSection } from "@/registry/0nlytype/ui/reading-trail"

const sections: (TrailSection & { text: string[] })[] = [
  {
    id: "trail-measure",
    name: "The measure",
    text: [
      "A line of text is read in one breath of the eye. Set it too long and the eye loses its way back to the start of the next; too short, and it spends its time turning. Between forty-five and seventy-five characters, the eye runs out just as the line does.",
      "The measure is set before the size. Choose how wide the column is, then find the size that fills it with about sixty characters, and let the margins take whatever is left.",
    ],
  },
  {
    id: "trail-leading",
    name: "Leading",
    text: [
      "The space between lines is named for the strips of lead a compositor laid between rows of type. A longer measure wants more of it, so the eye can find its way back along the gap; a short one can be set nearly solid.",
      "Body text at seventeen pixels reads well at about one and a half times its size. Headings, being short and large, want much less, or their lines drift apart and stop reading as one thought.",
    ],
  },
  {
    id: "trail-rag",
    name: "The rag",
    text: [
      "Set flush left, the right edge of a column is ragged, and its shape is part of the page. A good rag moves gently in and out; a bad one makes wedges and steps that the eye stops to look at.",
      "Hyphenation softens it, and so does leaving the last word of a sentence on the line it belongs to. The browser can balance a heading's lines for you, and keep the last line of a paragraph from standing alone.",
    ],
  },
  {
    id: "trail-widows",
    name: "Widows and orphans",
    text: [
      "A widow is the last line of a paragraph left alone at the top of a column; an orphan is the first line left alone at the foot. Both break the paragraph's shape where the reader turns, which is where they notice.",
      "On a screen there are no pages to turn, but the same care holds at a column's end, above a picture, or where a section begins.",
    ],
  },
  {
    id: "trail-colophon",
    name: "Colophon",
    text: [
      "Set in Archivo and Bodoni Moda. The trail beside it reads the page as you scroll: the section you are in carries the accent, and its leader inks as you read it.",
    ],
  },
]

export default function Example() {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)] items-start gap-x-16 gap-y-10 md:grid-cols-[minmax(0,1fr)_15rem]">
      <ReadingTrail sections={sections} className="md:sticky md:top-24 md:col-start-2 md:row-start-1" />
      <article className="ot-prose md:col-start-1 md:row-start-1">
        {sections.map((s) => (
          <section key={s.id}>
            <h3 id={s.id}>{s.name}</h3>
            {s.text.map((t) => (
              <p key={t.slice(0, 16)}>{t}</p>
            ))}
          </section>
        ))}
      </article>
    </div>
  )
}

const short = sections.map(({ id, name }) => ({ id: `${id}-s`, name }))
const wide = { width: "17rem", maxWidth: "100%" }

export function States() {
  return (
    <>
      <State label="At the start"><div style={wide}><ReadingTrail sections={short} pinned={{ now: 0, read: 0.1 }} /></div></State>
      <State label="Reading the third"><div style={wide}><ReadingTrail sections={short} pinned={{ now: 2, read: 0.55 }} /></div></State>
      <State label="Pointed at"><div style={wide}><ReadingTrail sections={short} pinned={{ now: 2, read: 0.55 }} data-force="hover" /></div></State>
      <State label="Right to left"><div style={wide} dir="rtl"><ReadingTrail sections={short} pinned={{ now: 1, read: 0.4 }} /></div></State>
    </>
  )
}
