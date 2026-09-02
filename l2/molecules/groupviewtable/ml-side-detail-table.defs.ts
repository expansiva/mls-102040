/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-side-detail-table.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewTable';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  recordsView: "table",
  listOverflow: "pagination"
};

export const skill = `# Metadata
- TagName: groupviewtable--ml-side-detail-table
# Objective
Presents groupViewTable records as a sortable, paginated table with optional selection and an associated record-detail panel, following the groupViewTable contract for supplied table content, states, selection, editing, sorting, pagination, and events.
# Responsibilities
- Presents supplied captions, headers, body rows and cells, and supplied footer content as a table when those content areas are provided.
- Displays loading content while loading, empty content when no body rows are available, and an error message when error content is present.
- Lets users sort a sortable column, alternates the direction on repeated activation of that column, indicates the active column and direction, and emits sort with the resulting key and direction.
- Sorts all received records and calculates available pages locally when the complete record set is available.
- Displays the page identified by page using pageSize, lets users navigate available pages, and emits pageChange with the requested page.
- When selection is enabled, lets users select individual rows or all rows, reflects the selected rows separately from the open-row state, updates value as comma-separated row indices, and emits change with the updated value.
- On activation of a body row other than its selection control or row action, emits rowClick with that row index and opens that row's direct Detail content in the associated detail panel.
- Gives the open record a distinct active-row state that is not confused with checkbox selection.
- Presents the direct Detail content supplied for the open row without creating, changing, or interpreting it, and preserves that content's identity and interactivity while it is open.
- Keeps one record detail open at a time; opening another row replaces the displayed detail and makes the newly opened row active.
- Provides a perceptible control that closes the detail panel and clears the open-record state without changing page-supplied data.
- Keeps the table usable for sorting, pagination, selection, and opening another record while a detail panel is open.
- Keeps an open detail open through sorting and pagination actions until it is closed or another record is opened.
- In wide available space, presents the table as the primary region and the detail panel as a complementary region alongside it, with list sorting and pagination controls remaining available.
- In narrow available space, presents the open detail in place of the table region and preserves a clear return path to the table through the panel close control.
- Lets the table occupy its full available region when no detail panel is open.
- Propagates the applicable row editing state to consumer components in row cells according to isEditing, editingRows, and the group editing modes.
- Visually distinguishes loading, empty, error, selected, editing, disabled, active-row, and sorted states.
# Constraints
- Uses only the properties, events, and content areas defined by the groupViewTable contract; it adds no properties, events, or slot tags.
- Requires the group table header, body, row, header-cell, and data-cell content hierarchy; caption, footer, empty, loading, and Detail content remain optional as defined by the group contract.
- Reads Detail only from a direct child of a body row; it does not read Detail content from header or footer rows, nested locations, or arbitrary non-record content.
- Does not derive a detail heading or detail content from a row's cells.
- Does not reorder received rows when totalItems exceeds the number of available body rows; in that external-data mode it emits sort and waits for updated records.
- Applies local sorting and pagination only when all records are available in the table.
- Does not open a detail from a selection control or a row action.
- Does not alter, serialize, replace, or edit page-supplied Detail content.
- Allows no more than one open record detail at a time.
- When disabled, blocks sorting, pagination, selection, row opening, opening another detail, and closing the detail.
- Does not create editing controls or modify consumer values while propagating editing state.
# Notes
- Detail content is supplied by the page for each record and may validly be empty until the page supplies it.
- The optional Detail label names a scene-style detail presentation when supplied; it is not inferred from table cells.
- Table semantics expose headers, rows, and cells; sortable headers expose their sort state, pagination is identified as table pagination, and selection controls identify their affected rows.
- Keyboard interaction supports row navigation, selection toggling, and sortable-header activation as defined by the group contract.`;
