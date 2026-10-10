import { Avatar } from "@/registry/0nlytype/ui/avatar"
import { Button } from "@/registry/0nlytype/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/registry/0nlytype/ui/item"
import { State } from "@/components/site/state"

const faces: [string, number][] = [
  ["Akzidenz-Grotesk", 1898], ["Futura", 1927], ["Gill Sans", 1928], ["Times New Roman", 1932], ["Helvetica", 1957], ["Univers", 1957],
  ["Optima", 1958], ["Frutiger", 1976], ["Avenir", 1988], ["Meta", 1991], ["Archivo", 2016], ["Bodoni Moda", 2020],
]

const projects: [string, string, number][] = [
  ["Northlight", "A wayfinding site for a lighthouse trust on the Norwegian coast, in two languages and one typeface", 2026],
  ["Tidewater", "Motion titles", 2025],
  ["Halden", "An identity for a small press: a wordmark, a colophon and the covers of its first twelve books", 2026],
  ["Marram", "A web shop for dune grasses", 2025],
]

export default function Example() {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)] justify-items-start gap-12">
      <div className="grid w-full justify-items-start gap-3">
        <span className="ot-label">Leader</span>
        <Leader />
      </div>
      <div className="grid w-full justify-items-start gap-3">
        <span className="ot-label">Lineation</span>
        <ItemGroup variant="lineation" aria-label="Typefaces in the studio" className="w-full max-w-[40rem]">
          {faces.map(([name, year]) => (
            <Item key={name}>
              <ItemContent><ItemTitle>{name}</ItemTitle></ItemContent>
              <ItemActions>{year}</ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </div>
      <div className="grid w-full justify-items-start gap-3">
        <span className="ot-label">Words</span>
        <ItemGroup variant="words" aria-label="Projects" className="w-full max-w-[40rem]">
          {projects.map(([name, about, year]) => (
            <Item key={name}>
              <ItemContent>
                <ItemTitle>{name}</ItemTitle>
                <ItemDescription>{about}</ItemDescription>
              </ItemContent>
              <ItemActions>{year}</ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </div>
    </div>
  )
}

function Leader() {
  return (
    <ItemGroup className="w-full max-w-[40rem]">
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
      <State label="Lineation, the fifth line">
        <ItemGroup variant="lineation" className="w-72">
          {faces.slice(0, 5).map(([name, year]) => <Item key={name}><ItemContent><ItemTitle>{name}</ItemTitle></ItemContent><ItemActions>{year}</ItemActions></Item>)}
        </ItemGroup>
      </State>
      <State label="Lineation, pointed at">
        <ItemGroup variant="lineation" className="w-72">
          <Item data-force="hover"><ItemContent><ItemTitle>Futura</ItemTitle></ItemContent><ItemActions>1927</ItemActions></Item>
        </ItemGroup>
      </State>
      <State label="Words, running out">
        <ItemGroup variant="words" className="w-72">
          <Item><ItemContent><ItemTitle>Halden</ItemTitle><ItemDescription>{projects[2][1]}</ItemDescription></ItemContent><ItemActions>2026</ItemActions></Item>
        </ItemGroup>
      </State>
      <State label="Words, pointed at">
        <ItemGroup variant="words" className="w-72">
          <Item data-force="hover"><ItemContent><ItemTitle>Tidewater</ItemTitle><ItemDescription>Motion titles</ItemDescription></ItemContent><ItemActions>2025</ItemActions></Item>
        </ItemGroup>
      </State>
    </>
  )
}
