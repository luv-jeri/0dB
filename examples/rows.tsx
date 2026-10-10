import { Row, RowKind, RowMeta, RowTitle, Rows, type RowsProps } from "@/registry/0nlytype/ui/rows"
import { State } from "@/components/site/state"

const work = [
  ["Halden", "Identity", "2026"],
  ["Northlight", "Web", "2026"],
  ["Oda Studio", "Identity", "2025"],
  ["Tidewater", "Motion", "2025"],
  ["Marram", "Web", "2025"],
]

// By year, then kind: the order a ledger keeps, so the repeats fall together.
const byYear = [
  ["Halden", "Identity", "2026"],
  ["Kestrel", "Identity", "2026"],
  ["Northlight", "Web", "2026"],
  ["Oda Studio", "Web", "2025"],
  ["Marram", "Web", "2025"],
  ["Tidewater", "Motion", "2025"],
]

function Index({ variant, label, here, rows = work }: { variant?: RowsProps["variant"]; label: string; here?: string; rows?: string[][] }) {
  return (
    <Rows variant={variant} aria-label={label}>
      {rows.map(([title, kind, year]) => (
        <Row key={title} href={`#${title.toLowerCase().replace(" ", "-")}`} aria-current={title === here ? "page" : undefined}>
          <RowTitle>{title}</RowTitle><RowKind>{kind}</RowKind><RowMeta>{year}</RowMeta>
        </Row>
      ))}
    </Rows>
  )
}

export default function Example() {
  return (
    <div className="grid w-full" style={{ gap: "var(--db-space-7)" }}>
      <Index label="Projects" />
      <div className="grid gap-3">
        <span className="db-label">Ditto</span>
        <Index variant="ditto" label="Projects by year" rows={byYear} />
      </div>
      <div className="grid gap-3">
        <span className="db-label">Trail: open one, and its ring fills</span>
        <Index variant="trail" label="Projects you have seen" here="Oda Studio" />
      </div>
    </div>
  )
}

const one = (props: { force?: string; current?: boolean }) => (
  <Row href="#halden" data-force={props.force} aria-current={props.current ? "page" : undefined}>
    <RowTitle>Halden</RowTitle><RowKind>Identity</RowKind><RowMeta>2026</RowMeta>
  </Row>
)

export function States() {
  return (
    <>
      <State label="Rest"><Rows>{one({})}</Rows></State>
      <State label="Pointed at"><Rows>{one({ force: "hover" })}</Rows></State>
      <State label="Not a link">
        <Rows><Row><RowTitle>Halden</RowTitle><RowKind>Identity</RowKind><RowMeta>2026</RowMeta></Row></Rows>
      </State>
      <State label="Ditto">
        <Rows variant="ditto">
          <Row href="#halden"><RowTitle>Halden</RowTitle><RowKind>Identity</RowKind><RowMeta>2026</RowMeta></Row>
          <Row href="#oda-studio"><RowTitle>Oda Studio</RowTitle><RowKind>Identity</RowKind><RowMeta>2026</RowMeta></Row>
        </Rows>
      </State>
      <State label="Ditto, pointed at">
        <Rows variant="ditto">
          <Row href="#halden"><RowTitle>Halden</RowTitle><RowKind>Identity</RowKind><RowMeta>2026</RowMeta></Row>
          <Row href="#oda-studio" data-force="hover"><RowTitle>Oda Studio</RowTitle><RowKind>Identity</RowKind><RowMeta>2026</RowMeta></Row>
        </Rows>
      </State>
      <State label="Trail, to come"><Rows variant="trail">{one({})}</Rows></State>
      <State label="Trail, pointed at"><Rows variant="trail">{one({ force: "hover" })}</Rows></State>
      <State label="Trail, been"><Rows variant="trail">{one({ force: "visited" })}</Rows></State>
      <State label="Trail, here"><Rows variant="trail">{one({ current: true })}</Rows></State>
    </>
  )
}
