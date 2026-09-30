"use client"

import { Field, Input, Textarea } from "@/registry/0db/ui/field"
import { Form, FormSubmit } from "@/registry/0db/ui/form"
import { Select } from "@/registry/0db/ui/select"

// Try sending it empty: each field gets its callout and focus goes to the first.
export default function Example() {
  return (
    <Form
      className="w-full max-w-md"
      onSubmit={async (data) => {
        await new Promise((done) => setTimeout(done, 1400))
        console.log(Object.fromEntries(data))
      }}
    >
      <Field label="Your name">
        <Input name="name" required data-error="Add your name so we know who to answer." autoComplete="name" />
      </Field>
      <Field label="Email">
        <Input name="email" type="email" required data-error="Check the address. It needs a domain after the @, like studio.com." autoComplete="email" />
      </Field>
      <Select label="Budget is" name="budget" defaultValue="under 20k">
        <option>under 20k</option>
        <option>20k to 60k</option>
        <option>over 60k</option>
      </Select>
      <Field label="The brief" count maxLength={400} hint="What should we know before the call?">
        <Textarea name="brief" rows={4} required data-error="Tell us a line or two about the project." />
      </Field>
      <FormSubmit busy="Sending">Send</FormSubmit>
    </Form>
  )
}
