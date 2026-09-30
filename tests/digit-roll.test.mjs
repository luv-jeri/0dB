import { test } from "node:test"
import assert from "node:assert/strict"
import * as rolls from "../registry/0db/lib/roll.ts"

function setup(t, initial = "100") {
  t.mock.timers.enable({ apis: ["setTimeout"] })
  t.mock.method(globalThis, "matchMedia", () => ({ matches: false }))
  let shown = initial
  const element = () => ({
    animate(_, { duration }) {
      let reject
      let timer
      const finished = new Promise((resolve, fail) => {
        reject = fail
        timer = setTimeout(resolve, duration)
      })
      return { finished, cancel() { clearTimeout(timer); reject(new Error("cancelled")) } }
    },
  })
  assert.equal(typeof rolls.createDigitRoll, "function", "the digit scheduler must be shared")
  const roller = rolls.createDigitRoll(initial, next => { shown = next })
  const options = { whole: element(), figures: Array.from({ length: 12 }, element), distance: "0.5em", dir: 1 }
  const tick = async ms => { t.mock.timers.tick(ms); await Promise.resolve(); await Promise.resolve() }
  const settle = async () => { for (let i = 0; i < 30; i++) await tick(36) }
  return { roller, update: (next, extra) => roller.update(next, { ...options, ...extra }), shown: () => shown, tick, settle }
}

// Browser preference is the only global the scheduler needs; each test restores its mock.
globalThis.matchMedia ??= () => ({ matches: false })

test("a pending carry cannot overwrite 100 → 211 → 311", async t => {
  const f = setup(t)
  f.update("211")
  await f.tick(20)
  f.update("311")
  await f.settle()
  assert.equal(f.shown(), "311")
})

test("a turn back to the displayed number cancels every old digit", async t => {
  const f = setup(t)
  f.update("211")
  await f.tick(50)
  f.update("100", { dir: -1 })
  await f.settle()
  assert.equal(f.shown(), "100")
})

test("changes during the outgoing and incoming phases retain the latest digits", async t => {
  const f = setup(t)
  f.update("211")
  await f.tick(0)
  await f.tick(160)
  f.update("321")
  await f.tick(180)
  f.update("311", { dir: -1 })
  await f.settle()
  assert.equal(f.shown(), "311")
})

test("whole-number and digit transitions cancel each other", async t => {
  const f = setup(t, "99")
  f.update("100")
  await f.tick(40)
  f.update("98", { dir: -1 })
  await f.settle()
  assert.equal(f.shown(), "98")
})

test("an instant update cancels animation and pending work even for the same target", async t => {
  const f = setup(t)
  f.update("211")
  await f.tick(10)
  f.update("211", { instant: true })
  assert.equal(f.shown(), "211")
  f.update("42", { instant: true })
  await f.settle()
  assert.equal(f.shown(), "42")
})

test("cleanup prevents pending timers and animation completions from publishing", async t => {
  const f = setup(t)
  f.update("211")
  await f.tick(0)
  f.roller.cancel()
  await f.settle()
  assert.equal(f.shown(), "100")
})

test("reduced motion changes every digit synchronously", t => {
  const f = setup(t)
  t.mock.method(globalThis, "matchMedia", () => ({ matches: true }))
  f.update("321")
  assert.equal(f.shown(), "321")
})
