/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-record-form-table.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewTable';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  recordsView: "table",
  listOverflow: "pagination"
};

export const skill = `# Metadata
- TagName: groupviewtable--ml-record-form-table
# Objective
Presents records in a sortable, paginated table with optional selection and record actions, and temporarily replaces that list with a detailed record form for viewing and maintenance, following the groupViewTable contract while the consuming page supplies record content, data updates, and persistence.
# Responsibilities
- Presents the supplied caption, header, body, footer, rows, header cells, and data cells as the record list, with the table as the primary list-view element.
- Shows an action column after the data columns when row actions are supplied for a record or new-record draft, visually distinguishing and grouping the available record controls.
- Sorts a sortable column by alternating its active direction, indicates the active direction on that header, and emits \`sort\` with the current column key and direction.
- In internal mode, sorts the complete received record set and applies pagination locally; in external mode, retains the received row order and emits sorting and page-navigation requests for the page to update the data.
- Displays the requested page according to \`page\`, \`pageSize\`, and \`totalItems\`, and emits \`pageChange\` when page navigation is requested.
- When selection is enabled, lets users select individual records or all records, reflects a consistent selected state in rows and selection controls, stores selected row indices as the comma-separated \`value\`, and emits \`change\` after every selection change.
- Emits \`rowClick\` with a row index when a row is activated outside its selection controls and row actions.
- Opens a record's supplied Detail content when its \`open\` action is activated, emits \`rowAction\` with that record key and \`open\`, and replaces the list in the same context with the detail content as the primary focus.
- Keeps the supplied Detail content live and interactive, provides an identifiable return control, and restores the existing list when that control is used.
- Preserves the list instance and its current page, sort state, selection, and existing interactive controls while a record detail is open.
- Shows an edit action in record view and save and cancel actions during record editing, with the editing state making supplied editable content perceptibly editable and the view state presenting it as read-only.
- Emits \`edit\` with the record key before entering edit mode when an \`edit\` action is activated.
- Emits \`save\` before leaving edit mode when a \`save\` action is activated.
- Emits \`cancel\` before leaving edit mode when a \`cancel\` action is activated, without changing values supplied by the page.
- Emits \`delete\` with the record key when a \`delete\` action is activated, without removing a record or changing the open-detail or editing mode.
- Uses keys in \`editingRows\` as the editing-mode source when that property is present; otherwise maintains the editing mode internally.
- Propagates the opened record's editing state to custom content supplied in its cells and Detail, and propagates the corresponding viewing state when it is not being edited.
- Opens the supplied NewRecordRow as a single distinguishable draft when a footer \`new\` action is activated, keeps it in editing mode, propagates its editing state, and emits \`newRecord\`.
- Emits \`newRecord\` without opening a draft when a footer \`new\` action is activated and no NewRecordRow is supplied.
- Limits a new-record draft to save and cancel actions, emits \`save\` or \`cancel\` with its key and \`isNew: true\` before closing it, and leaves page-supplied values unchanged on cancellation.
- Shows supplied loading content while loading, supplied empty content when the body has no rows, and the error message when \`error\` is not empty.
- Clearly distinguishes loading, empty, error, disabled, selected, sorted, editing, draft, and normal states without concealing necessary information.
- Blocks selection, sorting, pagination, detail opening, and lifecycle actions while disabled.
# Constraints
- Uses only the groupViewTable slots, properties, value semantics, and events.
- Requires TableHeader, TableBody, TableRow, TableHead, and TableCell content supplied by the consuming page; Caption, TableFooter, Empty, Loading, Detail, RowActions, RowAction, and NewRecordRow are optional content areas.
- Accepts Detail only as direct content of a body row and never as header or footer content.
- Adds no action column unless a row or NewRecordRow supplies RowActions, and never accepts an action column declared as a data column.
- Supports at most one NewRecordRow draft at a time.
- Never creates, modifies, removes, or persists record values; the consuming page owns record data and persistence.
- Never reorder received rows in external mode.
- Treats \`value\` as a comma-separated list of row indices only when selection is enabled; an empty string represents no selected rows.
- Does not change record values on cancellation or delete records after a delete request.
- Does not alter the list state while its Detail view is open.
- Does not expose out-of-mode lifecycle actions as available controls.
# Notes
- Row identity for edit, save, cancel, delete, and generic row actions is the supplied row key; a missing key uses the row position.
- A \`RowAction\` outside the recognized lifecycle actions is reported through \`rowAction\` with its record key and action.
- The page may provide text, custom interactive content, or nested content in data cells and Detail; their identity and interactivity remain preserved.
- Sortable headers and table rows support keyboard operation, including header activation for sorting, row navigation, and selection toggling.
- The table exposes table, row-group, row, header-cell, and data-cell semantics; sortable headers expose their sort state, and selection and pagination controls have identifiable labels.
- Internal versus external mode is determined by whether \`totalItems\` exceeds the number of received body rows.`;
