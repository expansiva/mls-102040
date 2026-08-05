# Machine brief — Directory profile

Apply after the Salesforce global and Customer management briefs. Two regions, side by side, both permanent: the **finder** on the leading side — search above the list of parties — and the **profile** filling the rest, where the selected party's facts and relations stack in reading order. Finding is as important as reading here, so the directory never yields its side of the stage: the operator's work is a sequence of half-remembered names.

A layout may require more than the page brief, and this one does: it needs the **declared directory query**. Without a collection of parties there is nothing to put on the finder's side, so refuse without writing a page and say that the layout excluded it, not the page — a context-resolved party is still a valid customer-management page in the arrangement that gives the party the whole stage.

It excludes the arrangement where a highlight band crowns one party and the relations are the body, with other parties reachable only through a quiet picker — that is the other layout. It also excludes navigating to another page to read a profile, tabs that fragment the profile into hidden panes, and a full table of parties inside the profile side.

## State

```ts
selectedId: Id | null;          // the party on stage; null before the first selection
mode: 'read' | 'edit' | 'create';
```

Nothing else. The search text, the declared filters, the page and the sort are **query inputs the contract declares**, so they live in the binding and are not restated here — a second copy of a filter value is a second answer to what the list is showing. The commands' progress and errors likewise belong to their own bindings.

## Shapes and containment

| Shape | Arrangement |
| --- | --- |
| Wide | finder fixed on the leading side at a width that keeps a name and its disambiguating fact on one line; profile fills the rest; each side scrolls on its own, separated by a hairline |
| Medium | the same split with the finder at its minimum readable width, and the profile's fact groups in one column instead of two |
| Narrow | one region at a time: the directory, then the profile, with the back employment returning to the list |

- The page is viewport-bounded: the two sides have equal height, the search input and the pagination stay put, and only the list body and the profile body scroll.
- **The finder never shrinks into a breadcrumb or a dropdown** on the wide and medium shapes. Collapsing it would make the page a record form with a picker, which is the other arrangement's job, and the operator would lose the list they are working down.
- On the narrow shape the two regions take turns, and that is not a collapsed finder: the list is one back-tap away, its narrowing and its scroll survive the trip, and the profile never becomes a page of its own.
- Selecting a party never clears the search text or the applied filters, and never scrolls the list: the next name the operator wants is usually near the last one.
- Switch shape before a list row's name truncates past recognition, before the profile's label/value pairs collide, and before the finder's search input loses its clear affordance.
- Report the arithmetic: the finder's minimum width for the longest declared name plus its secondary fact at the smallest type step, against the profile's minimum comfortable reading measure, against the available width.

## The finder

- Search sits above the list and never scrolls away with it. It renders only when the contract declares a search input, with the search employment and a clear affordance; without a declared search input the list has filters only, and no search box is invented.
- One row anatomy for the whole list: the name loudest, and exactly one declared secondary fact beside or under it to tell namesakes apart. Rows are dense and uniform, with subtle separators, no zebra and no vertical dividers.
- The selected row stays visibly selected while the profile shows it. A selection whose mark is not on the list is a selection the operator cannot find again after scrolling.
- A row selects and does nothing else: no per-row action, no inline edit, no link inside the row. The profile is where acting happens.
- The list's four collection states replace the list body only — the search, the filters and the pagination keep their places, and the profile side is untouched by them.
- Pagination belongs to the finder and stays reachable at its foot without scrolling the rows.

## The profile

- Reading order, always the same so the reader learns where things live: identity first, then the declared fact groups, then the related collections in the contract's declared order. The profile's own title is the party's name.
- With nothing selected, the profile says once, quietly, that selecting a party from the list will show it — with the empty-region mark, and never a blank half-page. It never auto-selects the first row: a selection the operator did not make looks exactly like one they did.
- Editing happens in place, in the profile: the fact groups become the update command's inputs and the trailing action row carries cancel then confirm. The finder stays fully usable while editing, and the party stays selected in the list.
- Creating takes the profile's place, with the same reading position and the finder untouched; cancelling returns the previously selected party, or the empty statement when there was none.
- Relations stack below the facts and scroll with the profile. A relation never gets its own scrollbar: two nested scrolls in one column make the reader lose which one they are moving.
- Every action lives in the profile side — commit, add to a relation, deactivate — and each reports its own failure above itself, in normal body colour, with retry, while the finder keeps working.

## Icon employments it adds

The back employment gains its place: returning from the profile to the directory on the narrow shape, where the two regions take turns. Nothing else — the finder's rows carry no icons, and selection is shown by the row's own mark.
