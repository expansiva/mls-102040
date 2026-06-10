/// <mls fileReference="_102040_/l2/molecules/groupviewhierarchy/ml-view-hierarchy-mindmap.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewHierarchy';
export const skill = `# Metadata
- TagName: groupviewhierarchy--ml-view-hierarchy-mindmap

# Objective
Present a mind-map hierarchy with a configurable central node and radial child layout. Enable users to explore parent-child relationships through expand and collapse interactions, navigate the view via pan and zoom, and interact with nodes while delegating all structural changes to the consumer.

# Responsibilities
- Present a central node with children arranged radially on concentric rings, maintaining spacing to avoid overlap.
- When multiple top-level nodes exist, treat the first as the central node and place the remaining top-level nodes on the first radial ring.
- Draw connection lines between parents and children, colored to match the parent node's text styling.
- Present node labels using the provided content, allowing rich embedded content for consumer-supplied controls.
- Provide expand and collapse interaction only on nodes that have children; present leaf nodes without a toggle.
- Hide all descendants of a collapsed node; reveal the full subtree of an expanded node.
- Start every node expanded when expand-all is active, ignoring individual node preferences.
- Start a node expanded only when it is explicitly configured to do so and expand-all is inactive; otherwise start collapsed.
- In single-expand mode, collapse siblings at the same depth when a node is expanded.
- In multiple-expand mode, allow multiple siblings at the same depth to remain expanded simultaneously.
- Prevent all node interactions when the component is disabled; prevent only the specific interaction when an individual node is disabled.
- Visually de-emphasize disabled nodes; de-emphasize every node when the entire component is disabled.
- Signal node selection when a node is clicked or double-clicked, including the node's identifier or null if absent.
- Signal state changes when a node is expanded or collapsed, including the node's identifier and its new expanded state.
- Never create, remove, or modify nodes internally; reflect only the structure supplied by the consumer.
- Allow panning the view by dragging the background area.
- Allow zooming the entire view with pointer wheel or trackpad gestures, scaling nodes and connections smoothly.
- Present an empty state when no nodes are supplied.
- Present a loading indicator when loading is active.
- Communicate the hierarchy structure, expansion state, and disabled state to assistive technologies.
- Support keyboard navigation: move focus between nodes with up and down arrows, expand with right arrow, collapse with left arrow, and toggle with enter.

# Constraints
- Only recognize content supplied through the three named contract regions: Label, Node, and Empty.
- Treat nested Node regions as parent-child relationships.
- Use the direct content of a Node as its label, excluding any nested Node regions.
- Show the Empty region only when no Node regions are provided.
- Do not provide a built-in label editing interface; rely on external workflows triggered by selection signals.

# Notes
- Double-clicking intentionally triggers the same selection signal as clicking to support external editing workflows.
- Rich content inside labels is presented as-is to enable consumer-defined action controls such as add or remove buttons.`;

