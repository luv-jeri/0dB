# 0dB: text-diff

Extracted from DESIGN.md.

### db-text-diff (text-diff)
- Underneath: Native section and a named group of three pressed buttons, with del and ins around actual removed and added text. No tab-widget roles, pretend labels or colour-only distinction. Native root props and ref pass through.
- Creative move: Small struck roman is interrupted by large replacement italic. Three numbered readings share a travelling proof coordinate. Reference: Basquiat strike (19.jpg), Weingart proof (12.jpg).
- Behavior: Distinct from Note's one authored correction: this computes changes between arbitrary plain-text passages. Whitespace tokens are retained; bounded LCS compares words, with a shared-prefix/shared-suffix replacement for more than 250000 middle-token pairs. Each view projects the exact original or revision. Added and Removed are explicitly named for assistive reading; the diff is not announced as a live stream. Controlled view and uncontrolled defaultView share the same request.
- Motion: proof-sheet turnover. Choosing a reading moves its proof coordinate and turns the setting from the baseline; replacements grow past their reading size and settle while old words remain small struck roman. A new view replaces the unfinished turn. Reduced motion resolves directly; each action ends at rest. Native focus and hit areas remain stable.
- Access: native controls retain keyboard and touch activation, focus remains visible, long text wraps in flow, logical spacing follows local direction, reduced motion changes directly and forced colours retain semantic lines and system focus. `[hidden]` keeps its native meaning.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Text diff (`text-diff`) | Proof-sheet turnover | Choosing a reading moves its proof coordinate and turns the setting from the baseline; replacements grow past their reading size and settle while old words remain small struck roman. A new view replaces the unfinished turn. |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Text diff (`text-diff`) | Basquiat strike (19.jpg), Weingart proof (12.jpg) | Small struck roman is interrupted by large replacement italic. Three numbered readings share a travelling proof coordinate. |
