# Machine brief — Summary first statement

Apply after the Salesforce global and Read-only detail portal briefs. One reading column, and the answer at the top of it: the headline is the largest thing on the page, the facts that identify the record sit under it, the breakdown that justifies it comes next, and the fine print closes. The reader is meant to leave after the first line — everything below exists to be checked, not to be read.

A layout may require more than the page brief, never less. This one requires nothing beyond the page's own minimum: one record and one declared value are enough to state an answer.

It excludes the formal document sheet — issuer and recipient blocks, a tabulated document body, an attribution footer, a print affordance — which is the other arrangement and earns its authority from looking like paper. It also excludes tabs, folds, accordions and "see more" controls, side-by-side regions, and any control inside the reading column.

## State

This arrangement adds no state. A statement has nothing to remember: there is no selection, no mode, no draft and no scene, and the acknowledgement's progress belongs to the command's own binding. A view field invented here would be a control invented with it.

## Shapes and containment

| Shape | Arrangement |
| --- | --- |
| Wide | one reading column, centred, capped at a comfortable measure with the page's surface behind it; every region is full column width, stacked in reading order |
| Medium | the same single column, filling the available width, with the reference facts still in two label/value tracks |
| Narrow | the same column with the reference facts and the breakdown in one track each, and the headline still on one line |

- **The page scrolls as one document.** No region has its own scroll and nothing is pinned: the style brief's rule for stacked regions that would both scroll applies here in full, because a reader who scrolls a panel inside a statement loses their place in the statement.
- The reading column never becomes full-bleed text. Long measure is what makes a statement unreadable, and the design system's spacing scale is what caps it.
- Switch shape before the headline wraps its digits onto a second line, before a label and its value collide, and before the breakdown's numbers stop lining up in their column.
- Report the arithmetic: the headline's digit count at the largest type step against the column measure, and the breakdown's widest declared value at the body step against the column left after its labels.

## Reading order

- Above the headline there is the page identity and nothing else — no hero, no toolbar, no summary of the summary. The single exception is the page-level banner the style brief places directly below the header: a condition about the whole statement has to be read before the number it qualifies.
- The headline is one value at the largest type step the design system declares, with tabular figures, its unit or currency, and one small muted label naming what it is. The label is above or below it, never beside it competing for the line.
- The reference facts follow as quiet label/value pairs at the smallest type step — small enough to be skipped by a reader who trusts the headline, complete enough for one who does not.
- The breakdown follows as a plain tabulated block with subtle row separators, no zebra and no vertical dividers, its numbers right-aligned and tabular in the same treatment as the headline, in the contract's declared order. It closes with the declared total when the contract declares one, heavier than a line and quieter than the headline — a total concludes the breakdown, it never re-answers the question.
- Notes and declared fine print come last, at the smallest step, in muted text.
- The acknowledgement sits below the reading order, at the foot of the column, where a reader who has read everything arrives. It is the only control in the page body, and after it succeeds its quiet result takes exactly the space it occupied — the column must not jump.

## What this arrangement refuses to hide

- Nothing folds. No region is collapsed behind a control, and no value is revealed by hovering: a statement that hides part of itself cannot be trusted as a complete record, and the reader has no reason to believe a fold exists.
- The breakdown shows every declared line. When it is longer than the viewport the page scrolls; it is never paged, never virtualised behind a "show all", and never truncated with an ellipsis.
- A declared region the contract leaves empty says so once, quietly, with the empty-region mark — an absent region and an empty one read differently to someone checking whether they received everything.

## Icon employments it adds

None. The headline is type, the breakdown is a table of declared values, and the reload, success, status and empty-region employments the page already authorizes cover every state this arrangement can reach.
