"use client"

import * as React from "react"

import { Button } from "@/registry/0db/ui/button"
import { Progress } from "@/registry/0db/ui/progress"
import { State } from "@/components/site/state"

export default function Example() {
  const [value, setValue] = React.useState(0)
  const [running, setRunning] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setInterval>>(undefined)

  React.useEffect(() => () => clearInterval(timer.current), [])

  const upload = () => {
    setValue(0)
    setRunning(true)
    let v = 0
    timer.current = setInterval(() => {
      v = Math.min(100, v + 1 + Math.random() * 5)
      setValue(v)
      if (v >= 100) {
        clearInterval(timer.current)
        setRunning(false)
      }
    }, 80)
  }

  return (
    <div className="flex flex-col items-start gap-10">
      <Progress
        style={{ width: "min(36rem, 100%)" }}
        value={value}
        label={running ? "Uploading 12 files" : value >= 100 ? "Uploaded 12 files" : "12 files ready to upload"}
      />
      <Button disabled={running} onClick={upload}>{value >= 100 && !running ? "Upload again" : "Upload"}</Button>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Not started"><Progress value={0} label="Upload" style={{ width: "16rem" }} /></State>
      <State label="Halfway"><Progress value={50} label="Upload" style={{ width: "16rem" }} /></State>
      <State label="Done"><Progress value={100} label="Upload" style={{ width: "16rem" }} /></State>
    </>
  )
}
