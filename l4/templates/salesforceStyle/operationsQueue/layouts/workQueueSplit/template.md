# Machine brief — Work queue split

Apply after the Salesforce global and Operations queue briefs. An operations desk: the **queue** on the leading side and the **item under work** on the other, both on stage at once. The operator scans the line, opens an item without losing the line, acts on it, and watches it move — for someone seated with the whole shift in view.

A layout may require more than the page brief, never less. This one requires nothing beyond the page's own minimum: a queue and one declared transition fill both sides.

It excludes the arrangement where the queue itself is the workspace — one card per item carrying its own action, armed and committed on the card, built for a thumb in motion — which is the other layout. It also excludes navigating to a detail page to act, transition buttons on queue rows, and a working panel that replaces the queue on the wide shape.

## State

```ts
selectedId: Id | null;                       // the item under work; null before the first selection
collecting: { transition: string } | null;   // the transition currently asking for its declared input
```

Nothing else. The lane, the narrowing, the page and the sort are query inputs the contract declares, so they live in the binding; each command's values, progress and error live in that command's own binding. A copy here would be a second answer to what the panel is about to commit.

## Shapes and containment

| Shape | Arrangement |
| --- | --- |
| Wide | queue fixed on the leading side at a width that keeps identity, state and the urgency fact on one line; panel fills the rest; each side scrolls on its own, separated by a hairline |
| Medium | the same split with the queue at its minimum readable width and the panel's facts in one column |
| Narrow | one region at a time: the queue, then the panel, with the back employment returning to the line |

- The page is viewport-bounded: the lane controls, the queue header and the pagination stay put, and only the queue's rows and the panel's body scroll. The two sides have equal height.
- **The queue never yields its side on the wide and medium shapes.** A desk whose queue collapses while an item is open is a detail page with extra steps, and the operator loses the line they were working down.
- On the narrow shape the two regions take turns. That is not a collapsed queue: the line is one back-tap away, its lane, narrowing and scroll survive the trip, and the panel never becomes a page of its own.
- Switch shape before a row's identity truncates past recognition, before the urgency fact and the state chip touch, and before the panel's label/value pairs collide.
- Report the arithmetic: the queue's minimum width for the longest declared identity plus its state and urgency fact at the smallest type step, against the panel's minimum comfortable width for its facts and its action row, against the available width.

## The queue side

- The lane controls sit above the rows and never scroll away with them: the lens must be reachable from anywhere in the line. One control per declared state, in a single row, with the declared count on each when the contract provides it.
- One row anatomy, uniform for every state: identity leading, the state chip in one consistent shape, the urgency fact trailing and right-aligned so the ranking reads as a column.
- **A row selects and nothing else.** No transition on a row, no inline edit, no overflow control: acting on a row from the line is the other arrangement's whole idea, and mixing the two makes every click a guess about what will happen.
- The selected row stays visibly selected for as long as the panel shows it. A selection with no mark in the line is one the operator cannot find again after two scrolls.
- The queue's four collection states replace the rows only: the lane controls and the pagination keep their places, and the panel is untouched by them.
- Pagination belongs to the queue and stays at its foot, reachable without scrolling the rows.

## The working panel

- With nothing selected, the panel says once, quietly, with the empty-region mark, that selecting an item will show it. Never a blank half-page, and **never an auto-selected first row** — a selection the operator did not make looks exactly like one they did, and the first act lands on the wrong item.
- Reading order, the same for every item so the operator learns where things live: identity and state first, then the declared facts, then the actions in the panel's trailing row.
- Only the transitions the contract declares from this item's current state appear, each labelled by outcome. When the contract declares none — a terminal state — the panel says so plainly where the actions would be.
- A transition that declares an input collects it inside the panel, in place, with the confirm unavailable until it is valid. The queue stays scannable while it is being filled, and abandoning it leaves the item exactly as it was.
- A transition in flight locks the panel's actions only, and shows the running state on the action that is running. The queue stays selectable — the operator may keep reading the line while a commit lands.
- Failure renders inside the panel, immediately above the actions, in normal body colour, with retry, and every entered value survives. The queue is untouched by a failed transition.
- On success the panel follows the item: it shows the item in its new state when the item is still in the current lane, and when the item left the lane it empties to its quiet statement so the operator picks the next one deliberately. It never jumps to another item on its own.

## Icon employments it adds

The back employment gains its place: returning from the panel to the queue on the narrow shape, where the two regions take turns. Nothing else — the rows carry no icons beyond the state icon the page already authorizes for a flagged fact, and selection is shown by the row's own mark.
