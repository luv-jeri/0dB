import { Corners } from "@/registry/0db/ui/corners"

export default function Example() {
  return (
    <Corners className="max-w-[28rem] p-(--db-space-6)">
      <p className="db-mf">Halden</p>
      <p className="db-mp mt-3 text-pretty">A studio for type and silence. Frames a space without closing it.</p>
    </Corners>
  )
}
