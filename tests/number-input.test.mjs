import { test } from "node:test"
import assert from "node:assert/strict"
import { reader, raw } from "../registry/0db/lib/number.ts"

test("localized editing and grouped display values round trip", () => {
  for (const locale of ["en", "de", "fr", "ar-EG", "fa", "bn", "hi-u-nu-deva", "th-u-nu-thai", "zh-u-nu-hanidec"]) {
    const parse = reader(locale)
    for (const value of [0, 12.5, -12.5, 12345.625, -12345.625]) {
      assert.equal(parse(raw(value, locale)), value, `${locale}: editing ${value}`)
      assert.equal(parse(new Intl.NumberFormat(locale).format(value)), value, `${locale}: grouped ${value}`)
      assert.equal(parse(new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 3 }).format(value)), value, `${locale}: currency ${value}`)
    }
    assert.equal(parse(raw(null, locale)), null)
  }
})

test("Arabic and Persian digits, grouping, bidi marks and minus signs are normalized", () => {
  assert.equal(reader("ar-EG")("؜-١٢٬٣٤٥٫٥"), -12345.5)
  assert.equal(reader("fa")("‎−۱۲٬۳۴۵٫۵"), -12345.5)
  assert.equal(reader("fa")("12٫5"), 12.5)
})

test("empty input stays distinct from invalid input", () => {
  const parse = reader("en")
  assert.equal(parse("  "), null)
  for (const value of ["word", "-", "1.2.3", "--12"]) assert.equal(parse(value), undefined)
  assert.equal(parse("−12.5"), -12.5)
})
