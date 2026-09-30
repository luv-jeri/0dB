import { test } from "node:test"
import assert from "node:assert/strict"
import { marginaliaUnder } from "../registry/0db/lib/menu-room.ts"

test("marginalia checks the logical end, including opposite viewport edges", () => {
  assert.equal(marginaliaUnder({ left: 20, right: 220 }, 1440, "rtl"), true)
  assert.equal(marginaliaUnder({ left: 20, right: 220 }, 1440, "ltr"), false)
  assert.equal(marginaliaUnder({ left: 1220, right: 1420 }, 1440, "rtl"), false)
  assert.equal(marginaliaUnder({ left: 1220, right: 1420 }, 1440, "ltr"), true)
  assert.equal(marginaliaUnder({ left: 220, right: 440 }, 660, "rtl"), false)
  assert.equal(marginaliaUnder({ left: 220, right: 440 }, 660, "ltr"), false)
})
