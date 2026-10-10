import { ScrollExpand } from "@/registry/0nlytype/ui/scroll-expand"
import { State } from "@/components/site/state"

function Plate({ small = false }: { small?: boolean }) {
  return (
    <div className="grid gap-(--ot-space-5) py-(--ot-space-6)">
      <p className={small ? "ot-f" : "ot-fff"} style={{ margin: 0 }}>
        Space
        <br />
        does the
        <br />
        layout.
      </p>
      <p className="ot-pp max-w-[18rem] justify-self-end text-pretty" style={{ margin: 0, color: "var(--ot-pencil)" }}>
        A hairline appears only where space alone can&rsquo;t hold two things apart.
      </p>
    </div>
  )
}

export default function Example() {
  return (
    <div className="grid w-full gap-(--ot-space-9)">
      <p className="ot-pp" style={{ margin: 0, color: "var(--ot-pencil)" }}>Scroll down: the plates open as far as you go, and close when you go back.</p>
      <ScrollExpand caption={["Plate 01", "Principles, the first"]}>
        <Plate />
      </ScrollExpand>
      <ScrollExpand variant="horizon" caption={["Plate 02", "From the horizon"]}>
        <Plate />
      </ScrollExpand>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Shut, a mark"><ScrollExpand progress={0} caption={["Plate 01", "Shut"]} className="w-[22rem] max-w-full"><Plate small /></ScrollExpand></State>
      <State label="Half open"><ScrollExpand progress={0.5} caption={["Plate 01", "Half"]} className="w-[22rem] max-w-full"><Plate small /></ScrollExpand></State>
      <State label="Open"><ScrollExpand progress={1} caption={["Plate 01", "Open"]} className="w-[22rem] max-w-full"><Plate small /></ScrollExpand></State>
      <State label="Horizon, shut"><ScrollExpand variant="horizon" progress={0} caption={["Plate 02", "Shut"]} className="w-[22rem] max-w-full"><Plate small /></ScrollExpand></State>
      <State label="Horizon, half open"><ScrollExpand variant="horizon" progress={0.5} caption={["Plate 02", "Half"]} className="w-[22rem] max-w-full"><Plate small /></ScrollExpand></State>
    </>
  )
}
