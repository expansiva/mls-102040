# Layout — Grid, then edit (two scenes)

> The arrangement: the collection **owns the whole page**. A row carries an action that leaves the list and
> opens a second scene for that record. Only one scene is on screen at a time.
>
> This document adds the **arrangement** to the page document that precedes it. It decides the scenes, the
> navigation between them, and what survives the trip — nothing about the domain, the columns or the
> commands, which the page document already fixed.

## L1. What this layout contributes to the resolved model

```ts
scene: 'list' | 'record';
// Which command the record scene opened for. 'read' when the record is only being looked at.
recordIntent: 'read' | 'create' | 'edit' | 'movement';
// The list's state, held while the record scene is open so returning restores it exactly.
listMemory: { page: number; sort: Sort | null; filters: FilterValues; selectedId: Id | null };
columnsByShape: { wide: Field[]; medium: Field[]; narrow: Field[] };
```

`listMemory` is not an optimisation — L4 makes it a requirement.

## L2. Layout contract

Two scenes, never both:

```text
SCENE: list                                  SCENE: record
┌─ Header ──────────────────────────┐ fixed   ┌─ Header (back + record label) ─┐ fixed
├─ Filters (when available) ────────┤ fixed   ├─ Form or read view ───────────┤
├─ Grid ────────────────────────────┤         │                               │
│  column header              fixed │         │            SCROLLS            │
│  rows                    SCROLLS  │         │                               │
├─ Pagination ───────────── pinned ─┤         ├─ Actions ──────────── pinned ─┤
└───────────────────────────────────┘         └───────────────────────────────┘
```

Both scenes are bounded by the viewport and **never scroll as a whole** (the style document's containment
rules). In each, exactly **one** region scrolls: the grid body in the list, the form in the record.

The grid gets the **full page width**, so this layout has no panel minimum to protect and drops columns
later than a split view would: at most 8 in Wide, roughly 5 in Medium, 3 in Narrow, and 2 at the smallest
size the design system contemplates. Drop **complete columns, lowest priority first**. Derive the widths
from the same forbidden outcomes the page's grid rules imply — horizontal scrolling, a wrapping cell, type
shrinking, a numeric column too narrow to compare down — and **record the widths and the arithmetic**.

The record scene keeps the **same width discipline as the list**: a form that spans a wide monitor is
unreadable, so fields sit in a column of readable measure, aligned to the page's leading edge, with the rest
of the width left empty. Do not center a single column of fields in a sea of blank space; do not stretch a
field to the full width because the space is there.

**There is no shape at which the two scenes appear together.** That is the difference from a split view, and
it is not a limitation to route around: a layout that shows both is a split view and should be that
document.

## L3. How a record is reached

- **Every row carries an explicit action.** The page document leaves this to the layout; here it is required,
  because without a panel on screen a click has nowhere to land and a whole-row click that navigates away is
  too easy to trigger by accident.
- **One action per row, labelled, in a trailing column** — never a kebab menu (the page document forbids it),
  never an icon alone (the style document requires icons beside text). The column is the last one and is
  **never dropped** as space falls: it is how the page is operated.
- The action's label names what happens next in business language.
- **The row itself is not clickable.** One affordance per row, and it is the action. *Reason: two ways to
  leave the list — one explicit, one incidental — makes accidental navigation indistinguishable from
  intent.*
- Creation is reached from the header's primary action, and opens the record scene with an empty form.

## L4. Returning to the list

This is the rule that makes or breaks the layout, and the one a split view never has to answer.

- **Returning restores the list exactly as it was left**: same page, same sorting, same filter values, and
  the row that was operated on still marked. Losing the page or the filter turns a two-record edit into two
  full re-navigations, and that is the failure that makes people prefer the split view.
- **Two ways back, and both land in the same restored list**: an explicit back action in the record scene's
  header, and the successful outcome of the command.
- The back action is **quiet and always available**, including mid-edit. Abandoning a form is the style
  document's cancel case: it sits with the form's actions, not in the header. The header's back is
  navigation, not cancellation — when a form has unsaved input, back behaves as cancel does and asks.
- **A failed command does not navigate.** The record scene stays, keeps the input, and reports the failure
  where the style document puts a form's errors.
- After creating, the restored list contains the new record and marks it — reload before returning.

## L5. States, per scene

The page document's four collection states belong to the **list** scene's grid, presented as the style
document requires.

The **record** scene owns its own states, and they are easy to forget because a split view borrows the
grid's:

- **Loading**, when the record's detail is fetched rather than taken from the row: the scene renders its
  frame and header, with the fields as a skeleton. Never a blank page with a spinner — the header already
  tells the user where they are.
- **Failure to load**: the scene reports it where the style document puts a region's failure, with a retry,
  and the back action stays available. A record scene that fails and offers no way out traps the user.
- A record that no longer exists (removed elsewhere) returns to the list and reports it there.

## L6. Icon employments this layout adds

On top of the page document's list: **back** (return to the list, in the record scene's header).

## L7. Checklist

- [ ] **Only one scene on screen**, at every width — no arrangement shows list and record together.
- [ ] **Neither scene scrolls as a whole**: the grid body scrolls in the list, the form scrolls in the
      record, and the record's actions stay reachable without scrolling.
- [ ] **Every row has one labelled action, in a trailing column that is never dropped**; the row itself does
      not navigate.
- [ ] **Returning restores page, sorting, filters and the marked row** — verified after paging away from
      page 1, editing a record, and coming back.
- [ ] **A failed command keeps the record scene and the typed input.**
- [ ] **After creating, the list comes back with the new record marked.**
- [ ] **The record scene has its own loading and failure states**, and its failure leaves a way back.
- [ ] Back is available mid-edit and asks before discarding unsaved input.
- [ ] Fields sit in a column of readable measure, not stretched across the full width.
- [ ] The widths chosen for each shape, and the arithmetic that produced them, were recorded.
