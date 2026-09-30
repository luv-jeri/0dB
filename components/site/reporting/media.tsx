"use client"

import * as React from "react"
import type { ReportFile } from "@/lib/reporting/client"

function Preview({ file }: { file: File }) {
  const [url, setUrl] = React.useState("")
  React.useEffect(() => {
    const value = URL.createObjectURL(file)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronize the preview with an external, revocable browser resource
    setUrl(value)
    return () => URL.revokeObjectURL(value)
  }, [file])
  if (!url) return null
  return file.type.startsWith("video/")
    ? <video src={url} controls preload="metadata" aria-label={`Attachment: ${file.name}`} />
    // Local, revocable object URLs cannot use the image optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    : <img src={url} alt={`Attachment: ${file.name}`} />
}

export function MediaReview({ files }: { files: ReportFile[] }) {
  return files.length ? <div className="db-report-media">
    {files.map(({ id, file }) => <figure key={id}>
      <Preview file={file} />
      <figcaption><span className="db-yours" dir="auto">{file.name}</span> <bdi className="db-report-number">({(file.size / 1024 / 1024).toFixed(2)} MiB)</bdi></figcaption>
    </figure>)}
  </div> : null
}
