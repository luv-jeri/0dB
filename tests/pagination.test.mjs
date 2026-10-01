import { test } from "node:test"
import assert from "node:assert/strict"
import { paginationRange as r } from "../registry/0db/ui/pagination.tsx"

test("paginationRange keeps its slots and never hides a single page", () => {
  assert.deepEqual(r(1, 5), [1, 2, 3, 4, 5])
  assert.deepEqual(r(4, 24), [1, 2, 3, 4, 5, "gap", 24])
  assert.deepEqual(r(5, 24), [1, "gap", 4, 5, 6, "gap", 24])
  assert.deepEqual(r(21, 24), [1, "gap", 20, 21, 22, 23, 24])
  for (let t = 1; t <= 30; t++) for (let c = 1; c <= t; c++) {
    const v = r(c, t)
    assert.ok(v.includes(c))
    assert.equal(v.length, Math.min(t, 7))
    v.forEach((x, i) => x === "gap" && assert.ok(v[i + 1] - v[i - 1] > 2, `a gap hides one page at ${c}/${t}`))
  }
})
