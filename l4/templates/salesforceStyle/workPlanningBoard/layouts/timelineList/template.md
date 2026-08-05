# Machine brief — Timeline list

Apply after the Salesforce global and Work planning board briefs. The plan as a single queue of commitments: every item in one deadline order, the next thing due at the top, and the ownership gaps fixable without leaving the queue. Time here is an **ordering**, not a drawing.

This arrangement excludes bars, a time canvas, a today line, columns by state, and dragging. A plan whose question is "what overlaps" belongs to a drawn arrangement, not to this one.

## State

```ts
selectedId: Id | null;
panel: 'closed' | 'detail' | 'create';
assigningId: Id | null;      // the row whose ownership gap is being filled inline
filterValues: FilterValues;
fieldsByShape: { wide: Field[]; medium: Field[]; narrow: Field[] };
```

## Shapes and containment

| Shape | Arrangement |
| --- | --- |
| Wide | the queue on the leading side, the panel beside it at a readable minimum, equal height and a hairline between them; all resolved fields fit a row |
| Medium | the same two regions with fewer fields per row; the panel keeps its readable minimum and the queue gives up width first |
| Narrow | one region at a time: the panel covers the queue and carries a return control back to it |

Switch shape before horizontal scrolling, before a row wraps, before the deadline stops being readable at a glance, and before the panel is as wide as the queue. Derive and report the breakpoint arithmetic.

- Wide/medium: the page is viewport-bounded; the rows and the panel each scroll on their own; header, filters, applied values and pagination stay in place.
- Narrow: the page scrolls as one document and the visible region relinquishes its own scroll; pagination follows the queue.
- Keep density constant; only increase touch targets in narrow. Drop whole low-priority fields before wrapping — never the label and never the deadline.

## Order of the queue

- One order, always: deadline soonest first. There is no grouping, no second sort, and no control to change it — the order is what the arrangement is for.
- Overdue items rise above everything else, keeping deadline order among themselves. Their deadline carries the alarm color; the rest of the row does not.
- Finished and cancelled items do not compete for the top: they sort by their own deadline among the rest, muted.
- An item that changes deadline or state re-sorts to its new position and stays briefly marked, so the eye can follow where it went. An item that leaves the current page by re-sorting says so rather than vanishing silently.

## Quick assign and the panel

- A row with no owner shows the owner picker in the ownership place itself, and choosing a person commits at once. This is for closing gaps in two interactions, without opening anything.
- A row that already has an owner shows the name as plain text: changing an existing owner happens in the panel. Inline is for filling a gap, not for churn — an inline control that also reassigns turns a scan into an accidental edit.
- While an inline assignment commits, that row's ownership place shows a running state; a failure reports inside that row, in normal body color, with retry, and the chosen person is not lost. Other rows stay usable.
- Selecting a row opens the panel with that item's fields grouped by subject, its declared editable payload, and its own commit. The queue stays visible in the wide and medium shapes, and the selected row stays marked while its panel is open.
- The create action opens the same panel region in its create state, never a second kind of overlay.
- The panel's commit stays disabled until it is dirty and valid; its failure reports inside the panel, above the commit. Closing a dirty panel asks once, in plain words naming what would be discarded.
- Lifecycle advances live in the panel with the item they belong to, and their confirmation is the page's blocking confirmation.
- The row itself is not a control for anything but selection: no checkbox, no per-row button other than the ownership picker of a gap.

## Icon employments it adds

The narrow shape adds the `return to list` employment on the panel. The picker of a gap is a form control, not an icon.
