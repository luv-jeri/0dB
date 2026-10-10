# 0nlyType: hover-card

Extracted from DESIGN.md.

### ot-peek (hover-card)
- Underneath: Radix HoverCard.
- Anatomy: `<span class="ot-peek"><a>Name</a><span class="ot-peek-card">` holding `.ot-peek-name` (aria-hidden), a sentence and `.ot-peek-meta`.
- The name, set large and cut by the card's top edge through its ascenders (and by its end, when long), slides in to meet you. It is decorative and not selectable (`user-select: none`): a selection would only paint a slab of yellow across the crop. It waits 450ms for the pointer; focus shows it at once. While the card is open its trigger holds the link's highlighter (`data-state="open"`), black on yellow, so you can see what the card belongs to. The card's text meets 4.5:1 on its paper in every scheme and mode: the body (graphite) 7.1 to 10.6, the meta line (pencil) 4.63 (statue, day) to 5.91, the name (ink) 11.7 to 18.9; selected, 16.5. Where anchor positioning exists, the card flips or centres rather than leave the screen.
- Variants go on `data-variant` of the card (`HoverCardContent variant`): name (the default), entry, quote.
- Entry, after "the uncreative": a dictionary entry for the word you point at. `HoverCardName` given a headword with its syllable points and stress mark (`gro·ˈtesque`) sets it heavy at `--ot-mf` and breaks it at each point with a dot (`.ot-peek-point`); the stressed syllable is reversed out of the ink (`.ot-peek-stress`, paper on ink, over 15:1). Then the part of speech in the italic (`.ot-term`, as dictionaries set it), the senses as an `<ol>` with bold figures hung in the margin, and the word's history in `HoverCardMeta`. The headword is decorative; the trigger is the word.
- Quote, after the magazine pull quote: what the person said, as a `<blockquote>` in the italic (their words, not ours) at `--ot-mp`, in ink. The opening mark hangs in the margin at the size of a title and the card's top edge cuts its tails, the name's crop moved to the mark. The attribution, in `HoverCardMeta`, is ours.
- Keyboard: focus opens every variant at once. Reduced motion: the points and the mark are simply there. Right to left: the name slides the other way and the margin (the senses' figures, the mark) is on the right. Forced colours: the reversed syllable keeps its ink as a system colour pair.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Hover card (`hover-card`) | Slide | The large name slides in to meet you |
| Entry hover card (`hover-card`) | Spelling out | The headword opens at its breaks and each point lands in turn |
| Quote hover card (`hover-card`) | Spiccato | The mark drops into the margin and lands |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Hover card (`hover-card`) | POINT crop | The name cut by the card's top edge |
| Entry hover card (`hover-card`) | "the uncreative"; the dictionary entry | The headword broken at its syllables, the stressed one reversed out of the ink |
| Quote hover card (`hover-card`) | The pull quote; POINT crop | Their words in the italic, the opening mark hung in the margin and cut by the edge |
