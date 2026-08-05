# Machine brief — Generate review share

Apply after the Salesforce global and AI assisted authoring briefs. A corridor the artifact travels through: **configure, draft, review, gate** — in that order, each act earning the next, with the human standing at the end of it. The page's shape is the guarantee: the gate is not on screen until there is something on screen to gate.

A layout may require more than the page brief, never less. This one requires nothing beyond the page's own minimum, and it decides one thing the page brief leaves open: the acts are **sequential**, and the artifact is reviewed rather than rewritten.

It excludes the arrangement where the artifact is an editable canvas the person writes in, with the machine's advice as a rail applied one card at a time — that is the other layout. It also excludes any gate reachable from the configuration, a chooser of drafts, tabs across the acts, and a configuration panel that keeps the artifact from ever being the largest thing on the page.

## State

```ts
act: 'configure' | 'drafting' | 'review';      // 'review' is where the gate lives; success within it never advances the act
confirmReplace: boolean;                        // asking before a redraft supersedes a judged artifact
```

Nothing else. The configuration's values live in the drafting command's declared inputs, the artifact and the findings are what the commands returned, and each act's progress and error live in its own binding. The standing of the artifact is a fact of the contract's outputs, not a field this arrangement keeps.

## Shapes and containment

| Shape | Arrangement |
| --- | --- |
| Wide | before the draft, the configuration is centred at a comfortable form width and is the only thing on stage; after it, the configuration becomes a quiet summary strip above, the artifact takes the centre at a comfortable reading measure, and the findings sit as a trailing rail at their own readable width |
| Medium | the same, with the findings below the artifact instead of beside it |
| Narrow | one act at a time, in order, each filling the page; the artifact scrolls with the page |

- The page is viewport-bounded on the wide and medium shapes: the configuration strip, the act's title and the action row stay put, and the artifact and the findings scroll in their own regions. On the narrow shape the page scrolls as one document, because two nested scrolls on a phone lose the reader's place in the text they are judging.
- **The artifact is never smaller than the configuration that produced it.** A page whose form outweighs its draft is a form with a preview, and the reader reviews what dominates the screen.
- The configuration is never hidden: after drafting it is a summary strip stating, in the declared labels, what was asked for, with one quiet action that expands it in place to change and draft again. Hiding it would leave the reader unable to tell what the draft answers.
- Switch shape before the artifact's measure passes comfortable reading width, before a finding's text wraps to a column too narrow to read, and before the configuration strip's values truncate.
- Report the arithmetic: the artifact's comfortable reading measure plus the findings rail's minimum readable width against the available width, and the configuration strip's declared values against the width above.

## The acts

- **Configure.** The drafting command's accepted inputs, in declared order, with required inputs marked before any mistake. The drafting action is the only action on stage and stays unavailable until the configuration is valid.
- **Drafting.** The configuration stays visible and locked, and the region that will hold the artifact shows an honest running state — the region's frame and title, and a plain statement that the draft is being produced. Never a skeleton shaped like paragraphs, never a step narrative, never a percentage: the contract reports none of those, and a fabricated progress story is the page lying about the machine.
- **Review.** The artifact takes the centre with its origin and standing stated above or beside it, and the findings take their rail. This is where the gate appears, and it is the only place it appears.
- The act advances only on a command's success, and it never advances past review on its own. Returning to the configuration is always available and never destroys the artifact on screen.
- A redraft over a saved or published artifact asks once, in plain words naming what would be superseded, before it runs. That question is asked where the drafting action lives, not in an overlay: it is a question about the configuration, not a destruction of a record.
- After the gate succeeds, the act stays review: the gate's control is replaced in place by the quiet statement of what happened and when, the artifact stays exactly where it was, and drafting again remains available when the contract allows it. Nothing closes, and nothing navigates.

## The rail

- One card per returned finding, quiet, at the smallest readable step, each naming in plain words the part of the artifact it concerns. Same anatomy for every card, whatever its severity — a rail whose cards change shape by severity cannot be scanned.
- The rail never overlaps the artifact and never covers text: it is beside it, or below it, and the artifact keeps its measure either way.
- A card's declared acts live on the card. While one runs, only that card locks; failure stays inside the card, in normal body colour, with retry; and a card that resolves leaves the rail without disturbing the cards around it.
- With no returned findings the rail does not exist, and the artifact takes the width it leaves. The page does not draw an empty rail to keep the layout symmetric — symmetry is not worth a claim the contract never made.

## Icon employments it adds

None. Returning to the configuration is a labelled action rather than a back affordance, the acts are named in words rather than numbered with marks, and the reload, dismiss, success, warning, remove and empty-region employments the page already authorizes cover every state this corridor can reach.
