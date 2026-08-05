# Machine brief — KPI filter table

Apply after the Salesforce global and Analytical list briefs. The set **told twice in numbers**: one row of filters at the top, one row of summary tiles under it, and a dense grid filling the rest. The reader asks with the filters, reads the answer in the tiles, then finds the rows behind the tile that looks wrong. This arrangement trusts the numbers and the grid.

A layout may require more than the page brief, never less. This one requires nothing beyond the page's own minimum: one measure or one aggregate is enough to fill a tile row, and one declared input is enough to steer it.

It excludes the arrangement where a picture is the control — any chart, sparkline or plotted shape, here, is a rival to the tiles and belongs to the other layout. It also excludes tiles that filter, a second narrowing control inside the grid, cards in place of grid rows, and a tile row the reader has to scroll to finish reading.

## State

```ts
filterValues: FilterValues;              // one value per declared filter input
searchDraft: string;                     // the unsubmitted text of a declared search filter
sort: { column: Field; direction: 'asc' | 'desc' } | null;   // only where the contract declares sorting
selection: Set<Id>;                      // only when a command accepts many records
```

## Shapes and containment

| Shape | Arrangement |
| --- | --- |
| Wide | filter row, then the tile row in one line, then the grid filling the remaining height; the grid body is the only thing that scrolls |
| Medium | the tiles wrap into further rows of the same size, and the grid drops its lowest-priority columns whole |
| Narrow | the tiles stack a few per row, and the grid keeps the identity and the leading measure only |

- The page is viewport-bounded: the filter row, the tile row, the grid header and the pagination all stay, and only the grid body scrolls. A summary that scrolls out of view while the reader studies the rows stops being the summary of what they are looking at.
- Switch shape before a tile's value wraps, before a tile's label truncates, and before a numeric column narrows past comparing its own digits.
- **The tile row never becomes a sideways-scrolling strip.** A summary is read at a glance or it is not a summary; wrapping into a second full row keeps every tile equally present, and scrolling does not.
- **The grid stays a grid at every width.** Rows never become cards: comparison happens down a column, and a card breaks the column.
- Report the arithmetic: the number of tiles times the width a tile needs for its value at the summary type step plus its label at the smallest step, against the available width; and the number of grid columns times the width the widest declared measure needs, against the width left for the grid.

## The tile row

- One tile per declared aggregate, all the same size, in the order the contract declares them. Never pad the row to fill it: fewer real numbers means fewer tiles, and an invented metric is worse than white space.
- Inside a tile: the value first and largest, tabular, with its declared unit or currency; the label under it at the smallest type step; a declared comparison beside or under the value. Nothing else — a tile holds one number.
- **Tiles are not controls.** They do not filter, select or navigate: the filter row is the page's single steering wheel, and a tile that also asks the question makes it impossible to tell whether a number is the answer or the input.
- A tile keeps its footprint while its value is stale, failed or unknown, so the row never reflows underneath the reader's eye between two readings of the same number.

## The grid

- Dense uniform rows with subtle separators and a header that stays while the body scrolls. Column order by priority: identity, the leading measure, the remaining measures, the declared dimensions, status, date.
- Drop whole low-priority columns before allowing wrapping, horizontal overflow or a numeric column too narrow to compare. Identity and the leading measure are never dropped.
- Sorting appears only on columns the contract declares sortable, marked on the active column with the ascending/descending employment, one column at a time.
- A row offers two targets and they never trigger each other: the identity drills down, and the selection control selects. Clicking anywhere else in the row does nothing — a row that both navigates and selects loses a reader's records every time they meant the other one.
- The selection control exists only when a command accepts many records. Its header control covers the records currently loaded and says so, because a control that appears to select the whole set while covering one page misreports what the next command will do.
- The selection count and the set actions sit in a strip between the tiles and the grid header. The strip takes its space from the grid body, never from the tile row, and it is absent — not disabled, not empty — when nothing is selected.
- Pagination belongs to the grid and stays pinned below it, reachable without scrolling the body.

## Icon employments it adds

None. A tile is a number with a label, the selection control is a form control, and the sorting arrows, pagination chevrons and dismiss employments the page already authorizes cover everything this arrangement introduces. An action here that has no authorized icon is labelled with text alone.
