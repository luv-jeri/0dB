import { Button } from "@/registry/0db/ui/button"
import { Checkbox, CheckboxGroup } from "@/registry/0db/ui/checkbox"
import { Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from "@/registry/0db/ui/drawer"

export default function Example() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="bracket">Filter the work</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle>Filter the work</DrawerTitle>
        <CheckboxGroup legend="Kinds of work">
          <Checkbox>Identity</Checkbox>
          <Checkbox>Web</Checkbox>
          <Checkbox>Motion</Checkbox>
        </CheckboxGroup>
        <DrawerClose asChild>
          <Button variant="statement" data-autofocus>Show 7 projects</Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}
