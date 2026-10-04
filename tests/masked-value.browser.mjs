import assert from "node:assert/strict"
import { withComponent } from "./component-browser.mjs"

await withComponent("masked-value", async ({ page }) => {
  const initial = page.locator('[data-slot="masked-value"]').first()
  assert.equal(await initial.evaluate((el) => getComputedStyle(el.querySelector("bdi")).animationName), "none")
  const masked = page.locator('[data-slot="masked-value"]').last()
  await masked.getByRole("button", { name: "Reveal Private reading" }).click()
  await masked.getByRole("button", { name: "Hide Private reading" }).click()
  assert.equal(await masked.locator("bdi").count(), 0)
  assert.equal(await page.evaluate(() => document.activeElement.dataset.slot), "masked-value-trigger")

})
