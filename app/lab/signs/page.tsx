import type { Metadata } from "next"

import { Sheet } from "./sheet"
import "@/registry/0db/styles/sign.css"
import "./lab.css"

export const metadata: Metadata = { title: "Signs (contact sheet)", robots: { index: false } }

/** A dev-only contact sheet of every sign, for judging them tile by tile. ?set=words-120, fill-24, dots-48 and so on;
 *  ?from=0&count=48 for a page of them; ?say=1 pins the said state; ?names=star,share picks signs by name. */
export default function SignsLab() {
  return (
    <main id="content" className="lab-signs">
      <Sheet />
    </main>
  )
}
