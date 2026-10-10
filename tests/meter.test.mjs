import { test } from "node:test"
import assert from "node:assert/strict"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Meter } from "../registry/0nlytype/ui/meter.tsx"

const render = (props) => renderToStaticMarkup(React.createElement(Meter, { label: "Storage used", ...props }))
const native = (html) => html.match(/<meter\b[^>]*>/)[0]

test("meter clamps its visible reading and native value to the same limits", () => {
  for (const [value, expected] of [[-10, 0], [37.5, 37.5], [150, 100]]) {
    const html = render({ value, unit: " GB" })
    assert.match(native(html), new RegExp(`value="${expected}"`))
    assert.match(native(html), new RegExp(`aria-valuetext="${expected} GB"`))
    assert.ok(html.includes(`<span class="db-yours">${expected}</span>`))
    assert.ok(html.includes(`--db-meter-p:${expected / 100}`))
  }
})

test("signed ranges and zero use their own minimum, rather than a percentage of max", () => {
  const html = render({ value: 0, min: -100, max: 100 })
  assert.match(native(html), /value="0" min="-100" max="100"/)
  assert.ok(html.includes("--db-meter-p:0.5"))
})

test("the native label, description and caller semantics are preserved", () => {
  const html = render({ value: 72, id: "archive", note: "28 GB available", "aria-describedby": "policy", "aria-valuetext": "72 of 100 gigabytes used", low: 20, high: 90, optimum: 10 })
  assert.match(html, /<label[^>]*for="archive">Storage used<\/label>/)
  assert.match(native(html), /id="archive"/)
  assert.match(native(html), /aria-describedby="policy archive-note"/)
  assert.match(native(html), /aria-valuetext="72 of 100 gigabytes used"/)
  assert.match(native(html), /low="20" high="90" optimum="10"/)
  assert.match(html, /id="archive-note">28 GB available<\/p>/)
  assert.match(html, /data-slot="meter-scale"[^>]*aria-hidden="true"/)
  assert.doesNotMatch(native(html), /tabindex/)
})

test("formatting is shared by the reading, limits and spoken value", () => {
  const html = render({ value: 12.5, max: 50, unit: " kg", format: (n) => n.toFixed(1).replace(".", ",") })
  assert.match(native(html), /aria-valuetext="12,5 kg"/)
  assert.ok(html.includes("0,0 kg"))
  assert.ok(html.includes("50,0 kg"))
  assert.doesNotMatch(native(html), /aria-describedby/)
})

test("invalid readings and ranges cannot silently render a misleading meter", () => {
  for (const props of [{ value: NaN }, { value: Infinity }, { value: 10, min: 20, max: 20 }, { value: 10, min: 30, max: 20 }, { value: 10, max: Infinity }, { value: 0, min: -Number.MAX_VALUE, max: Number.MAX_VALUE }])
    assert.throws(() => render(props), RangeError)
})

test("direction, language and visibility cover the visual meter as well as its native reading", () => {
  const html = render({ value: 50, dir: "rtl", lang: "ar", hidden: true })
  assert.match(html, /<div[^>]*hidden="" dir="rtl" lang="ar"/)
  assert.doesNotMatch(native(html), /dir="rtl"|lang="ar"/)
})

test("bidi isolation keeps signed readings and their units together in RTL", () => {
  const html = render({ value: -25, min: -100, max: 100, dir: "rtl", unit: " GBP" })
  assert.ok(html.includes('<bdi dir="ltr"><span class="db-yours">-25</span><small> GBP</small></bdi>'))
  assert.ok(html.includes('<bdi dir="ltr" data-slot="meter-min">-100 GBP</bdi>'))
})


test("signed readings without a lettered unit keep an explicit numeric direction", () => {
  const html = render({ value: -25, min: -100, dir: "rtl" })
  assert.ok(html.includes('<bdi dir="ltr"><span class="db-yours">-25</span>'))
  assert.ok(html.includes('<bdi dir="ltr" data-slot="meter-min">-100</bdi>'))
})

test("the displayed and spoken reading share one formatter result", () => {
  const calls = []
  const html = render({ value: 12.5, format: (n) => { calls.push(n); return String(n) } })
  assert.deepEqual(calls, [12.5, 0, 100])
  assert.match(native(html), /aria-valuetext="12.5"/)
})
