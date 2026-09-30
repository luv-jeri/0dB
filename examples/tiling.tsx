import { Tile, Tiling } from "@/registry/0db/ui/tiling"
import { State } from "@/components/site/state"

const word = "db-fff font-medium text-(--db-ink)"
const note = "db-pp max-w-[18ch] text-(--db-graphite)"

export default function Example() {
  return (
    <div className="grid w-full gap-(--db-space-9)">
      {/* One sheet after "Less is more.": the headline set a word to a tile, the notes kept to the corners, a large number at the foot. */}
      <Tiling aria-label="Less but better">
        <Tile span={8}>
          <p className={note}>Less noise, more meaning</p>
          <p className={`${word} mt-(--db-space-7)`}>Less</p>
        </Tile>
        <Tile span={4} rows={3} place="end-top">
          <p className={note}>Space does the layout</p>
          <p className="db-p mt-auto max-w-[16ch] text-(--db-ink)">Take something away before adding anything, and the line that is left means more.</p>
        </Tile>
        <Tile span={8} place="start-foot">
          <p className={word}>but</p>
        </Tile>
        <Tile span={8} place="start-foot">
          <p className={word}>better.</p>
        </Tile>
        <Tile span={4} place="start-foot">
          <span aria-hidden="true" className="mb-(--db-space-4) block h-(--db-stroke) w-(--db-space-5) bg-(--db-ink)" />
          <p className={note}>Focus on what matters</p>
        </Tile>
        <Tile span={4}>
          <p className="db-pp text-(--db-graphite)">Clarity<br />Purpose<br />Silence<br />Type</p>
        </Tile>
        <Tile span={4} place="end-foot">
          <p className="db-ff font-light tabular-nums text-(--db-ink)">01</p>
        </Tile>
      </Tiling>
      {/* crosses: the same space, no lines, a registration cross at every corner. */}
      <Tiling variant="crosses" aria-label="Services">
        {[
          ["Identity", "Names, marks, and the rules that keep them from drifting."],
          ["Websites", "Built to be read slowly and used for years."],
          ["Motion", "Titles that move once, and mean it."],
        ].map(([name, body]) => (
          <Tile key={name}>
            <p className="db-mf font-light text-(--db-ink)">{name}</p>
            <p className="db-p mt-(--db-space-3) max-w-[26ch] text-(--db-graphite)">{body}</p>
          </Tile>
        ))}
      </Tiling>
    </div>
  )
}

const cells = (n: number) =>
  Array.from({ length: n }, (_, i) => (
    <Tile key={i} span={i === 0 ? 8 : 4} place={i % 2 ? "end-foot" : "start-top"}>
      <span className="db-pp tabular-nums text-(--db-graphite)">{String(i + 1).padStart(2, "0")}</span>
    </Tile>
  ))

export function States() {
  return (
    <>
      <State label="Rules">
        <Tiling className="w-[26rem] max-w-full">{cells(5)}</Tiling>
      </State>
      <State label="Crosses">
        <div className="max-w-full p-(--db-space-5)">
          <Tiling variant="crosses" className="w-[26rem] max-w-full">{cells(5)}</Tiling>
        </div>
      </State>
      <State label="One row, no lines outside">
        <Tiling className="w-[26rem] max-w-full">
          {["01", "02"].map((n) => (
            <Tile key={n} span={6}>
              <span className="db-pp tabular-nums text-(--db-graphite)">{n}</span>
            </Tile>
          ))}
        </Tiling>
      </State>
      <State label="Right to left">
        <Tiling dir="rtl" className="w-[26rem] max-w-full">{cells(5)}</Tiling>
      </State>
    </>
  )
}
