# Machine brief — Entity record management

Apply after the `salesforceStyle` style brief. This page owns exactly one business record: it creates it, edits it, and moves it through the lifecycle the contract declares. Layout documents choose the arrangement and may narrow this brief, never contradict it.

The page has no collection: no list of other records, no search, no pagination, no selection of one record among many. The style brief's collection-state requirements therefore have nothing to apply to here; this page's own states are named below. Pagination and sorting parameters do not exist on this page, and if the contract declares any, they are wiring and never render.

## Resolved model

Resolve the fixture into:

```ts
type ResolvedModel = {
  mode: 'create' | 'edit';
  record: { id?: string; label: string; status?: string; saved: Record<string, unknown> } | null;  // null while creating
  groups: { subject: string; fields: Field[] }[];   // command-accepted inputs, in declared order
  commands: { create?: Command; update?: Command; transitions?: Transition[]; remove?: Command };
  lifecycle: { states: string[]; from: Record<string, Transition[]> };   // only declared states and transitions
  context: Record<string, unknown>;                 // session/route inputs — never fields
};
```

Use only fixture-declared commands, inputs, setters, handlers, value vocabularies, transitions, errors and formats. Resolve field meanings by contract, not by technical names. Do not read or use the seed as application data: saved values come from the base class.

The record's identity is its readable label. An id identifies the record to a command and is never displayed, never typed, and never the label.

If the fixture declares no command that writes the record, refuse without writing a page: a record page with nothing to commit is not this page. If the fixture's dominant surface is a collection of records to browse, this is also the wrong page — say so and refuse.

When the contract declares no query, the saved values come from the base class and the context; the page never invents a list, a search or a picker of records to make up for it.

## Required page behavior

- One record, one page. Create and edit are the same page in two states: a form that begins empty and a form that begins filled. Never a wizard, never a sequence of steps, never a redirect after committing.
- Render only command-accepted inputs. A value the record has but no command accepts is shown as a saved value or not at all — never as a disabled input that pretends to be editable.
- Required fields are visibly required before any mistake is made, not discovered on commit. Validation is field-level, at the field, at commit time, and never travels in a transient notification.
- A commit action stays disabled until it has something valid to commit: in create, the required inputs; in edit, a change. Its label names the outcome in business words, never `Submit`, `OK` or `Send`.
- Command failure renders in the region that owns the action, immediately above it, in normal body color, with retry, and every entered value survives. Success is local and quiet.
- Unsaved work is never lost in silence: leaving, or any action that would discard it, asks once in plain words naming what would be discarded.
- The status is text plus semantic color and updates in place after a transition; the page does not reload itself to show it.
- Session and context inputs never render as fields — at most a quiet read-only caption. Selection inputs are pickers over declared values.
- Use displayed domain formats and the fixture language. Never expose fixture ids, state field names or other technical names in visible UI.

## Record states

- Create: the form opens empty, the identity region says a new record is being created, and no transition is offered — a record that does not exist has no lifecycle yet.
- Loading a saved record: the identity region and the field structure appear as a skeleton that keeps its own shape, so the page does not jump when the values arrive.
- Load failure: reported in the region that would hold the record, in normal body color, with retry. The page does not fall back to an empty create form, which would invite committing a second record.
- Record not available (it does not exist, or the context does not resolve one): stated plainly in the same region, without offering the edit commands.

These states replace the content of the same region, never stack, and never move to a page-level banner.

## Structural elements

| Slot | Required behavior |
| --- | --- |
| identity region | the record's label and status, read-only, plus at most a few decisive saved facts |
| field groups | command-accepted inputs grouped by subject, in the contract's declared order |
| commit action | commits the record (or the part of it the layout declares), naming its outcome |
| transition actions | one per transition the contract declares from the current status |
| irreversible or destructive confirmation | the style brief's blocking confirmation, naming the record and the consequence |
| success feedback | brief and local to the action that succeeded |
| page-level banner, only when applicable | page-level condition only |

Field controls follow the global role mapping. The commit is the page's one primary action; transitions are quiet, and a transition or command that destroys the record is danger. Without a commit command the page has no primary action, and no transition is promoted to fill the gap.

## Lifecycle and transitions

- A transition is offered only when the contract declares it from the record's current status. A transition the contract does not reach from here is absent, not disabled: a disabled transition sends the reader looking for how to unlock it.
- Transitions belong to the record, not to a field group: they never live in a group's action row, and they never compete with the commit action for the same place or the same emphasis.
- A transition the contract cannot undo confirms once, in plain words naming the consequence, before it runs.
- A transition whose contract requires a justification collects it in that confirmation, where it is required: without the justification the transition cannot be submitted. A justification the contract only accepts for one outcome is asked for only in that outcome.
- Committing and transitioning are separate: a commit never changes the status, and a transition never silently commits pending edits — with edits pending, the page says so before transitioning.
- A declared guard that cannot be evaluated from contract data is not simulated: offer the transition and let the command report its refusal in the transition's own place.

## Commands

- Create: submit only the accepted inputs. On success the page becomes the edit state of the record it just created — identity filled, transitions as the contract now allows — without navigating anywhere.
- Update: the same field surface as create, minus what the update payload excludes; preserve the fixture's rules about excluded fields, showing them as saved values.
- Transition: as above, with the status changing in place.
- Remove, when declared: danger styling and the named-record blocking confirmation. Removing is the only action allowed to end the page's subject.
- On any command failure the page stays where it is, keeps the entered values, and reports at the action that failed.

## Record display

- The identity region carries the label, the status, and only facts that decide what the reader does next — it never mirrors the field groups below it.
- A saved value the record does not have shows an em dash. An empty space reads as an unread field and a zero is a claim.
- Money and dates use the contract's declared formats; a numeric value uses tabular figures wherever it is read next to another number.
- Group titles are business words for the subject, never the page title again, and never the label of a control inside the group.

## Optionality matrix

| Missing capability | Result |
| --- | --- |
| create | the page opens only over an existing record; it never offers an empty form |
| update | the record is read-only except for its declared transitions |
| transitions | no lifecycle action; the status is display only |
| remove | no danger action |
| status/lifecycle | no status in the identity region and no transitions |
| saved values (no query and no resolving context) | create-only page: no identity facts, no transitions, and no pretence of editing |
| every writing command | refuse: this page has nothing to commit |

## Icon employments

Allowed: dismiss, for closing an overlay; create; remove; reload, for retrying a failed load or command; success feedback; and a status icon for a contract-flagged fact. Search, sort and pagination employments do not exist on this page.

An action with no icon in the project set — a commit and a transition among them — is labelled with text alone: do not substitute a glyph, an inline drawing or a similar-looking icon, and report the missing employment.

Report unresolved design-system/icon gaps and genuine ambiguity, including the owning level (style, page or layout).
