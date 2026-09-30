import { Avatar } from "@/registry/0db/ui/avatar"
import { Button } from "@/registry/0db/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/registry/0db/ui/item"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <ItemGroup className="max-w-[40rem]">
      <Item>
        <ItemMedia><Avatar size="s" alt="Ada Lindqvist" aria-hidden="true" /></ItemMedia>
        <ItemContent>
          <ItemTitle>Ada Lindqvist</ItemTitle>
          <ItemDescription>Design director</ItemDescription>
        </ItemContent>
        <ItemActions><Button variant="quiet">Message</Button></ItemActions>
      </Item>
      <Item>
        <ItemMedia><Avatar size="s" alt="Jonas Berg" aria-hidden="true" /></ItemMedia>
        <ItemContent>
          <ItemTitle>Jonas Berg</ItemTitle>
          <ItemDescription>Type designer</ItemDescription>
        </ItemContent>
        <ItemActions><Button variant="quiet">Message</Button></ItemActions>
      </Item>
      <Item>
        <ItemMedia><Avatar size="s" alt="Mira Okafor" aria-hidden="true" /></ItemMedia>
        <ItemContent>
          <ItemTitle>Mira Okafor</ItemTitle>
          <ItemDescription>Producer</ItemDescription>
        </ItemContent>
        <ItemActions>Since 2021</ItemActions>
      </Item>
    </ItemGroup>
  )
}

export function States() {
  return (
    <>
      <State label="Rest">
        <ItemGroup className="w-72"><Item><ItemContent><ItemTitle>Invoice 0142</ItemTitle></ItemContent><ItemActions>£24,000</ItemActions></Item></ItemGroup>
      </State>
      <State label="Pointed at">
        <ItemGroup className="w-72"><Item data-force="hover"><ItemContent><ItemTitle>Invoice 0142</ItemTitle></ItemContent><ItemActions>£24,000</ItemActions></Item></ItemGroup>
      </State>
    </>
  )
}
