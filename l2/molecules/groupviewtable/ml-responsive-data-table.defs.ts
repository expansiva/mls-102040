/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-responsive-data-table.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewTable';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  listOverflow: "pagination",
  recordsView: "table"
};

export const skill = `# Metadata
- TagName: groupviewtable--ml-responsive-data-table
# Objective
Presents data in an accessible, responsive tabular listing using the groupViewTable contract, with optional captions, sorting, row selection, pagination, loading, empty, editing, disabled, and error states.
# Responsibilities
- Presents the content supplied by TableHeader, TableBody, and TableFooter in an accessible table structure.
- Presents Caption as the table's secondary title or accessible description when supplied.
- Preserves the order of columns and rows when no sorting is active.
- Progressively hides columns from right to left as available width decreases.
- Keeps at least three columns visible at every width; when those three columns do not fit, preserves them and provides horizontal scrolling.
- Gives the tabular structure and the relationships among headers, rows, cells, and footer the strongest visual hierarchy.
- Keeps cell content as the primary reading focus, with selection and pagination controls visually subordinate.
- Distinguishes sortable headers visually and indicates the active sort column and direction.
- Sorts a column when its TableHead has the sortable attribute.
- Alternates the active column between ascending and descending order when it is activated repeatedly.
- Orders rows according to the textual content of the cell corresponding to the selected column.
- Emits sort with the column key and current direction after sorting.
- Allows individual row selection and select-all selection when selectable is enabled.
- Renders selected rows with a clearly distinguishable visual state.
- Updates value with selected row indices as a comma-separated list after selection changes.
- Emits change with the updated value after every selection change.
- Displays Loading content while loading, or a default loading indication when that slot is absent.
- Temporarily replaces normal table content with the loading indication during loading.
- Displays Empty content when TableBody has no rows, or a default empty message when that slot is absent.
- Communicates the absence of records without presenting a filled-looking data grid in the empty state.
- Displays the supplied error message when an error is present and gives that message visual prominence.
- Provides pagination controls when pageSize is greater than zero, visually separated from the table and communicating the current page.
- Calculates the number of pages from totalItems and pageSize.
- Updates page and emits pageChange when another page is selected.
- Emits rowClick when a row is activated, without treating interaction with a selection control as row activation.
- Propagates isEditing to custom elements inside cells on first render and whenever the state changes, making cell content visibly enter editing mode.
- Supports keyboard movement between rows with ArrowUp and ArrowDown.
- Toggles the active row's selection with Space and sorts an active sortable header with Enter.
- Communicates sorting, selection, loading, editing, disabled, and error states to assistive technologies.
- Keeps molecule-specific events distinguishable from native events emitted by internal controls.
- Preserves perceptible focus and interaction states on sortable headers, selection controls, and pagination controls.
# Constraints
- Uses only the Caption, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, Empty, and Loading slot areas.
- Caption is optional; TableHeader, TableBody, TableRow, TableHead, and TableCell are required according to the group hierarchy; TableFooter, Empty, and Loading are optional.
- TableHead requires a key identifying its column, and sortable is supported by attribute presence.
- The table must not hide any of the first three columns as a responsive adaptation.
- When fewer than three columns can fit, the table must use horizontal scrolling rather than hiding any of those columns.
- Sorting is unavailable for headers without sortable and is based on matching column position and textual cell content.
- Selection is unavailable unless selectable is enabled, and value uses a comma-separated string of row indices with an empty string representing no selected rows.
- When disabled is enabled, selection, sorting, pagination, row activation, keyboard interaction, and all other interactions are blocked.
- Loading content replaces the normal table presentation while loading is active.
- Empty content is shown only when TableBody contains no rows; the default empty message is used only when Empty is absent.
- Error content is limited to the supplied error message when an error is present.
- Pagination is not provided when pageSize is zero or less; when enabled, total pages are calculated as totalItems divided by pageSize and rounded up.
- Selection-control interaction must not emit rowClick.
- isEditing propagation targets only custom elements contained within TableCell content.
- The table must expose table, row-group, row, column-header, and cell relationships accessibly, and pagination must expose a navigation region identified as table pagination.
# Notes
- The component follows the groupViewTable slot hierarchy and property, value, event, state, validation, and accessibility contract.
- The selectable header control represents selecting all rows, and row selection controls identify their row to assistive technologies.
- The sorted header exposes its active direction accessibly; selected, loading, editing, disabled, and error states remain understandable without relying only on visual treatment.
- The molecule emits change with { value }, sort with { key, direction }, pageChange with { page }, and rowClick with { index }.
- Pagination navigation is intended to update the table body through the surrounding data-flow integration after pageChange.
- The normal, sorted, selected, editing, disabled, loading, empty, and error states are mutually understandable from the presented content and interaction state.`;
