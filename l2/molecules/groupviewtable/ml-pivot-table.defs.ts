/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-pivot-table.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewTable';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  recordsView: "table"
};

export const skill = `# Metadata
- TagName: groupviewtable--ml-pivot-table

# Objective
Provide a pivot table interface that interprets dynamic table intent through column sorting and externally controlled group expansion. It renders tabular data with headers, body, and footer while delegating calculations, groupings, and aggregation logic to the consumer.

# Responsibilities
- Accept data structure exclusively through the contract's structural children, not through external data properties.
- Define columns via header child elements with identifiers; support user sorting interaction on columns enabled for ordering.
- Toggle sort direction between ascending and descending when an orderable header is activated.
- Reorder body rows based on the textual content of cells in the corresponding column.
- Emit a sort event identifying the column and direction.
- Render subtotal and grand total rows as normal rows without internal calculation; these are supplied by the consumer via body and footer content.
- Emit a row click event containing the row index when a group row is clicked, leaving the consumer responsible for updating which rows are visible.
- Display consumer-provided loading content when loading, or fall back to the contract's default loading presentation.
- Display consumer-provided empty content when no rows exist, or fall back to the contract's default empty presentation.
- Propagate editing state to inner components within cells per the contract, enabling view and edit mode transitions.
- Maintain compatibility with contract selection and pagination behaviors.
- Keep columns aligned across headers, body, and footer.
- Visually differentiate subtotal and total rows with stronger text emphasis.
- Show a directional indicator on the currently sorted header.
- Present a loading placeholder that preserves the table's occupied area.
- Present empty messaging with subdued text styling.
- Apply reduced opacity and blocked interactions when disabled.
- Adapt colors and states for dark presentation per the contract.

# Constraints
- Must not compute aggregations, subtotals, or totals internally.
- Must not store or manage group expansion state; row visibility is controlled externally.
- Must not accept data through mechanisms outside the contract's structural children.
- Sorting must only affect the presentation order of existing rows based on cell text.
- Loading and empty presentations must maintain layout stability.
- Editing state propagation must respect inner component autonomy.

# Notes
- The component serves as a presentation layer for pivot-style data, expecting the consumer to provide pre-grouped and pre-aggregated information.
- Dynamic pivot behavior is limited to column sorting; drag-and-drop field arrangement is not supported.`;

