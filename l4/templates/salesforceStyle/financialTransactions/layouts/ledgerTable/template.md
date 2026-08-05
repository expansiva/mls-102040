# Machine brief — Ledger table

Apply after the Salesforce global and Financial transactions briefs. One dense working surface: the collection fills the page, the totals never leave the screen, and the commands that cover more than one entry are driven by what is selected.

## State

```ts
selection: Id[];
totalsScope: 'set' | 'selection';
sort: Sort | null;
filterValues: FilterValues;
columnsByShape: { wide: Field[]; medium: Field[]; narrow: Field[] };
```

## Shapes and containment

| Shape | Arrangement |
| --- | --- |
| Wide | filter controls above the collection, applied values below them, all resolved columns fit, totals on one line adjacent to the collection |
| Medium | same anatomy with fewer columns; filter controls wrap to a second row before any of them shrinks |
| Narrow | each entry is a stacked block instead of a row; the totals line stays at the top of the collection |

Switch shape before horizontal scrolling, cell wrapping, an amount that cannot be compared column-wise, or a filter control narrower than its own content. Derive and report the breakpoint arithmetic.

- Wide/medium: the page is viewport-bounded and only the entries scroll; header, filter controls, applied values, column header, totals and pagination stay in place.
- Narrow: the page scrolls as one document, the collection relinquishes its own scroll, and pagination follows the entries.
- Keep density constant; only increase touch targets in narrow. Use at most about 7 columns wide, 5 medium, 3 narrow and 2 at the smallest supported size; drop complete low-priority columns first, never the amount.

## Totals placement

- The totals line sits adjacent to the collection and outside its scroll, so scrolling entries can never hide it. A total inside the scrolling area, in an overlay, or reachable only by scrolling is a failure of this layout.
- While a selection exists, the selection's totals appear beside the set's totals and never replace them: the reader cross-checking the set against an outside figure must keep seeing the set total.

## Selection and command scope

- Every entry carries a selection control, and one control selects the whole current filtered set — never beyond it. When that control reaches further than the entries on screen, it states what it covers.
- Selection-driven actions are disabled while nothing is selected, and their labels carry count and outcome, so the consequence is known before the click. An action on a single entry may also live at the end of its row, quiet and labelled; the row itself is not clickable.
- While a command runs, the entries it covers lock and show a running state, and the rest of the collection stays workable. Success is those entries' own status change.
- A command that fails for part of the selection keeps exactly those entries selected and names them.
- An entry that leaves the current filtered set — by a filter change, a sort change or a page change — leaves the selection with it, and the selection count updates visibly. Selection that survives out of view would let a command act on entries the reader can no longer see.

## Icon employments it adds

None. Selection is a form control rather than an icon, and removing an applied filter value uses the page's dismiss employment.
