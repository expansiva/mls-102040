/// <mls fileReference="_102040_/l2/molecules/groupexpandcontent/ml-accordion.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupExpandContent';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  expand: "accordion"
};

export const skill = `# Metadata
- TagName: groupexpandcontent--ml-accordion

# Objective
Allow the user to expand and collapse individually labeled content sections arranged vertically. The component can operate in single-expand mode (only one section open at a time) or multi-expand mode (any number of sections open simultaneously), and supports disabled, loading, and per-section disabled states with full keyboard navigation.

# Responsibilities
- Render each Section slot as a collapsible panel with a clickable header showing its title attribute.
- Track which sections are open and toggle them when their header is clicked or activated via keyboard.
- In single-expand mode, close any currently open section before opening a new one.
- In multi-expand mode, allow any number of sections to be open simultaneously.
- Initialize open sections from the expanded attribute present on Section elements at first render.
- Dispatch a toggle custom event (bubbling, composed) with index, title, and expanded when a section is toggled.
- Allow moving keyboard focus between section headers using ArrowDown and ArrowUp keys, skipping disabled headers.
- Activate a focused header with Enter or Space.
- Render an optional Label slot above the accordion panels.
- Display a loading skeleton with an animated pulse when the loading property is true.
- Show an empty-state message when no Section slots are provided.
- Apply disabled styling and block interaction on individual sections that carry the disabled attribute.
- Block all interaction when the component-level disabled or loading property is true.
- Support light and dark color schemes through conditional class application.

# Constraints
- A section must not open or close while the component-level disabled or loading state is active.
- A per-section disabled header must receive tabindex="-1" and must not be reachable or togglable.
- In single-expand mode, at most one section may be open at any time.
- Keyboard navigation must skip disabled headers and wrap around the list.
- The component must not contain business logic; it only manages visual expand/collapse state.
- Section content is rendered via unsafeHTML from the Section slot's inner template or innerHTML and must not be sanitized by this component.`;
