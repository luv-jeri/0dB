import { Meta, MetaItem } from "@/registry/0db/ui/meta"

export default function Example() {
  return (
    <div className="grid gap-12">
      <Meta>
        <span>Halden index</span>
        <span>Version 0.1</span>
        <span>September 2026</span>
      </Meta>
      <Meta variant="proportional" at={[2014, 2016, 2021, 2026]}>
        <span>Founded 2014</span>
        <span>Oslo 2016</span>
        <span>Kyoto 2021</span>
        <span>Now</span>
      </Meta>
      <Meta variant="credits">
        <MetaItem label="Format">18 × 25.7 cm</MetaItem>
        <MetaItem label="Pages">224</MetaItem>
        <MetaItem label="Set in">Archivo, Bodoni Moda</MetaItem>
        <MetaItem label="Printed">Oslo, 2026</MetaItem>
      </Meta>
    </div>
  )
}
