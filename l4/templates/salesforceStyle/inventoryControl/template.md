# Template — Inventory control (with molecules)

> Purpose: create an operational inventory page over a paginated collection of items — reviewing them one
> by one and operating on them. This document defines **what the page is**: the model it resolves, the
> meaning of its columns and commands, and **the concrete molecule for every structural part** — with the
> reason for each assignment, so a wrong or missing molecule can be recognised instead of silently
> replaced.

**Three documents make one specification, and they arrive assembled in this order:**

| Document | Carries |
| --- | --- |
| `salesforceStyle/template.md` | rules for every page in the style: how molecules are used, containment, the states a collection region owes, form and action conventions, overlays, visual invariants |
| **this document** | what this page *is*: the domain model, the columns, the commands and what they mean, the structural molecules |
| `layouts/<layout>/template.md` | how it is *arranged*: shapes, who scrolls, how a record is reached and where its form lives |

Each narrows the one before it and **never contradicts** it. A contradiction is a finding to report, not an
override to make silently. This document says nothing about arrangement — no shapes, no panel, no scenes —
because the same page has more than one, and each is its own layout document.

## 1. When to use it

Use when there is a paginated query of items with an identifier, a readable label, and a comparable
numeric measure. It is suited to item-by-item review and operations.

Do not use it for dashboards, read-only reports, multi-step flows, predominantly visual records, or
non-paginated collections. In those cases, request a different page classification.

### Minimum required

- a query with `items`, `total`, `page`, and `pageSize`;
- a record identifier;
- a readable label;
- a numeric measure.

Without this minimum, this page does not apply.

## 2. Resolve the model before designing

Inspect the workspace once and produce the model below. Do not make contract decisions while designing
the page.

```ts
type ResolvedModel = {
  query: Query;
  commands: {
    create?: Command;
    update?: Command;
    remove?: Command;
    move?: Command;
    relate?: Command;
    detail?: Query;
  };
  fields: {
    id: Field;
    label: Field;
    measure: Field;
    unit?: Field;
    threshold?: Field;
    alert?: Field;
    date?: Field;
    description?: Field;
    facets: Field[];
    extras: Field[];
  };
  filters: {
    search?: Input;
    facets: Input[];
    range?: { min: Input; max: Input };
    alertsOnly?: Input;
  };
  sorting: { remote: boolean; columns: Field[] };
  unitDisplay?: 'column' | 'suffix';
  // How the record and its forms are presented, and how columns fall as space falls, are
  // the LAYOUT's decisions — its document adds whatever fields it needs for them.
  //
  // One entry per interactive or structural part of the page. §3 here and the style
  // document's field-molecule table assign these.
  molecules: Array<{
    slot: string;          // where in the page: 'grid', 'filter.search', 'form.create.measure', …
    role: string;          // the role that selected it
    molecule: string;      // the assigned TagName: '<group>--<variant>'
    missing?: string;      // set when the assigned molecule does not exist or no longer fits,
                           // with what is missing — the slot then carries a placeholder
  }>;
  variations: string[];
  notes: string[];
};
```

### Resolution rules

| Element | How to identify it | Fallback |
| --- | --- | --- |
| Query | returns a paginated collection and total | page does not apply |
| Create | does not receive `id` and returns a new `id` | remove creation |
| Update | receives `id` and returns the same record | the record is read-only |
| Remove | receives only `id` (plus optional justification) | remove danger zone |
| Move | receives `id`, quantity, and reason/direction; returns resulting measure | see variations |
| Detail | receives `id` and returns an object | use row data |
| Label | text used for creation or first non-technical text field | required |
| Measure | primary business numeric field | required |
| Alert | boolean with a matching filter | do not show status |

When a code/label pair exists, display the label and submit the code. Treat a number as currency only when
the contract explicitly declares it.

## 3. Structural molecules

The style document governs how molecules are used and assigns the **field** molecules by role. This section
assigns the **structural** ones this page is made of.

### What each structural slot must do

The behaviour the slot owes the page, independent of which molecule fills it. This is what makes an
assignment checkable: a molecule that stops satisfying its **Requires**, or that drags in something under
**Forbids**, is a stale assignment to report — not a reason to hand-build the part.

| Slot | Requires | Forbids |
| --- | --- | --- |
| **grid** | column-based sorting · a selection event when a row is clicked · pagination · loading skeleton · empty state · error state · **compact density** · no business logic inside the molecule | per-row checkbox column · inline cell editing · pivoting or aggregation |
| **actions** | a single labelled action, with a quiet style and a danger style available | per-row action menu (kebab) · split actions with a hidden default |
| **overlays** | a **blocking** confirmation modal that names the record · a **transient** success notification that dismisses itself · a **dismissible** banner for a page-level condition | a modal for anything that is not the destructive confirmation · a notification carrying a validation error |

Density is `compact` because the grid row height in §5 is a high-density value; a "comfortable" variant of
the same group is the wrong choice here even though it satisfies everything else.

### The assignments

| Slot | Molecule | Why this one | Rejected |
| --- | --- | --- | --- |
| **grid** | `groupviewtable--ml-data-table-minimal` | declares `recordsView: table` **and** `density: compact`, which is what this page's row height means; its contract already carries column sorting, **optional** selection, pagination, and loading/empty states | `ml-data-table` (density `comfortable`) · `ml-data-table-select` (selection column not optional) · `ml-inline-edit-table` (inline editing) · `ml-pivot-table` (aggregation). `ml-view-table` is an acceptable **alternate**: same axes, same behaviors |
| **actions** | `grouptriggeraction--ml-button-standard` | one molecule covers every action on the page — the single primary, the quiet cancel, the danger removal — because it carries label, icon, sizes, visual tones **and** a loading state for the wait while a command runs | `ml-icon-button` (icon without text) · `ml-kebab-action-trigger` (per-row menu, which this page forbids) · `ml-split-button` (hidden default action) · `ml-button-group` (no set of sibling actions here) |
| **removal dialog** | `groupnotifyuser--ml-alert-modal` | blocking, built for destructive actions, and demands an explicit choice before proceeding | — |
| **success notification** | `groupnotifyuser--ml-toast-notification` | ephemeral, in a corner, dismisses itself — which is exactly what a command result needs | `ml-contextual-feedback` (field-level; validation belongs next to the field, and the field molecules already do that) |
| **system error banner** | `groupnotifyuser--ml-notify-banner` | inline banner with semantic types and dismissal. On this page it is **conditional and usually absent**: the collection's failure belongs to the grid region (§4) and command validation belongs to the form, so there is often no page-level condition left for it to carry | — |

### The one field role this page adds

The style document's field table covers every role by primitive and intent. This page contributes one role
whose *shape* comes from the operation rather than from the domain:

| Role | Molecule | Why |
| --- | --- | --- |
| **movement direction** — always exactly two values (§4) | `groupselectone--ml-radio-group` | it is the style's *structural two-value choice* role: both options visible, as a form field with a legend, beside the other fields. **Not** `ml-segmented-control` — it reads as a view switcher, and would compete with any region of the layout that already switches between modes or scenes |

## 4. Regions and behavior

### Header

- Page title, short context, and query total.
- Secondary actions on the right; the page's single primary action is **Create**, when available.
- Do not display cards, KPIs, or charts above the grid.

### Filters

Render only when a filter was resolved. Order them: search → facets → range → boolean.

- Changing a filter returns to page 1, preserves sorting, and clears selection.
- Search waits for a short pause in typing before querying.
- Each control is the molecule its role maps to in the style document — including the boolean one, which is
  a checkbox role and must never read as a select.

### Grid

Carried by the **grid** molecule (§3). The molecule owns column geometry, header/cell alignment, sticky
header, sorting affordance and pagination mechanics; this document owns what goes in it and what it means.

The four collection states and how they are presented come from the style document. What is this page's:

- Priority columns: label, measure/unit, status, threshold, date, facet, and extras.
- Right-align numbers, use tabular figures, and apply formats declared by the domain.
- Remote sorting is available only for columns declared by the query. Without remote sorting, sort loaded
  values only when the entire collection fits on one page.
- **How a record is reached from a row is the layout's decision** — a whole-row click, a per-row action, or
  both. Whatever it is, it must be the same for every row, and reaching a record must never depend on a
  column that a narrower shape drops.
- The empty-without-filters state offers creation, when a create command exists; the empty-after-filtering
  state offers a way back out of the filter instead.

### Pagination

**The grid molecule brings its own pagination — use it.** Feed it the page, the page size and the total
from the query, and let it emit the page change. Do **not** build a second pagination beside it, and do not
turn its pagination off to rebuild one by hand.

- **Page size: 25 items**, or 10 when a row is tall enough that 25 would not fit a screenful. This is a
  functional decision about how much collection to load at once, not a design-system value — the scales in
  §5 have nothing to say about it.
- Page and page size are query parameters, not controls on the screen. The user never chooses the size.
- Wherever the molecule renders its pagination, it must land in the region the layout document assigns and
  stay **reachable without scrolling** wherever that layout bounds the page to the viewport. If the
  molecule's pagination cannot be placed without breaking that, report it instead of working around it.

### Editing this domain

Rules about **what** the operations mean. Where these forms live on screen — a panel, a scene, a dialog — is
the layout's decision; what they contain and how they behave is not.

- Show only inputs the command accepts. Form and action conventions — where cancel sits, where validation
  appears, how a destructive action is styled and confirmed — come from the style document.
- Movement: quantity is **always positive** — the direction field carries the sign, never a negative number.
- **Direction is structural, not domain vocabulary.** Whenever the command has a field expressing whether
  the movement raises or lowers the measure, that field is **always a single choice between exactly two
  values**, labeled in business language ("Entrada"/"Saída", "Aumento"/"Redução") — **with or without a
  declared vocabulary, no exceptions**. Never a text input. Writing those two labels is **not** inventing
  domain options: the binary shape comes from the movement operation itself. Only an operation that is
  inherently one-way has no direction field at all.
- Reason **is** domain vocabulary: a selection control only when the contract or the business rules declare
  the value set; otherwise a text input.
- Removal always names the record it destroys and says what is lost.
- Outcomes, whatever the layout: creating selects the new record · updating reloads it · a movement clears
  its form · each of the three reports success once, through the notification.

## 5. Visual specifics of this page

The style document carries the invariants. This page fixes one thing of its own, and it is still a step on
a scale, not a number:

| Topic | Rule |
| --- | --- |
| Grid row | **one compact height, uniform** for the entire grid — the tightest that still gives a comfortable click target. One step taller in the stacked shape, where the pointer is likely a finger |

### Icon employments

These are the employments this page allows, and no others: search · sort ascending/descending · pagination
chevrons · dismiss · create · edit · remove · reload the query · success in the notification ·
the discreet mark for an empty region · and optionally one per status.
A layout may add employments of its own.

## Appendix A — Variation matrix

| Condition | Remove/change | Alternative |
| --- | --- | --- |
| No create | the create action and its form | empty state does not offer creation |
| No update | the edit action and its form | the record is read-only, with the remaining actions |
| No remove | danger zone and dialog | — |
| No move | the movement action and its form | if update accepts the measure, record lost traceability |
| No alert | status chip, column, and boolean filter | boolean may become an extra field |
| No filters | filter region | grid follows the header directly |
| No commands | every operational form | query + reading a record remain valid |
| An assigned molecule does not exist, or no longer fits its stated reason | that part as a molecule | leave the placeholder from §3 and record the finding; do not hand-build silently |

## Appendix B — Delivery checklist

Adds to the style document's checklist; it does not restate it.

- [ ] The resolved model, **including the molecule assigned to each slot**, was recorded before design
      began.
- [ ] The boolean filter uses the **checkbox** molecule, not the switch or the segmented one.
- [ ] The grid uses the **compact view-table** molecule — not a selection table, not an editable one.
- [ ] Columns, filters, and actions match the actual contract.
- [ ] Selection, filtering, sorting, and pagination have predictable effects.
- [ ] **Movement direction is a two-value choice**, never a text input — and quantity is positive.
- [ ] Creation selects the new record; removal requests confirmation.
- [ ] Only the icon employments listed in §5 appear.

## Appendix C — Decisions to record

Record outside this template: field and command mapping · **the molecule table: slot, the role that
selected it, the assigned TagName, and every slot where the assigned molecule was missing or did not fit** ·
sortable fields · data formats · filter and form controls · state messages · action copy · and notes about
contract gaps and about molecules that were missing from the set or wrong for the role they had to fill.

The layout document adds what belongs to the arrangement — which columns at which shape, the widths chosen
and the arithmetic behind them.
