import assert from "node:assert/strict"
import { withComponent } from "./component-browser.mjs"

await withComponent("time-range", async ({ page, settle }) => {
  const submitted = await page.evaluate(() => Object.fromEntries(new FormData(document.getElementById("settings"))))
  assert.equal(submitted.from, "09:00")
  assert.equal(submitted.until, "17:30")
  const end = page.locator('[data-slot="time-range-end"]')
  await end.fill("08:00")
  await settle(() => !document.querySelector('[data-slot="time-range-end"]').validity.valid)
  await page.getByRole("button", { name: "Allow overnight" }).click()
  await settle(() => document.querySelector('[data-slot="time-range-end"]').validity.valid)
  await page.getByRole("button", { name: "Reset", exact: true }).click()
  await settle(() => document.querySelector('[data-slot="time-range-end"]').value === "17:30")

})
