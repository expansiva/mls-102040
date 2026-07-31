# Style — salesforceStyle (global rules)

> These rules hold for **every page** in this style, whatever the page does. A page template
> (`salesforceStyle/<template>/template.md`) adds what is specific to it: which page it is, the model it
> resolves, its shapes, its regions, and which concrete molecules fill its structural slots.

## 0. How this document relates to a page template

**This document is the floor.** A page template may **narrow** a rule here — be more specific, add a
constraint, name the region a rule applies to — and may **never contradict** one.

If a page genuinely needs the opposite of something here, that is a **finding to report**, not an
override to make silently. Either this document is wrong for the style, or the page does not belong to
it; both are decisions for a human, and both are invisible if the page just does the other thing.

Two consequences:

- **Do not repeat a rule from here in a page template.** A copy is a future divergence: the two drift,
  and nothing detects it. Reference it instead.
- Where the two documents overlap in scope, the more specific one applies **within its scope only** — a
  page that fixes the row height of *its* grid does not license off-scale measures anywhere else.

## 1. Molecules

Pages in this style are **assembled from the project's molecules**, not from hand-built controls. Every
interactive and structural part gets a molecule.

### Assignment is a decision already made

A page template **assigns the concrete molecule** for every slot, states **why that one** and **which
ones were rejected**. Do not re-derive an assignment, and do not substitute a different molecule because
it seemed close enough.

The stated reason is not decoration: it is how an assignment is recognised as **stale**. Before using an
assigned molecule, check it still satisfies what the reason claims. If it does not, or if it **does not
exist** in the project, that is a **finding about the molecule set** — report it naming the group and the
missing behavior, and leave an explicit placeholder at that slot. **Never silently hand-build a control
in place of a molecule**: a hand-built control is invisible to whoever maintains the set, and it drifts
from every other page that uses the same molecule.

**An assigned molecule is a permission, not an obligation.** A molecule assigned to a slot that this
particular page has no use for simply goes unused. Do not find something to put in it — a molecule
pressed into service for a job that belongs elsewhere is how a page ends up with two surfaces competing
to report the same thing.

TagName is `<group>--<variant>`, e.g. `groupviewtable--ml-data-table-minimal`.

The same visual form can belong to different groups depending on intent — a table can be something you
*read*, something you *pick one from*, or something you *pick many from*. Read the intent, not the shape.

### Using an assigned molecule

- **Register it with a side-effect import**, one per molecule used, at the top of the page:
  `import '<the molecule's module path>';` — no named import, nothing destructured. The molecule
  registers its own custom element; writing the tag without importing the module gives an unknown
  element that renders nothing, **and no error**.
- **The path segment for the group is spelled exactly like the TagName's prefix — all lowercase.**
  A document names groups in camelCase when it talks *about* them (`groupViewTable`), but the module path
  and the tag both use the flat lowercase form (`groupviewtable`). Getting this wrong is a trap worth
  naming: a case-insensitive filesystem resolves the import anyway, so it compiles and runs on the machine
  where it was written and **breaks only on a case-sensitive one** — far from where the mistake was made.
- **Use the exact TagName.** Do not derive it from a file name or run it through a tag converter.
- **Data goes down as properties, events come up as events.** Bind values as properties and read results
  from the event payload; never write into a molecule's internals.
- **Only the props, events and slots that the molecule's own contract declares.** Never invent an
  attribute. Where that contract shows examples in another engine's syntax, take the **names and shapes**
  from it and ignore the syntax.
- **A molecule with nothing real behind it is a defect.** Every molecule must be bound to actual state and
  handlers from the resolved model. If a slot has no real binding, it is not a molecule slot.
- **A molecule's appearance is changed through the API it declares for that**, not by adding classes over
  it. Where a molecule offers a variant, tone or size, use it. Utility classes appended from outside land
  on the same element as the molecule's own class, with the same specificity, so which one wins depends on
  stylesheet order — the override silently does nothing about as often as it works. Outside classes are
  for what the molecule does not set at all: margin, width, alignment.

### When the molecule and the page template disagree

A molecule owns its internals; the page template owns the page. Where they overlap — a molecule that
brings its own pagination, its own sticky header, its own empty state — **the molecule's version is the
one that ships, and it must not be duplicated**. Do not wrap a molecule in a page-level copy of something
it already does.

But the **layout contract still holds**: whatever the molecule brings has to end up in the region the page
template assigns it to, and has to respect who scrolls. If a molecule cannot be placed without breaking
containment — its pagination unreachable, its scroll fighting the page's — that is a **finding worth
reporting**, not something to paper over by disabling the molecule's feature and rebuilding it by hand.

**An affordance thinner than the state it is supposed to carry does not satisfy that state.** If a
required state is "error with a retry" and the molecule only declares an error string with no action, the
region renders the state itself and that prop goes unused. A required state is not satisfied by a prop
that merely mentions the condition somewhere.

### Field molecules — assigned by role, never by primitive type

Map from the **role the field plays in the resolved model**, not from its primitive type. *Reason: a
contract usually carries primitives — a direction, a unit and a reason may all be declared as `string` —
so mapping by primitive sends everything to free text and throws away what the model already knows.*

| Role in the resolved model | Molecule | Why, and what was rejected |
| --- | --- | --- |
| short free text — a label, a unit, or any value with no declared vocabulary | `groupentertext--ml-enter-text` | general-purpose, with length limits and edit/view modes. The specialised variants (`ml-cpf-input`, `ml-phone-input`, `ml-address-field`, `ml-password-strength-input`, `ml-tag-input`) answer roles only a page that has them should reach for |
| long free text — a description, observations | `groupentertext--ml-multiline-text` | switches between one line and a paragraph by its `rows`, so the same molecule serves both |
| free-text search over a collection | `groupsearchcontent--ml-search-bar` | field + clear + loading/empty states. **Not** `ml-faceted-search` or `ml-search-filters`: those own an entire filter panel, and pages in this style lay their filters out themselves |
| numeric — a measure, a threshold, a quantity | `groupenternumber--ml-number-input` | locale-aware decimal, and a **suffix adornment** — which is how a unit appears when it is shown as a suffix. `ml-number-stepper` only when the domain genuinely adjusts in discrete steps; `ml-floating-number-input` is a label-placement variant this style's field layout does not use |
| numeric **the contract declares as currency** | `groupentermoney--ml-currency-input` | the locale-general one; `ml-enter-money-br` only when the contract is Brazil-specific |
| boolean — a filter predicate, or a boolean field | `groupenterboolean--ml-checkbox-preference` | the group's **only checkbox** variant. **Not** `ml-toggle-switch`, `ml-boolean-segmented` or `ml-toggle-icon`: a filter is a predicate ("show only those that…"), and a switch reads as a setting the user is configuring |
| a **declared** vocabulary, one choice | `groupselectone--ml-select` | conventional click-to-open dropdown for exactly one option. `ml-select-dropdown` when the vocabulary is long enough to need searching inside it |
| a **declared** vocabulary, several choices | `groupselectmany--ml-multi-checkbox-list` | all options visible, no hidden state — consistent with the checkbox used for the boolean role. `ml-multi-select-dropdown` when the list is too long to show; `ml-table-multi-select` and `ml-tree-multi-select` answer structures a page must actually have |
| a **structural** choice between exactly two values (not domain vocabulary) | `groupselectone--ml-radio-group` | shows both options at once, as a form field with a legend, next to the other form fields. **Not** `ml-segmented-control`: it reads as a view switcher, and competes with any region that already switches modes |
| date, or date and time | `groupenterdate--ml-date-picker` · `groupenterdatetime` variant to match | a picker fits a form row; the inline-calendar variants are too tall for a form or a filter bar |
| a min/max pair over a number | `groupenternumberinterval--ml-number-interval-inputs` | two typed bounds. **Not** `ml-number-range-slider`: a slider cannot express an exact bound, and filtering needs exact |
| a min/max pair over dates | `groupenterdateinterval--ml-date-range-dual-calendar` | the general case; `ml-date-interval-presets` when the domain has canonical ranges worth offering. When the bounds carry a time, the matching `groupenterdatetimeinterval` variant |

Two consequences worth stating, because they are the ones most often got wrong:

- **Currency is a contract fact, not a name.** A field called `price`, `cost` or `total` gets
  `ml-number-input` until the contract or the business rules say it is money.
- **A vocabulary must be declared to become a selection.** With no declared value set, the field is free
  text — never a select with invented options.

**A known friction in the set, to report rather than paper over**: the checkbox variant is named and framed
as a *preference* control, while the role it usually fills is a *filter predicate*. The form is right and
the framing is not. Use it, and record it — if the set later grows a filter-oriented checkbox, this
assignment should move.

## 2. Containment

**A page in this style is bounded by the viewport — it is not a document that grows.**

- **Never let content height bound a region.** Height flows from the frame down to the regions, never the
  other way around.
- Regions placed side by side occupy the **same height**, separated by a hairline border — siblings, not
  cards floating next to each other.
- Where two scrollable regions would stack vertically, they give up their own scroll and the page scrolls
  as one document instead. *Reason: two independent scroll areas stacked vertically fight for the same
  gesture.*

Which regions scroll, and at which shape, is the page template's decision — these constraints hold
whatever it decides.

## 3. States of a region that shows a collection

Any region that renders a collection owes four states: **loading**, **empty because nothing exists yet**,
**empty because a filter hid everything**, and **failure, with a retry**.

- **The two empty states say different things** and must not share a sentence.
- **All four render inside the region, in place of the content** — same frame, same borders, same width. A
  failure to load belongs where the content would be, with its retry right there, because that is where
  the user is looking and what they are trying to recover. Never as a page-level banner: the banner speaks
  for the page, and this failure is about the region.
- **Never a failure and an empty state at once** — "nothing here" plus "it broke" tells two different
  stories about the same absence.
- **They are presented alike: centered in the region, on both axes** — icon (when there is one), sentence,
  then the single action, stacked and centered. They are the same kind of thing — a region with no content
  explaining itself — so they must not each invent a layout. A left-aligned failure beside a centered empty
  state reads as two different components taking turns.
- **The failure is not colored red.** State colour is for a value that *is* wrong — a field, a status.
  Here the message is normal body colour: the state is already unmistakable from replacing the content and
  offering a retry, and a red headline turns a recoverable, often transient condition into an alarm.
  Semantic colour is reserved for status values and field-level validation, where it carries meaning the
  words alone do not.

## 4. Forms and actions

- **Only one global primary action per page.** Everything else is quiet or danger.
- **Cancel and the confirming action live on the same row, at the end of the form** — never cancel in the
  form's header or anywhere apart from the action it cancels. Confirm sits last, cancel beside it, both in
  the same alignment, with cancel in a quieter style. *Reason: an escape placed far from the commitment
  reads as "leave this screen" instead of "abandon this form".* This applies to every editing mode and to
  any confirmation dialog.
- **Validation appears at each field**, and when there are several errors, also in a summary at the top of
  the form. Never in a notification.
- **A destructive action wears the danger style** — both where it is offered and on the confirming action
  in its dialog. Quiet is the style of a *reversible* secondary action, so a quiet destructive action sits
  indistinguishable beside the harmless ones and reads as equally safe right up to the dialog. Cancel in
  that dialog stays quiet: **only one side of a destructive choice is loud.**
- A destructive action is **always confirmed in a dialog** that names the record, blocks interaction, and
  does not close on an outside click.

## 5. Overlays

- **Dialog** only for a destructive confirmation — never for anything else.
- **Transient notification** only for a successful command; it dismisses itself.
- **A banner reports a page-level condition** — one that belongs to no single region. Failures a region
  owns are reported by that region. With nothing page-level to say, **there is no banner**: reaching for it
  to display a region's error is what produces two competing error surfaces.
- When there is one, it sits **in the flow, directly below the page header**, spanning the content width,
  taking space rather than floating over it. Two things this rules out, both seen in practice: floating it
  against the screen (a persistent error that overlays the header hides the very controls used to recover
  from it), and placing it above the header (it detaches from the page it belongs to and pushes the page
  identity down).
- On narrow screens, notifications use the available bottom width; dialogs keep side margins.

## 6. Visual invariants

Molecules carry their own appearance from the design system. These invariants are what the **page** must
hold, and what disqualifies a variant that would break them.

**No measurement in this section is a number.** Every value comes from the design system's scales — space,
radius, type size, weight, line height, duration, shadow. This document says *which step of the scale* and
*why*; the design system says how much that is. A number written here would override the brand's own
decision and would be wrong for the next design system this style meets.

| Topic | Rule |
| --- | --- |
| Density | every gap and padding comes from the design system's **space scale** — nothing off-scale. The same kind of element gets the same padding across the whole page |
| Surfaces | a **hairline** border and the design system's **smallest** radius; no shadow outside overlays, and overlays use its **smallest** elevation that still separates them from the page |
| Typography | one family, and **exactly two weights**: the regular one and the emphasis one the design system declares. Two sizes carry the page — the **body** size for values and cells, and **one step down** for labels, column headers and metadata. Tabular figures in every numeric column |
| Color | mostly neutral; color only for primary action, links, status, and focus |
| Table | no zebra striping or vertical dividers; subtle bottom separators |
| Status | text + color; never color alone or saturated backgrounds |
| Motion | the **shortest** duration the design system declares, and never long enough to be read as animation; no bounce; focus appears with **no** transition at all |
| Icons | project icon set only — see below |

**Read the design system's values, not its token names.** Scale names are not guaranteed to be ordered: a
set may declare its transition tokens with names that run opposite to their durations, so "fast" is not
necessarily the shortest. Pick by the value, and if the intent above and the name disagree, the intent
wins. The same caution applies to any scale whose steps are named rather than numbered.

When a step this section asks for **does not exist** in the design system — no weight between regular and
bold, no text level below muted, no radius small enough — that is a **finding about the design system**.
Record it, take the nearest step, and say which one you took. Do not invent a value to fill the gap.

### Icons

Monochrome, inheriting the text color, **sized to the text they sit beside** — never larger than the label
next to them. **Always next to text and never replacing it.** They come from the **project icon set** —
never third-party, never drawn inline per page, and **never a typographic glyph** (`▲` `▼` `‹` `›` `✕`)
standing in for an icon.

A page template lists the icon **employments** it allows, and no others. Icons a molecule draws for itself
are the molecule's business, not that list's.

## 7. Never invent

Do not invent domain options, units, reasons, color values, or visible technical names. Use project tokens
and molecules.

## Appendix — Checklist items that apply to every page

A page template's own checklist adds to these; it does not restate them.

- [ ] **Every interactive and structural part uses the molecule its page template assigns** — nothing
      hand-built in place of one, and no substitution because another molecule looked close enough.
- [ ] **Every assigned molecule was confirmed to exist**, and any that did not is reported as a finding
      about the set, with a placeholder left at its slot.
- [ ] **Every molecule used is registered by a side-effect import** of its module — a tag written without
      its import renders nothing and raises no error.
- [ ] **Every molecule is bound to real state and handlers**; none is decorative.
- [ ] **Nothing a molecule already does was rebuilt beside it** — no second pagination, no page-level copy
      of its empty state or its sticky header.
- [ ] Only props, events and slots the molecule's own contract declares; no invented attribute, and no
      binding syntax copied from a contract written for another engine.
- [ ] **A molecule's tone or variant came from its own API**, not from utility classes layered over it.
- [ ] **No region is bounded by its content height.**
- [ ] **A collection region's four states look like each other**: centred the same way, and the failure's
      text is not red.
- [ ] **The collection's failure is drawn in its region**, with its retry there — not in a page banner, and
      never alongside an empty state.
- [ ] **Cancel is on the same row as the action it cancels**, at the end of the form, and quieter than it.
- [ ] **A destructive action wears the danger style**, in the panel and in its dialog's confirming action;
      cancel stays quiet.
- [ ] Validation errors are next to fields, not in notifications.
- [ ] There is only one global primary action.
- [ ] Light and dark themes use design-system tokens.
- [ ] There is no visible technical content, excessive decoration, zebra striping, or surface shadow.
