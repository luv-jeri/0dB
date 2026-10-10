import { Alert, AlertActions, AlertCorrection, AlertDescription, AlertTitle } from "@/registry/0nlytype/ui/alert"
import { Button } from "@/registry/0nlytype/ui/button"
import { State } from "@/components/site/state"

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
      <Alert variant="cue">
        <AlertTitle>Sharing is paused tonight from 22:00 to 23:00.</AlertTitle>
        <AlertDescription>Links you&apos;ve sent keep working. New ones wait until it&apos;s back.</AlertDescription>
      </Alert>
      <Alert variant="errata">
        <AlertTitle>The review moved.</AlertTitle>
        <AlertCorrection was="Thursday 2 October" now="Friday 3 October" />
        <AlertDescription>Same time, same room. Everyone invited has been told.</AlertDescription>
      </Alert>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Double bar"><Alert><AlertTitle>Your trial ends on 14 October.</AlertTitle></Alert></State>
      <State label="Error, the final bar"><Alert variant="error"><AlertTitle>Halden didn&apos;t publish.</AlertTitle></Alert></State>
      <State label="Cue"><Alert variant="cue"><AlertTitle>Sharing is paused tonight.</AlertTitle></Alert></State>
      <State label="Errata"><Alert variant="errata"><AlertTitle>The review moved.</AlertTitle><AlertCorrection was="Thursday" now="Friday" /></Alert></State>
      <State label="Cue, arriving"><Alert variant="cue" arriving><AlertTitle>Sharing is paused tonight.</AlertTitle></Alert></State>
    </>
  )
}
