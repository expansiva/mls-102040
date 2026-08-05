# Machine brief — Read-only detail portal

Apply after the `salesforceStyle` style brief. This page states one record to someone who came only to read it — often from outside the organisation, usually in a hurry — and lets them leave satisfied in seconds. It reads, and it does not write. Layout documents choose the arrangement and may narrow this brief, never contradict it.

The page has no collection: no list of other records, no search, no filter, no pagination, no selection among many. The style brief's collection-state requirements therefore have nothing to apply to here, and this page's own states are named below. Its breakdown is a statement, not a grid — no sorting, no paging, no per-column control — and if the contract declares paging or sorting parameters they are wiring and never render.

## Resolved model

Resolve the fixture into:

```ts
type ResolvedModel = {
  record: { id?: string; label: string; status?: string; flags?: Flag[] } | null;
  headline: { role: string; value: unknown; unit?: string; currency?: string } | null;  // the one answer
  values: { role: string; value: unknown; unit?: string; currency?: string }[];  // declared order
  breakdown: Line[] | null;     // the declared component values that justify the headline
  reference: Field[];           // the declared dates, parties and identifiers
  notes: Field[];               // the declared free text
  acknowledge: Command | null;  // a declared acknowledgement, when there is one
  load: { loading: boolean; error?: ErrorState; missing: boolean };
};
```

Use only fixture-declared data, values, vocabularies, errors and formats. Resolve field meanings by contract, not by technical names. Do not read or use the seed as application data: the record's values come from the base class.

The page's minimum usable model is a contract that resolves **one** record, a readable identity for it, and at least one declared value worth stating. Refuse without writing a page, and say which case it is:

- the contract's subject is a collection to browse rather than one record — there is nothing to state;
- the contract declares commands that create, edit or transition the record — whoever holds those commands is an editor, not a reader, and the record-management page is the one that owns them. An acknowledgement of this record, and an export or print of this same record, are not editing and do not trigger this refusal.

## Required page behavior

- Answer first. The record's decisive value is the page's headline, and nothing but the page identity precedes it — a reader who has to hunt for the answer has already lost the seconds this page exists to save.
- When the contract declares several candidate values, the first in declared order is the headline and the rest wait below it. Never a row of competing headlines: two answers to one question is no answer.
- Every value is read-only in appearance as well as in fact. No editable-looking field, and no disabled input either: a disabled input says "not allowed to you", while absence says "this is a statement".
- Each value carries the unit or currency the contract declares, and a value with none declared is a bare number — never attach a symbol, a unit or a percent sign the contract did not declare.
- An absent value shows an em dash. Blank space reads as an unread field and a zero is a claim.
- Status is text plus semantic colour. Alarm colour marks only a fact the contract flags, and only that value — never the frame, the headline or the whole record.
- Never invent a total, a comparison, a trend, a chart or a status the contract does not declare. On a page whose authority is looking finished, an invention is worse than a gap.
- Use displayed domain formats and the fixture language. Never expose fixture ids, state field names or other technical names in visible UI: the identity is the label, and the id identifies the record to a command at most.

## Reading states

- Loading: the identity and the place of the headline appear first and keep their shape, so the page does not jump when the values arrive.
- Load failure: reported in the region that would hold the record, in normal body colour, with retry. Never a half-rendered record — a partial statement can be mistaken for a complete one, and this page's whole value is being trustworthy.
- Record not available (it does not exist, or the context resolves none): stated plainly in that same region, and no acknowledgement is offered — you cannot confirm what was never shown.
- These states replace the content of the same region, never stack on each other, and never move to a page-level banner.

## Structural elements

| Slot | Required behavior |
| --- | --- |
| headline | the record's decisive value, its unit or currency, and a short quiet label naming what it is |
| reference facts | the declared dates, parties and identifiers, compact and quiet — is this mine, which period, who issued it |
| breakdown | the declared component values that justify the headline, in the contract's order, numerically aligned |
| status | the record's declared state, when the contract declares one |
| notes | the declared free text, last and quiet |
| acknowledgement | the declared confirmation, with its outcome named and its result stated in place |
| page-level banner, only when applicable | page-level condition only |

Field controls follow the global role mapping, and on this page almost none apply: the acknowledgement renders only the inputs its command accepts, and if it accepts none it is a single action. The acknowledgement is the page's one primary action when the contract declares it; an export or print of the record is quiet. With no declared command the page has no action at all, and that is the correct outcome rather than a gap to fill.

## The acknowledgement

- It stays unavailable until the record has loaded: confirming a statement nobody could read is a signature on a blank page.
- Its label names the outcome in the domain's words, and it renders only the inputs its command declares — never a comment box the contract did not ask for.
- While it runs it shows a running state; on failure it reports beside itself, in normal body colour, with retry, and keeps whatever the reader entered.
- On success it is replaced, in place, by a quiet statement of what was confirmed and when. It does not re-arm itself, and it never announces itself in a page-level banner or a redirect: the whole point is that the reader can close the page.

## Optionality matrix

| Missing capability | Result |
| --- | --- |
| acknowledgement | no action anywhere; the page is pure statement, and that is complete |
| breakdown | the headline stands with the reference facts and nothing is invented to fill the space |
| status | no status shown |
| notes | no notes region |
| declared flags | no alarm colour anywhere: nothing is flagged |
| a declared unit or currency | values are bare numbers |
| one resolvable record | refuse: a collection is not this page's subject |
| any command that writes the record | refuse: the editor's page owns those |

## Icon employments

Allowed: reload, for retrying a failed load; success feedback, for the acknowledgement's result; dismiss, only for closing an overlay the style brief allows; a status icon for a contract-flagged fact; and the empty-region mark when the contract leaves a declared region empty. The search, sort, pagination, create and remove employments do not exist on this page.

An action with no icon in the project set — the acknowledgement among them — is labelled with text alone: do not substitute a glyph, an inline drawing or a similar-looking icon, and report the missing employment.

Report unresolved design-system/icon gaps and genuine ambiguity, including the owning level (style, page or layout).
