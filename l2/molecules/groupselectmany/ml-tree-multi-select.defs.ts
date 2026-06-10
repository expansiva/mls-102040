/// <mls fileReference="_102040_/l2/molecules/groupselectmany/ml-tree-multi-select.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectMany';
export const skill = `# Metadata
- TagName: groupselectmany--ml-tree-multi-select

# Objective
Provide a hierarchical tree interface that allows users to select multiple nodes. Parent nodes can be expanded or collapsed. Selecting a parent selects all its descendants. The component supports searching to filter nodes and emits the selected node identifiers following the groupSelectMany contract.

# Responsibilities
- Render a hierarchical tree structure where each node displays a label and a selection control.
- Allow nodes with children to be expanded or collapsed independently of selection state.
- Provide interactive checkboxes for each node when in editing mode, respecting disabled, readonly, and loading states.
- Cascade selection downward: selecting a parent selects all non-disabled descendants; deselecting a parent deselects all descendants.
- Update parent checkbox state based on descendants: checked if all selected, unchecked if none selected, indeterminate if partially selected.
- Maintain the selected value as a comma-separated string of node identifiers per contract.
- Enforce maxSelection by preventing selection of additional unselected items once the limit is reached.
- Enter an error state when required=true and no items are selected, or when selectedCount is below minSelection.
- Filter nodes by label text when search is enabled, showing only matching nodes and their ancestor nodes.
- Emit a change event on any selection change, providing the comma-separated string of selected identifiers.
- Emit focus and blur events when the component gains or loses focus.
- Display a loading indicator and disable interactions when loading is active.
- In read-only mode (isEditing=false), display only the labels of selected items as static text or tags without interactive controls.

# Constraints
- Must use only the contract slot tags: Label, Helper, Trigger, Item, Group, Empty.
- Each selectable node must be represented by an Item with a value attribute; the Item content represents the node label.
- Hierarchy must be defined by nested Items; optional Group tags may group sibling nodes with a label.
- Leaf nodes must preserve alignment equivalent to nodes with children.
- Disabled items, disabled state, loading state, or reached maxSelection must render nodes non-interactive with reduced opacity.
- Error styling must apply to the container and display the error message below; Helper content must be hidden when an error is present.
- When no items are available or search returns no results, the Empty slot content must be rendered.
- In read-only mode without selection, a placeholder must be shown.
- All colors must support dark mode variants using the semantic color pairs defined in the contract.

# Notes
- The expansion state of nodes is internal and does not affect the selection value.
- Search filtering preserves ancestor visibility to maintain hierarchical context.`;

