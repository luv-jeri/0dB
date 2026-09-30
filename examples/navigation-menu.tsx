import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/registry/0db/ui/navigation-menu"

export default function Example() {
  return (
    <div style={{ minHeight: "18rem" }}>
      <NavigationMenu aria-label="Studio">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Work</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#identity">Identity<small>Names, marks, and the rules that keep them</small></NavigationMenuLink>
              <NavigationMenuLink href="#websites">Websites<small>Built to be read slowly and used for years</small></NavigationMenuLink>
              <NavigationMenuLink href="#motion">Motion<small>Titles, idents and things that move once</small></NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Studio</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#people">People<small>Six of us, in Stockholm and Lisbon</small></NavigationMenuLink>
              <NavigationMenuLink href="#process">Process<small>How a project runs, week by week</small></NavigationMenuLink>
              <NavigationMenuLink href="#journal">Journal<small>Notes on type, space and slowness</small></NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#contact">Contact</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
