# 0nlyType: agent-chat

Extracted from DESIGN.md.

### db-agent-chat (agent-chat)
- Underneath: native, composed from `thread`, `message`, `attachment`, `field`, `dialog`, `radio-group`, `progress`, `marker`, `agent-state`, `button` and `kbd`. The composer is the one new piece.
- Anatomy: `<section class="db-agent-chat" data-variant="callout">` holding `header.db-agent-chat-head` (an `h2` and a `db-agent` status), `.db-agent-chat-thread` (a `db-thread`) and `form.db-agent-compose` (`data-over` while files are dragged over it) with a `db-field` textarea, `ul.db-attachments.db-agent-encl` (enclosure), and `.db-agent-compose-actions` (Attach, a hidden multiple file input, `.db-agent-compose-hint` with two `db-kbd`, then Send or Stop). In the thread: `div.db-agent-note` around a `db-marker` status (a note, or a permission's receipt with `data-decision="pending | allowed | denied"`) or a sentence `db-progress` (the work), and `div.db-agent-choice` (`data-answered`) holding a vertical `db-choice` and a bracket Continue.
- After "It has to be design.": the agent's words are ours, in roman; yours arrive in italic, in the thread and on the composer's ruled lines. When it asks permission the question is heavy and narrow and the answers are large in italic (the dialog's reply surface, an alert). Deny has the focus and Escape denies, so nothing is allowed by default; the question and your answer stay behind as a receipt, "Read last season's timetable? Allowed once.", the answer italic because it's yours. A choice is the radio words in a column; answered, only your word stays inked. The work is a sentence that inks in at the size of the messages and ends in a full stop.
- The composer: Enter starts a new line, ⌘ Enter (Ctrl Enter elsewhere, `aria-keyshortcuts`) sends. Files come by Attach or by dropping them on the composer and are written under the box as a letter's "Encl. (2)"; dragged over, the count takes the incoming files and a pencil italic line says "Let go to enclose all 2." before anything is added. While the agent is busy, Send gives way to a bracket Stop and the box stays open for your next words. An error hangs from the box as the field's callout. Send and Stop keep the far end, wrapped or not; below 22rem the key hint gives way. Every word is a prop with an English default (`sendLabel`, `stopLabel`, `attachLabel`, `sendsLabel`, `dropLabel(count)`; on the permission `allowLabel`, `denyLabel`, `allowedLabel`, `deniedLabel`, `metaLabel`, `pendingLabel`), so a right-to-left page reads in its own language.
- Callout (`data-variant="callout"`), after the Weingart letter: the notes, receipts and the work leave the column and hang at the far side, reversed out of ink pills (the tokens are swapped inside, so the work sentence inks in reverse), each on a hairline leader that reaches back toward the conversation and ends in a dot.
- Typing: keep a `MessageTyping` mounted last in the thread and drive `writing`; when the reply comes, set writing false and add the new `Message` with `arriving` before it. The header's `db-agent` is the one live status for where the agent is.
- Right to left the whole column mirrors and the leaders reach the other way. Reduced motion: the parts' own still frames. Forced colours: the pills are Canvas with a CanvasText edge and leader.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Agent chat (`agent-chat`) | Count in | Files dragged over are counted into the enclosure line before you let go; the rest is its parts' own motion, each answering you or the agent |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Agent chat (`agent-chat`) | "It has to be design." (theirs roman, yours italic) | The agent's words roman, yours italic; its question heavy and narrow, your answer large in italic and kept as a receipt |
| Callout agent chat (`agent-chat`) | Weingart letter's callouts | The work and the receipts hang at the far side in reversed pills on leader lines that end in dots |
