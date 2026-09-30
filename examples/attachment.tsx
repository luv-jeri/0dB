"use client"

import * as React from "react"

import { Attachment, AttachmentList } from "@/registry/0db/ui/attachment"
import { Button } from "@/registry/0db/ui/button"
import { State } from "@/components/site/state"

export default function Example() {
  const [files, setFiles] = React.useState([
    { name: "Halden brief, second round.pdf", size: "2.4 MB" },
    { name: "Stamp sizes.png", size: "3.6 MB" },
  ])
  // ponytail: a pretend upload; each press sends another quarter of the file.
  const [sent, setSent] = React.useState(0.25)
  const done = sent >= 1
  return (
    <div className="grid gap-(--db-space-8)">
      <AttachmentList className="max-w-[40rem]">
        {files.map((f) => (
          <Attachment key={f.name} {...f} onRemove={() => setFiles((all) => all.filter((x) => x !== f))} />
        ))}
      </AttachmentList>
      <div className="grid max-w-[40rem] justify-items-start gap-(--db-space-5)">
        <AttachmentList variant="reverse" className="w-full">
          <Attachment name="Timetable grid.svg" size="0.8 MB" />
          <Attachment
            name="Ferry flag, one colour.eps"
            state={done ? "done" : "uploading"}
            progress={Math.min(sent, 1)}
            status={done ? "5.2 MB" : `${(5.2 * sent).toFixed(1)} of 5.2 MB`}
          />
        </AttachmentList>
        <Button variant="bracket" disabled={done} onClick={() => setSent((p) => p + 0.25)}>Send the next part</Button>
      </div>
      <div className="grid max-w-[40rem] gap-(--db-space-3)">
        <p>With the second round of marks, as promised.</p>
        <AttachmentList variant="enclosure">
          <Attachment name="Halden brief, second round.pdf" size="2.4 MB" />
          <Attachment name="Stamp sizes.png" size="3.6 MB" />
        </AttachmentList>
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Waiting"><AttachmentList className="w-68"><Attachment name="Stamps.png" status="Waiting" state="idle" /></AttachmentList></State>
      <State label="Uploading"><AttachmentList className="w-68"><Attachment name="Stamps.png" status="1.4 of 3.6 MB" state="uploading" progress={0.4} /></AttachmentList></State>
      <State label="Checking"><AttachmentList className="w-68"><Attachment name="Stamps.png" status="Checking" state="processing" /></AttachmentList></State>
      <State label="Done"><AttachmentList className="w-68"><Attachment name="Stamps.png" size="3.6 MB" /></AttachmentList></State>
      <State label="Reverse, uploading"><AttachmentList variant="reverse" className="w-68"><Attachment name="Stamps.png" status="1.4 of 3.6 MB" state="uploading" progress={0.4} /></AttachmentList></State>
      <State label="Reverse, checking"><AttachmentList variant="reverse" className="w-68"><Attachment name="Stamps.png" status="Checking" state="processing" /></AttachmentList></State>
      <State label="Reverse, done"><AttachmentList variant="reverse" className="w-68"><Attachment name="Stamps.png" size="3.6 MB" /></AttachmentList></State>
      <State label="Reverse, failed"><AttachmentList variant="reverse" className="w-68"><Attachment name="Marks, final.ai" status="The connection dropped." state="error" progress={0.7} /></AttachmentList></State>
      <State label="Enclosure">
        <AttachmentList variant="enclosure" className="w-[min(24rem,calc(100vw-2*var(--db-margin)))]">
          <Attachment name="Brief.pdf" size="2.4 MB" />
          <Attachment name="Stamps.png" status="1.4 of 3.6 MB" state="uploading" progress={0.4} />
        </AttachmentList>
      </State>
      <State label="Failed"><AttachmentList className="w-[min(24rem,calc(100vw-2*var(--db-margin)))]"><Attachment name="Marks, final.ai" status="The connection dropped." state="error" progress={0.7} onRemove={() => {}} /></AttachmentList></State>
    </>
  )
}
