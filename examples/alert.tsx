import { Alert, AlertActions, AlertDescription, AlertTitle } from "@/registry/0db/ui/alert"
import { Button } from "@/registry/0db/ui/button"

export default function Example() {
  return (
    <div className="flex flex-col gap-10">
      <Alert>
        <AlertTitle>Your trial ends on 14 October.</AlertTitle>
        <AlertDescription>Choose a plan before then and nothing you&apos;ve made will change.</AlertDescription>
        <AlertActions>
          <Button variant="quiet">Choose a plan</Button>
        </AlertActions>
      </Alert>
      <Alert variant="error">
        <AlertTitle>Halden didn&apos;t publish.</AlertTitle>
        <AlertDescription>Two images are over the 20 MB limit. Make them smaller, then publish again.</AlertDescription>
        <AlertActions>
          <Button>Publish again</Button>
        </AlertActions>
      </Alert>
    </div>
  )
}
