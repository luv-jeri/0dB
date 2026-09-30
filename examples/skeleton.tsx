import { Skeleton, SkeletonLine, SkeletonRing } from "@/registry/0db/ui/skeleton"
import { State } from "@/components/site/state"

const lines = (
  <Skeleton>
    <SkeletonLine width="38%" height="2.8em" index={0} />
    <SkeletonLine width="94%" index={1} />
    <SkeletonLine width="88%" index={2} />
    <SkeletonLine width="56%" index={3} />
  </Skeleton>
)

export default function Example() {
  return (
    <div aria-busy="true" style={{ width: "min(36rem, 100%)" }}>
      {lines}
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="At rest"><div style={{ width: "16rem" }}>{lines}</div></State>
      <State label="Loading"><div aria-busy="true" style={{ width: "16rem" }}>{lines}</div></State>
      <State label="Ring"><SkeletonRing /></State>
    </>
  )
}
