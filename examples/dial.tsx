import { Dial } from "@/registry/0db/ui/dial"

export default function Example() {
  return <Dial name="weeks" legend="How many weeks do we have?" options={[2, 4, 6, 8, 12, 16, 24]} defaultValue={8} unit="weeks" />
}
