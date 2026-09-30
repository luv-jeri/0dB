"use client"

import * as React from "react"

import { Field } from "@/registry/0db/ui/field"
import { InputOTP } from "@/registry/0db/ui/input-otp"
import { State } from "@/components/site/state"

// For this page, the code we sent is 246810.
export default function Example() {
  const [error, setError] = React.useState<string>()
  return (
    <Field
      label="The code we sent to your phone"
      hint="For this page, the code is 246810."
      error={error}
      className="max-w-md"
    >
      <InputOTP
        onValueChange={() => setError(undefined)}
        onComplete={(code) => code !== "246810" && setError("That code doesn't match. Check the message and type it again.")}
      />
    </Field>
  )
}

export function States() {
  return (
    <>
      <State label="Waiting"><InputOTP aria-label="Code" data-force="focus" defaultValue="24" /></State>
      <State label="Whole"><InputOTP aria-label="Code" defaultValue="246810" /></State>
      <State label="Wrong"><InputOTP aria-label="Code" defaultValue="246811" aria-invalid /></State>
    </>
  )
}
