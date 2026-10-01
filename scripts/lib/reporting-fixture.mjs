// Static-site browser checks use public read fixtures, without contacting a live reporting service.
export async function fixtureReportingReads(context) {
  for (const [path, response] of [
    ["/v1/config", { emailEnabled: false, turnstileSiteKey: "", local: false }],
    ["/v1/requests?*", { requests: [], hasMore: false }],
  ]) {
    await context.route(`https://feedback.thedirectors.agency${path}`, (route) => {
      if (route.request().method() !== "GET") return route.abort()
      return route.fulfill({ json: response, headers: { "access-control-allow-origin": "*" } })
    })
  }
}
