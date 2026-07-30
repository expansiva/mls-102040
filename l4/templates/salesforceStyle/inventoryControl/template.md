# Template — Inventory control (with molecules)

> Purpose: create an operational inventory page in a split view: a paginated collection on the left and
> the selected record on the right. This document defines the outcome and behavior, and **assigns a
> concrete molecule to every interactive and structural part of the page** — with the reason for each
> assignment, so a wrong or missing molecule can be recognised instead of silently replaced.

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
  columnsByShape: { wide: Field[]; medium: Field[]; narrow: Field[] };
  panelModes: Array<'read' | 'create' | 'edit' | 'movement'>;
  // One entry per interactive or structural part of the page. §4 assigns these.
  molecules: Array<{
    slot: string;          // where in the page: 'grid', 'filter.search', 'form.create.measure', …
    role: string;          // the role that selected it, from the tables in §4
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
| Update | receives `id` and returns the same record | read-only panel |
| Remove | receives only `id` (plus optional justification) | remove danger zone |
| Move | receives `id`, quantity, and reason/direction; returns resulting measure | see variations |
| Detail | receives `id` and returns an object | use row data |
| Label | text used for creation or first non-technical text field | required |
| Measure | primary business numeric field | required |
| Alert | boolean with a matching filter | do not show status |

When a code/label pair exists, display the label and submit the code. Treat a number as currency only
when the contract explicitly declares it.

## 3. Layout contract

```text
┌─ Header ─────────────────────────────────────────────────┐ fixed
├─ Filters (when available) ───────────────────────────────┤ fixed
├─ Grid ──────────────────────────┬─ Record panel ─────────┤
│  column header            fixed │                        │
│  rows                  SCROLLS  │        SCROLLS         │
├─ Pagination ────────── pinned ──┤                        │
└─────────────────────────────────┴────────────────────────┘
```

The page has **three shapes**. This document prescribes the shapes and the invariants that must hold in
all of them. It does **not** prescribe the widths that trigger each one, nor the mechanism used to
detect them: derive the widths from the constraints below, and use whatever the project offers to
observe available space. **The outcome is what is judged, not the numbers you chose to reach it.**

| Shape | What the user sees |
| --- | --- |
| **Wide** | grid and record panel side by side, same height, separated by a hairline border. The grid is the dominant work area. All resolved columns fit. |
| **Medium** | same arrangement, panel at its narrowest readable width, fewer columns. |
| **Narrow** | **stacked: grid on top, record panel below it**, panel at full width, with a clear return-to-list action. |

### What decides the shape

Not a pixel — **whether the arrangement still works**. Step down to the next shape as soon as the
current one would force any of the following. Each is forbidden at **every** size, so any of them
appearing is proof the shape should have changed already:

- horizontal scrolling anywhere;
- a cell wrapping to a second line, or type shrinking to make content fit;
- a numeric column too narrow to compare values down the column at a glance;
- the panel as wide as the grid, or wider;
- pagination out of reach.

### Constraints that determine the numbers

Derive, do not guess — and if the arithmetic disagrees with a breakpoint the design system declares,
**the constraint wins and the shape changes earlier**. A declared breakpoint is a convenience, not a
permission to break the invariants above.

- The panel has a **readable minimum**: enough for a label and its value without wrapping. Narrower
  than that, do not squeeze it — **stack instead**.
- Column ceilings fall as space falls: at most 6 in Wide, roughly 4 in Medium, 3 in Narrow, and 2 at the
  smallest size the design system contemplates. Drop **complete columns, lowest priority first**.
- Density does not change with width; only touch targets grow in Narrow.
- **Record the widths you chose and the reasoning**, so the next reader can check the arithmetic.

### Scroll and containment

**The page is bounded by the viewport — it is not a document that grows.**

- In **wide and medium**: the page occupies the viewport height and **never scrolls as a whole**. The
  grid body and the record panel each own their own scroll. Header, filters and the grid's column
  header do not move. Pagination is **pinned to the bottom of the grid column** and is reachable
  without scrolling anything.
- In **narrow**: the page scrolls as a single document. Grid and panel give up their own scroll and
  pagination follows the end of the grid. *Reason: two independent scroll areas stacked vertically
  fight for the same gesture.*
- **Never let content height bound a region.** Height flows from the frame down to the regions, never
  the other way around.
- The record panel is a sibling of the grid, not a card floating next to it: in side-by-side layouts
  both occupy the **same height**, separated by a hairline border.

## 4. Molecules

The page is **assembled from the project's molecules**, not from hand-built controls. Every interactive
and structural part has an assigned molecule below.

### The rule

This document **assigns the concrete molecule** for every slot, and states **why that one** and **which
ones were rejected**. The assignment is a decision already made — do not re-derive it, and do not
substitute a different molecule because it seemed close enough.

The stated reason is not decoration: it is how an assignment is recognised as stale. Before using an
assigned molecule, check it still satisfies what the reason claims. If it does not, or if it **does not
exist** in the project, that is a **finding about the molecule set** — report it naming the group and the
missing behavior, and leave an explicit placeholder at that slot. **Never silently hand-build a control
in place of a molecule**: a hand-built control is invisible to whoever maintains the set, and it drifts
from every other page that uses the same molecule.

TagName is `<group>--<variant>`, e.g. `groupviewtable--ml-data-table-minimal`.

The same visual form can belong to different groups depending on intent — a table can be something you
*read*, something you *pick one from*, or something you *pick many from*. That is why the grid here is a
**view** table and not a selection table, even though clicking a row selects.

### Using an assigned molecule

- **Register it with a side-effect import**, one per molecule used, at the top of the page:
  `import '<the molecule's module path>';` — no named import, nothing destructured. The molecule
  registers its own custom element; writing the tag without importing the module gives an unknown
  element that renders nothing, **and no error**.
- **The path segment for the group is spelled exactly like the TagName's prefix — all lowercase.**
  This document names groups in camelCase when it talks *about* them (`groupViewTable`), but the module
  path and the tag both use the flat lowercase form (`groupviewtable`). Getting this wrong is a trap
  worth naming: a case-insensitive filesystem resolves the import anyway, so it compiles and runs on
  the machine where it was written and **breaks only on a case-sensitive one** — far from where the
  mistake was made.
- **Use the exact TagName.** Do not derive it from a file name or run it through a tag converter.
- **Data goes down as properties, events come up as events.** Bind values as properties and read results
  from the event payload; never write into a molecule's internals.
- **Only the props, events and slots that the molecule's own contract declares.** Never invent an
  attribute. Where that contract shows examples in another engine's syntax, take the **names and shapes**
  from it and ignore the syntax.
- **A molecule with nothing real behind it is a defect.** Every molecule must be bound to actual state
  and handlers from the resolved model. If a slot has no real binding, it is not a molecule slot.

### When the molecule and this document disagree

A molecule owns its internals; this document owns the page. Where they overlap — a molecule that brings
its own pagination, its own sticky header, its own empty state — **the molecule's version is the one that
ships, and it must not be duplicated**. Do not wrap a molecule in a page-level copy of something it
already does.

But the **layout contract still holds**: whatever the molecule brings has to end up in the region this
document assigns it to, and has to respect who scrolls (§3). If a molecule cannot be placed without
breaking containment — its pagination unreachable, its scroll fighting the page's — that is a **finding
worth reporting**, not something to paper over by disabling the molecule's feature and rebuilding it by
hand.

### What each structural slot must do

The behaviour the slot owes the page, independent of which molecule fills it. This is what makes an
assignment checkable: a molecule that stops satisfying its **Requires**, or that drags in something under
**Forbids**, is a stale assignment to report — not a reason to hand-build the part.

| Slot | Requires | Forbids |
| --- | --- | --- |
| **grid** | column-based sorting · a selection event when a row is clicked · pagination · loading skeleton · empty state · error state · **compact density** · no business logic inside the molecule | per-row checkbox column · inline cell editing · pivoting or aggregation |
| **actions** | a single labelled action, with a quiet style and a danger style available | per-row action menu (kebab) · split actions with a hidden default |
| **overlays** | a **blocking** confirmation modal that names the record · a **transient** success notification that dismisses itself · a **dismissible** banner for a page-level condition | a modal for anything that is not the destructive confirmation · a notification carrying a validation error |

Density is `compact` because the grid row height in §6 is a high-density value; a "comfortable" variant of
the same group is the wrong choice here even though it satisfies everything else.

### Structural molecules — always present

| Slot | Molecule | Why this one | Rejected |
| --- | --- | --- | --- |
| **grid** | `groupviewtable--ml-data-table-minimal` | declares `recordsView: table` **and** `density: compact`, which is what this page's row height means; its contract already carries column sorting, **optional** selection, pagination, and loading/empty states | `ml-data-table` (density `comfortable`) · `ml-data-table-select` (selection column not optional) · `ml-inline-edit-table` (inline editing) · `ml-pivot-table` (aggregation). `ml-view-table` is an acceptable **alternate**: same axes, same behaviors |
| **actions** | `grouptriggeraction--ml-button-standard` | one molecule covers every action on the page — the single primary, the quiet cancel, the danger removal — because it carries label, icon, sizes, visual styles **and** a loading state for the wait while a command runs | `ml-icon-button` (icon without text) · `ml-kebab-action-trigger` (per-row menu, which this page forbids) · `ml-split-button` (hidden default action) · `ml-button-group` (no set of sibling actions here) |
| **removal dialog** | `groupnotifyuser--ml-alert-modal` | blocking, built for destructive actions, and demands an explicit choice before proceeding | — |
| **success notification** | `groupnotifyuser--ml-toast-notification` | ephemeral, in a corner, dismisses itself — which is exactly what a command result needs | `ml-contextual-feedback` (field-level; validation belongs next to the field, and the field molecules already do that) |
| **system error banner** | `groupnotifyuser--ml-notify-banner` | inline banner with semantic types and dismissal. **Conditional, and often absent:** it carries only a page-level condition that no region owns. It is *not* where the collection failure goes (that belongs to the data region) and *not* where command validation goes (that belongs to the form). With nothing page-level to report, this row goes unused — an assigned molecule is a permission, not an obligation | — |

### Field molecules — assigned by role, never by primitive type

Map from the **role the field plays in the resolved model**, not from its primitive type. *Reason: a
contract usually carries primitives — a direction, a unit and a reason may all be declared as `string` —
so mapping by primitive sends everything to free text and throws away what the model already knows.*

| Role in the resolved model | Molecule | Why, and what was rejected |
| --- | --- | --- |
| short free text — label, unit, or a reason with no declared vocabulary | `groupentertext--ml-enter-text` | general-purpose, with length limits and edit/view modes. The specialised variants (`ml-cpf-input`, `ml-phone-input`, `ml-address-field`, `ml-password-strength-input`, `ml-tag-input`) answer roles this page does not have |
| long free text — description, observations | `groupentertext--ml-multiline-text` | switches between one line and a paragraph by its `rows`, so the same molecule serves both |
| free-text search over the collection | `groupsearchcontent--ml-search-bar` | field + clear + loading/empty states. **Not** `ml-faceted-search` or `ml-search-filters`: those own an entire filter panel, and this page lays its filters out itself |
| numeric — measure, threshold, movement quantity | `groupenternumber--ml-number-input` | locale-aware decimal, and a **suffix adornment** — which is how the unit appears when `unitDisplay` is `suffix`. `ml-number-stepper` only when the domain genuinely adjusts in discrete steps; `ml-floating-number-input` is a label-placement variant this page's field layout does not use |
| numeric **the contract declares as currency** | `groupentermoney--ml-currency-input` | the locale-general one; `ml-enter-money-br` only when the contract is Brazil-specific |
| boolean — the alerts-only filter, or a boolean field | `groupenterboolean--ml-checkbox-preference` | the group's **only checkbox** variant. **Not** `ml-toggle-switch`, `ml-boolean-segmented` or `ml-toggle-icon`: a filter is a predicate ("show only those that…"), and a switch reads as a setting the user is configuring |
| a **declared** vocabulary, one choice | `groupselectone--ml-select` | conventional click-to-open dropdown for exactly one option. `ml-select-dropdown` when the vocabulary is long enough to need searching inside it |
| a **declared** vocabulary, several choices | `groupselectmany--ml-multi-checkbox-list` | all options visible, no hidden state — consistent with the checkbox used for the boolean role. `ml-multi-select-dropdown` when the list is too long to show; `ml-table-multi-select` and `ml-tree-multi-select` answer structures this page does not have |
| **movement direction** — always exactly two values (§5) | `groupselectone--ml-radio-group` | shows both options at once, as a form field with a legend, next to the other form fields. **Not** `ml-segmented-control`: it reads as a view switcher, and this panel already switches modes — the two would compete |
| date, or date and time | `groupenterdate--ml-date-picker` · `groupenterdatetime` variant to match | a picker fits a form row; the inline-calendar variants are too tall for a form or a filter bar |
| a min/max pair over a number | `groupenternumberinterval--ml-number-interval-inputs` | two typed bounds. **Not** `ml-number-range-slider`: a slider cannot express an exact bound, and filtering needs exact |
| a min/max pair over dates | `groupenterdateinterval--ml-date-range-dual-calendar` | the general case; `ml-date-interval-presets` when the domain has canonical ranges worth offering. When the bounds carry a time, the matching `groupenterdatetimeinterval` variant |

Two consequences worth stating, because they are the ones most often got wrong:

- **Currency is a contract fact, not a name.** A field called `price`, `cost` or `total` gets
  `ml-number-input` until the contract or the business rules say it is money.
- **A vocabulary must be declared to become a selection.** With no declared value set, the field is free
  text — never a select with invented options.

**A known friction in the set, to report rather than paper over**: the checkbox variant is named and
framed as a *preference* control, while the role it fills here is a *filter predicate*. The form is right
and the framing is not. Use it, and record it — if the set later grows a filter-oriented checkbox, this
assignment should move.

## 5. Regions and behavior

### Header

- Page title, short context, and query total.
- Secondary actions on the right; only one global primary action: **Create**, when available.
- Do not display cards, KPIs, or charts above the grid.

### Filters

Render only when a filter was resolved. Order them: search → facets → range → boolean.

- Changing a filter returns to page 1, preserves sorting, and clears selection.
- Search waits for a short pause in typing before querying.
- Each control is the molecule its role maps to in §4 — including the boolean one, which is a checkbox
  role (`groupEnterBoolean`) and must never read as a select.

### Grid

Carried by the **grid** molecule (§4). The molecule owns column geometry, header/cell alignment, sticky
header, sorting affordance and pagination mechanics; this document owns what goes in it and what it
means.

- Priority columns: label, measure/unit, status, threshold, date, facet, and extras.
- Right-align numbers, use tabular figures, and apply formats declared by the domain.
- Remote sorting is available only for columns declared by the query. Without remote sorting, sort
  loaded values only when the entire collection fits on one page.
- Clicking anywhere on a row selects the record and loads the panel.
- The selected row stays visually distinguishable for as long as the panel shows it. Master-detail
  without that mark leaves the user unable to tell which row the panel is about. If the grid molecule
  treats selection as a controlled prop, echoing the choice back is part of wiring it.
- Required states: loading, empty without filters, empty after filtering, and error with "Try again".
- The two empty states say different things: nothing exists yet × the filter hid everything.
- **All four states render inside the data region, in place of the rows** — same frame, same borders,
  same width. A failure to load the collection belongs where the collection would be, with its retry
  action right there, because that is where the user is looking and what they are trying to recover.
  Never report it as a page-level banner: the banner speaks for the page, and this failure is about the
  region. And never show a failure and an empty state at once — "nothing here" plus "it broke" tells
  two different stories about the same absence.
- **The states are presented alike: centered in the region, on both axes** — icon (when there is one),
  sentence, then the single action, stacked and centered. They are the same kind of thing — a region
  with no rows explaining itself — so they must not each invent a layout. A left-aligned failure beside
  a centered empty state reads as two different components taking turns.
- **The failure is not colored red.** State colour is for a value that *is* wrong — a field, a status.
  Here the message text is normal body colour: the state is already unmistakable from replacing the data
  and offering a retry, and a red headline turns a recoverable, often transient condition into an alarm.
  Semantic colour is reserved for the status column and for field-level validation, where it carries
  meaning that the words alone do not.
- If the grid molecule's own error affordance is thinner than this (a caption line, a footnote), the
  page renders the state in the region itself and leaves that affordance unused. A required state is
  not satisfied by a molecule prop that merely mentions the error somewhere.

### Pagination

**The grid molecule brings its own pagination — use it.** Feed it the page, the page size and the total
from the query, and let it emit the page change. Do **not** build a second pagination beside it, and do
not turn its pagination off to rebuild one by hand.

- **Page size: 25 items**, or 10 when a row is tall enough that 25 would not fit a screenful. This is a
  functional decision about how much collection to load at once, not a design-system value — the scales
  in §6 have nothing to say about it.
- Page and page size are query parameters, not controls on the screen. The user never chooses the size.
- Wherever the molecule renders its pagination, it must land in the region §3 assigns and stay
  **reachable without scrolling** in the side-by-side shapes. If the molecule's pagination cannot be
  placed without breaking that, report it (§4) instead of working around it.

### Panel

The panel always exists: without a selection it guides the user; with a selection it shows read mode.
Modes are mutually exclusive.

| Mode | Available when | Successful outcome |
| --- | --- | --- |
| Read | always | — |
| Create | a create command exists | reload, select the new record, return to read |
| Edit | an update command exists | reload record, return to read |
| Movement | a move or relate command exists | clear form and return to read |

- Read: label, status (if available), label/value field pairs, and permitted actions.
- Edit/create: show only inputs accepted by the command. Validation appears at each field and, when
  there are multiple errors, in a summary at the top.
- **Cancel and the confirming action live on the same row, at the end of the form** — never cancel in the
  form's header or anywhere apart from the action it cancels. Confirm sits last, cancel beside it, both
  in the same alignment, with cancel in a quieter style (the page's single primary action belongs to
  Create in the header). *Reason: an escape placed far from the commitment reads as "leave this screen"
  instead of "abandon this form".* This applies to every mode that is not read, and to the removal
  dialog.
- Movement: quantity is **always positive** — the direction field carries the sign, never a negative
  number.
- **Direction is structural, not domain vocabulary.** Whenever the command has a field expressing whether
  the movement raises or lowers the measure, that field is **always a single choice between exactly two
  values**, labeled in business language ("Entrada"/"Saída", "Aumento"/"Redução") — **with or without a
  declared vocabulary, no exceptions**. Never a text input. Writing those two labels is **not** inventing
  domain options: the binary shape comes from the movement operation itself. Only an operation that is
  inherently one-way has no direction field at all.
- Reason **is** domain vocabulary: a selection control only when the contract or the business rules
  declare the value set; otherwise a text input.
- Removal: a small action at the bottom of the panel, separated by a divider and always confirmed in a
  dialog. **It carries the danger style — both there and on the confirming action in the dialog** (the
  action molecule offers one; §4). Quiet is the style of a *reversible* secondary action, so a quiet
  removal sits indistinguishable beside Edit and reads as equally harmless right up to the dialog. The
  danger style is what makes the divider and the warning sentence add up to a danger zone instead of
  just a paragraph. Cancel in that dialog stays quiet: only one side of a destructive choice is loud.

### Overlays

Carried by the three overlay molecules assigned in §4 — one each for the dialog, the notification and
the banner.

- Dialog only for removal: names the record, blocks interaction, and does not close on outside click.
- Transient notification only for successful commands.
- A dismissible banner may report a **page-level** condition — one that belongs to no single region.
  Failures that a region owns are reported by that region: the collection failing to load is drawn in
  the data region, and command validation next to the fields. With nothing page-level to say, there is
  no banner: reaching for it to display a region's error is what produces two competing error surfaces.
- When there is one, it sits **in the flow, directly below the page header**, spanning the content
  width, taking space rather than floating over it. Two things this rules out, both seen in practice:
  floating it against the screen (a persistent error that overlays the header hides the very controls
  used to recover from it), and placing it above the header (it detaches from the page it belongs to
  and pushes the page identity down).
- On narrow screens, notifications use the available bottom width; dialogs keep side margins.

## 6. Visual invariants

Molecules carry their own appearance from the design system. These invariants are what the **page** must
hold, and what disqualifies a variant that would break them.

**No measurement in this section is a number.** Every value comes from the design system's scales —
space, radius, type size, weight, line height, duration, shadow. This document says *which step of the
scale* and *why*; the design system says how much that is. A number written here would override the
brand's own decision and would be wrong for the next design system this template meets.

| Topic | Rule |
| --- | --- |
| Density | every gap and padding comes from the design system's **space scale** — nothing off-scale. The same kind of element gets the same padding across the whole page |
| Grid row | **one compact height, uniform** for the entire grid — the tightest that still gives a comfortable click target. One step taller in the stacked shape, where the pointer is likely a finger |
| Surfaces | a **hairline** border and the design system's **smallest** radius; no shadow outside overlays, and overlays use its **smallest** elevation that still separates them from the page |
| Typography | one family, and **exactly two weights**: the regular one and the emphasis one the design system declares. Two sizes carry the page — the **body** size for values and cells, and **one step down** for labels, column headers and metadata. Tabular figures in every numeric column |
| Color | mostly neutral; color only for primary action, links, status, and focus |
| Table | no zebra striping or vertical dividers; subtle bottom separators |
| Status | text + color; never color alone or saturated backgrounds |
| Motion | the **shortest** duration the design system declares, and never long enough to be read as animation; no bounce; focus appears with **no** transition at all |
| Icons | project icon set only — see below |

**Read the design system's values, not its token names.** Scale names are not guaranteed to be ordered:
a set may declare its transition tokens with names that run opposite to their durations, so "fast" is not
necessarily the shortest. Pick by the value, and if the intent above and the name disagree, the intent
wins. The same caution applies to any scale whose steps are named rather than numbered.

When a step this section asks for **does not exist** in the design system — no weight between regular and
bold, no text level below muted, no radius small enough — that is a **finding about the design system**.
Record it, take the nearest step, and say which one you took. Do not invent a value to fill the gap.

### Icons

Monochrome, inheriting the text color, **sized to the text they sit beside** — never larger than the
label next to them, and one step smaller for the sort arrow. **Always next to text and never replacing
it**. They come from the **project icon set** — never third-party, never drawn inline per page, and
**never a typographic glyph** (`▲` `▼` `‹` `›` `✕`) standing in for an icon.

These are the employments, and no others: search · sort ascending/descending · pagination chevrons ·
dismiss · return to list · create · remove · reload the query · success in the notification · the
discreet mark for the empty grid and the empty panel · and optionally one per status. Icons a molecule
draws for itself are the molecule's business, not this list's.

Do not invent domain options, units, reasons, color values, or visible technical names. Use project
tokens and molecules.

## Appendix A — Variation matrix

| Condition | Remove/change | Alternative |
| --- | --- | --- |
| No create | CTA and create mode | empty state does not offer creation |
| No update | edit mode | panel remains read-only with remaining actions |
| No remove | danger zone and dialog | — |
| No move | movement mode | if update accepts the measure, record lost traceability |
| No alert | status chip, column, and boolean filter | boolean may become an extra field |
| No filters | filter region | grid follows the header directly |
| No commands | operational modes | query + read panel remain valid |
| An assigned molecule does not exist, or no longer fits its stated reason | that part as a molecule | leave the placeholder from §4 and record the finding; do not hand-build silently |

## Appendix B — Delivery checklist

- [ ] The resolved model, **including the molecule assigned to each slot**, was recorded before design began.
- [ ] **Every interactive and structural part uses the molecule §4 assigns to it** — nothing hand-built in
      place of one, and no substitution made because another molecule looked close enough.
- [ ] **Every assigned molecule was confirmed to exist**, and any that did not is reported as a finding
      about the set, with a placeholder left at its slot.
- [ ] **Every molecule used is registered by a side-effect import** of its module — a tag written without
      its import renders nothing and raises no error.
- [ ] **Every molecule is bound to real state and handlers**; none is decorative.
- [ ] **Nothing a molecule already does was rebuilt beside it** — no second pagination, no page-level
      copy of its empty state or its sticky header.
- [ ] Only props, events and slots the molecule's own contract declares; no invented attribute, and no
      binding syntax copied from a contract written for another engine.
- [ ] The boolean filter uses the **checkbox** molecule, not the switch or the segmented one.
- [ ] The grid uses the **compact view-table** molecule — not a selection table, not an editable one.
- [ ] **In wide and medium, the page does not scroll**: grid body and panel scroll on their own, and
      **pagination is visible without scrolling anything**. No region is bounded by its content height.
- [ ] **The three shapes were each opened and looked at**, and the page was resized **through** the
      transitions: columns drop by priority, the panel stacks with a return-to-list action, and none of
      the forbidden outcomes appears at any width along the way.
- [ ] Columns, filters, and actions match the actual contract.
- [ ] Selection, filtering, sorting, and pagination have predictable effects.
- [ ] **The collection's failure is drawn in the data region**, with its retry action there — not in a
      page banner, and never alongside an empty state.
- [ ] **The region's states look like each other**: loading, both empties and the failure are centred the
      same way, and the failure's text is not red.
- [ ] **Removal wears the danger style** in the panel and in the dialog's confirming action; cancel stays
      quiet.
- [ ] The panel guides without a selection; modes never appear together.
- [ ] **Cancel is on the same row as the action it cancels**, at the end of the form.
- [ ] **Movement direction is a two-value choice**, never a text input — and quantity is positive.
- [ ] Creation selects the new record; removal requests confirmation.
- [ ] Validation errors are next to fields, not in notifications.
- [ ] There is only one global primary action.
- [ ] Light and dark themes use design-system tokens.
- [ ] There is no visible technical content, excessive decoration, zebra striping, or surface shadow.

## Appendix C — Decisions to record

Record outside this template: field and command mapping · **the molecule table: slot, the role that
selected it, the assigned TagName, and every slot where the assigned molecule was missing or did not
fit** · columns
per shape · sortable fields · data formats · filter and form controls · state messages · action copy ·
the widths chosen for each shape and the reasoning that produced them · and notes about contract gaps
and about molecules that were missing from the set or wrong for the role they had to fill.
