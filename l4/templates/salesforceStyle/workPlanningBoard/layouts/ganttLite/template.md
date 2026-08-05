# Machine brief — Gantt lite

Apply after the Salesforce global and Work planning board briefs. The plan **drawn in time**: one row per item, its date placed on a horizontal axis, today marked across the whole drawing, and what slid past today unmistakable at a glance. This arrangement answers questions a queue cannot — what piles up next week, what is stacked on one person, what is late and by how much.

A layout may require more than the page brief, never less. This one requires nothing beyond the page's own minimum: a declared deadline is enough to place an item in time. Drawing a **span** needs two declared ends, and **moving** an item needs a command that changes its date — both are read from the contract, and neither is ever simulated.

It excludes the deadline-ordered queue with inline gap-filling (that is the other arrangement), columns by state, aggregate tiles or charts above the canvas, and any dependency line, progress bar, percentage or milestone the contract does not declare.

## State

```ts
window: { from: string; to: string };       // the visible time range
axisUnit: 'day' | 'week';
labelColumn: { fields: Field[] };            // what stays readable beside the canvas
selectedId: Id | null;
detail: 'closed' | 'open';
dragging: { id: Id; toDate: string } | null;
filterValues: FilterValues;
```

## Shapes and containment

| Shape | Arrangement |
| --- | --- |
| Wide | fixed label column on the leading side, canvas filling the rest; rows scroll vertically while the axis and the label column stay |
| Medium | the label column keeps the item's identity only — owner and state move into the detail region — and the canvas keeps its readable day width |
| Narrow | the window shortens to about a week and the canvas scrolls sideways with the label column pinned |

- The page is viewport-bounded: only the rows scroll vertically, the axis and the today marker never scroll away, and the query's pagination belongs to the canvas as a whole and stays reachable without scrolling the rows.
- Switch shape before the axis loses its labels, before an item's label truncates past readability, and before two marks on consecutive dates touch.
- **The narrow shape stays a canvas.** It never quietly becomes a dated list: a list is the other arrangement and answers another question, so degrading into one would silently swap the test's subject.
- Report the arithmetic: the visible window in days times the width a day needs to stay readable at the design system's smallest type step, plus the label column, against the available width.

## The canvas

- The horizontal axis is time, labelled at the design system's smallest readable type step, with one unit per view — days inside a couple of weeks, weeks beyond that. Never two granularities at once.
- Today is a single vertical marker across the whole canvas, labelled once and quiet: it is the reference the reader measures against, not an alarm.
- Rows are ordered by the date they are placed on, soonest first, so the drawing reads from the top-left. Overdue rows are **not** lifted out of that order here — their position in time is the point of the picture, and the alarm colour is what finds them.
- The window opens centred on today, and stretches back far enough to include the earliest unfinished item when that lies in the past. Overdue work drawn off-screen is overdue work hidden.
- The canvas draws only contract data. Blank canvas is a blank plan, and that is information too.
- Loading: the frame, the axis and the today marker first, the marks after — the shape before the data.

## Marks and spans

- An item with one declared date is a **point mark** on that date. Never widen it into a bar: an invented span is a claim about duration the contract never made.
- A span is drawn only when the contract declares both of its ends, running from one to the other, with the item's identity readable at its leading edge.
- Overdue is carried by the mark: the portion of a span past today, or a point mark past today, takes the alarm colour, and nothing else in the row does.
- A finished or cancelled item is muted whatever its date — on this canvas it is history, not debt.
- Marks never overlap: two items on the same date stack, and a date holding more than the rows can show says how many it holds.
- A mark carries no text of its own beyond what fits without touching its neighbour. Identity lives in the label column.

## Rescheduling on the canvas

- Dragging a mark exists **only** when the contract declares a command that changes the date. Without it the marks are read-only and the arrangement says so once, quietly — never a drag that lands nowhere.
- A drag changes the date and nothing else. Owner and state change in the detail region, so moving a mark can never rewrite something the reader cannot see.
- The drop commits at the granularity the axis shows. A day-labelled axis commits a day; a week-labelled axis must not guess a day inside the week — it asks which, or it does not accept the drop.
- While the move commits, the mark shows a running state where it landed. On failure it returns to its original date **and** reports beside its row, in normal body colour, with retry: a silent snap-back is a lost command.
- Every reschedule has an equivalent that needs no pointer, reachable from the selected row and from the detail region. A plan that can only be changed by dragging locks out part of the people who have to change it.
- Selecting a mark or its label opens a quiet detail region with the item's declared editable payload and its own commit; the canvas stays visible and the selected row stays marked.

## Icon employments it adds

The pagination chevrons gain a second employment: moving the visible window along the axis. Nothing else — the today marker is a line with a label, and the drag affordance is the mark itself.
