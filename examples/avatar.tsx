import { Avatar, AvatarGroup } from "@/registry/0db/ui/avatar"
import { State } from "@/components/site/state"

export default function Example() {
  return (
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
    </>
  )
}
