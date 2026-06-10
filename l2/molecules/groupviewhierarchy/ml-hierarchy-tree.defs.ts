/// <mls fileReference="_102040_/l2/molecules/groupviewhierarchy/ml-hierarchy-tree.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewHierarchy';
export const skill = `# Metadata
- TagName: groupviewhierarchy--ml-hierarchy-tree

# Objective
Display a hierarchical tree structure that allows users to navigate nested levels by expanding and collapsing nodes, while emitting events for interactions. The tree renders user-provided nested content, supports disabled states, and adapts to single or multiple selection patterns without maintaining selection state internally.

# Responsibilities
- Render the hierarchy based on nested Node items provided by the user, where nesting establishes parent-child relationships.
- Display the Empty content as a placeholder when no Node items are provided.
- Display the Label content as a title above the tree when provided.
- Allow nodes with children to expand and reveal their children or collapse and hide them.
- Treat nodes without children as leaves and do not present expansion controls for them.
- Emit a toggle event containing the node's value and its expanded state when the expansion control is activated.
- Emit a nodeClick event containing the node's value when a node's content is activated.
- Respect the initial expanded state indicated on each Node, unless expandAll is active, in which case all nodes must start expanded.
- Collapse sibling nodes at the same level when a node is expanded and multiple selection is disabled.
- Block all expansion, collapse, and click interactions when the component is disabled.
- Block interactions only on specific nodes marked as disabled.
- Preserve and display the full user-provided content of each Node as its visual label, including any checkboxes, icons, or other elements.
- Emit nodeClick events for selection purposes without maintaining internal selection state.
- Render exactly the nodes provided by the user without applying internal filtering, searching, or term highlighting.
- Display an expansion indicator exclusively on nodes that contain children.
- Visually indent child nodes relative to their parent to indicate hierarchy.
- Show only the node label when collapsed; show the label and its children when expanded.
- Present disabled nodes with a visually dimmed appearance.
- Present all nodes as visually dimmed when the entire component is disabled.
- Adapt visual presentation for dark mode with appropriate treatment for surfaces, text, borders, and hover states according to the group's semantic contract.

# Constraints
- Must not maintain internal selection state; selection must be handled entirely by the consuming system through emitted events.
- Must not perform internal search, filtering, or text highlighting; the provided Node content must be rendered exactly as received.
- Leaf nodes must never display expansion controls or empty child areas.
- Sibling collapse behavior applies only when multiple selection is disabled.
- Disabled states on individual nodes and on the component must prevent associated interaction events from emitting.

# Notes
- The user is responsible for providing pre-filtered and pre-highlighted content within Node items when search or highlight behavior is desired.
- Selection indicators such as checkboxes must be included by the user inside the Node content; the component provides only the structural behavior and events.`;

