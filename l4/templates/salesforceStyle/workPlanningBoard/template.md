# Machine brief — Work planning board

Apply after the `salesforceStyle` style brief. This page plans and follows work items: it shows them against their deadlines, fills and changes who owns them, and moves them through the lifecycle the contract declares. Layout documents choose the arrangement and may narrow this brief, never contradict it.

## Resolved model

Resolve the fixture into:

```ts
type ResolvedModel = {
  query: { rows: Item[]; total: number; page: number; pageSize: number; loading: boolean; error?: ErrorState };
  item: { id: string; label: string; dueDate: string; owner?: string; status?: string; startDate?: string;
          overdue?: boolean; completedAt?: string; detail?: string };
  commands: { create?: Command; assign?: Command; update?: Command; transitions?: Transition[]; reschedule?: Command };
  lifecycle: { states: string[]; from: Record<string, Transition[]> };   // only declared states and transitions
  people: OptionSet | null;      // the declared vocabulary of owners, when there is one
  filters: { owner?: State; status?: State; search?: State; facets?: State[]; ranges?: State[] };
};
```

Use only fixture-declared query data, commands, setters, handlers, value vocabularies, transitions, errors and formats. Resolve field meanings by contract, not by technical names. Do not read or use the seed as application data: the page reads the query data from its base class.

Two facts make this page a planning board rather than a plain collection: every item has a **deadline**, and the page can **act on the plan** — assign it, move its date, or advance its state. A collection with neither is a different page.

If the fixture lacks the page's minimum usable planning model — a query of work items, a stable item id, a readable label, a declared deadline, and at least one command that plans (assign, reschedule, update or a lifecycle transition) — refuse without writing a page. In particular, a fixture that declares commands and **no query** is not this page: a board with nothing to show is not a board. Say which of the two is missing and refuse.

## Required page behavior

- Show a header with page identity, and the create action when the create command exists.
- Show only fixture-supported filters, with their applied values visible and individually removable. Never invent an owner, a status or an option set.
- Render all collection states required by the style brief, over the planning surface. Filtered-empty and no-records-empty must differ, and the filtered-empty message names filtering rather than an empty plan — a plan hidden by a filter is not an empty plan.
- Use fixture pagination inputs/outputs. Pagination and sorting parameters are wiring, never form fields.
- Deadline order is the page's own, not a user preference: it comes from the layout and does not need a sorting control to exist.
- Every command acts on exactly one item, unless the contract declares a command that accepts many. Never simulate a bulk action by looping single-item commands: with a unitary contract, act on one item at a time and say so.
- Filtering, paging and any selection must have predictable state updates and preserve the layout's required state.
- Use displayed domain formats and the fixture language. Never expose fixture ids, state field names or other technical names in visible UI — an owner is a name, never an id.

## Structural elements

| Slot | Required behavior |
| --- | --- |
| planning surface | the work items against their deadlines, with pagination and the collection states |
| item identity | the readable label, and the deadline in the item's own place |
| ownership | who owns the item, and the gap when nobody does |
| status | the item's lifecycle state, when the contract declares one |
| actions | primary, quiet and danger actions, each with a loading state, each naming its outcome |
| irreversible or destructive confirmation | the style brief's blocking confirmation, naming the item and the consequence |
| success feedback | brief and local to the item that changed |
| page-level banner, only when applicable | page-level condition only |
| applied filter values | one removable value per applied filter |

Field controls follow the global role mapping. Create is the page's one primary action when it exists; assign, save and lifecycle advances are quiet; a command that destroys or cancels an item is danger. Without a create command the page has no primary action.

## Time and ownership

- The deadline is the item's ranking fact and is always shown when declared. Read it against today: an item whose deadline has passed and whose work is not finished is **overdue**.
- Prefer the contract's own overdue fact when it declares one. Only when it declares none, derive overdue from the declared deadline against today, and record that the page derived it.
- Alarm color marks the **deadline** of an overdue item, never the whole item and never the label: a surface that is all alarm ranks nothing. A finished or cancelled item is muted, never alarmed, whatever its date.
- Do not draw a span from a single date. A duration is drawn only when the contract declares both ends; with only a deadline, the item is a point in time.
- An item has one owner at a time unless the contract says otherwise. An item with no owner is a **gap**: the page makes it visible, and offers to fill it wherever the contract has a command that assigns.
- An owner is chosen from the declared vocabulary of people. When the contract declares no such vocabulary, the page cannot offer assignment: report the contract gap, keep showing the owner value the query provides, and never type an id to stand in for a person.
- A deadline change goes through the command the contract declares for it. Without such a command, deadlines are read-only, and the page says so once, quietly, rather than offering an edit that cannot commit.

## Commands and lifecycle

- Create: open an empty form with only command-accepted inputs, submit, reload, and mark the created item where it lands in the plan.
- Assign: commit the chosen owner for one item; the item's ownership updates in place and the gap closes.
- Update: the declared editable payload for one item; preserve the fixture's rules about excluded fields.
- Lifecycle advance: offered only when the contract declares that transition from the item's **current** state. A transition the contract does not reach from here is absent, not disabled.
- A transition whose contract requires a justification collects it where the transition is confirmed, and requires it there; a justification the contract accepts for only one outcome is asked for only in that outcome.
- A transition that cannot be undone confirms once, in plain words naming the item and the consequence. Cancelling or destroying an item is danger and always names the item.
- While a command runs, the item it covers shows a running state and the rest of the surface stays workable. Success is that item's own change — not a page banner.
- On failure, the page keeps the entered values, reports in the place that owns the failed action, and never navigates away.

## Item display

- Prefer readable item values: label; deadline; owner; status; and the finish date when the contract declares one.
- Status is text plus semantic color; the overdue fact is carried by the deadline, not by a second status.
- An absent value shows an em dash — except ownership, whose absence is a gap the page names in words, because a dash reads as "unknown" and this is "nobody yet".
- Dates use the contract's declared formats; the deadline is the one date always readable at a glance.
- Which fields survive at each width is decided by the selected layout. The label and the deadline are never the ones dropped.

## Optionality matrix

| Missing capability | Result |
| --- | --- |
| create | no create action/form; the empty state does not offer it |
| assign | ownership is display only; a gap is named but not fillable |
| update | items are read-only except for their declared transitions |
| reschedule (or an update that accepts the deadline) | deadlines are read-only |
| transitions | no lifecycle action; the status is display only |
| status/lifecycle | no status anywhere, and no lifecycle action |
| declared overdue fact | derive it from the deadline and record that |
| people vocabulary | no owner picker; report the gap |
| filters | omit the filter region and its applied values |
| every planning command | refuse: this is a read-only collection, not a planning board |
| the query | refuse: a board with nothing to show is not a board |

## Icon employments

Allowed: search, when a search filter is declared; sort ascending/descending, only if the contract supports sorting; pagination chevrons; dismiss, for closing an overlay and for removing an applied filter value; create; remove; reload query; success feedback; empty-region mark; and a status icon for a contract-flagged fact. A selected layout may add its own stated employments.

An action with no icon in the project set — assigning, saving and advancing a state among them — is labelled with text alone: do not substitute a glyph, an inline drawing or a similar-looking icon, and report the missing employment.

Report unresolved design-system/icon gaps and genuine ambiguity, including the owning level (style, page or layout).
