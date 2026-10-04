import assert from "node:assert/strict"
import { withComponent } from "./component-browser.mjs"

await withComponent("allocation", async ({ page, settle }) => {
  const submitted = await page.evaluate(() => Object.fromEntries(new FormData(document.getElementById("settings"))))
  assert.equal(submitted["shares[a]"], "8")
  assert.equal(submitted["shares[b]"], "12")
  const shares = page.getByRole("group", { name: "External shares" })
  await shares.getByRole("spinbutton", { name: "Research" }).fill("100")
  assert.equal(await shares.getByRole("spinbutton", { name: "Research" }).inputValue(), "28")
  assert.equal(await shares.getByRole("spinbutton", { name: "Type" }).inputValue(), "12")


  await page.getByRole("button", { name: "Reset", exact: true }).click()
  await settle(() => document.querySelector('[data-slot="allocation-input"]').value === "8")
  await page.evaluate(() => document.getElementById("settings").addEventListener("reset", (e) => e.preventDefault(), { once: true }))
  await shares.getByRole("spinbutton", { name: "Research" }).fill("20")
  await page.getByRole("button", { name: "Reset", exact: true }).click()
  await page.waitForTimeout(20)
  assert.equal(await shares.getByRole("spinbutton", { name: "Research" }).inputValue(), "20")
  const balance = page.getByRole("group", { name: "Changing allowance" }).locator("output")
  assert.match(await balance.innerText(), /Unassigned:.*5/s)
  await page.getByRole("button", { name: "Change allowance" }).click()
  assert.match(await balance.innerText(), /Over allowance:.*5/s)
  const decimals = page.getByRole("group", { name: "Decimal shares" })
  assert.equal(await decimals.getAttribute("aria-invalid"), null)
  assert.equal(await decimals.getByRole("spinbutton", { name: "One", exact: true }).getAttribute("max"), "0.1")
  assert.equal(await decimals.getByRole("spinbutton", { name: "Two", exact: true }).getAttribute("max"), "0.2")
  assert.equal(await decimals.evaluate((el) => [...el.querySelectorAll("input")].every((input) => input.validity.valid)), true)

  const stepped = page.getByRole("group", { name: "Stepped shares" })
  await stepped.getByRole("spinbutton", { name: "First" }).fill("9")
  assert.equal(await stepped.getByRole("spinbutton", { name: "First" }).inputValue(), "6")
  assert.equal(await stepped.getByRole("spinbutton", { name: "Second" }).inputValue(), "3")
  assert.equal(await page.locator("#stepped").evaluate((form) => form.checkValidity()), true)
})
