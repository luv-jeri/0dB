import { Corners } from "@/registry/0nlytype/ui/corners"

const tools = [
  ["Type", ["Roman", "Italic", "Small caps"]],
  ["Measure", ["Narrow", "Book", "Wide"]],
  ["Leave", ["Save", "Discard"]],
] as const

const plates = [
  ["01", "Morning, the lake"],
  ["02", "The ferry at noon"],
  ["03", "Birches, late"],
]

export default function Example() {
  return (
    <div className="grid gap-16">
      <Corners className="max-w-[28rem] p-(--ot-space-6)">
        <p className="ot-mf">Halden</p>
        <p className="ot-mp mt-3 text-pretty">A studio for type and silence. Frames a space without closing it.</p>
      </Corners>

      <Corners variant="viewfinder" className="grid max-w-[40rem] grid-cols-3 gap-6 p-(--ot-space-4)">
        {plates.map(([n, name]) => (
          <a key={n} href="#" className="grid gap-2 p-(--ot-space-2) no-underline" style={{ color: "inherit" }}>
            <span className="ot-mf ot-figures">{n}</span>
            <span className="ot-pp">{name}</span>
          </a>
        ))}
      </Corners>

      <Corners variant="glide" role="toolbar" aria-label="Setting" className="flex max-w-[44rem] flex-wrap gap-x-10 gap-y-6 py-(--ot-space-2)">
        {tools.map(([group, names]) => (
          <div key={group} role="group" aria-label={group} className="grid gap-2">
            <span className="ot-pp text-(--ot-pencil)">{group}</span>
            <div className="flex flex-wrap gap-5">
              {names.map((name) => (
                <button key={name} type="button" className="ot-mp disabled:text-(--ot-pencil)" disabled={name === "Discard"}>
                  {name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </Corners>

      <p className="ot-mp max-w-[34rem] text-pretty">
        The note on the studio door says{" "}
        <Corners asChild variant="kagi">
          <q>come in, the kettle is on, and leave your shoes by the stove</q>
        </Corners>{" "}
        and nothing else.
      </p>
    </div>
  )
}
