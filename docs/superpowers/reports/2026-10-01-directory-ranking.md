**Verdict: mostly correct, but the fallback, item counting, name matching, and “98.96 ceiling” need correction.**

Verified against current main, **[`d75a96ab`](https://github.com/shadcn-ui/ui/commit/d75a96ab781f3d659be1ad287347d5887ce9f2fc)**. Ranking arrived in **[`7c29a199`](https://github.com/shadcn-ui/ui/commit/7c29a19961da80a38a560e5d4905af8e8ee4392c)**, September 30. Calculations use the [live feed](https://ui.shadcn.com/r/registries.json) checked **October 1, 17:27:56 UTC**, containing 408 registries; a subsequent fetch returned identical data.

| Claim | Verdict | Exact qualification |
|---|---|---|
| Group 0: healthy/degraded, descending ranking, alphabetical ties | **Verified** | When ranking metadata exists; otherwise eligible entries use health scores. |
| Group 1: observing, monitoring-limited, missing ranking, empty catalog | **Verified** | Also missing health; missing ranking matters only when ranking is enabled. |
| Unavailable last | **Verified** | Alphabetical within that group; `hidden` does not remove entries. |
| Alphabetical fallback **only** for missing/stale feed | **Corrected** | Invalid/future-dated health also gets discarded; freshness is checked per entry. Fresh health without usable ranking uses health-score order. |
| `0.8H + 20 log1p(min(items,500))/log1p(500)` | **Verified** | Rounded to three decimals. |
| Health weights 45/25/20/10; four setup checks | **Verified, with correction** | Both registry names are normalized; unknown setup signals receive 1.25 points. |
| Prior-smoothed, ceiling ≈98.96 | **Corrected** | Smoothing exists; **no fixed 98.96 ceiling exists**. |

Sources: [directory.ts:16–85](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/lib/registry-health/directory.ts#L16-L85), [rank.ts:3–16](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/lib/registry-health/rank.ts#L3-L16), [score.ts:212–224,358–438](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/lib/registry-health/score.ts#L212-L438).

**1. Exact comparator and legal names**

```js
a.name.toLowerCase().localeCompare(b.name.toLowerCase(), "en")
```

No options are passed. It compares the **namespace including `@`**, not a separate display name. English defaults include `numeric:false` and `ignorePunctuation:false`. My Node check ordered `_ < - < 0 < 1 … < letters`; therefore `@10` precedes `@2`. After a common prefix: `@0_a < @0-a < @00 < @0a`. [directory.ts:16–18](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/lib/registry-health/directory.ts#L16-L18)

Legal namespaces match **`^@[a-zA-Z0-9][a-zA-Z0-9_-]*$`**. Thus `@0` is legal; leading `@-`/`@_` are not. Subsequent hyphens/underscores and uppercase are permitted; duplicates are rejected case-insensitively. No explicit maximum length appears. [registry-directory.ts:3–37](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/lib/registry-directory.ts#L3-L37)

**2. Entry, observing, and prior decay**

Leaving observing requires **at least 24 non-challenge index observations AND a span of at least 24 hours** from first observation. Perfect hourly execution normally reaches this on check **25**, at +24 hours. Group 0 additionally needs positive ranking count and no monitoring limitation; neither a weekly dry run nor ten item checks is an admission requirement. First observed October 2 IST → earliest October 3 IST, plus scheduling/publication delay. [score.ts:237–355](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/lib/registry-health/score.ts#L237-L355)

Each rate is `(successes + μw)/(observations + w)`. Weights **stay fixed**: availability 24, schema 12, items 10, dry runs 3. Their relative influence is `w/(n+w)`. Availability uses 7/30-day windows; correctness/installability use 30 days. Global means are recalculated from monitored observations. [score.ts:12–26,90–216](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/lib/registry-health/score.ts#L12-L216)

Consequently, the prior **never simply washes out**: with 168 weekly observations its availability share remains 12.5%; with five dry runs, 37.5%. About 30 days fills the longest window, but guarantees neither 98.961 nor 100. There is no defensible “ceiling date.”

**3. What items count**

Ranking counts **case-sensitive distinct names from the latest successfully validated index**, not raw array length. Failed later index checks retain the previous catalog. Individual endpoint success is not required before an item contributes to count. [monitor.ts:196–221,302–304,650–654](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/lib/registry-health/monitor.ts#L196-L654)

There is no type filter: all schema-supported types count, including UI, component, block, lib, hook, page, file, theme, style, item, base, font, and even schema-supported internal/example types. Different-name variants/icons explicitly count. [schema.ts:81–98](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/packages/registry/src/registry/schema.ts#L81-L98), [health.mdx:170–174](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/content/docs/registry/health.mdx#L170-L174)

Large catalogs increase response size and sampling work; **500 caps the breadth bonus, not monitoring work**.

**4. Fetching, sampling, and Workers failures**

- **Hourly:** replace `{name}` with `registry`; validate the complete index schema. `{style}` becomes `radix-vega`. Correctness awards 10 points for index validity and 15 for sampled-item validity.
- **“Daily”:** due after **20 hours**, globally; sequential rotating sample `ceil(indexLength/30)`. Fetch each item URL, validate its schema and exact name; slash-containing requested names bypass name equality.
- **“Weekly”:** due after **6 days**, globally; one deterministically shuffled distinct item, preferring recently unchecked items. Runs the repository CLI’s `add @namespace/item --dry-run --yes` in a temporary configured project.

Sources: [monitor.ts:31–39,308–415,542–611](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/lib/registry-health/monitor.ts#L308-L611), [workflow:3–5](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/.github/workflows/monitor-registries.yml#L3-L5).

Index/item fetches allow **10 seconds per attempt, 10 MiB, five redirects, up to three attempts** for retryable failures. Dry runs allow **60 seconds**, then five seconds before forced termination. They resolve registry dependencies and transform files; they do not perform an npm install or application build. [network.ts:10–13,541–582](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/lib/registry-health/network.ts#L541-L582), [dry-run.ts:19–25,96–165](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/lib/registry-health/dry-run.ts#L19-L165), [CLI dry-run.ts:96–127](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/packages/shadcn/src/utils/dry-run.ts#L96-L127).

Static Workers assets can fail through wrong paths, HTML fallback, malformed JSON/schema, name mismatch, authentication, missing dependencies, redirects, oversized responses, or timeouts. Recognized Cloudflare challenges exclude index/item observations from failure rates but make the latest index monitoring-limited; CLI challenge failures still affect installability. [network.ts:282–312](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/lib/registry-health/network.ts#L282-L312)

Setup name matching lowercases **both** names, removes spaces and a leading `@`; it does not demand literal lowercase equality. [registry-directory.ts:63–65](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/lib/registry-directory.ts#L63-L65)

**5. Page one**

**10 entries**; position 10 is the last slot. I executed the pinned `createRegistryDirectoryView` against the feed. [directory.ts:91–122](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/lib/registry-health/directory.ts#L91-L122)

| Position | Namespace | Health | Ranking | Items |
|---:|---|---:|---:|---:|
| 1 | `@soundcn` | 98.961 | 99.169 | 816 |
| 10 / last | `@registrydirectory` | 98.565 | 98.852 | 14,207 |

**6. Your landing positions**

[registry.json](/Users/sanjaykumar/Developer/sa/registry.json) contains **108 unique items: 103 UI + four item + one base**.

These are insertions as `@0db` into the frozen feed, assuming group-0 eligibility. **98.961 is today’s observed maximum, not a ceiling.** The early scenario uses **94.940**, actually observed for healthy `@stealth`, approximately 33 hours old.

| Items | H=98.961: score → position | Early H=94.940 | Hypothetical H=100 |
|---:|---|---|---|
| 108 | 94.262 → **68** | 91.045 → **146** | 95.093 → **53** |
| 250 | 96.945 → **36** | 93.728 → **81** | 97.776 → **18** |
| 500 | 99.169 → **1**, tie won | 95.952 → **43** | 100 → **1** |
| 1,000 | 99.169 → **1**, tie won | 95.952 → **43** | 100 → **1** |

Before eligibility, observing `@0db` would land **360th**, regardless of those scores. These are conditional scenarios, not predicted future health.

**7. Submission and anti-gaming gates**

Published requirements: public/open-source registry, valid schema, flat endpoints, index file entries without `content`; submit `directory.json`, run validation, obtain review. Validation checks metadata, not remote functionality. Merge publishes immediately. [registry-index.mdx:16–33](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/content/docs/registry/registry-index.mdx#L16-L33), [validate-registries.mts:13–40](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/scripts/validate-registries.mts#L13-L40)

No numerical minimum or extra ranking gate appeared in CONTRIBUTING; no PR template was found. Single-item `@videocn` was accepted through [merged #12052](https://github.com/shadcn-ui/ui/pull/12052); [its original closure](https://github.com/shadcn-ui/ui/pull/12013#issuecomment-5895119296) was batching, not rejection.

[#12058](https://github.com/shadcn-ui/ui/pull/12058) contained no human discussion/reviews about gaming. Related searches found no explicit shadcn prohibition. Deduplication and the cap are documented safeguards; calling meaningless aliases/padding “gaming” is my assessment.

**Dependency-ordered plan**

1. Make all 108 real items, dependencies, HTTPS/JSON endpoints and setup checks pass; submit and obtain merge.
2. Accumulate the required baseline, then sustained successful sampling.
3. Reach page one through useful catalog growth and health: today’s threshold needs roughly **454 items at H=98.961**, or **H=98.565 at 500**.
4. For #1, exceed **99.169**, or match it with an earlier namespace. `@0db` beats `@soundcn` on an exact tie; a name cannot overcome a lower score or observing status. Renaming normally starts new name-keyed history.
5. Avoid artificial aliases/splits. Beyond 500 there is no direct breadth gain, although increased sampling can indirectly change smoothed health.

Read-only throughout. Comparator/scenario execution took approximately **1.3 seconds**, separate from research; no builds or app tests.