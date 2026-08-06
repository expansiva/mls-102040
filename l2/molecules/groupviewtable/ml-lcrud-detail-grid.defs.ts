/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-lcrud-detail-grid.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewTable';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  recordsView: "table",
  listOverflow: "pagination"
};

export const skill = `# Metadata
- TagName: groupviewtable--ml-lcrud-detail-grid
# Objective
Presents records in a sortable, pageable table whose record detail opens as a scene of its own that replaces the list, for editing or examining one record at a time, following the groupViewTable contract for table content, selection, states, events, and accessibility.
# Responsibilities
- Presents the supplied caption, header, body, footer, empty content, and loading content in their respective table areas when provided.
- Presents tabular content as the dominant visual structure, with headers, records, and cells clearly organized.
- Provides each body record with an untitled trailing control column dedicated to opening that record, visually subordinate to the record data, and indicates the forward navigation with a directional indicator pointing to the reading-direction end.
- Replaces the list with the activated record's detail content when its control is activated, keeping the list's page, sort order, selection, and scroll position so returning restores the previous view without rebuilding it.
- Emits \`rowClick\` with the activated record index when the detail is requested, enabling the detail to be loaded on demand.
- Presents, in the detail scene, a control that returns to the list, and the record's declared \`Detail\` label as the scene heading when one is supplied.
- Displays the declarative text and supplied components from the record's \`Detail\` content area in the detail scene, preserving nested interactive components as functional elements.
- Allows sortable headers to be activated to alternate the active sort direction, reorder records by the corresponding column, identify the active sort column and direction, and emit \`sort\` with the current key and direction.
- Allows individual and all-record selection when selection is enabled, visually distinguishes selected records, maintains the selected indices as a comma-separated \`value\`, and emits \`change\` when that value changes.
- Presents pagination below the table when \`pageSize\` is greater than zero, communicates the current page and available navigation, updates \`page\`, and emits \`pageChange\` with the requested page.
- Presents supplied loading content or a loading representation while loading is active.
- Presents supplied empty content or a default no-records message when no body records exist.
- Presents a non-empty error message after the tabular content.
- Propagates the editing state to custom components within record cells, including those displayed in the detail scene.
- Provides visible focus for records, the record-opening controls, the return control, sortable headers, selection controls, and active pagination controls.
- Supports keyboard navigation between records, selection toggling with Space, opening the focused record with Enter, and sorting of sortable headers with Enter.
- Blocks opening, sorting, selection, and pagination while disabled, and visually distinguishes disabled controls.
# Constraints
- Preserves all groupViewTable slots, properties, selection-value rules, events, and accessibility requirements.
- Supports only the groupViewTable content areas: Caption, TableHeader, TableBody, TableFooter, Empty, Loading, and Detail, with rows and cells in their defined table sections and at most one Detail per body record, as its direct child.
- Requires TableHeader and TableBody content and uses the group-defined row, header-cell, and data-cell structure.
- Presents at most one record detail at a time, and presents it instead of the list rather than alongside it.
- Keeps the list present while the detail is open, so that returning does not rebuild the list or lose its state.
- Accepts sorting only for header cells identified as sortable and uses their required column key in \`sort\`.
- Uses \`value\` as a comma-separated list of selected record indices only when selection is enabled; an empty string represents no selection.
- Does not present pagination when \`pageSize\` is zero.
- Does not permit any interaction while disabled.
- Does not introduce slots, properties, or events beyond the groupViewTable contract.
# Notes
- \`rowClick\` carries \`{ index }\`; \`sort\` carries \`{ key, direction }\`; \`pageChange\` carries \`{ page }\`; and \`change\` carries \`{ value }\`.
- Returning from the detail to the list emits no event.
- \`Detail\` content may include text and supplied nested components, including interactive content and additional tables.
- The detail content is supplied or updated by the consumer inside that record's \`Detail\` after the opening request; an empty \`Detail\` before it is a valid state.
- The optional \`label\` attribute of \`Detail\` names the record for the scene heading; without it the scene shows only the return control.
- The table exposes table semantics, labelled selection controls, sortable-header sort state, labelled pagination navigation, and the detail scene as a labelled region, as defined by the group contract.`;
