import {
  Collapsible,
  CollapsibleContent,
  CollapsibleList,
  CollapsibleTrigger,
} from "@/registry/0db/ui/collapsible"

export default function Example() {
  return (
    <div style={{ maxWidth: "30rem" }}>
      <CollapsibleList>
        <li>Halden</li>
        <li>Northlight</li>
        <li>Oda Studio</li>
      </CollapsibleList>
      <Collapsible>
        <CollapsibleTrigger openLabel="Hide these 4">and 4 more</CollapsibleTrigger>
        <CollapsibleContent>
          <CollapsibleList>
            <li>Tidewater</li>
            <li>Marram</li>
            <li>Quiet Hours</li>
            <li>Felt &amp; Field</li>
          </CollapsibleList>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
