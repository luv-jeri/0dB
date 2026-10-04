import { TextDiff } from "@/registry/0db/ui/text-diff"
import { State } from "@/components/site/state"

export default function Example() {
  return <TextDiff className="w-full max-w-2xl" original="We make things look good. Every project begins with a layout." revised="We make things mean something. Every project begins with a question." />
}

export function States() {
  const text = { original: "Less noise. More decoration.", revised: "Less noise. More meaning." }
  return <>
    <State label="Proof"><TextDiff className="w-72" {...text} view="changes" /></State>
    <State label="Original"><TextDiff className="w-72" {...text} view="original" /></State>
    <State label="Revised"><TextDiff className="w-72" {...text} view="revised" /></State>
    <State label="Nothing changed"><TextDiff className="w-72" original="Let it stand." revised="Let it stand." /></State>
    <State label="RTL proof"><TextDiff className="w-72" dir="rtl" original="نص قديم" revised="نص جديد" /></State>
  </>
}
