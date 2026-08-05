# Machine brief — Analytical list

Apply after the `salesforceStyle` style brief. This page measures a set of records and itemizes it in the same view: the reader narrows the set, reads what it adds up to, finds the record that explains the number, and acts on it. Layout documents choose the arrangement and may narrow this brief, never contradict it.

## Resolved model

Resolve the fixture into:

```ts
type ResolvedModel = {
  query: { rows: Record[]; total: number; page: number; pageSize: number; loading: boolean; error?: ErrorState };
  record: { id: string; label: string; measures: Measure[]; dimensions?: Dimension[];
            date?: string; status?: string; flags?: Flag[] };
  measure: { role: string; value: number; unit?: string; currency?: string };   // declared unit only
  summary: Aggregate[];                                    // declared, or honestly derived (see below)
  grouping: { dimension: Dimension; buckets: Bucket[] } | null;   // only when the contract declares one
  commands: { detail?: Command; export?: Command; perRecord?: Command[]; perSet?: Command[] };
  filters: { period?: State; search?: State; facets?: State[]; ranges?: State[] };
};
```

Use only fixture-declared query data, commands, setters, handlers, value vocabularies, groupings, errors and formats. Resolve field meanings by contract, not by technical names. Do not read or use the seed as application data: the page reads the query data from its base class.

Two facts make this page an analytical list rather than a plain collection. First, the set is shown **at two altitudes at once** — summarized and itemized — and both obey the same narrowing. Second, the itemization is **evidence that acts**: a record leads somewhere, or a declared command acts on it. A page with only the summary is a dashboard, a page with only the rows is a collection, and neither is this page. Acting is what the page is for, not what it requires: a contract that declares no command and no drill-down still gives a readable analytical list, and nothing is invented to act with.

The page's minimum usable analytical model is a paginated query of records, a stable record id, a readable identity, at least one **measure** per record or one declared aggregate over the set, and at least one declared query input that **narrows** the set. Refuse without writing a page when one is missing, and say which:

- no query — there is nothing to itemize, and a summary with no evidence under it is not this page;
- no measure and no aggregate — there is nothing to add up, and a set that cannot be measured is a plain collection;
- no narrowing input — there is no question to ask, and a set that cannot be narrowed is a static report.

## Required page behavior

- Show a header with page identity. This page has no create of its own: when the contract declares a command that creates a record, that is the page's one primary action; otherwise the page has no primary action and no other command is promoted to fill the gap.
- Show only fixture-supported filters, with their applied values visible and individually removable. Never invent a period, a category, a status or an option set. Inputs the screen receives from its context — the parent record these belong to, the acting session — are wiring: they narrow the query and never render as fields.
- Render all collection states the style brief requires, over the itemization. Filtered-empty and no-records-empty must differ, and the filtered-empty message names the narrowing rather than an absent set: a set hidden by a question is not an empty set.
- Use fixture pagination inputs/outputs. Pagination and sorting parameters are wiring, never form fields: the reader never picks a page size, and sorting exists only where the contract declares it. With more records than one page, do not sort or total only the loaded page as if it were the set.
- Summary and itemization are two regions, each owning its own failure: the one that fails reports inside itself with retry, and the other stays live and readable. Never blank both for one failure, and never move a region failure to a page banner.
- Narrowing, sorting, paging and selection have predictable state updates and preserve the state the layout requires.
- Use displayed domain formats and the fixture language. Never expose fixture ids, state field names, grouping keys or other technical names in visible UI — a category is its declared label, never its key.

## Structural elements

| Slot | Required behavior |
| --- | --- |
| summary | what the narrowed set adds up to, from declared or honestly derived values, with the set it covers stated |
| itemization | the records behind the summary, dense and uniform, with pagination and the collection states |
| record identity | the readable label, and the drill-down when the contract declares one |
| measures | the declared numbers, in the same numeric treatment in both regions |
| narrowing controls | one place for the declared filter inputs, and one removable value per applied filter |
| set actions | a declared command that accepts many records, naming its outcome and how many it covers |
| record actions | a declared command that acts on one record |
| destructive confirmation | the style brief's blocking confirmation, naming the record and the consequence |
| success feedback | the transient result of a command, local to what changed |
| page-level banner, only when applicable | page-level condition only |

Field controls follow the global role mapping. Render only command-accepted inputs in any form. A record id is never typed: a record is selected, and a category, an account or a period is picked from declared values.

## Summaries and measures

- Every summary is a summary **of the narrowed set**, recomputed whenever the narrowing changes. A summary that keeps answering the previous question while the rows answer the new one is this page's deadliest error, because a stale number looks exactly like a fresh one.
- Prefer the contract's own aggregate. Derive one only from data actually in hand, and then say which set it covers: a number derived from the loaded page is a page number and is labelled as one, never presented as the total of the set.
- A summary value the contract does not support is not shown, and a value not yet known shows an em dash — a dash is unknown, a zero is a claim. A summary that failed shows the dash too; it never falls back to zero.
- While the set is being requeried, stale summary values read as stale and the region keeps its shape. Do not swap a number for a spinner: a summary that disappears on every keystroke cannot be compared with the one before it.
- Measures are right-aligned and tabular, carrying the declared unit or currency, and the summary uses the same numeric treatment as the records — so a total reads as the same species of number as the rows it summarizes.
- A measure with no declared unit is a bare number. Never attach a unit, a currency symbol or a percent sign the contract did not declare, and never rescale a declared value into friendlier units.
- A flag colours the fact it flags — its own value or its own cell, never the whole record, because a record painted entirely by one bad number stops being readable for the others. Alarm colour belongs to a fact the contract flags, never to a big number, a negative number or a low rank.
- A comparison — against a target, a previous period, a threshold — is shown only when the contract declares both sides. A delta the page computes from one declared value is an invented claim.

## Narrowing the set

- The declared filter inputs live in one place, and that place rules **both** regions. A second narrowing control inside the itemization — a per-column filter row, a search that only hides loaded rows — competes with the first and lets the two altitudes disagree.
- Applied values are stated as values, not as controls: one removable value per applied filter, each removable on its own, and removing one leaves the others applied.
- A narrowing the query cannot express is not offered. Combining values in one filter, or two filters at once, exists only when the contract's inputs can carry it; where they cannot, a new choice replaces the old and the page shows which one is in force.
- Every narrowing returns to the first page, because page N of the previous question is not page N of this one.
- A record whose measure the narrowing excludes is gone from both regions at once. The two never show different sets, and neither shows a set the filters do not describe.

## Records, drill-down and commands

- Prefer readable record values: identity; the declared measures; the declared dimensions; status when declared; and the declared date. Which of them survive at each width is the selected layout's decision — identity and the leading measure are never the ones dropped.
- An absent value shows an em dash. Status is text plus semantic colour, never colour alone.
- A control is navigation or action, never both: the identity drills down and does nothing else; a command acts and never navigates.
- Drill-down exists only when the contract declares the detail route or command. Without it the identity is plain text — a link that leads nowhere teaches the reader to distrust every other link.
- A command that acts on many records exists only when the contract declares one that accepts many. Never simulate it by looping a single-record command: partial failure in a loop leaves a set nobody can name. With a unitary contract, act on one record at a time and say so.
- A set command names its outcome and how many records it covers, and stays unavailable until there is a selection. On partial failure it names the records that did not go through and keeps them addressable.
- Export, when declared, acts on the narrowed set the reader is looking at, and its label says so.
- While a command runs, what it covers shows a running state and the rest of the page stays workable. Success is the affected records and the summary changing together — the two never disagree — and not a page banner.
- On failure the page keeps the entered values, reports where the action was invoked, and never navigates away.

## Optionality matrix

| Missing capability | Result |
| --- | --- |
| declared aggregates | derive from data in hand, labelled as the set it covers |
| every measure and every aggregate | refuse: there is nothing to measure |
| the query | refuse: there is nothing to itemize |
| every narrowing input | refuse: a set that cannot be narrowed is a static report |
| grouping/series | no grouped reading; the arrangement that needs one does not apply |
| detail | the identity is plain text, not a link |
| commands over many | no selection, no selection count, no set action |
| commands over one | records are read-only evidence |
| every command and the detail together | a read-only analytical list: the two altitudes and the narrowing stand on their own |
| export | no export action |
| create | no primary action anywhere on the page |
| status | no status column, chip or status filter |
| declared comparison | the summary shows values without deltas |
| declared flags | no alarm colour anywhere: nothing is flagged |

## Icon employments

Allowed: search, when a search filter is declared; sort ascending/descending, only where the contract declares sorting; pagination chevrons; dismiss, for closing an overlay and for removing an applied filter value; create, only when a create command exists; remove; reload query; success feedback; empty-region mark; and a status icon for a contract-flagged fact. A selected layout may add its own stated employments.

An action with no icon in the project set — exporting and the domain's own commands among them — is labelled with text alone: do not substitute a glyph, an inline drawing or a similar-looking icon, and report the missing employment.

Report unresolved design-system/icon gaps and genuine ambiguity, including the owning level (style, page or layout).
