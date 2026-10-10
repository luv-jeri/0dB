# 0nlyType: form

Extracted from DESIGN.md.

### ot-form (form)
- Underneath: a native `<form>` with `noValidate`, plus a hook. The browser's own constraint validation decides what's wrong; the form only says it the 0nlyType way.
- Anatomy: `<form class="ot-form">` holding `ot-field`s on a grid and one `FormSubmit`, a statement button.
- On submit it checks every control. Each invalid one gets its Field's error callout (the control's `data-error`, else the browser's message), `aria-invalid` and `aria-describedby`, and focus goes to the first. Typing clears or updates that field's error.
- Sending: `FormSubmit` goes busy and says so (`busy="Sending"`), with the breathing periods. A second submit while one runs is ignored.
- Copy: the button names the action (Send, Save), never Submit. Errors say what to fix.
- Sent: `FormSubmit sent="Sent"` says so once `onSubmit` resolves, until anything is changed, so the action keeps one name: Send, Sending, Sent.
- Variants go on `data-variant`: grid (the default), letter, postmark.
- Letter, after Weingart's letter to AIGA: the form is a letter, our words in roman prose and each field a blank in it that you fill in italic. The prose names each blank, so its label, hint and callout are kept for screen readers only (the control still gets `aria-invalid` and `aria-describedby`). A textarea stays a block, the letter's body. After a failed send, what's still wrong is said once, in a postscript under the letter (`FormPostscript`): "P.S." in ink, then each thing to fix in the signal, each a link that takes focus to its blank. It arrives once and shortens as you fix things.
- Postmark, after the postal hand stamp: once sent, a postmark comes down on the form's end corner, beside the button that sent it and clear of what you wrote (`FormPostmark`, `role="status"`). A double ring set askew, "Sent", the day large as the dot calendar sets it, the month and year, the time. It is ink, so the one accent stays with you. It lands once with spiccato, and lifts off as soon as anything is changed. Right to left it leans the other way; reduced motion, it is simply there; forced colours, `CanvasText` rings on `Canvas`.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Letter form (`form`) | Arrive | The postscript arrives once, after a failed send |
| Postmark form (`form`) | Stamp | The postmark comes down from above, turning into its tilt, with spiccato |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Letter form (`form`) | Weingart letter; the postscript | The fields are blanks in prose; what's wrong is said once, in a P.S. |
| Postmark form (`form`) | The postal hand stamp; the dot calendar's day; the collage's hand rings | Sent, the day and the time in a double ring, set askew |
