import { test } from "node:test"
import assert from "node:assert/strict"
import { activeIndex } from "../registry/0db/lib/chart-index.ts"

test("a removed radar axis cannot index the replacement data", () => {
  assert.equal(activeIndex(3, 4), 3)
  assert.equal(activeIndex(3, 3), -1)
  assert.equal(activeIndex(1, 3), 1)
  assert.equal(activeIndex(0, 0), -1)
})

test("invalid initial axes retain one keyboard entry point", () => {
  for (const now of [-1, 3, 1.5, NaN, Infinity]) assert.equal(activeIndex(now, 3, 0), 0)
  assert.equal(activeIndex(2, 3, 0), 2)
  assert.equal(activeIndex(0, 0, 0), -1)
})
