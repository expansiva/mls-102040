/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-data-table-select.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewTable';
export const skill = `# Metadata
- TagName: groupviewtable--ml-data-table-select

# Objective
A table component that displays data records and allows users to select rows in either single or multiple selection modes. It supports sorting, pagination, and presents distinct states for loading, empty data, and errors.

# Responsibilities
- Render table structure using only the group's defined structural elements in the specified hierarchy.
- In multiple selection mode, provide a selection control in the header to select all records and one in each row to select individual records.
- In single selection mode, allow selecting one record at a time by activating a row, replacing any previous selection.
- Maintain selection as a comma-separated list of row indices; single selection must contain at most one index.
- Notify when selection changes by emitting an event carrying the current selection value.
- Notify when a row is activated by emitting an event carrying the row's index, independent of selection mode.
- Support column sorting on sortable headers, alternating sort direction and notifying the sort criteria.
- Propagate editing state to all nested child elements within table cells when editing is active or inactive.
- When pagination is active, calculate available pages from total items and page size, render page navigation below the table, and notify when the page changes.
- Display a loading state when data is loading; use a default skeleton presentation when no custom loading state is provided.
- Display an empty state when no records exist and loading is complete; use a default empty presentation when no custom empty state is provided.
- Block all interactions and apply disabled styling when disabled.
- Display error messages below the table when errors are present.
- Present appropriate accessibility information per the group contract, including sort state on headers and labels on selection and pagination controls.
- Enable keyboard navigation between rows, selection toggling via keyboard, and sort activation via keyboard on headers.

# Constraints
- Selection value must always be a comma-separated string of numeric indices without duplicates.
- Single selection must never contain more than one index simultaneously.
- Selection controls must not appear in single selection mode.
- Row activation events must occur in both selection modes.
- Sort direction must toggle only between ascending and descending.
- Pagination must only be available when page size is greater than zero.
- Loading and empty states must not appear simultaneously.
- All interactions must be blocked when disabled.
- Error display requires a non-empty error message.
- Colors must follow the group's semantic light and dark theme contract without single-theme hardcoding.

# Notes
- The component relies on the group's defined structural element contract for its composition.
- Selected rows must be visually distinguishable from unselected rows in both selection modes.`;

