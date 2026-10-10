import { Skeleton, SkeletonLine, SkeletonRing, type SkeletonProps } from "@/registry/0nlytype/ui/skeleton"
import { State } from "@/components/site/state"

// A headline and a paragraph that ends short, as a real one does.
const lines = (variant?: SkeletonProps["variant"]) => (
  <Skeleton variant={variant}>
    <SkeletonLine width="38%" height="2.8em" index={0} />
    <SkeletonLine width="94%" index={1} />
    <SkeletonLine width="88%" index={2} />
    <SkeletonLine width="56%" index={3} />
  </Skeleton>
)

const variants = ["baseline", "metrics", "words"] as const

export default function Example() {
  return (
    <div aria-busy="true" className="grid w-[min(36rem,100%)] gap-(--ot-space-8)">
      {variants.map((v) => (
        <div key={v} className="grid gap-4">
          <span className="ot-label">{v}</span>
          {lines(v)}
        </div>
      ))}
    </div>
  )
}

export function States() {
  return (
    <>
      {variants.map((v) => (
        <State key={`${v}-rest`} label={`${v[0].toUpperCase()}${v.slice(1)}, at rest`}>
          <div style={{ width: "16rem" }}>{lines(v)}</div>
        </State>
      ))}
      {variants.map((v) => (
        <State key={`${v}-busy`} label="Loading">
          <div aria-busy="true" style={{ width: "16rem" }}>{lines(v)}</div>
        </State>
      ))}
      <State label="Ring"><SkeletonRing /></State>
    </>
  )
}
