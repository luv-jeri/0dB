import { Pick, PickDescription, Picks, PickTitle } from "@/registry/0nlytype/ui/picks"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid items-start gap-x-(--ot-space-8) gap-y-(--ot-space-7) md:grid-cols-2">
      <Picks legend="Pair" defaultValue="press">
        <Pick value="parma">
          <PickTitle>Parma</PickTitle>
          <PickDescription>The house pair. Sharp and bright; Bodoni cut his types in Parma.</PickDescription>
        </Pick>
        <Pick value="press">
          <PickTitle>Press</PickTitle>
          <PickDescription>Both made for reading news on screens. Plain, warm, unhurried.</PickDescription>
        </Pick>
        <Pick value="paris">
          <PickTitle>Paris</PickTitle>
          <PickDescription>A narrow modern voice answered in the oldest italic here.</PickDescription>
        </Pick>
        <Pick value="salon">
          <PickTitle>Salon</PickTitle>
          <PickDescription>A grotesque with a little ink trap, and a Garamond cut for display.</PickDescription>
        </Pick>
      </Picks>
      <Picks variant="rubric" legend="Ink" defaultValue="vermilion">
        <Pick value="lamp">
          <PickTitle>Lamp black</PickTitle>
          <PickDescription>Soot from an oil lamp, ground into varnish.</PickDescription>
        </Pick>
        <Pick value="vermilion">
          <PickTitle>Vermilion</PickTitle>
          <PickDescription>The rubricator&rsquo;s red, ground from cinnabar.</PickDescription>
        </Pick>
        <Pick value="gall">
          <PickTitle>Iron gall</PickTitle>
          <PickDescription>Brown-black, and it bites into the page for good.</PickDescription>
        </Pick>
      </Picks>
      <Picks variant="watermark" legend="Paper" defaultValue="wove">
        <Pick value="laid">
          <PickTitle>Laid</PickTitle>
          <PickDescription>Ribbed with the wires of the mould it was made on.</PickDescription>
        </Pick>
        <Pick value="wove">
          <PickTitle>Wove</PickTitle>
          <PickDescription>Smooth as a page can be. Baskerville asked for it.</PickDescription>
        </Pick>
        <Pick value="cotton">
          <PickTitle>Cotton</PickTitle>
          <PickDescription>Soft and heavy in the hand, and it outlasts us.</PickDescription>
        </Pick>
      </Picks>
      <Picks variant="register" legend="Format" defaultValue="quarto">
        <Pick value="octavo">
          <PickTitle>Octavo</PickTitle>
          <PickDescription>The sheet folded three times: sixteen pages, small in the hand.</PickDescription>
        </Pick>
        <Pick value="quarto">
          <PickTitle>Quarto</PickTitle>
          <PickDescription>Folded twice into eight pages. About half of Shakespeare&rsquo;s plays first saw print this way.</PickDescription>
        </Pick>
        <Pick value="folio">
          <PickTitle>Folio</PickTitle>
          <PickDescription>Folded once. Tall, grand and heavy on the lectern.</PickDescription>
        </Pick>
      </Picks>
    </div>
  )
}

const line = "Plain, warm, unhurried."

export function States() {
  return (
    <>
      <State label="Pizzicato">
        <Picks aria-label="Rest"><Pick value="press">Press</Pick></Picks>
      </State>
      <State label="Pointed at">
        <Picks aria-label="Pointed at"><Pick value="press" data-force="hover">Press</Pick></Picks>
      </State>
      <State label="Focus">
        <Picks aria-label="Focus"><Pick value="press" data-force="focus">Press</Pick></Picks>
      </State>
      <State label="Chosen">
        <Picks aria-label="Chosen" defaultValue="press"><Pick value="press">Press</Pick></Picks>
      </State>
      <State label="Disabled">
        <Picks aria-label="Disabled"><Pick value="press" disabled>Press</Pick></Picks>
      </State>
      <State label="Rubric">
        <Picks variant="rubric" aria-label="Rest"><Pick value="press"><PickTitle>Press</PickTitle><PickDescription>{line}</PickDescription></Pick></Picks>
      </State>
      <State label="Pointed at">
        <Picks variant="rubric" aria-label="Pointed at"><Pick value="press" data-force="hover"><PickTitle>Press</PickTitle><PickDescription>{line}</PickDescription></Pick></Picks>
      </State>
      <State label="Chosen">
        <Picks variant="rubric" aria-label="Chosen" defaultValue="press"><Pick value="press"><PickTitle>Press</PickTitle><PickDescription>{line}</PickDescription></Pick></Picks>
      </State>
      <State label="No capitals">
        <Picks variant="rubric" aria-label="No capitals" defaultValue="waraq" dir="rtl"><Pick value="waraq"><PickTitle>ورق</PickTitle><PickDescription>أملس كما يمكن للصفحة أن تكون.</PickDescription></Pick></Picks>
      </State>
      <State label="Disabled">
        <Picks variant="rubric" aria-label="Disabled"><Pick value="press" disabled><PickTitle>Press</PickTitle><PickDescription>{line}</PickDescription></Pick></Picks>
      </State>
      <State label="Watermark">
        <Picks variant="watermark" aria-label="Watermark" defaultValue="press"><Pick value="press"><PickTitle>Press</PickTitle><PickDescription>{line}</PickDescription></Pick></Picks>
      </State>
      <State label="Register">
        <Picks variant="register" aria-label="Rest"><Pick value="press"><PickTitle>Press</PickTitle><PickDescription>{line}</PickDescription></Pick></Picks>
      </State>
      <State label="Pointed at">
        <Picks variant="register" aria-label="Pointed at"><Pick value="press" data-force="hover"><PickTitle>Press</PickTitle><PickDescription>{line}</PickDescription></Pick></Picks>
      </State>
      <State label="Chosen">
        <Picks variant="register" aria-label="Chosen" defaultValue="press"><Pick value="press"><PickTitle>Press</PickTitle><PickDescription>{line}</PickDescription></Pick></Picks>
      </State>
    </>
  )
}
