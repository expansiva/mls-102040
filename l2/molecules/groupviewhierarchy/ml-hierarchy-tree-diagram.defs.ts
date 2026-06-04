/// <mls fileReference="_102040_/l2/molecules/groupviewhierarchy/ml-hierarchy-tree-diagram.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewHierarchy';
export const skill = `# Metadata
- TagName: groupviewhierarchy--ml-hierarchy-tree-diagram

# Objective
Render an interactive hierarchy tree in a horizontal diagram style where each node is shown with a circular state indicator, a toggle button, and its label, connected to children through decorative SVG connectors. The layout flows top-to-bottom with children arranged to the right, providing a clear branching visual metaphor.

# Responsibilities
- Parse nested Node slot elements recursively to build the tree model, assigning stable path-based IDs to each node.
- Render each node with a circular state indicator (highlighted when expanded), a toggle button for nodes with children, and a label area.
- Render SVG connector curves between parent nodes and their children to communicate the branching structure visually.
- Track expanded/collapsed state in an internal map, using each node's expanded attribute as the initial default.
- Expand all nodes when expandAll is true by clearing the expanded state map so all nodes default to expanded.
- When multiple is false, collapse all sibling nodes at the same parent level when one sibling is expanded.
- Maintain a list of currently visible node IDs and use it for arrow-key focus navigation.
- Dispatch a nodeClick CustomEvent (bubbles, composed) with the node's value when a node label is clicked.
- Dispatch a toggle CustomEvent (bubbles, composed) with the node's value and the new expanded state when a toggle button is activated.
- Support keyboard navigation: ArrowDown/ArrowUp move focus through visible nodes; ArrowRight expands a collapsed node; ArrowLeft collapses an expanded node; Enter toggles a node with children.
- Show an optional label when a Label slot is provided.
- Render a loading message when loading is true.
- Render an empty state message when no nodes exist; use the Empty slot content when provided, otherwise use the localized default.

# Constraints
- The component must not contain business logic; node meaning and actions are the consumer's responsibility.
- Nodes with the disabled attribute or when the component-level disabled property is true must not respond to any interaction including click, toggle, and keyboard activation.
- When multiple is false, expanding a node must collapse its siblings within the same parent before expanding the target node.
- Focus movement via arrow keys must be constrained to the current set of visible (non-collapsed) node IDs.
- The component uses createRenderRoot returning this, meaning it renders without a shadow DOM.`;
