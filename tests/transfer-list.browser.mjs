import assert from "node:assert/strict"
import { withComponent } from "./component-browser.mjs"

await withComponent("transfer-list", async ({ page, settle }) => {
  const transfer = page.locator('[data-slot="transfer-list"]')
  await transfer.getByLabel("Proof", { exact: true }).check()
  await transfer.getByRole("button", { name: "Include selected" }).click()
  assert.equal(await page.evaluate(() => document.activeElement.dataset.slot), "transfer-heading")
  assert.deepEqual(await page.evaluate(() => new FormData(document.getElementById("membership")).getAll("parts")), ["a", "b"])
  assert.equal(await transfer.getByRole("status").innerText(), "1 Included")
  await transfer.getByLabel("Release", { exact: true }).check()
  assert.equal(await transfer.getByRole("status").innerText(), "")
  await transfer.getByRole("button", { name: "Include selected" }).click()
  assert.equal(await transfer.getByRole("status").innerText(), "1 Included")
  assert.match(await transfer.getByRole("heading", { name: /Included/ }).innerText(), /03/)
  assert.equal(await transfer.getByRole("heading", { name: /Included/ }).locator("small").getAttribute("aria-hidden"), null)
  await page.getByRole("button", { name: "Reset membership" }).click()
  await settle(() => document.querySelectorAll('[data-slot="transfer-item"][data-included]').length === 1)


})
