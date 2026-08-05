# Machine brief — Split view

Apply after the Salesforce global and Inventory control briefs. The collection grid and selected-record panel are visible together except in the narrow stacked shape.

## State

```ts
panelMode: 'read' | 'create' | 'edit' | 'movement';
columnsByShape: { wide: Field[]; medium: Field[]; narrow: Field[] };
selectedId: Id | null;
```

## Shapes and containment

| Shape | Arrangement |
| --- | --- |
| Wide | grid and record panel side-by-side, equal height; grid is dominant; all resolved columns fit |
| Medium | side-by-side with panel at readable minimum and fewer columns |
| Narrow | grid above full-width panel with a return-to-list action |

Switch shape before horizontal scrolling, cell wrapping/type shrinking, unreadable numeric columns, a panel as wide as the grid, or unreachable pagination. Derive and report the breakpoint arithmetic.

- Wide/medium: page is viewport-bounded; grid rows and panel each scroll; header, filters and grid header stay fixed; pagination is pinned at the grid bottom.
- Narrow: page scrolls as one document; grid and panel relinquish their own scroll; pagination follows the grid.
- Keep density constant; only increase touch targets in narrow. Use at most about 6 columns wide, 4 medium, 3 narrow and 2 at the smallest supported size; drop complete low-priority columns first.

## Selection and panel

- A row click selects it and loads the panel. There is no per-row action button. Keep the selected row visibly marked while its panel is shown.
- Without selection, the panel gives guidance. With selection, read mode shows label, status when available, label/value fields and permitted actions.
- Create/update/movement modes exist only for declared commands. Success: create reloads, selects new item and returns to read; edit reloads record and returns to read; movement clears its form and returns to read.
- Place removal at the panel bottom behind a divider, with its destructive explanation and the page's confirmation flow.

Adds the `return to list` icon employment for the narrow shape.
