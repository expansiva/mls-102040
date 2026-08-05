# Machine brief — AI assisted authoring

Apply after the `salesforceStyle` style brief. On this page a machine drafts and a person judges: the reader asks for a draft, reads what came back, and decides what happens to it. Its promise is that nothing the machine produced leaves the page without a human act the contract declares. Layout documents choose the arrangement and may narrow this brief, never contradict it.

The page's subject is one artifact at a time. It has no collection of artifacts: no list, no search, no pagination, no selection among many, so the style brief's collection-state requirements have nothing to apply to here. The artifact's own states are named below, and if the contract declares paging or sorting parameters they are wiring and never render.

## Resolved model

Resolve the fixture into:

```ts
type ResolvedModel = {
  configuration: { inputs: Field[] };        // only the drafting command's accepted inputs
  context: Record<string, unknown>;          // session and route inputs — never fields
  artifact: { id?: string; title?: string; content: Field[]; producedAt?: string;
              status?: string } | null;      // exactly what the contract returned
  findings: { subject: string; text: string; severity?: string }[];   // only what the contract returned
  commands: { draft: Command; redraft?: Command; save?: Command; publish?: Command;
              discard?: Command; acceptFinding?: Command; dismissFinding?: Command };
  audiences: OptionSet | null;               // the declared targets of publishing, when there are any
  standing: 'none' | 'drafted' | 'saved' | 'published';   // what the thing on screen currently is
};
```

Use only fixture-declared commands, inputs, setters, handlers, value vocabularies, errors and formats. Resolve field meanings by contract, not by technical names. Do not read or use the seed as application data.

Two facts make this page assisted authoring rather than a form. First, the content on screen was **produced by a command**, not typed by the reader, so the page's job is to make its origin and its standing unmistakable. Second, there is a **gate**: a declared human act — publish, share, save, approve — that the machine's output has to pass, and the page never opens it on its own.

The page's minimum usable model is a declared command that produces the artifact, content the contract actually returns for it, and at least one declared act the human performs on what came back. Refuse without writing a page, and say which case it is:

- no command produces content — the author is the person, and the form or record page owns that work;
- the producing command returns nothing the page can render as the artifact — a page that has to invent the draft in order to show it is a page that fabricates, which is the one thing this template exists to prevent;
- the contract declares no act on the result — nothing to save, publish, accept or approve — because then there is no gate, and a page that only displays what a command returned is a statement, not an authoring surface.

## Required page behavior

- The origin is always legible: the reader can always tell that the content came from the drafting command, and when it was produced. Machine output is never presented as a fact of record.
- **The standing is always legible too**: whether what is on screen is a fresh draft, something the human saved, or something already published, and when. A page that cannot tell those apart invites publishing the same thing twice.
- The artifact renders **only** what the contract returned — never an invented section, heading, summary, score or confidence value, and never a placeholder paragraph. Content the contract does not return is content that does not exist.
- Findings render only when the contract returns them, one per returned finding, each stating in plain words what it concerns. No findings returned means no findings region at all, silently — an empty rail announcing that the machine found nothing is a claim the contract did not make.
- **A running state is honest.** While the command runs, the page shows that it is running and nothing more: no fabricated steps, no invented percentage, no text streaming in that the contract did not stream, no skeleton shaped like content that may never arrive. The configuration that produced the request stays visible and locked while it runs.
- The configuration renders only the drafting command's accepted inputs. Session and context inputs never render as fields — a quiet read-only caption at most — and an id is never typed: a target is a picker over the declared vocabulary.
- Drafting again replaces what is on screen. When the standing is saved or published, the page asks once, in plain words, naming what will be replaced — a redraft that silently discards a judged artifact throws away the only human work on the page.
- Generation failure reports in the region that would hold the artifact, in normal body colour, with retry, and the configuration is never lost. A failed draft never leaves half an artifact on screen.
- Every act on the result names its outcome in the domain's words and states, before it runs, what it will do — for publishing, what goes where and to whom, exactly as the contract declares it and never a target the contract does not name. Publishing is not destructive and does not take the style brief's blocking confirmation: its statement belongs in place, beside the action.
- On success an act's result replaces its control in place: a quiet statement of what happened and when. No page-level banner, no redirect, and the artifact stays on screen — the reader may need a next version.
- A declared discard is danger and takes the style brief's named-artifact blocking confirmation.
- Text the reader typed is never lost — not on a failed act, not when the findings are refreshed, not on publishing.
- Use displayed domain formats and the fixture language. Never expose fixture ids, state field names or other technical names in visible UI.

## The artifact and its findings

- The artifact is the largest and calmest thing on the page: it is what the reader has to judge, and judgement needs room. Its declared title belongs to it and is never the page identity repeated.
- Render the artifact's declared content in the contract's declared order and structure. Do not restructure it into sections the contract did not declare, and do not summarise it: a summary of a draft is another draft nobody asked for.
- A finding is quiet, and it points: it names in plain words what part of the artifact it concerns. A finding's declared severity is text plus semantic colour, and alarm colour appears only where the contract declares that severity — never as decoration to make the machine look diligent.
- A finding the contract lets the reader act on offers exactly the acts the contract declares — accepting it, dismissing it — and each one changes only what that finding concerns. **The machine never changes the artifact without an explicit human act on a specific finding.**
- An act on one finding reports its own failure inside that finding, with retry, and leaves the artifact exactly as it was. While it runs, only that finding locks.
- Findings the reader dismissed do not come back for the same content, and a refresh of the findings never rewrites the artifact — it refills the findings and nothing else.

## The human gate

- The gate is the declared act — publish, share, approve, save — and it is reachable only with a produced artifact on screen. Never before, and never automatically on a successful draft: the whole page exists so that a person sees the thing first.
- The gate's inputs are asked at the gate, not before there is something to gate: an audience, a channel, a recipient, from the declared vocabulary only.
- The gate is the page's one primary action when the contract declares it. Drafting is quiet — it is a request, not a commitment — and so is saving. Without a declared gate act the page has no primary action.
- After the gate, drafting again stays available when the contract allows it, and the page states plainly that a new draft would supersede what was already published.

## Structural elements

| Slot | Required behavior |
| --- | --- |
| configuration | the drafting command's accepted inputs, with the declared vocabularies as pickers |
| drafting action | requests the draft, quiet, with an honest running state |
| artifact | exactly the returned content, in the contract's order, at a comfortable reading measure |
| origin and standing | where the content came from, when, and what it currently is |
| findings | one per returned finding, quiet, each pointing at what it concerns, with its declared acts |
| gate action | the declared publish/share/approve, naming what goes where, primary |
| save action | the declared save, quiet, with its own state |
| discard | a declared discard, danger, behind the named-artifact confirmation |
| success feedback | local to the act that succeeded, replacing its control in place |
| page-level banner, only when applicable | page-level condition only |

Field controls follow the global role mapping.

## Optionality matrix

| Missing capability | Result |
| --- | --- |
| findings in the returned result | no findings region at all, silently |
| acts on a finding | findings are read-only advice |
| redraft | one draft per configuration; changing the configuration is how a new one is asked for |
| save | the artifact is not persisted by this page; the gate is the only act |
| publish/share | the gate is whatever declared act remains, and the page has no primary action if none does |
| declared audiences | no target picker; report the gap and never name a target the contract does not declare |
| discard | no danger action |
| an editable artifact (no accepted content input) | the artifact is read-only and the page says so once, quietly |
| declared severity on findings | findings are plain text, with no alarm colour anywhere |
| the producing command | refuse: the person is the author here |
| returned content | refuse: there is nothing to review |
| every act on the result | refuse: there is no gate, so this is a statement |

## Icon employments

Allowed: reload, for retrying a failed draft or a failed act; dismiss, for closing an overlay the style brief allows and for a declared dismissal of a finding; success feedback, for an act's result; the warning icon, only beside the text of a finding whose declared severity the contract flags; remove, only for a declared discard; and the empty-region mark, for a declared region the contract left empty. The search, sort, pagination and create employments do not exist on this page.

An action with no icon in the project set — drafting, saving, publishing and accepting a finding among them — is labelled with text alone: do not substitute a glyph, an inline drawing or a similar-looking icon, and report the missing employment. In particular there is no icon for the machine, and none is invented: the page says in words where the content came from.

Report unresolved design-system/icon gaps and genuine ambiguity, including the owning level (style, page or layout).
