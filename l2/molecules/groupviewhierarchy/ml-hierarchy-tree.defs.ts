/// <mls fileReference="_102040_/l2/molecules/groupviewhierarchy/ml-hierarchy-tree.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewHierarchy';
export const skill = `# Metadata
- TagName: groupviewhierarchy--ml-hierarchy-tree

# Objective
Render a standard expandable/collapsible tree view where each node is displayed as an indented row with a chevron toggle and a clickable label. The component reads its structure from nested Node slot elements and supports keyboard navigation, multi-expand control, and disabled states.

# Responsibilities
- Parse nested Node slot elements recursively from the component's template document fragment to build the tree structure.
- Render each node as an indented row, using left padding scaled to the node's depth to communicate hierarchy level.
- Show a chevron toggle button for nodes that have children; show a blank spacer of equal size for leaf nodes to maintain alignment.
- Track each node's expanded state using a WeakMap keyed on the source Element, initializing from the node's expanded attribute or expandAll.
- Expand all nodes when expandAll becomes true by walking the full tree and setting every node to expanded.
- When multiple is false, collapse all siblings of the toggled node before expanding it.
- Dispatch a toggle CustomEvent (bubbles, composed) with the node's value and new expanded state when a node is toggled.
- Dispatch a nodeClick CustomEvent (bubbles, composed) with the node's value when a leaf node label is clicked or activated.
- Support keyboard interaction: Enter and Space toggle a parent node or fire nodeClick on a leaf; ArrowRight expands a collapsed parent; ArrowLeft collapses an expanded parent; ArrowDown/ArrowUp move focus to the adjacent visible label button.
- Show an optional title when a Label slot is provided.
- Render a loading state message when loading is true.
- Render an empty state when no root nodes exist; use the Empty slot content when provided, otherwise use the localized default.
- Support English and Portuguese UI strings via the i18n message system.

# Constraints
- The component must not contain business logic; node meaning and actions are the consumer's responsibility.
- Nodes with the disabled attribute or when the component-level disabled property is true must not respond to click, toggle, or keyboard activation and must be rendered with reduced opacity and a not-allowed cursor.
- When multiple is false, toggling a node open must collapse all its siblings at the same level before expanding the target.
- Chevron toggle and label click are distinct interactions: clicking the chevron only toggles expansion; clicking the label fires nodeClick without toggling.
- Focus navigation with ArrowDown/ArrowUp must operate only on elements with data-node-content="true" that are currently rendered in the DOM.`;
