"use client"

import * as React from "react"

import { Attachment, AttachmentList } from "@/registry/0db/ui/attachment"
import { State } from "@/components/site/state"

export default function Example() {
  const [files, setFiles] = React.useState([
    { name: "Halden brief, second round.pdf", size: "2.4 MB" },
    { name: "Stamp sizes.png", size: "3.6 MB" },
  ])
  return (
    <AttachmentList className="max-w-[40rem]">
      {files.map((f) => (
        <Attachment key={f.name} {...f} onRemove={() => setFiles((all) => all.filter((x) => x !== f))} />
      ))}
    </AttachmentList>
  )
}

export function States() {
  return (
    <>
      <State label="Waiting"><AttachmentList className="w-68"><Attachment name="Stamp sizes.png" status="Waiting" state="idle" /></AttachmentList></State>
      <State label="Uploading"><AttachmentList className="w-68"><Attachment name="Stamp sizes.png" status="1.4 of 3.6 MB" state="uploading" progress={0.4} /></AttachmentList></State>
      <State label="Checking"><AttachmentList className="w-68"><Attachment name="Stamp sizes.png" status="Checking" state="processing" /></AttachmentList></State>
      <State label="Done"><AttachmentList className="w-68"><Attachment name="Stamp sizes.png" size="3.6 MB" /></AttachmentList></State>
      <State label="Failed"><AttachmentList className="w-68"><Attachment name="Marks, final.ai" status="The connection dropped." state="error" progress={0.7} onRemove={() => {}} /></AttachmentList></State>
    </>
  )
}
