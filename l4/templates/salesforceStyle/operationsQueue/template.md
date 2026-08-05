# Machine brief — Operations queue

Apply after the `salesforceStyle` style brief. This page runs a shift: work waits in line, the worst waits at the top, and the operator moves items through the states the contract declares until the line is empty. Layout documents choose the arrangement and may narrow this brief, never contradict it.

## Resolved model

Resolve the fixture into:

```ts
type ResolvedModel = {
  queue: { rows: Item[]; total: number; page: number; pageSize: number; loading: boolean; error?: ErrorState };
  item: { id: string; label: string; status: string; urgency?: { role: string; value: unknown };
          assignee?: string; waiting?: string; facts?: Field[]; flags?: Flag[] };
  lifecycle: { states: string[]; from: Record<string, Transition[]> };   // only declared states and transitions
  commands: { transitions: Transition[]; assign?: Command; create?: Command };
  people: OptionSet | null;         // the declared vocabulary of operators, when there is one
  counts: Record<string, number> | null;   // per-state counts, only when the contract declares them
  filters: { status?: State; assignee?: State; search?: State; facets?: State[] };
};
```

Use only fixture-declared query data, commands, setters, handlers, value vocabularies, transitions, errors and formats. Resolve field meanings by contract, not by technical names. Do not read or use the seed as application data: the page reads the queue from its base class.

Two facts make this page a queue rather than another collection of work. First, the question it answers is **what next** — the order is the page's argument, and the operator works from the top. Second, an item **moves**: every row carries the states the contract declares and the transitions out of the one it is in, and acting is the point of arriving here.

This is not the planning board. That page answers **when** — deadlines placed against a calendar, dates moved, work spread across owners. This one answers **now**: a deadline may be the urgency fact, but nothing here is drawn in time and no date is moved.

The page's minimum usable model is a query of work items, a stable item id, a readable label, a declared state vocabulary, and at least one declared transition out of a state. Refuse without writing a page, and say which is missing:

- no query — a queue with nothing in line is not a queue;
- no declared state or no declared transition — nothing can move, so the page is a collection to read and another page owns reading;
- the only fact that orders the work is a deadline and the contract declares no state and no transition — the plan, not the shift, is the subject, and the planning board owns it.

## Required page behavior

- Show a header with page identity, and the create action only when the contract declares a command that puts a new item in the queue. Otherwise the page has no primary action: a queue is fed from elsewhere, and no transition is promoted to fill the gap.
- **The order is the page's own, not a preference.** It comes from the contract's declared ordering — the urgency fact, the priority, the time waited. When the contract declares no ordering input, keep the collection's own order and never re-sort the rows in hand, which would claim an order the rest of the collection does not have.
- Show only fixture-supported filters, with their applied values visible and individually removable. The declared states are the page's lens; never invent a state, a priority, a queue name or an option set, and show a per-state count only where the contract declares one.
- Render all collection states the style brief requires over the queue. An **empty lane is not an empty queue**: the filtered-empty message names the lane the operator is looking at, and the no-records message says the queue itself is clear.
- A transition is offered only where the contract declares it from the item's **current** state. One the contract does not reach from here is absent, not disabled — a disabled transition sends the operator hunting for how to unlock it, and there is nothing to find.
- A transition that needs an input collects it where it was invoked and requires it there. An input the contract accepts for one outcome only is asked for only in that outcome, and never asked for the others.
- Routine transitions commit without a confirmation: they are the work, and a dialog per item would cost more than the shift can pay. A transition that destroys or cancels an item is danger and takes the style brief's named-item blocking confirmation.
- Every command acts on exactly one item unless the contract declares one that accepts many. Never simulate a batch by looping a single-item command: a loop that half fails leaves a set nobody can name. With a unitary contract, act on one item and say so.
- While a transition runs, the item it covers shows a running state and the rest of the queue stays scannable and selectable. Success is that item's own change — its state where the eye already is, or its departure from the lane — never a page-level banner.
- On failure the page keeps the entered values, reports where the action was invoked, and never navigates away.
- **After acting, the operator's place survives**: the lane, the narrowing, the scroll and the page are the same as before. Losing the place is losing the shift.
- Use displayed domain formats and the fixture language. Never expose fixture ids, state field names or other technical names in visible UI — an operator is a name, never an id.

## Order and urgency

- The urgency fact is what makes the top of the queue the top: a due time, a priority, an age. It is shown on every row, in one consistent place, and read against now.
- Prefer the contract's own late or critical flag. Only when it declares none, derive lateness from the declared urgency fact against now, and record that the page derived it.
- Alarm colour marks the urgency fact of a flagged item and nothing else in the row. A row painted whole ranks nothing against its neighbours, and a queue that is all alarm has no top.
- An item in a terminal state — done, cancelled, whatever the contract declares as final — is muted wherever it still appears, never alarmed, whatever its urgency fact says. It is history, not work.
- One row anatomy for the whole queue: same fields, same places, same density for every state. Density that changes per state makes the queue unscannable, which is the one thing it cannot afford.
- Ownership, when the contract declares it, is a name from the declared vocabulary of operators. An unowned item is a **gap** the page names in words — not a dash, which reads as unknown — and offers to fill wherever the contract declares a command that assigns. With no declared vocabulary the page cannot offer assignment: report the gap, keep showing what the query provides, and never type an id to stand in for a person.

## Structural elements

| Slot | Required behavior |
| --- | --- |
| queue | the items in their declared order, with pagination and the collection states |
| item identity | the readable label, in the same place on every row |
| urgency | the declared fact that ranks the item, read against now |
| state | the item's declared state, as text plus semantic colour, in one consistent shape |
| lane filters | one control per declared state the query accepts, with counts only where declared |
| transition actions | one per transition declared from the current state, naming its outcome, each with a running state |
| action inputs | the inputs a transition declares, collected where the transition is invoked |
| destructive confirmation | the style brief's blocking confirmation, naming the item and the consequence |
| success feedback | the item's own change, local to it |
| page-level banner, only when applicable | page-level condition only |
| applied filter values | one removable value per applied filter |

Field controls follow the global role mapping. Transitions and assignment are quiet; a command that cancels or destroys an item is danger; create, when declared, is the page's one primary action.

## Lanes and lifecycle

- The lanes are the declared states and nothing else. A lane the contract cannot query is not offered, and a lane with no items still exists — its emptiness is the shift's good news, and hiding it would make the operator wonder where the work went.
- Moving between lanes never loses the queue's rhythm: the same row anatomy, the same actions, the same place for the urgency fact.
- An item that leaves the current lane on a successful transition leaves visibly. It is not silently removed on the next reload, and the page does not renumber or re-order the remaining rows under the operator's hand.
- Terminal states are declared, not guessed: only a state the contract declares as final has no transitions out of it, and the page says so plainly where the actions would be, rather than showing an empty action row.
- A declared guard the page cannot evaluate from contract data is not simulated: offer the transition and let the command report its refusal in the transition's own place.

## Optionality matrix

| Missing capability | Result |
| --- | --- |
| create | no create action; the empty queue does not offer one |
| assign | ownership is display only; a gap is named but not fillable |
| people vocabulary | no operator picker; report the gap |
| declared per-state counts | lanes without counts; no count is derived from the page in hand |
| declared late/critical flag | derive lateness from the declared urgency fact and record that |
| urgency fact | the queue keeps the collection's order and shows no ranking fact |
| a command that accepts many items | one item at a time, and the page says so |
| filters | omit the lane controls and the applied values |
| every transition | refuse: nothing moves |
| the query | refuse: nothing is in line |

## Icon employments

Allowed: search, when a search filter is declared; sort ascending/descending, only where the contract declares sorting; pagination chevrons; dismiss, for closing an overlay and for removing an applied filter value; create, only when a create command exists; remove; reload query; success feedback; empty-region mark, for an empty lane; and a status icon for a contract-flagged fact. A selected layout may add its own stated employments.

An action with no icon in the project set — every transition and the assignment among them — is labelled with text alone: do not substitute a glyph, an inline drawing or a similar-looking icon, and report the missing employment.

Report unresolved design-system/icon gaps and genuine ambiguity, including the owning level (style, page or layout).
