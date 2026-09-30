"use client"

import * as React from "react"

import { Field } from "@/registry/0db/ui/field"
import { InputOTP, type InputOTPProps } from "@/registry/0db/ui/input-otp"
import { State } from "@/components/site/state"

// For this page, the code we sent is 246810.
function Check({ label, variant }: { label: string; variant?: InputOTPProps["variant"] }) {
  const [error, setError] = React.useState<string>()
  return (
    <Field label={label} hint="For this page, the code is 246810." error={error} className="max-w-md">
      <InputOTP
        variant={variant}
        onValueChange={() => setError(undefined)}
        onComplete={(code) => code !== "246810" && setError("That code doesn't match. Check the message and type it again.")}
      />
    </Field>
  )
}

export default function Example() {
  return (
    <div className="grid gap-12">
      <Check label="The code we sent to your phone" />
      <Check label="The code from your email" variant="close-up" />
      <Check label="The code we read to you" variant="lyric" />
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Waiting"><InputOTP aria-label="Code" data-force="focus" defaultValue="24" /></State>
      <State label="Whole"><InputOTP aria-label="Code" defaultValue="246810" /></State>
      <State label="Wrong"><InputOTP aria-label="Code" defaultValue="246811" aria-invalid /></State>
      <State label="close-up, waiting"><InputOTP variant="close-up" aria-label="Code" data-force="focus" defaultValue="24" /></State>
      <State label="close-up, whole"><InputOTP variant="close-up" aria-label="Code" defaultValue="246810" /></State>
      <State label="close-up, wrong"><InputOTP variant="close-up" aria-label="Code" defaultValue="246811" aria-invalid /></State>
      <State label="lyric, waiting"><InputOTP variant="lyric" aria-label="Code" data-force="focus" defaultValue="2468" /></State>
      <State label="lyric, whole"><InputOTP variant="lyric" aria-label="Code" defaultValue="246810" /></State>
    </>
  )
}
