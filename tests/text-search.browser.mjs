import assert from "node:assert/strict"
import { withComponent } from "./component-browser.mjs"

await withComponent("text-search", async ({ page }) => {
  const search = page.locator('[data-slot="text-search"]')
  await search.getByRole("button", { name: "Next", exact: true }).click()
  await search.getByRole("button", { name: "Next", exact: true }).click()
  assert.equal(await search.getByRole("status").innerText(), "3 of 3 matches")
  assert.equal(await search.getAttribute("data-located"), "")
  await search.getByRole("searchbox").fill("and")
  assert.equal(await search.getAttribute("data-located"), null)
  await search.getByRole("searchbox").fill("one")
  assert.equal(await search.getByRole("status").innerText(), "1 of 3 matches")


})
