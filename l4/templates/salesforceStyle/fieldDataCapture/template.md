# Machine brief — Field data capture

Apply after the `salesforceStyle` style brief. This page records what happened in the field, many times in one sitting: hours worked, material used, a reading taken, a photo's worth of facts turned into an entry. It is used standing up, often on a phone, by someone with no attention to spare — so its whole design problem is the second entry, not the first. Layout documents choose the arrangement and may narrow this brief, never contradict it.

The page has no collection: no list to browse, no search, no filter, no pagination, no selection of one entry among many. The style brief's collection-state requirements therefore have nothing to apply to here, and if the contract declares paging or sorting parameters they are wiring and never render. The evidence of the sitting described below is not a collection region: it has no header, no sorting, no pagination and no filtered-empty state.

## Resolved model

Resolve the fixture into:

```ts
type ResolvedModel = {
  captures: { subject: string; command: Command; inputs: Field[] }[];   // one per declared recording command
  context: Record<string, unknown>;      // session and route inputs — never fields
  vocabularies: Record<string, OptionSet>;   // only declared value sets
  revert: Command | null;                // a declared way to undo a recorded entry, when there is one
  sitting: { entries: { subject: string; values: Field[]; at: string }[] };  // what THIS page committed, now
};
```

Use only fixture-declared commands, inputs, setters, handlers, value vocabularies, errors and formats. Resolve field meanings by contract, not by technical names. Do not read or use the seed as application data.

Two facts make this page a capture surface rather than a record form. First, the subject is a **stream of entries**: the same kind of thing is recorded again and again, and no single one of them owns the page. Second, the page's success is measured **after** a commit — the surface must be empty, ready and in the right place for the next entry, with what was just recorded still visible as evidence.

The page's minimum usable model is at least one declared command that records an entry and accepts at least one input the reader can fill. Refuse without writing a page, and say which case it is:

- the contract declares no command at all — there is nothing to capture, and a page that only reads is not this one;
- the contract's writing surface is one record being created and then maintained — an update that takes that record's own id, or declared transitions over its states — because then the subject is a record with a lifecycle, and the record-management page owns it;
- every declared command's inputs are resolved by session or context, leaving nothing for the reader to enter: a page whose form has no fields is a button, not a capture surface.

## Required page behavior

- One entry is one command. A capture renders only the inputs its own command accepts, commits with its own action, and never reads or clears another capture's values — there is no shared submit, and no capture's commit is a commit for the page.
- Inputs the system already knows never render as fields: who is recording, which site, which shift, any id the route resolves. Show them, when they help, as a quiet read-only caption naming the sitting — never as an editable field, and never as a disabled one, because a disabled field invites someone to look for the way to unlock it.
- An id is never typed. A reference to another record is a picker over the declared vocabulary; with no declared vocabulary the page reports the gap and does not invent options.
- A measure carries the unit the contract declares and no other: never attach a unit, a currency or a precision the contract did not declare, and never rescale what the reader typed.
- Required inputs are visibly required before any mistake is made, not discovered on commit. Validation is field-level, at the field, at commit time, and never travels in a transient notification.
- The commit stays unavailable until its capture has something valid to commit, and its label names the outcome in the domain's words — never `Submit`, `OK` or `Send`.
- On success the capture resets to empty and is immediately ready for the next entry, in the same place, with the reader's attention landing on the first thing they would fill again. On failure it keeps every entered value and reports immediately above the action that failed, in normal body colour, with retry.
- While a capture commits, that capture shows a running state and locks its own fields; every other capture stays usable.
- The page has no global action of its own. When exactly one capture exists, its commit is the style brief's single primary action; with more than one, each commit is primary inside its own capture and the page identity carries no action at all.
- Use displayed domain formats and the fixture language. Never expose fixture ids, state field names or other technical names in visible UI.

## The capture loop

- The loop is: fill, commit, see it land, fill again. Every rule above serves it, and anything that interrupts it — a blocking success dialog, a redirect, a page-level notification the reader has to dismiss, a form that has to be reopened — breaks the only thing this page is for.
- Success is stated where the reader already is: the capture's own brief confirmation, plus the entry appearing in the sitting's evidence. Never a page-level banner, and never a dialog: the style brief reserves those for destructive confirmation, and recording an entry destroys nothing.
- An entry the contract lets the reader revert offers that as one quiet action on the entry itself, for as long as the contract allows it, labelled by outcome. Without a declared revert command the entries are read-only evidence, and the page says nothing about undoing — an undo that cannot commit is worse than no undo.
- Reverting an entry that the contract treats as irreversible is not offered. When the declared revert is itself destructive, it takes the style brief's named-entry blocking confirmation.

## Evidence of the sitting

- The page shows what it has committed in this sitting: what was recorded, its decisive values, and when — most recent first, and from the command's own declared output. It never queries what it cannot query, and it never shows an entry it did not just commit.
- The evidence is not a data table: no column header, no sorting, no pagination, no filters. It exists so the reader can trust that the last four entries went through, and catch the one that went in wrong.
- Before the first commit it says once, quietly, what will appear there — never a placeholder row, and never a fabricated example, which on a capture page reads as an entry somebody already made.
- The evidence never becomes the page's subject: it stays subordinate to the capture surface, because the next entry is always more important than the last one.

## Structural elements

| Slot | Required behavior |
| --- | --- |
| capture surface | one per declared recording command, with only that command's accepted inputs, in declared order |
| sitting caption | the session and context facts, read-only, named in business words |
| commit action | one per capture, naming its outcome, with a running state |
| field validation | at the field, required marked in advance, errors in words |
| command failure | inside the capture, above its action, with retry, values preserved |
| success feedback | brief, local to the capture, plus the entry landing in the evidence |
| evidence of the sitting | what this page committed, most recent first, with its declared revert when there is one |
| destructive confirmation | the style brief's blocking confirmation, only for a declared destructive revert |
| page-level banner, only when applicable | page-level condition only |

Field controls follow the global role mapping. Inside a capture, order the inputs the way the entry is decided: the target of the entry first, then its measures and dates, then optional free text last and visually quiet.

## Optionality matrix

| Missing capability | Result |
| --- | --- |
| a second recording command | one capture surface, and no chooser of any kind |
| revert | entries are read-only evidence and no undo is offered or mentioned |
| a declared vocabulary for a reference input | free text, and the gap is reported |
| a declared unit for a measure | the number is captured and shown bare |
| optional free-text inputs | no notes area is invented |
| session/context inputs | no caption; the page states only what it has |
| every command | refuse: nothing to capture |
| commands that maintain one record | refuse: the record page owns a lifecycle |

## Icon employments

Allowed: success feedback, for a committed entry; reload, only for retrying a failed commit; dismiss, only for closing an overlay the style brief allows; remove, only for a declared command that destroys an entry; and a status icon for a contract-flagged fact. The search, sort, pagination and create employments do not exist on this page — recording an entry is what this page does, not a `create` marked with a plus.

An action with no icon in the project set — every commit and every revert among them — is labelled with text alone: do not substitute a glyph, an inline drawing or a similar-looking icon, and report the missing employment.

Report unresolved design-system/icon gaps and genuine ambiguity, including the owning level (style, page or layout).
