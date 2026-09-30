import { Marquee } from "@/registry/0db/ui/marquee"
import { State } from "@/components/site/state"

const words = ["Silence", "Space", "Type", "Rest", "Line", "Measure"]

export default function Example() {
  return (
    <div className="grid gap-y-16">
      <Marquee className="db-fff" label="What the page is made of">
        {words.map((w) => <span key={w}>{w}</span>)}
      </Marquee>
      <Marquee variant="ticker" label="Index">
        {["New era", "Of silence", "Oslo 2026", "Set in Archivo", "Printed on paper", "Read slowly"].map((w) => <span key={w}>{w}</span>)}
      </Marquee>
      <Marquee variant="counter" className="db-fff" label="Both ways">
        {["Spectra", "Point", "Dust", "Hush"].map((w) => <span key={w}>{w}</span>)}
      </Marquee>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Autoplaying">
        <Marquee className="db-f" label="Words" style={{ width: "20rem", maxWidth: "100%" }}>
          {words.map((w) => <span key={w}>{w}</span>)}
        </Marquee>
      </State>
      <State label="Paused">
        <Marquee defaultPaused className="db-f" label="Paused words" style={{ width: "20rem", maxWidth: "100%" }}>
          {words.map((w) => <span key={w}>{w}</span>)}
        </Marquee>
      </State>
      <State label="Reduced motion">
        <Marquee data-force="reduced" className="db-f" label="Still words" style={{ width: "20rem", maxWidth: "100%" }}>
          {words.map((w) => <span key={w}>{w}</span>)}
        </Marquee>
      </State>
      <State label="Scroll only">
        <Marquee autoplay={false} className="db-f" label="Scroll words" style={{ width: "20rem", maxWidth: "100%" }}>
          {words.map((w) => <span key={w}>{w}</span>)}
        </Marquee>
      </State>
      <State label="Reverse">
        <Marquee className="db-f" reverse label="Words, backwards" style={{ width: "20rem", maxWidth: "100%" }}>
          {words.map((w) => <span key={w}>{w}</span>)}
        </Marquee>
      </State>
      <State label="Ticker">
        <Marquee variant="ticker" label="Index" style={{ width: "20rem", maxWidth: "100%" }}>
          {["Plate 04", "Oslo", "2026", "Archivo"].map((w) => <span key={w}>{w}</span>)}
        </Marquee>
      </State>
      <State label="Counter">
        <Marquee variant="counter" className="db-f" label="Both ways" style={{ width: "20rem", maxWidth: "100%" }}>
          {words.map((w) => <span key={w}>{w}</span>)}
        </Marquee>
      </State>
      <State label="Right to left">
        <Marquee dir="rtl" className="db-f" label="كلمات" style={{ width: "20rem", maxWidth: "100%" }}>
          {["صمت", "مساحة", "خط", "راحة"].map((w) => <span key={w}>{w}</span>)}
        </Marquee>
      </State>
    </>
  )
}
