# 0nlyType: message

Extracted from DESIGN.md.

### ot-msg, ot-bubble, ot-reactions (message)
- Underneath: native.
- Anatomy: `<article class="ot-msg" data-from="them | you" data-variant="script | quote">` holding an `ot-avatar`, `.ot-msg-head`, `.ot-msg-body` (optionally a `<p class="ot-bubble" data-variant="ink | mark">`), and `.ot-msg-foot` with `.ot-msg-status` (`data-read`). Reactions are `<span class="ot-reactions">` of `<button class="ot-tag" aria-pressed>` with `.ot-reaction-count`.
- No balloons. Of the speech bubble, only its tail is left: a leaning hairline. What you wrote sits on the other side, in italic. Sent is a ring; read, it fills to a dot. New messages write in from the inline start (`ot-message-write`, from the right on a right-to-left page). A reaction you add turns italic and its count rolls. A bubble can be `ink` (reversed out of a block, the tail beneath it) or `mark` (a highlighter behind the words; selected inside it, the words reverse to ink, as in a mark).
- Script, after the printed play text. No face and no tail. The name stands in the margin in spaced capitals with a full stop, the time under it in parentheses like a stage direction, and the words sit in one column for everyone, on the name's baseline. Nobody is placed on a side: who is speaking shows only in the type, theirs roman and yours italic, which is the house rule with nothing else holding it up. Narrow (below 30rem) the name runs in above the words. Right to left, the margin is on the right.
- Quote, after the typographer's own speech balloon, the quotation mark, set at the scale of "It has to be design.". No face and no tail: a large pencil italic mark (`::before`, `--ot-ff`, aria-hidden by its empty alt text) stands where the face was. Theirs opens (“) at the top of the start; yours closes (”) at the foot of the end, so an exchange is framed from both sides. Arriving, the mark lands with spiccato before the words write in. Right to left the mark is mirrored. Forced colours: the mark is `GrayText`.
- Typing (`MessageTyping`, `<p class="ot-bubble ot-typing" role="status" data-writing>`): the other side is writing. Of a message only the tail and three periods are there, where the words will be, sketched in pencil until the message inks them in; the periods breathe in turn, as a busy button's do (`ot-dots`). It shows only while `writing` is true, which the caller drives from the real typing state, so it is not motion that plays by itself. Not writing, it stays mounted as an empty, silent status (`.ot-sr`) that takes no room, so its `label` ("Ada is writing") is heard when writing starts. Alone it stands after the last message; given a face (a `Message` holding a `MessageAvatar` and a `MessageBody` with the typing in place of a bubble) that message folds away with it while nobody writes. In the script variant the periods stand in the column after the name, a line about to be spoken. Reduced motion: the periods trail off and dim, as the spinner's do.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Message (`message`) | Written | New messages write in; the status ring fills to a dot |
| Reactions (`message`) | Roll | Yours turns italic; the count rolls |
| Quote message (`message`) | Spiccato | Arriving, the quotation mark lands, then the words write in |
| Typing (`message`) | Breath | Only while they write: the periods lift as they brighten, in turn |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Message (`message`) | "It has to be design." | Theirs roman, yours italic; only the tail |
| Script message (`message`) | The printed play text | The name in the margin; only the type says who speaks |
| Quote message (`message`) | The quotation mark as the printed balloon; "It has to be design." scale | A large mark opens theirs and closes yours |
| Typing (`message`) | The ellipsis; the busy button's periods | Only the tail and three periods where their words will be, in pencil |
