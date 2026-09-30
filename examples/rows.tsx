import { Row, RowKind, RowMeta, RowTitle, Rows } from "@/registry/0db/ui/rows"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <Rows aria-label="Projects">
      <Row href="#halden"><RowTitle>Halden</RowTitle><RowKind>Identity</RowKind><RowMeta>2026</RowMeta></Row>
      <Row href="#northlight"><RowTitle>Northlight</RowTitle><RowKind>Web</RowKind><RowMeta>2026</RowMeta></Row>
      <Row href="#oda-studio"><RowTitle>Oda Studio</RowTitle><RowKind>Identity</RowKind><RowMeta>2025</RowMeta></Row>
      <Row href="#tidewater"><RowTitle>Tidewater</RowTitle><RowKind>Motion</RowKind><RowMeta>2025</RowMeta></Row>
      <Row href="#marram"><RowTitle>Marram</RowTitle><RowKind>Web</RowKind><RowMeta>2025</RowMeta></Row>
    </Rows>
  )
}

export function States() {
  return (
    <>
      <State label="Rest">
        <Rows><Row href="#halden"><RowTitle>Halden</RowTitle><RowKind>Identity</RowKind><RowMeta>2026</RowMeta></Row></Rows>
      </State>
      <State label="Pointed at">
        <Rows><Row href="#halden" data-force="hover"><RowTitle>Halden</RowTitle><RowKind>Identity</RowKind><RowMeta>2026</RowMeta></Row></Rows>
      </State>
      <State label="Not a link">
        <Rows><Row><RowTitle>Halden</RowTitle><RowKind>Identity</RowKind><RowMeta>2026</RowMeta></Row></Rows>
      </State>
    </>
  )
}
