/// <mls fileReference="_102040_/l2/molecules/groupviewhierarchy/ml-hierarchy-orgchart.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewHierarchy';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  hierarchy: "orgchart"
};

export const skill = `# Metadata
- TagName: groupviewhierarchy--ml-hierarchy-orgchart

# Objective
Render an interactive organizational-chart-style hierarchy tree where each node is displayed as a card-like button connected to its children by vertical and horizontal lines. Users can expand or collapse branches, navigate the tree with the keyboard, and select individual nodes.

# Responsibilities
- Parse nested Node slot elements recursively to build the full tree model, preserving parent-child relationships and depth information.
- Render each node as a focusable button with an optional expand/collapse toggle button when the node has children.
- Draw connector lines between parent and child nodes to visually communicate the hierarchy.
- Track expanded/collapsed state per node path; nodes marked with the expanded attribute start expanded by default.
- Expand all nodes simultaneously when expandAll is true.
- When multiple is false, collapse all sibling nodes at the same level when one is expanded.
- Dispatch a nodeClick CustomEvent (bubbles, composed) with the node's value when a node button is clicked or Enter is pressed.
- Dispatch a toggle CustomEvent (bubbles, composed) with the node's value and the new expanded state when a node is toggled.
- Support full keyboard navigation: ArrowDown/ArrowUp move focus between visible nodes; ArrowRight expands a collapsed node or moves focus forward; ArrowLeft collapses an expanded node or moves focus to the parent.
- Show an optional title when a Label slot is provided.
- Render an animated loading skeleton when loading is true.
- Render an empty state message when no nodes are present; use the Empty slot content when provided, otherwise use the localized default.
- Manage roving tabindex so only one node is in the tab sequence at a time.

# Constraints
- The component must not contain business logic; node meaning and actions are the consumer's responsibility.
- Nodes marked with the disabled attribute or when the component-level disabled property is true must not respond to click, toggle, or keyboard activation.
- When multiple is false, expanding one node must immediately collapse all its siblings at the same hierarchy level.
- Focus must remain within the currently rendered set of visible node buttons; focus must not move to hidden or collapsed nodes.
- The component renders with role="tree" and each node button with role="treeitem" to maintain ARIA tree semantics.`;
