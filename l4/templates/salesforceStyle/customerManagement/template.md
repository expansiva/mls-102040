# Machine brief — Customer management

Apply after the `salesforceStyle` style brief. This page keeps the record of a party the business deals with — a customer, a client, a supplier — correct and reachable: it finds one among many, states who they are, keeps their facts current, and shows what the contract relates to them. Layout documents choose the arrangement and may narrow this brief, never contradict it.

## Resolved model

Resolve the fixture into:

```ts
type ResolvedModel = {
  directory: { rows: Party[]; total: number; page: number; pageSize: number;
               loading: boolean; error?: ErrorState } | null;     // the collection of parties, when declared
  party: { id: string; label: string; status?: string; saved: Field[] } | null;   // the one on stage
  related: { subject: string; rows: Entry[]; total?: number;
             loading: boolean; error?: ErrorState; add?: Command }[];   // only declared relations
  commands: { create?: Command; update?: Command; deactivate?: Command; transitions?: Transition[] };
  filters: { search?: State; status?: State; facets?: State[] };
};
```

Use only fixture-declared query data, commands, setters, handlers, value vocabularies, transitions, errors and formats. Resolve field meanings by contract, not by technical names. Do not read or use the seed as application data: the page reads its values from the base class.

Two facts make this page party management rather than a record form. First, the party is **reached** — found among many, or resolved from context — and their identity is a name a person recognises, never an id. Second, the party is a **counterpart with a history**: what the contract relates to them belongs on this page, not on a page of its own.

The page's minimum usable model is a party with a stable id and a readable name, a way to reach one (a declared query of parties, or a context that resolves one), and at least one of: a command that maintains the party, or a declared related collection. Refuse without writing a page, and say which case it is:

- the record the page would show carries no identity of a counterpart — a name plus at least one declared contact or commercial fact. A thing measured, an entry posted or a task assigned is not a party;
- the party has neither a maintenance command nor a declared related collection — there is nothing to keep and nothing to relate, so the record is a statement and the read-only portal is the page that states it.

## Required page behavior

- The party's identity is the name. An id identifies the party to a command and is never displayed, never typed, and never the label: a party is selected from the directory or resolved from context.
- **Read comes before write.** The party's facts are read-only until an explicit switch into editing, because a page whose fields are always live cannot tell a reader from an editor, and every value looks like something somebody already changed.
- Show only fixture-supported filters over the directory, with their applied values visible and individually removable. Never invent a status, a segment, a tier or an option set.
- Every collection region on this page — the directory and each related collection — implements the style brief's collection states, and each owns its own failure: one failing region reports inside itself with retry while the others stay live and readable.
- The directory's filtered-empty and no-records-empty messages differ, and the filtered-empty one names the narrowing rather than an empty directory.
- Use fixture pagination inputs/outputs. Pagination and sorting parameters are wiring, never form fields.
- Never invent a relationship: no timeline, no score, no health, no segment, no "last contact" the contract does not declare. A declared relation with no entries says so once, quietly, in its own place.
- Selecting a party, editing and committing all have predictable state updates, and none of them discards the reader's place: the narrowing, the scroll and the search text survive a commit.
- Use displayed domain formats and the fixture language. Never expose fixture ids, state field names or other technical names in visible UI.

## Structural elements

| Slot | Required behavior |
| --- | --- |
| directory | the collection of parties with its declared search and filters, pagination and the collection states |
| party identity | the name, the declared status, and only the facts that decide what the reader does next |
| party facts | the declared saved values, grouped by subject in the contract's order, read-only until edited |
| edit surface | the update command's accepted inputs, prefilled, with cancel and confirm in one trailing row |
| create action | the create command's accepted inputs, when the contract declares create |
| related collections | one region per declared relation, uniform anatomy, each with its own states and its own add action when declared |
| deactivation | the declared command that ends the relationship, in danger styling behind the named-party confirmation |
| success feedback | brief and local to the region that changed |
| page-level banner, only when applicable | page-level condition only |
| applied filter values | one removable value per applied filter |

Field controls follow the global role mapping. Create is the page's one primary action when it exists; saving, adding to a relation and lifecycle moves are quiet; the command that deactivates or closes the party is danger. Without a create command the page has no primary action, and nothing is promoted to fill the gap.

## The party's own record

- The identity region carries the name, the declared status and at most a few decisive facts. It never mirrors the fact groups below it: a page that states its own values twice teaches the reader to distrust which copy is current.
- Editing renders only update-accepted inputs, prefilled with the saved values. A value the party has that no command accepts is shown as a saved value or not at all — never as a disabled input pretending to be editable.
- Required inputs are visibly required before any mistake, and validation is field-level, at the field, at commit time. The commit stays unavailable until there is something valid and changed to commit, and its label names the outcome in the domain's words.
- On commit failure the page keeps every entered value and reports immediately above the action that failed. Success returns the record to read mode showing the saved values, and updates the party's row in the directory in place — no redirect, no reload of the page, no lost scroll.
- Unsaved edits are never lost in silence: selecting another party, or any action that would discard them, asks once in plain words naming what would be discarded.
- Create opens an empty form of the create command's accepted inputs. On success the created party becomes the one on stage and joins the directory — the page never navigates away to show what it just created.
- Deactivating is not deleting: the confirmation names the party and says, in the domain's words, what stops happening. When the contract declares no such command, the page offers no way to end the relationship and does not repurpose an update for it.
- A contact value the contract declares as reachable may render as a link, and then it is only a link: a control is navigation or action, never both.
- An absent saved value shows an em dash. Money and dates use the contract's declared formats, and numbers read next to other numbers use tabular figures.

## Related collections

- One region per relation the contract declares, and only those. Each has the same anatomy: a business-word title for the subject, the entries in the contract's declared order, and what each entry is plus when it happened.
- A relation shows the entries the contract returns for the party on stage. When the contract paginates it, the region uses those inputs; when it does not, the region shows what it has and never invents "see all".
- A relation with a declared add command offers it inside that region, as a quiet action opening only that command's accepted inputs. The new entry appears in its own region on success — that appearance is the confirmation, not a page-level notification.
- An entry is evidence, not a record to manage: entries are read-only unless the contract declares a command that changes one, and no relation grows an edit affordance it cannot commit.
- A relation region's failure stays in that region, with retry, in normal body colour. The party's identity and facts never disappear because a relation failed to load.

## Optionality matrix

| Missing capability | Result |
| --- | --- |
| directory query (context resolves the party) | no finder, no search, no pagination; the page is the party on stage |
| create | no create action or form; the empty directory does not offer it |
| update | the party's facts are read-only; no edit switch anywhere |
| deactivate | no danger action and no ending confirmation |
| transitions | no lifecycle action; the status is display only |
| status/lifecycle | no status anywhere and no lifecycle action |
| a relation's add command | that relation is read-only evidence |
| every declared relation | the page is the party's own record plus its directory |
| filters | omit the filter region and its applied values |
| a maintenance command and every relation together | refuse: nothing to keep and nothing to relate |

## Icon employments

Allowed: search, when a search filter is declared; sort ascending/descending, only where the contract declares sorting; pagination chevrons; dismiss, for closing an overlay and for removing an applied filter value; create; remove, only for a declared command that removes; reload query; success feedback; empty-region mark, for a declared relation with no entries; and a status icon for a contract-flagged fact. A selected layout may add its own stated employments.

An action with no icon in the project set — saving, adding to a relation and deactivating among them — is labelled with text alone: do not substitute a glyph, an inline drawing or a similar-looking icon, and report the missing employment.

Report unresolved design-system/icon gaps and genuine ambiguity, including the owning level (style, page or layout).
