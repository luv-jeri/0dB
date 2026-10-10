"use client"

import { Button } from "@/registry/0nlytype/ui/button"
import { Field, Input, Textarea } from "@/registry/0nlytype/ui/field"
import { Form, FormPostmark, FormPostscript, FormSubmit } from "@/registry/0nlytype/ui/form"
import { Select } from "@/registry/0nlytype/ui/select"
import { State } from "@/components/site/state"

const send = async (data: FormData) => {
  await new Promise((done) => setTimeout(done, 1400))
  console.log(Object.fromEntries(data))
}

// Try sending each one empty: the grid hangs a callout from each line, the letter writes a postscript.
export default function Example() {
  return (
    <div className="grid w-full gap-16">
      <div className="grid gap-6">
        <span className="ot-label">grid</span>
        <Form className="w-full max-w-md" onSubmit={send}>
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
          <FormSubmit busy="Sending" sent="Sent">Send</FormSubmit>
        </Form>
      </div>

      <div className="grid gap-6">
        <span className="ot-label">letter</span>
        <Form variant="letter" onSubmit={send}>
          <div>Dear Studio,</div>
          <div>
            My name is{" "}
            <Field label="Your name">
              <Input name="name" required placeholder="your name" data-error="Sign it with your name, so we know who to answer." autoComplete="name" />
            </Field>{" "}
            and you can write back to me at{" "}
            <Field label="Email">
              <Input name="email" type="email" required placeholder="you@studio.com" data-error="Check the address: it needs a domain after the @, like studio.com." autoComplete="email" />
            </Field>{" "}
            We have{" "}
            <Select aria-label="Budget" name="budget" defaultValue="under 20k">
              <option>under 20k</option>
              <option>20k to 60k</option>
              <option>over 60k</option>
            </Select>{" "}
            to spend, and this is what you should know before we speak:
          </div>
          <Field label="The brief">
            <Textarea name="brief" rows={3} required data-error="Write a line or two about the project." />
          </Field>
          <FormSubmit busy="Sending" sent="Sent">Send the letter</FormSubmit>
        </Form>
      </div>

      <div className="grid gap-6">
        <span className="ot-label">postmark</span>
        <Form variant="postmark" className="w-full max-w-md" onSubmit={send}>
          <Field label="Email">
            <Input name="email" type="email" required data-error="Check the address. It needs a domain after the @, like studio.com." autoComplete="email" />
          </Field>
          <FormSubmit busy="Subscribing" sent="Subscribed">Subscribe</FormSubmit>
        </Form>
      </div>
    </div>
  )
}

const noop = () => {}
const POSTED = new Date(Date.UTC(2026, 8, 30, 14, 2))

export function States() {
  return (
    <>
      <State label="grid, after a failed send">
        <Form className="w-60" onSubmit={noop}>
          <Field label="Email" error="Check the address.">
            <Input defaultValue="ada@studio" />
          </Field>
          <FormSubmit>Send</FormSubmit>
        </Form>
      </State>
      <State label="Sending">
        <Button variant="statement" busy="Sending">Send</Button>
      </State>
      <State label="letter, after a failed send">
        <Form variant="letter" className="w-72" onSubmit={noop}>
          <div>
            Yours,{" "}
            <Field label="Your name" id="b4-letter-name" error="Sign it with your name.">
              <Input placeholder="your name" />
            </Field>
          </div>
          <FormPostscript errors={{ "b4-letter-name": "Sign it with your name, so we know who to answer." }} />
        </Form>
      </State>
      <State label="postmark, sent">
        <Form variant="postmark" className="w-72" onSubmit={noop}>
          <Field label="Email">
            <Input defaultValue="ada@studio.com" />
          </Field>
          <Button variant="statement">Subscribed</Button>
          <FormPostmark date={POSTED} locale="en-GB" timeZone="UTC" />
        </Form>
      </State>
    </>
  )
}
