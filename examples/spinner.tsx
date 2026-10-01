import { Button } from "@/registry/0db/ui/button"
import { Spinner, type SpinnerProps } from "@/registry/0db/ui/spinner"
import { State } from "@/components/site/state"

// Each wait with the words it would stand beside. Alone, a spinner says its label to a screen reader;
// in a sentence the words say it, so the sentence is the status and the spinner stays silent.
const waits: { variant: NonNullable<SpinnerProps["variant"]>; words: string }[] = [
  { variant: "word", words: "Saving your draft" },
  { variant: "dots", words: "Checking the address" },
  { variant: "round", words: "Syncing the library" },
  { variant: "metronome", words: "Waiting for the printer" },
  { variant: "fermata", words: "Holding your place" },
  { variant: "breath", words: "Connecting" },
  { variant: "arpeggio", words: "Rendering the preview" },
]

export default function Example() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-x-6 gap-y-12 self-stretch sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] sm:gap-x-10 sm:gap-y-16">
      {waits.map(({ variant, words }) => {
        const cut = words.lastIndexOf(" ") + 1
        return (
          <div key={variant} className={variant === "word" ? "col-span-2 grid content-start gap-3" : "grid content-start gap-3"}>
            <Spinner variant={variant} size="l" label={variant === "word" ? undefined : words} />
            <span className="db-label">{variant}</span>
            {variant === "word" ? (
              <p className="db-p">
                <Spinner variant="word" label={words} />
              </p>
            ) : (
              <p className="db-p" role="status">
                {/* The last word and the spinner never part at a line break. */}
                {words.slice(0, cut)}
                <span className="whitespace-nowrap">
                  {words.slice(cut)} <Spinner variant={variant} />
                </span>
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function States() {
  return (
    <>
      {waits.map(({ variant }) => (
        <State key={variant} label={`${variant[0].toUpperCase()}${variant.slice(1)}, reduced motion`}>
          <Spinner variant={variant} size="l" data-force="reduced" />
        </State>
      ))}
      <State label="In a busy button">
        <Button variant="bracket" busy="Saving">
          Save
        </Button>
      </State>
    </>
  )
}
