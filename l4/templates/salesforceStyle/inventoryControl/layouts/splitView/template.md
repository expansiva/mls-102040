# Layout — Split view (grid + record panel)

> The arrangement: a paginated collection on the left and the selected record on the right, both visible at
> once. Selecting a row loads the panel; the panel is where reading, editing, creating and movement happen.
>
> This document adds the **arrangement** to the page document that precedes it. It decides shapes, who
> scrolls, and how the record is presented — nothing about the domain, the columns or the commands, which
> the page document already fixed.

## L1. What this layout contributes to the resolved model

The page document's `ResolvedModel` leaves the presentation of editing to the layout. This one adds:

```ts
panelModes: Array<'read' | 'create' | 'edit' | 'movement'>;
columnsByShape: { wide: Field[]; medium: Field[]; narrow: Field[] };
```

## L2. Layout contract

```text
┌─ Header ─────────────────────────────────────────────────┐ fixed
├─ Filters (when available) ───────────────────────────────┤ fixed
├─ Grid ──────────────────────────┬─ Record panel ─────────┤
│  column header            fixed │                        │
│  rows                  SCROLLS  │        SCROLLS         │
├─ Pagination ────────── pinned ──┤                        │
└─────────────────────────────────┴────────────────────────┘
```

The page has **three shapes**. This document prescribes the shapes and the invariants that must hold in all
of them. It does **not** prescribe the widths that trigger each one, nor the mechanism used to detect them:
derive the widths from the constraints below, and use whatever the project offers to observe available
space. **The outcome is what is judged, not the numbers you chose to reach it.**

| Shape | What the user sees |
| --- | --- |
| **Wide** | grid and record panel side by side, same height, separated by a hairline border. The grid is the dominant work area. All resolved columns fit. |
| **Medium** | same arrangement, panel at its narrowest readable width, fewer columns. |
| **Narrow** | **stacked: grid on top, record panel below it**, panel at full width, with a clear return-to-list action. |

### What decides the shape

Not a pixel — **whether the arrangement still works**. Step down to the next shape as soon as the current
one would force any of the following. Each is forbidden at **every** size, so any of them appearing is
proof the shape should have changed already:

- horizontal scrolling anywhere;
- a cell wrapping to a second line, or type shrinking to make content fit;
- a numeric column too narrow to compare values down the column at a glance;
- the panel as wide as the grid, or wider;
- pagination out of reach.

### Constraints that determine the numbers

Derive, do not guess — and if the arithmetic disagrees with a breakpoint the design system declares, **the
constraint wins and the shape changes earlier**. A declared breakpoint is a convenience, not a permission
to break the invariants above.

- The panel has a **readable minimum**: enough for a label and its value without wrapping. Narrower than
  that, do not squeeze it — **stack instead**.
- Column ceilings fall as space falls: at most 6 in Wide, roughly 4 in Medium, 3 in Narrow, and 2 at the
  smallest size the design system contemplates. Drop **complete columns, lowest priority first**.
- Density does not change with width; only touch targets grow in Narrow.
- **Record the widths you chose and the reasoning**, so the next reader can check the arithmetic.

### Who scrolls, by shape

The style document's containment rules apply. This layout assigns them like this:

- In **wide and medium**: the page occupies the viewport height and **never scrolls as a whole**. The grid
  body and the record panel each own their own scroll. Header, filters and the grid's column header do not
  move. Pagination is **pinned to the bottom of the grid column** and is reachable without scrolling
  anything.
- In **narrow**: the page scrolls as a single document. Grid and panel give up their own scroll and
  pagination follows the end of the grid.

## L3. How a record is reached

- Clicking anywhere on a row selects the record and loads the panel. There is **no per-row action button**:
  the whole row is the affordance, and the panel is already on screen.
- The selected row stays visually distinguishable for as long as the panel shows it. Master-detail without
  that mark leaves the user unable to tell which row the panel is about. If the grid molecule treats
  selection as a controlled prop, echoing the choice back is part of wiring it.

## L4. Panel

The panel always exists: without a selection it guides the user; with a selection it shows read mode. Modes
are mutually exclusive.

| Mode | Available when | Successful outcome |
| --- | --- | --- |
| Read | always | — |
| Create | a create command exists | reload, select the new record, return to read |
| Edit | an update command exists | reload record, return to read |
| Movement | a move or relate command exists | clear form and return to read |

- Read: label, status (if available), label/value field pairs, and permitted actions.
- Edit/create: show only inputs accepted by the command. Form and action conventions — where cancel sits,
  where validation appears — come from the style document.
- Removal sits at the **bottom of the panel, separated by a divider**, with a sentence saying what it
  destroys. Its style and its confirmation come from the style document.
- The panel keeps its own scroll in the side-by-side shapes: a long form never makes the page scroll.

## L5. Icon employments this layout adds

On top of the page document's list: **return to list** (the stacked shape only).

## L6. Checklist

- [ ] **In wide and medium, the page does not scroll**: grid body and panel scroll on their own, and
      **pagination is visible without scrolling anything**.
- [ ] **The three shapes were each opened and looked at**, and the page was resized **through** the
      transitions: columns drop by priority, the panel stacks with a return-to-list action, and none of the
      forbidden outcomes appears at any width along the way.
- [ ] **The selected row is marked** for as long as the panel shows it.
- [ ] The panel guides without a selection; modes never appear together.
- [ ] No per-row action button in the grid — the row itself is the affordance.
- [ ] The widths chosen for each shape, and the arithmetic that produced them, were recorded.
