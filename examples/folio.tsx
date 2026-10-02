import { Folio, FolioTitle, FolioLedger, FolioPlate } from "@/registry/0db/ui/folio"
import { Button } from "@/registry/0db/ui/button"
import { Contour } from "@/registry/0db/ui/contour"
import { Halftone } from "@/registry/0db/ui/halftone"
import { State } from "@/components/site/state"

const plate = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420"><rect width="720" height="420" fill="#f2f3f0"/><text x="360" y="300" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="280" fill="#000">0dB</text></svg>')}`

export default function Example() {
  return <div className="grid gap-(--db-space-8)">
    <Folio variant="live">
      <FolioTitle>0dB — The type behind the interface.</FolioTitle>
      <FolioLedger rows={[{ label: "My part", value: "Product engineering" }, { label: "Work in the open", value: "0dB" }]} />
      <FolioPlate><div className="grid justify-items-start gap-(--db-space-6)"><Contour className="db-mp" shape="crescendo">An idea to explore. A product to improve. A problem to solve.</Contour><Button variant="bracket">Start with what you have.</Button></div></FolioPlate>
    </Folio>
    <Folio variant="type">
      <FolioTitle>HighLevel Credentials — A visual editor for creating credentials.</FolioTitle>
      <FolioLedger rows={[{ label: "Work at HighLevel", value: "Product engineering" }]} />
      <FolioPlate>HighLevel Credentials</FolioPlate>
    </Folio>
  </div>
}

export function States() {
  return <>
    <State label="Type"><Folio variant="type" className="w-full"><FolioTitle>You can start in the middle.</FolioTitle><FolioLedger rows={[{ label: "My part", value: "Product engineering" }]} /><FolioPlate>0dB</FolioPlate></Folio></State>
    <State label="Live"><Folio variant="live" className="w-full"><FolioTitle>Start with what you have.</FolioTitle><FolioLedger rows={[{ label: "Work in the open", value: "0dB" }]} /><FolioPlate><Button variant="bracket">An idea to explore.</Button></FolioPlate></Folio></State>
    <State label="Plate · type specimen"><Folio className="w-full"><FolioTitle>The type behind the interface.</FolioTitle><FolioLedger rows={[{ label: "My part", value: "Product engineering" }]} /><FolioPlate><Halftone src={plate} alt="0dB, an example type specimen" word="0dB" resolve="none" cols={32} /></FolioPlate></Folio></State>
  </>
}
