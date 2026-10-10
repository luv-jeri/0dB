import assert from "node:assert/strict"
import test from "node:test"
import vm from "node:vm"

import { OVERTURE_ATTR, OVERTURE_DEADLINE, OVERTURE_KEY, OVERTURE_SCRIPT } from "../lib/site/overture.mjs"

// The first-visit decision is a script that runs in the page's HTML before the hero paints. These tests run the
// real script text against a fake browser, so the storage design is held to what it says: one key, written before
// the overture starts, and nothing played if storage, a hash, a scroll offset or reduced motion says not to.

function browser({ store = {}, reduced = false, hash = "", scroll = 0, throwOn = null } = {}) {
  const attrs = {}
  const calls = { get: [], set: [] }
  const localStorage = {
    getItem(key) { calls.get.push(key); if (throwOn === "get") throw new Error("denied"); return key in store ? store[key] : null },
    setItem(key, value) { calls.set.push([key, value]); if (throwOn === "set") throw new Error("quota"); store[key] = value },
  }
  const context = vm.createContext({
    localStorage,
    matchMedia: (query) => ({ matches: reduced && query.includes("prefers-reduced-motion") }),
    location: { hash },
    scrollY: scroll,
    performance: { now: () => 412.6 },
    document: { documentElement: { setAttribute: (name, value) => { attrs[name] = value } } },
  })
  const run = () => vm.runInContext(OVERTURE_SCRIPT, context)
  return { run, attrs, store, calls }
}

test("the deadline leaves the overture well under three seconds", () => {
  assert.ok(OVERTURE_DEADLINE > 0 && OVERTURE_DEADLINE < 3000)
})

test("a first visit plays, and records itself before it starts", () => {
  const b = browser()
  b.run()
  assert.deepEqual(b.calls.set, [[OVERTURE_KEY, "1"]])
  assert.equal(b.attrs[OVERTURE_ATTR], "413")
})

test("the second visit arrives settled, and writes nothing more", () => {
  const store = {}
  browser({ store }).run()
  const again = browser({ store })
  again.run()
  assert.equal(again.attrs[OVERTURE_ATTR], undefined)
  assert.deepEqual(again.calls.set, [])
})

test("one key, no personal data", () => {
  const b = browser()
  b.run()
  assert.deepEqual(Object.keys(b.store), [OVERTURE_KEY])
  assert.equal(b.store[OVERTURE_KEY], "1")
})

test("storage that refuses to be read skips the overture", () => {
  const b = browser({ throwOn: "get" })
  assert.doesNotThrow(() => b.run())
  assert.equal(b.attrs[OVERTURE_ATTR], undefined)
})

test("storage that refuses to be written skips the overture, so it can never replay unrecorded", () => {
  const b = browser({ throwOn: "set" })
  assert.doesNotThrow(() => b.run())
  assert.equal(b.attrs[OVERTURE_ATTR], undefined)
})

test("a missing localStorage skips the overture", () => {
  const attrs = {}
  const context = vm.createContext({ document: { documentElement: { setAttribute: (name, value) => { attrs[name] = value } } } })
  assert.doesNotThrow(() => vm.runInContext(OVERTURE_SCRIPT, context))
  assert.deepEqual(attrs, {})
})

test("reduced motion counts as seen and never plays", () => {
  const b = browser({ reduced: true })
  b.run()
  assert.equal(b.attrs[OVERTURE_ATTR], undefined)
  assert.equal(b.store[OVERTURE_KEY], "1")
})

test("arriving at a hash, or part-way down, counts as seen and never plays", () => {
  for (const options of [{ hash: "#noise" }, { scroll: 800 }]) {
    const b = browser(options)
    b.run()
    assert.equal(b.attrs[OVERTURE_ATTR], undefined)
    assert.equal(b.store[OVERTURE_KEY], "1")
  }
})
