import assert from "node:assert/strict"
import { withComponent } from "./component-browser.mjs"

await withComponent("shortcut-recorder", async ({ page, read, settle }) => {
  const submitted = await page.evaluate(() => Object.fromEntries(new FormData(document.getElementById("settings"))))
  assert.equal(JSON.parse(submitted.shortcut).key, "J")
  const shortcut = page.getByRole("group", { name: "External shortcut" })
  await shortcut.getByRole("button", { name: "Record", exact: true }).click()
  await page.keyboard.down("Control")
  await page.keyboard.down("k")
  await page.keyboard.down("k")
  await page.keyboard.down("k")
  assert.equal(await read('[data-testid="host-keys"]'), "0")
  await page.keyboard.up("k")
  await page.keyboard.down("k")
  await settle(() => document.querySelector('[data-testid="host-keys"]').textContent === "1")
  await page.keyboard.up("k")
  await page.keyboard.up("Control")
  assert.match(await shortcut.locator('[data-slot="shortcut-chord"]').innerText(), /K/)
  await shortcut.getByRole("button", { name: "Record", exact: true }).click()
  await shortcut.getByRole("button", { name: "Cancel", exact: true }).press("Escape")
  assert.equal(await shortcut.getByRole("button", { name: "Record", exact: true }).getAttribute("aria-pressed"), "false")
  await shortcut.getByRole("button", { name: "Clear", exact: true }).click()
  assert.equal(await page.evaluate(() => document.activeElement.dataset.slot), "shortcut-record")
  await page.getByRole("button", { name: "Reset", exact: true }).click()
  await settle(() => document.querySelector('[data-slot="shortcut-chord"]').textContent.includes("J"))

})
