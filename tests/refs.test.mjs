import { test } from "node:test"
import assert from "node:assert/strict"
import { composeRefs } from "../registry/0nlytype/lib/refs.ts"

test("composed refs attach both owners and preserve React 19 cleanup", () => {
  const node = { tagName: "INPUT" }
  const own = { current: null }
  const received = []
  let cleaned = 0
  const ref = composeRefs(own, value => {
    received.push(value)
    return () => { cleaned++ }
  })
  const cleanup = ref(node)
  assert.equal(own.current, node)
  assert.deepEqual(received, [node])
  cleanup()
  assert.equal(own.current, null)
  assert.equal(cleaned, 1)
  assert.deepEqual(received, [node], "a cleanup ref must not also receive null")
})

test("legacy callbacks receive null while other callbacks run their cleanup", () => {
  const values = []
  let cleaned = 0
  const node = {}
  const cleanup = composeRefs(value => { values.push(value) }, () => () => { cleaned++ })(node)
  cleanup()
  assert.deepEqual(values, [node, null])
  assert.equal(cleaned, 1)
})

test("a missing public ref still clears the private ref", () => {
  const own = { current: null }
  const node = {}
  const cleanup = composeRefs(own, undefined)(node)
  assert.equal(own.current, node)
  cleanup()
  assert.equal(own.current, null)
})
