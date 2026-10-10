# 0nlyType: questionnaire

Extracted from DESIGN.md.

### db-quest (questionnaire)
- Underneath: native form.
- Anatomy: `<form class="db-quest" data-variant="sentence | interview | definition">` holding `.db-quest-head` (an `db-fraction` count and a filling hairline), in an interview `<ol class="db-quest-log">`, `.db-quest-step` sections each with a `.db-quest-q` question and its controls, `.db-quest-actions` (Skip, Next), then `.db-quest-said` (`aria-live="polite"`) holding, in a definition, `.db-quest-entry` (`.db-quest-word`, `.db-quest-kind`), and `.db-quest-sentence`. `defaultAnswers` and `defaultStep` resume one.
- One question at a time, set large. The count rolls and the hairline fills; each question turns in from the side you're heading (`db-turn`). At the end your answers are written into one sentence, arriving word by word, in italic, because every word of it is yours.
- Interview: after the printed interview's Q and A. Every question asked stays above the next, small and roman, with your answer under it in italic; Q and A hang in the margin in pencil and step in below 860px. Each answer is a button: pressing it goes back to that question (a hairline sketches under it when pointed at). A skipped one says so in pencil. At the end the whole transcript stands over the sentence.
- Definition: after "the uncreative" (poster VI and its definition). The end is a dictionary entry: the headword (yours, so in the large italic) reversed out of an ink block that draws across behind it from the inline start, the part of speech under it small in roman, then the sense in italic at the lead size, a usage in quotation marks if you wrote one. `entry(answers)` gives the word and its part of speech. Forced colours: Canvas on CanvasText.
- Keyboard: native form controls; focus moves to each new question (to the chosen answer when you go back to one).

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Questionnaire (`questionnaire`) | Turn | Questions turn in from where you're heading; the sentence writes in |
| Interview questionnaire (`questionnaire`) | Minutes | The answered pair is written into the transcript as the next question turns in |
| Definition questionnaire (`questionnaire`) | Reversal | The ink block draws across and the headword appears in it where it has reached; the sense writes in after |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Questionnaire (`questionnaire`) | Healthy habits → | Your answers written as one sentence |
| Interview questionnaire (`questionnaire`) | The printed interview's Q and A | What's been asked stays as a transcript; press an answer to go back |
| Definition questionnaire (`questionnaire`) | "the uncreative" | The end as a dictionary entry, your headword reversed out of ink |
