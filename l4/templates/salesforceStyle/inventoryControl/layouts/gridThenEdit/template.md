# Machine brief — Grid then edit

Apply after the Salesforce global and Inventory control briefs. This layout has two exclusive scenes: `list` and `record`.

## State

```ts
scene: 'list' | 'record';
recordIntent: 'read' | 'create' | 'edit' | 'movement';
listMemory: { page: number; sort: Sort | null; filters: FilterValues; selectedId: Id | null };
columnsByShape: { wide: Field[]; medium: Field[]; narrow: Field[] };
```

## List scene

- Header and available filters are fixed.
- The compact grid has fixed column header; only its rows scroll.
- Grid pagination is pinned and reachable without scrolling the page.
- Grid uses full page width. At most about 8 columns in wide, 5 in medium, 3 in narrow, and 2 at the smallest supported size. Drop complete low-priority columns first.
- Every row has one labelled trailing action; it is never dropped. The row itself is not clickable. The action opens the record scene.
- Header create opens the record scene with an empty form.

## Record scene

- Header contains a quiet back action and the record label. The form/read region is the only scrolling region; its action row is pinned.
- Use a readable-width form column aligned with the leading edge; do not stretch it across a wide monitor and do not center it in empty space.
- Read mode is always available. Create, edit and movement modes exist only for their declared commands.
- A detail fetch uses in-frame loading skeleton and in-frame failure with retry; back stays available. If a record no longer exists, return to the list and report it there.

## Navigation and command outcomes

- Exactly one scene is visible at every width. Neither scene scrolls as a whole.
- Returning by header back or a successful command restores `listMemory` exactly: page, sort, filters and marked row.
- Back during unsaved editing follows cancel semantics and asks before discard. A failed command stays in the record scene and preserves input.
- After create, reload before return so the created record is present and marked.

## Widths and icon

Derive breakpoints from no horizontal scroll, no wrapping/shrinking, readable numeric columns and reachable pagination; record the chosen widths/arithmetic in the generation result. Adds the `back` icon employment.
