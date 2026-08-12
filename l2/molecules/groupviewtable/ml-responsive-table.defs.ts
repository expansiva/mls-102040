/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-responsive-table.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewTable';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  recordsView: "table"
};

export const skill = `# Metadata
- TagName: groupviewtable--ml-responsive-table
# Objective
Presents structured data through the groupViewTable contract, showing records as a conventional table in wide spaces and as semantically labeled record cards in constrained spaces while retaining the group’s selection, sorting, pagination, data-state, and event behaviors.
# Responsibilities
- Renders the Caption, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, Empty, and Loading content areas according to the group hierarchy.
- Presents column headers and aligned record rows in wide spaces, with headers structuring the reading of each column.
- Presents each TableBody record as an independent card in constrained spaces.
- Associates every card field value with its corresponding TableHead label, with the cell content carrying stronger visual weight than its informative label.
- Preserves row order, original row indices, and live interactive cell content when changing between table and card presentations.
- Displays a persistent selected state and matching selection controls for selected rows when selection is enabled.
- Allows individual available rows and all available rows to be selected and deselected when selectable is active.
- Maintains value as the comma-separated list of selected original row indices and emits change with the updated value after every selection change.
- Activates sorting from a sortable column header, toggles its direction between ascending and descending, and clearly identifies the active sorted column and direction.
- Uses a cell’s declared sorting value when present and emits sort with the selected column key and direction.
- In internal mode, sorts all received rows before calculating and presenting the current page.
- In external mode, retains the received record order and emits sort for the consumer to update the records.
- Calculates pagination from all received rows in internal mode and from totalItems in external mode.
- Emits pageChange with the selected page when the page changes.
- Propagates isEditing to custom components inside cells on first presentation and whenever that state changes.
- Emits rowClick with the original row index when a row is activated outside selection controls.
- Blocks sorting, selection, pagination, and row activation while disabled is active.
- Replaces records with supplied Loading content during loading, or presents a default loading state when none is supplied.
- Presents supplied Empty content when no body rows exist outside loading, or presents a default empty message when none is supplied.
- Displays a supplied error message below the main table area with distinction from informational content.
- Makes focus, interaction, and unavailable states perceptible for records and controls.
# Constraints
- The component follows the groupViewTable slot hierarchy and requires TableHeader, TableBody, TableRow, TableHead, and TableCell content areas.
- The component accepts Caption, TableFooter, Empty, and Loading as optional content areas.
- The component does not declare, render, or support the Detail content area or row expansion.
- Each TableHead has a column identifier, and only TableHead entries marked sortable can trigger sorting.
- Card presentation applies only to TableRow entries in TableBody; header and footer content retain their group-defined roles.
- Interactive content inside TableCell remains live and must not be replaced by a static representation.
- value is an empty string when no rows are selected and otherwise contains comma-separated original row indices.
- External mode is determined only when totalItems is greater than the number of rows received in TableBody; otherwise the component operates in internal mode.
- Internal pagination uses the complete received row set, including after sorting; external pagination does not locally reorder received rows.
- A page size of zero presents all rows without pagination.
- Disabled interaction does not emit selection, sorting, pagination, or row activation changes.
- Loading takes precedence over empty-state presentation.
# Notes
- The component provides accessible table, header, row, cell, selection, and pagination semantics.
- Keyboard navigation moves between rows with ArrowUp and ArrowDown; Space toggles row selection, and Enter activates sorting on sortable headers.
- Selection controls identify their target row or all rows, and sortable headers expose their current sorting state.
- The responsive card presentation preserves the readability and operability of composed content and interactive controls within cells.
- The external-mode signal cannot distinguish externally sliced records when totalItems equals the number of rows received.`;
