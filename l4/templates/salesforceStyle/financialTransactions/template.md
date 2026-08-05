# Machine brief — Financial transactions

Apply after the `salesforceStyle` style brief. This page lists and controls financial entries — invoices, payments, receivables, payables — and runs the entry commands the contract declares. Layout documents choose the arrangement and may narrow this brief, never contradict it.

## Resolved model

Resolve the fixture into:

```ts
type ResolvedModel = {
  query: { rows: Entry[]; total: number; page: number; pageSize: number; loading: boolean; error?: ErrorState };
  entry: { id: string; date: string; label: string; amount: number; currency?: string; direction?: Direction;
           status?: string; counterpart?: string; category?: string; dueDate?: string; flagged?: boolean };
  totals: { count?: number; sum?: number; balance?: number };   // only what the contract declares
  commands: { create?: Command; settle?: Command; cancel?: Command; reconcile?: Command; export?: Command; detail?: Command };
  filters: { period?: State; status?: State; account?: State; search?: State; facets?: State[]; ranges?: State[] };
};
```

Use only fixture-declared query data, commands, setters, handlers, value vocabularies, errors and formats. Resolve field meanings by contract, not by technical names. Do not read or use the seed as application data: the page reads the query data from its base class.

The entry amount is what makes this page a ledger: it is a value the contract declares as money. A count, a quantity or a duration is not an amount, and `total`, `page` and `pageSize` describe the query rather than the entry.

If the fixture lacks the page's minimum usable ledger model (a paginated query, a stable entry id, a readable identity, an entry date and a monetary amount per entry), refuse without writing a page.

## Required page behavior

- Show a header with page identity, and the create action when the create command exists.
- Show only fixture-supported filters, and show their applied values so each one can be removed on its own. Never invent a period, an account, a status or an option set.
- Render all collection states required by the style brief. Filtered-empty and no-records-empty must differ.
- Use fixture pagination inputs/outputs. Pagination and sorting parameters are wiring, never form fields: the reader never picks a page size. When total exceeds one page, do not sort only the currently loaded page unless the contract supplies server-side sorting.
- Derive every displayed total from contract data, for the set currently in view. A total the contract does not support is not shown; a value not yet known shows an em dash rather than a zero, because a dash is unknown and a zero is a claim.
- Filtering, selection, sorting and pagination must have predictable state updates and preserve the layout's required state.
- Use displayed domain formats and the fixture language. Never expose fixture ids, state field names or other technical names in visible UI.

## Structural elements

| Slot | Required behavior |
| --- | --- |
| entry collection | dense uniform entries, sorting when the contract supports it, pagination and the collection states |
| totals | count, sum or balance of the set in view, from declared data only, in the same numeric treatment as the entries |
| actions | primary, quiet and danger actions, each with a loading state, each naming its outcome and its scope |
| irreversible-command confirmation | the style brief's blocking confirmation, restating what will move and its amount |
| success notification | transient command result |
| page-level banner, only when applicable | page-level condition only |
| applied filter values | one removable value per applied filter |

Field controls follow the global role mapping. For any form, render only command-accepted inputs. An entry id is never typed: an entry is selected, and an account or category is picked from declared values.

The create action is the page's one primary action when it exists; settle, reconcile and export are quiet; cancel is danger. Without a create command the page has no primary action, and no other command is promoted to fill the gap.

## Commands

- Create: open an empty form, submit the declared create command, reload, and mark the created entry when its id can be obtained.
- Settle — pay, receive, send, or whatever the contract declares: money that moved does not move back from this page, so it uses the same blocking confirmation the style brief reserves for irreversible actions, restating the entry (or the count) and the amount. One dialog, never two. On success the entry's own status changes and the totals recompute; do not announce it with a page-level banner.
- Cancel/void: danger styling and the same blocking confirmation, naming the entry. When the contract declares no update command, an entry is not editable — correct it through the commands that exist, and do not offer editing.
- Reconcile: change only the reconciliation state the contract declares. Reconciling is not settling: it records agreement with an external record and moves no money.
- Export, when declared: act on the set currently in view, and say so in the action label.
- Detail, when declared: the entry identity links to it. A control is navigation or action, never both — the identity link navigates and does nothing else.
- On command failure, retain user input and show field/form feedback as appropriate. Do not navigate away on failure. When a command covers many entries and only some fail, name the ones that did not go through and keep them addressable.

## Entry display

- Prefer readable entry values: date; identity/description; counterpart or category when declared; status; due date when declared; and the amount.
- The amount is the entry's trailing value, right-aligned, carrying its currency. Totals use the same treatment, so a total reads as the same species of number as the entries it summarizes.
- Money in and money out are distinguished by the contract's own semantic and by sign. Color alone never carries the direction.
- Status is text plus semantic color. Alarm color is only for a fact the contract flags — overdue, failed, insufficient. A negative amount is not by itself an alarm.
- Column order, priority and visibility are determined by the selected layout. Drop whole low-priority columns before allowing wrapping, horizontal overflow or unreadable numeric comparison; the amount is never the column dropped.

## Optionality matrix

| Missing capability | Result |
| --- | --- |
| create | no create action/form; the empty state does not offer it |
| settle | entries are read-only except for the remaining commands |
| cancel | no danger action or confirmation dialog |
| reconcile | no reconciliation action or reconciliation state |
| export | no export action |
| detail | the identity is plain text, not a link |
| declared totals | no totals region; the collection stands alone |
| status | no status column, chip or status filter |
| filters | omit the filter region and its applied values |
| all commands | a read-only ledger and entry reading remain valid |

## Icon employments

Allowed: search; sort ascending/descending; pagination chevrons; dismiss, for closing an overlay and for removing an applied filter value; create; remove; reload query; success notification; empty-region mark; and a status icon for a contract-flagged fact. A selected layout may add its own stated employments.

An action with no icon in the project set is labelled with text alone: do not substitute a glyph, an inline drawing or a similar-looking icon, and report the missing employment.

Report unresolved design-system/icon gaps and genuine ambiguity, including the owning level (style, page or layout).
