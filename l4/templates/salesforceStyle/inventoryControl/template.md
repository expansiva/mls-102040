# Machine brief — Inventory control

Apply after the `salesforceStyle` style brief. This page manages a paginated inventory collection and inventory operations. Layout documents choose the arrangement.

## Resolved model

Resolve the fixture into:

```ts
type ResolvedModel = {
  query: { rows: Item[]; total: number; page: number; pageSize: number; loading: boolean; error?: ErrorState };
  item: { id: string; label: string; measure: number; unit?: string; threshold?: number; alert?: boolean; updatedAt?: string; description?: string };
  commands: { create?: Command; update?: Command; remove?: Command; move?: Command; detail?: Command };
  filters: { search?: State; boolean?: State; facets?: State[]; ranges?: State[] };
};
```

Use only fixture-declared query data, commands, setters, handlers, value vocabularies, errors and formats. Resolve field meanings by contract, not by technical names. Do not read or use the seed as application data: the page reads the query data from its base class.

If the fixture lacks the page's minimum usable collection model (a query, stable item id, readable label and numeric measure), refuse without writing a page.

## Required page behavior

- Show a header with page identity and the create action when the create command exists.
- Show only fixture-supported filters. Search uses the search input; boolean filters use checkboxes. Do not invent facets, ranges or options.
- Render all collection states required by the style brief. Filtered-empty and no-records-empty must differ.
- Use fixture pagination inputs/outputs. Choose page size from the page/layout density requirements; when total exceeds one page, do not sort only the currently loaded page unless the contract supplies server-side sorting.
- Selection, sorting, filtering and pagination must have predictable state updates and preserve the layout's required state.
- Use displayed domain formats and the fixture language. Never expose fixture ids, state field names or other technical names in visible UI.

## Structural elements

| Slot | Required behavior |
| --- | --- |
| grid | compact table with sorting, optional selection, pagination and the collection states |
| actions | primary, quiet and danger actions, each with a loading state |
| destructive confirmation | blocking dialog with an explicit destructive choice |
| success notification | transient, self-dismissing command result |
| page-level banner, only when applicable | page-level condition only |
| movement direction | exactly two structural choices |

Field controls follow the global role mapping. For create/edit/movement, render only command-accepted inputs. Movement quantity is positive; its direction is the two-value control. A row's unit is a suffix or separate display only when the resolved model supports it.

The create/edit/movement modal and the destructive confirmation dialog are two distinct overlays: the confirmation dialog exists only for destructive confirmation and is never reused for ordinary editing.

## Commands

- Create: open an empty form, submit the declared create command, reload, and select/mark the created item when its id can be obtained.
- Update: open the declared editable command payload for the selected item; preserve fixture rules about fields excluded from the payload.
- Remove: show the destructive confirmation, run the command, reload and show success. Do not assume a page correction unless the contract requires it.
- Movement: expose only declared fields; submit only valid, positive quantity and a selected direction.
- On command failure, retain user input and show field/form feedback as appropriate. Do not navigate away on failure.

## Inventory display

- Prefer readable inventory values: label; measure with optional unit; threshold; alert/status; update date; description when supplied.
- Status is text plus semantic color. Do not create an alert column/filter when the model has no alert concept.
- The grid uses one uniform compact row height; a stacked layout increases touch target by one design-system step.
- Column order, priority and visibility are determined by the selected layout. Drop whole low-priority columns before allowing wrapping, horizontal overflow or unreadable numeric comparison.

## Optionality matrix

| Missing capability | Result |
| --- | --- |
| create | no create action/form; empty state does not offer it |
| update | records are read-only except remaining commands |
| remove | no danger action/dialog |
| move | no movement form |
| alert | no alert status, column or boolean filter |
| filters | omit filter region |
| all commands | read-only query and record reading remain valid |

## Icon employments

Allowed: search; sort ascending/descending; pagination chevrons; dismiss; create; edit; remove; reload query; success notification; empty-region mark; and an optional status icon. A selected layout may add its own stated employments.

Report unresolved design-system/icon gaps and genuine ambiguity, including the owning level (style, page or layout).
