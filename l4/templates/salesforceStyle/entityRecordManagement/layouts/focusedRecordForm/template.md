# Machine brief — Focused record form

Apply after the Salesforce global and Entity record management briefs. One continuous column, read top to bottom like a well-organized sheet, with one commit at its end: the whole record is one thought.

This arrangement excludes tabs, an accordion, a stepper, and any section that commits on its own. A record rich enough to need rooms of its own belongs to another arrangement, not to this one.

## State

```ts
mode: 'create' | 'edit';
dirty: boolean;
fieldErrors: Record<string, string>;
pendingDiscard: 'leave' | 'transition' | null;
```

## Shape and containment

| Shape | Arrangement |
| --- | --- |
| Wide | one readable-width column aligned to the leading edge, identity region above it; the page is viewport-bounded and only the column scrolls |
| Medium | the same column at the available width minus page padding; no field pair shares a line |
| Narrow | the same order, one field per line, touch targets one design-system step larger |

- The column has a readable maximum width: it does not stretch across a wide monitor, and it does not centre itself in empty space. Extra width stays empty beside it.
- Two fields may share a line only in the wide shape, only when both controls are short and both belong to the same subject.
- Derive the column width and the breakpoints from the widest declared control plus the longest field label at the design system's own type scale, and report that arithmetic in the delivery record.
- The identity region stays in view while the column scrolls, so the reader never edits without knowing which record they are inside.

## Column order and the single commit

- Subject groups follow the contract's declared order: what identifies the record first, then its substance, and free text last and visually quieter than the rest.
- Exactly one commit action, as the last thing in the column, committing the whole record at once. It is not pinned: reaching it means having passed the fields it commits.
- The commit shares its trailing action row with cancel, per the style brief. No other action row exists in the column.
- Field-level messages appear at their field; a commit that fails for the record as a whole reports directly above the commit action.

## Transition placement

- Transition actions sit with the identity region, above the column and outside its scroll, so they never share a row with the commit and never scroll past the reader.
- With edits pending, a transition asks before discarding them, in the same plain words the page uses when leaving.

## Icon employments it adds

None. This arrangement adds no navigation of its own: the column is the page, so the `back` employment stays unused unless the page itself declares one.
