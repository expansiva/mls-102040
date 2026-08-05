# Machine brief — Rapid entry workbench

Apply after the Salesforce global and Field data capture briefs. A bench with everything on it: one capture card per declared command, all visible at once, and the sitting's evidence beside or below them. Nothing is reached — no chooser, no step, no fold — because the fastest way to the second entry is for the surface never to have moved.

A layout may require more than the page brief, never less. This one requires nothing beyond the page's own minimum: one command with one fillable input is a bench with one card on it.

It excludes the arrangement that shows one decision at a time — a chooser, beats, a progress rail, a review before commit — which is the other layout and answers the case of gloves and sunlight. It also excludes any wizard, tab, accordion or "add entry" control that has to be pressed before a form exists, and a single submit shared by two cards.

## State

```ts
sitting: { subject: string; values: Field[]; at: string }[];   // what this bench committed, most recent first
```

Nothing else. Every field's value lives in its command's declared input state, and every commit's progress and error live in that command's own binding — a copy of either on the bench would be a second answer to what is about to be recorded.

The sitting list is this arrangement's own memory, and it is view state: it holds only what a commit on this bench returned, it is never persisted, and it is never presented as a query the page does not have.

## Shapes and containment

| Shape | Arrangement |
| --- | --- |
| Wide | cards in one row while each keeps a comfortable form width, the evidence as a trailing rail at its own readable width; a single card sits centred at a comfortable form width and is never stretched to fill the row |
| Medium | cards wrap to further rows of the same width, the evidence still trailing when it fits, otherwise below the bench |
| Narrow | one column: cards stacked full width, the evidence below them, and touch targets one step larger than the desktop default |

- The page is viewport-bounded and the bench scrolls as one surface: no card scrolls inside itself, because a field that scrolls out of its own card is a field the reader stops finding.
- The evidence never takes space from a card below its readable width. When both cannot fit, the evidence moves under the bench — it is subordinate, and the next entry outranks the last one.
- **A card never collapses, folds or hides its fields.** Everything the entry needs is visible when the card is: the bench's promise is that nothing has to be opened.
- Touch targets never shrink on the narrow shape. This page is filled with a thumb, in the field, and the design system's spacing scale is where the comfortable size comes from.
- Switch shape before a card's longest label wraps past its input, before two cards in a row drop below a comfortable form width, and before the evidence's most recent entry stops fitting on one line.
- Report the arithmetic: the number of cards times the comfortable form width for the widest declared input, plus the evidence rail's readable width, against the available width.

## The cards

- One card per declared recording command, in the contract's declared order, all the same width in a row. A card's title is the entry it records, in business words, verb-first — and never the label of its own commit button.
- Inside a card, the reading order is the order of the decision: the entry's target first, then its measures and dates, then optional free text last and quiet. The commit is the last thing in the card, alone in its trailing row.
- The sitting caption — who is recording, which site — sits once above the bench, not once per card: repeated on every card it becomes noise, and the reader stops reading it exactly when it changes.
- A card that is committing dims and locks only itself, keeps its values visible, and shows the running state on its own action. Its neighbours stay fully usable — a bench where one commit freezes the others is a bench with one card.
- After a successful commit the card is empty again in place, with its brief confirmation where the reader's eyes already are, and the first field of that same card is where typing continues. The card must not change height between empty, filled and confirmed states, or the bench jumps under the reader's hands.

## The evidence rail

- Most recent first, each line naming what was recorded and its decisive values, with the moment it happened at the smallest type step. One line per entry when it fits, never a table header, never a column of controls.
- The rail shows the recent handful of entries and nothing more: this is a confidence check, not a log. Older entries fall off quietly, and no control is offered to page or expand them, because the contract gives this page no way to fetch them back.
- A declared revert renders as one quiet text action on its own entry, and only while the contract allows it. The entry it reverts stays in place, restated as reverted — an entry that vanishes leaves the reader unsure whether the revert or the original went through.
- Before the first commit the rail states once, quietly, with the empty-region mark, what will appear there.

## Icon employments it adds

None. The commit and the revert are labelled with text alone, and the success, reload, dismiss and empty-region employments the page already authorizes cover every state the bench can reach.
