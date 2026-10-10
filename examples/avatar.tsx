import { Avatar, AvatarGroup } from "@/registry/0nlytype/ui/avatar"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)] justify-items-start gap-12">
      <div className="grid justify-items-start gap-3">
        <span className="db-label">Ring</span>
        <div className="flex flex-wrap items-center gap-10">
          <Avatar size="s" alt="Ada Lindqvist" />
          <Avatar alt="Jonas Berg" here />
          <Avatar size="l" alt="Mira Okafor" />
          <AvatarGroup aria-label="Six people on Halden">
            <Avatar alt="Ada Lindqvist" />
            <Avatar alt="Jonas Berg" />
            <Avatar alt="Mira Okafor" />
            <Avatar alt="and 3 more" fallback="+3" count />
          </AvatarGroup>
        </div>
      </div>
      <div className="grid justify-items-start gap-3">
        <span className="db-label">Monogram</span>
        <div className="flex flex-wrap items-center gap-10">
          <Avatar variant="monogram" size="l" alt="Ada Lindqvist" here />
          <Avatar variant="monogram" size="l" alt="Wolfgang Weingart" />
          <AvatarGroup aria-label="Three people on Tidewater">
            <Avatar variant="monogram" alt="Jonas Berg" />
            <Avatar variant="monogram" alt="Mira Okafor" />
            <Avatar variant="monogram" alt="Tove Rask" />
          </AvatarGroup>
        </div>
      </div>
      <div className="grid justify-items-start gap-3">
        <span className="db-label">Fit</span>
        <AvatarGroup aria-label="Five people in the studio today">
          <Avatar variant="fit" size="l" alt="Ada Lindqvist" here />
          <Avatar variant="fit" size="l" alt="Jonas Berg" />
          <Avatar variant="fit" size="l" alt="Wolfgang Weingart" />
          <Avatar variant="fit" size="l" alt="Mira Okafor" />
          <Avatar variant="fit" size="l" alt="and 2 more" fallback="and 2 more" count />
        </AvatarGroup>
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Avatar alt="Ada" /></State>
      <State label="Here"><Avatar alt="Ada" here /></State>
      <State label="Group">
        <AvatarGroup aria-label="Three people">
          <Avatar alt="Ada" /><Avatar alt="Jonas" /><Avatar alt="Mira" />
        </AvatarGroup>
      </State>
      <State label="Group, pointed at">
        <AvatarGroup aria-label="Three people" data-force="hover">
          <Avatar alt="Ada" /><Avatar alt="Jonas" /><Avatar alt="Mira" />
        </AvatarGroup>
      </State>
      <State label="Monogram"><Avatar variant="monogram" alt="Jonas Berg" /></State>
      <State label="Monogram, here"><Avatar variant="monogram" alt="Jonas Berg" here /></State>
      <State label="Monogram, pointed at"><Avatar variant="monogram" alt="Jonas Berg" data-force="hover" /></State>
      <State label="Fit, a short name"><Avatar variant="fit" alt="Ada Lindqvist" /></State>
      <State label="Fit, a long name, here"><Avatar variant="fit" alt="Wolfgang Weingart" here /></State>
    </>
  )
}
