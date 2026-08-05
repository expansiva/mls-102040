# Machine brief — salesforceStyle global rules

This is the compact, normative generation brief for Salesforce-style pages. The original `template.md` remains the human specification and audit record. A page template may narrow these rules, never contradict them.

## Controls

- Build every interactive and structural control in the page itself, from the design system. No component library, no third-party widget, no copied markup.
- Render a control only when the page actually needs it. If a required behavior cannot be expressed with the design system, leave the slot explicit and report the gap; do not substitute a different interaction.
- One resolved role, one control (table below). Bind every control to real state or handlers, give it a label and keep it keyboard reachable with the design-system focus ring.
- A feature belongs to exactly one owner. When a region already supplies pagination, empty state or sticky header, implement it there once and do not repeat it elsewhere. Every control lives in the layout-assigned region and obeys that region's containment/scroll rule.
- External utility classes control only placement, size and alignment; appearance comes from the design-system scales.

### Field control mapping

| Resolved role | Control |
| --- | --- |
| short free text | single-line text input |
| long free text | multi-line text area |
| free-text collection search | search input with a clear affordance |
| numeric measure, threshold or quantity | numeric input |
| declared currency | numeric input using the declared currency format |
| boolean field/filter predicate | labelled checkbox |
| one declared vocabulary choice | select restricted to the declared options |
| many declared vocabulary choices | list of labelled checkboxes |
| structural choice with exactly two values | radio group with exactly those two options |
| date/date-time | date / date-time input |
| numeric range | two numeric inputs (from/to) with validated order |
| date range | two date inputs (from/to) with validated order |

Treat currency and vocabularies as contract facts: do not infer either from a field name. With no declared value set, use text rather than inventing select options.

## Containment and collection states

- A page is viewport-bounded. Height flows from the frame into its regions; the page must not grow with content.
- Side-by-side regions have equal height and a hairline separator. If vertically stacked regions would both scroll, they give up their own scroll and the page scrolls as one document.
- Every collection region implements: loading; empty with no records; empty after filtering; and failure with retry. The two empty states use different messages.
- All four states replace the region content in the same frame. Failure includes retry in that region, is centered like the empty states, and uses normal body color. Never show failure and empty together; never move a region failure to a page banner.

## Forms, actions and overlays

- There is only one global primary action. Other actions are quiet or danger.
- A form's cancel and confirm actions share its trailing action row; confirm is last. Field validation appears at fields and, for multiple errors, in a form summary.
- Destructive actions use danger styling, always require a named-record blocking confirmation dialog, and do not close on outside click. The dialog cancel remains quiet.
- Dialogs are for destructive confirmation only. Success uses a self-dismissing transient notification.
- A banner is only for a page-level condition. When present, it is in normal flow directly below the header; do not use it for region failures.
- On narrow screens notifications use available bottom width; dialogs retain side margins.

## Visual rules

- Use only design-system scales for space, radius, typography, motion and elevation; do not invent literal measurements or colors.
- Use the smallest radius and a hairline border. Use no shadow except overlays, which use the smallest separating elevation.
- Use one font family; exactly regular and emphasis weights; body text plus one smaller level for labels/metadata; numeric data uses tabular figures.
- Keep color neutral except primary action, link, status and focus. Status always uses text plus color, never color alone or saturated background. Tables have no zebra or vertical dividers; use subtle row separators.
- Use the shortest design-system duration, no bounce, and no focus transition. Resolve scale values by their actual value, not their token name.
- If a required design-system step is missing, use the closest existing step and report the gap. Icons come only from the project icon set, are monochrome/inherit text color, sit next to text, and never use inline SVG, third-party icons or glyph substitutes.

## Prohibitions and findings

Do not invent domain options, units, reasons, visible technical names, design tokens, or icons. Report: missing design-system steps; behavior the design system cannot express; template contradictions; and decisions required by genuine ambiguity.
