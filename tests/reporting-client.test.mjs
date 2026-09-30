import assert from "node:assert/strict"
import test from "node:test"
import { canEditRejectedSubmission, manifestFiles, receiptSecret, ReportingError } from "../lib/reporting/client.ts"
import { LIMITS } from "../lib/reporting/contracts.ts"
import { captureDimensions } from "../lib/reporting/capture.ts"
import "fake-indexeddb/auto"
import { emptyDraft, saveDraft, loadDraft, saveDraftWorkspace, loadDraftWorkspace, deleteDraft, DRAFT_TTL_MS } from "../lib/reporting/draft.ts"

const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0])
test("attachment manifest hashes original bytes and preserves retry identity", async () => {
  const file = new File([png], "reference.png", { type: "image/png" })
  const files = [{ id: crypto.randomUUID(), file }]
  const first = await manifestFiles(files), second = await manifestFiles(files)
  assert.deepEqual(first, second); assert.equal(first[0].id, files[0].id); assert.match(first[0].sha256, /^[a-f0-9]{64}$/)
  const different = await manifestFiles([{ ...files[0], file: new File([png, new Uint8Array([1])], "reference.png", { type: "image/png" }) }])
  assert.notEqual(first[0].sha256, different[0].sha256)
})
test("attachment intake refuses disguised files and count/total limits", async () => {
  await assert.rejects(manifestFiles([{ id: crypto.randomUUID(), file: new File(["<svg>"], "fake.png", { type: "image/png" }) }]), /does not match/)
  await assert.rejects(manifestFiles(Array.from({ length: LIMITS.files + 1 }, () => ({ id: crypto.randomUUID(), file: new File([png], "x.png", { type: "image/png" }) }))), /six/)
  await assert.rejects(manifestFiles(Array.from({ length: 4 }, () => ({ id: crypto.randomUUID(), file: new File([new Uint8Array(8 * 1024 * 1024)], "x.png", { type: "image/png" }) }))), /30 MiB/)
})
test("receipt secrets are independent 256-bit random values", () => {
  const first = receiptSecret(), second = receiptSecret(); assert.match(first, /^[a-f0-9]{64}$/); assert.notEqual(first, second)
})
test("first definite validation failures remain editable while uncertain retries stay frozen", () => {
  assert.equal(canEditRejectedSubmission(new ReportingError("Invalid public title", 422), false), true)
  assert.equal(canEditRejectedSubmission(new ReportingError("Invalid public title", 422), true), false)
  for (const status of [0, 408, 409, 500, 502, 503]) assert.equal(canEditRejectedSubmission(new ReportingError("Uncertain", status), false), false)
})
test("viewport capture does not inherit full-page height limits", () => {
  assert.deepEqual(captureDimensions("viewport", 1440, 45000, 900), { width: 1440, height: 900 })
  assert.throws(() => captureDimensions("page", 1440, 45000, 900), /too large/)
})

test("draft expiry removes files, frozen retry tokens and both draft keys", async () => {
  const originalNow = Date.now
  let time = originalNow()
  Date.now = () => time
  try {
    await deleteDraft()
    const draft = { ...emptyDraft(), files: [{ id: crypto.randomUUID(), file: new File([png], "private.png") }], frozen: { report: { id: crypto.randomUUID() }, token: "private-retry-token" } }
    await saveDraft(draft)
    await saveDraftWorkspace({ activeKind: "bug", drafts: { bug: draft } })
    time += DRAFT_TTL_MS - 1
    assert.equal((await loadDraftWorkspace()).drafts.bug.frozen.token, "private-retry-token")
    time += 1
    assert.equal(await loadDraftWorkspace(), null)
    assert.equal(await loadDraft(), null)
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open("0db-reporting-v1", 1)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    const count = await new Promise(resolve => {
      const request = db.transaction("drafts").objectStore("drafts").count()
      request.onsuccess = () => resolve(request.result)
    })
    db.close()
    assert.equal(count, 0)
  } finally { Date.now = originalNow; await deleteDraft() }
})

test("clearing a workspace removes every private local draft", async () => {
  await saveDraftWorkspace({ activeKind: "request", drafts: { request: emptyDraft(), bug: { ...emptyDraft(), kind: "bug", email: "private@example.com" } } })
  await deleteDraft()
  assert.equal(await loadDraftWorkspace(), null)
})

test("client submits the frozen identity and uses bearer tokens only on private routes", async () => {
  const priorAPI = process.env.NEXT_PUBLIC_REPORTING_API_URL
  process.env.NEXT_PUBLIC_REPORTING_API_URL = "https://feedback-0db.cojeev.com/"
  const client = await import("../lib/reporting/client.ts?configured")
  const originalFetch = globalThis.fetch
  const calls = []
  const receipt = { id: crypto.randomUUID(), token: "b".repeat(64), status: "received", topicId: null, email: "setup_required", issue: "setup_required", attachments: [] }
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init })
    return Response.json(receipt)
  }
  try {
    const frozen = { report: { id: receipt.id }, token: receipt.token }
    await client.submitReport(frozen, "challenge")
    await client.submitReport(frozen, "fresh-challenge")
    assert.deepEqual(JSON.parse(calls[0].init.body).report, JSON.parse(calls[1].init.body).report)
    assert.equal(JSON.parse(calls[1].init.body).token, receipt.token)
    await client.fetchReceipt(receipt.id, receipt.token)
    await client.uploadAttachment(receipt, { id: "file-id", file: new File([png], "capture.png", { type: "image/png" }) })
    assert.equal(calls[0].url, "https://feedback-0db.cojeev.com/v1/reports")
    assert.equal(calls[2].init.headers.Authorization, `Bearer ${receipt.token}`)
    assert.equal(calls[3].init.body.type, "image/png")
    for (const call of calls) {
      assert.equal(call.init.credentials, "omit")
      assert.equal(call.init.cache, "no-store")
      assert.ok(call.init.signal)
      assert.ok(!call.url.includes(receipt.token))
    }
    globalThis.fetch = async () => Response.json({ error: "Wait", retryAfter: 60 }, { status: 429 })
    await assert.rejects(client.submitReport(frozen, ""), error => error.status === 429 && error.message === "Wait")
    globalThis.fetch = async () => { throw new Error("disconnected") }
    await assert.rejects(client.submitReport(frozen, ""), error => error.status === 0 && /same report/.test(error.message))
  } finally {
    globalThis.fetch = originalFetch
    if (priorAPI === undefined) delete process.env.NEXT_PUBLIC_REPORTING_API_URL
    else process.env.NEXT_PUBLIC_REPORTING_API_URL = priorAPI
  }
})
