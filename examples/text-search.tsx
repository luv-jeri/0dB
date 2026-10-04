import { TextSearch } from "@/registry/0db/ui/text-search"
import { State } from "@/components/site/state"

const passage = "Silence gives the next word its weight. A silence between two ideas is different from the silence inside one idea. We set those distances before we set a line."

export default function Example() {
  return <TextSearch className="w-full max-w-2xl" text={passage} defaultQuery="silence" />
}

export function States() {
  return <>
    <State label="No query"><TextSearch className="w-72" text="The words remain in their context." /></State>
    <State label="No matches"><TextSearch className="w-72" text={passage} query="colour" /></State>
    <State label="Literal punctuation"><TextSearch className="w-72" text="Use (space), not a box. Keep (space)." query="(space)" /></State>
    <State label="RTL matches"><TextSearch className="w-72" dir="rtl" label="ابحث في النص" text="صمت بين الكلمات. صمت بين الأفكار." defaultQuery="صمت" /></State>
  </>
}
