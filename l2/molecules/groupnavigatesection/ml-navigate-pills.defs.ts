/// <mls fileReference="_102040_/l2/molecules/groupnavigatesection/ml-navigate-pills.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupNavigateSection';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  sectionNav: "pills"
};

export const skill = `# Metadata
- TagName: groupnavigatesection--ml-navigate-pills

# Objective
A horizontal navigation component that presents selectable sections as pills in a scrollable row. It allows users to choose one section at a time, revealing only the content associated with that section. It supports disabled sections, a loading state, and keyboard navigation.

# Responsibilities
- Display a horizontally scrollable row of selectable pills, each representing a distinct section.
- Maintain exactly one active selection at any time.
- Visually distinguish the active pill from inactive pills.
- If no external active section is specified, automatically select the first available non-disabled section.
- Prevent disabled pills from being selected and ensure they do not trigger selection changes.
- Notify the consuming system whenever the user changes the active selection.
- Render only the content of the active section; keep all other section contents hidden.
- When the component is entirely disabled, make all pills non-interactive and prevent any selection changes.
- When loading, indicate that the component is processing and block user interaction until loading completes.
- Allow keyboard users to move focus between pills and confirm a selection.
- Expose the relationship between each pill and its corresponding content panel for accessibility purposes.
- Depend on external sources for section labels, identifiers, and inner content.

# Constraints
- Only one pill may be active at a time.
- A disabled pill cannot be selected by user action or automatic fallback.
- Content from inactive sections must not be visible or accessible while another section is active.
- Keyboard navigation must skip disabled pills.
- The row of pills must remain usable through horizontal scrolling when the total width exceeds the available space.
- Business-specific labels and categories must be provided by the consumer; the component must remain generic.

# Notes
- Designed for corporate filtering and selection scenarios such as deal status, service request types, product categories, support queues, and project assignments.
- The consumer controls all text and content rendered inside the pills and their associated panels.`;

